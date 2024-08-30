package vn.edu.iuh.sv.vcarbe.service.impl;

import jakarta.servlet.http.HttpServletRequest;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import vn.edu.iuh.sv.vcarbe.config.VNPayConfig;
import vn.edu.iuh.sv.vcarbe.dto.RentalContractDTO;
import vn.edu.iuh.sv.vcarbe.dto.SignRequest;
import vn.edu.iuh.sv.vcarbe.entity.*;
import vn.edu.iuh.sv.vcarbe.exception.AppException;
import vn.edu.iuh.sv.vcarbe.repository.InvoiceRepository;
import vn.edu.iuh.sv.vcarbe.repository.RentalContractRepository;
import vn.edu.iuh.sv.vcarbe.repository.UserRepository;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.util.BlockchainUtils;
import vn.edu.iuh.sv.vcarbe.util.NotificationUtils;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class InvoiceService {
    private final VNPayConfig vnPayConfig;
    private final InvoiceRepository invoiceRepository;
    private final RentalContractRepository rentalContractRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final NotificationUtils notificationUtils;
    private final BlockchainUtils blockchainUtils;

    public InvoiceService(VNPayConfig vnPayConfig, InvoiceRepository invoiceRepository, RentalContractRepository rentalContractRepository, UserRepository userRepository, ModelMapper modelMapper, NotificationUtils notificationUtils, BlockchainUtils blockchainUtils) {
        this.vnPayConfig = vnPayConfig;
        this.invoiceRepository = invoiceRepository;
        this.rentalContractRepository = rentalContractRepository;
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
        this.notificationUtils = notificationUtils;
        this.blockchainUtils = blockchainUtils;
    }

    public String createPaymentUrl(HttpServletRequest req, UserPrincipal userPrincipal, SignRequest signRequest) throws UnsupportedEncodingException {
        RentalContract rentalContract = rentalContractRepository.findByLesseeIdAndId(userPrincipal.getId(), signRequest.contractId())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Contract not found"));
        User lessee = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "User not found"));
        rentalContract.sign(lessee, signRequest);

        String txnRef = VNPayConfig.getRandomNumber(8);
        Invoice invoice = new Invoice();
        invoice.setContractId(rentalContract.getId());
        invoice.setAmount((long) (rentalContract.getTotalRentalValue() * 30L));
        invoice.setLesseeId(rentalContract.getLesseeId());
        invoice.setLessorId(rentalContract.getLessorId());
        invoice.setTxnRef(txnRef);
        invoice.setPaymentStatus(PaymentStatus.PENDING);
        invoiceRepository.save(invoice);

        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", vnPayConfig.getVnp_Version());
        vnpParams.put("vnp_Command", vnPayConfig.getVnp_Command());
        vnpParams.put("vnp_TmnCode", vnPayConfig.getVnp_TmnCode());
        vnpParams.put("vnp_Amount", String.valueOf(invoice.getAmount()));
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", txnRef);
        vnpParams.put("vnp_OrderInfo", "Thanh toan don hang: " + txnRef);
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", vnPayConfig.getVnp_ReturnUrl());
        vnpParams.put("vnp_IpAddr", VNPayConfig.getIpAddress(req));

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        vnpParams.put("vnp_CreateDate", formatter.format(cld.getTime()));
        cld.add(Calendar.MINUTE, 15);
        vnpParams.put("vnp_ExpireDate", formatter.format(cld.getTime()));

        String queryUrl = generateQueryUrl(vnpParams);
        String vnpSecureHash = VNPayConfig.hmacSHA512(vnPayConfig.getSecretKey(), queryUrl);

        return vnPayConfig.getVnp_PayUrl() + "?" + queryUrl + "&vnp_SecureHash=" + vnpSecureHash;
    }

    public RentalContractDTO handlePaymentCallback(HttpServletRequest req) throws Exception {
        Map<String, String> fields = extractFieldsFromRequest(req);

        Invoice invoice = invoiceRepository.findByTxnRef(fields.get("vnp_TxnRef"))
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Invoice not found"));

        String vnpSecureHash = req.getParameter("vnp_SecureHash");
        fields.remove("vnp_SecureHash");
        String signValue = vnPayConfig.hashAllFields(fields);

        if (!vnpSecureHash.equals(signValue)) {
            invoice.setPaymentStatus(PaymentStatus.CANCELLED);
            invoice.setContent("Giao dịch thất bài. Sai mã xác thực");
            invoiceRepository.save(invoice);
            throw new AppException(HttpStatus.FORBIDDEN.value(), "Giao dịch không hợp lệ");
        }

        String vnpResponseCode = req.getParameter("vnp_ResponseCode");
        if ("00".equals(vnpResponseCode)) {
            invoice.setPaymentStatus(PaymentStatus.PAID);
            invoice.setContent("Thanh toán thành công");
            invoiceRepository.save(invoice);

            RentalContract rentalContract = rentalContractRepository.findById(invoice.getContractId())
                    .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Contract not found"));
            notificationUtils.createNotification(rentalContract.getLessorId(), "Lessee has signed the contract", NotificationType.RENTAL_CONTRACT, "/rental-contracts/" + rentalContract.getId(), rentalContract.getId());
//            blockchainUtils.approveRentalContract(rentalContract.getId().toHexString());
            return modelMapper.map(rentalContract, RentalContractDTO.class);
        } else {
            invoice.setPaymentStatus(PaymentStatus.CANCELLED);
            invoice.setContent("Giao dịch thất bại. Mã lỗi: " + vnpResponseCode);
            invoiceRepository.save(invoice);
            throw new AppException(HttpStatus.BAD_REQUEST.value(), "Giao dịch thất bại. Mã lỗi: " + vnpResponseCode);
        }
    }


    private String generateQueryUrl(Map<String, String> vnp_Params) throws UnsupportedEncodingException {
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if (fieldValue != null && fieldValue.length() > 0) {
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()))
                        .append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                }
            }
        }
        return query.toString();
    }

    private Map<String, String> extractFieldsFromRequest(HttpServletRequest req) {
        Map<String, String> fields = new HashMap<>();
        Map<String, String[]> parameterMap = req.getParameterMap();
        for (String key : parameterMap.keySet()) {
            String[] values = parameterMap.get(key);
            try {
                String encodedKey = URLEncoder.encode(key, StandardCharsets.US_ASCII.toString());
                String encodedValue = URLEncoder.encode(values[0], StandardCharsets.US_ASCII.toString());
                fields.put(encodedKey, encodedValue);
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }
        return fields;
    }
}
