package vn.edu.iuh.sv.vcarbe.service.impl;

import jakarta.servlet.http.HttpServletRequest;
import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import vn.edu.iuh.sv.vcarbe.config.VNPayConfig;
import vn.edu.iuh.sv.vcarbe.dto.InvoiceDTO;
import vn.edu.iuh.sv.vcarbe.dto.RentalContractDTO;
import vn.edu.iuh.sv.vcarbe.dto.SignRequest;
import vn.edu.iuh.sv.vcarbe.entity.*;
import vn.edu.iuh.sv.vcarbe.exception.AppException;
import vn.edu.iuh.sv.vcarbe.exception.MessageKeys;
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
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), MessageKeys.CONTRACT_NOT_FOUND.name()));
        User lessee = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), MessageKeys.USER_NOT_FOUND.name()));

        rentalContract.sign(lessee, signRequest);
        RentalContract savedRentalContract = rentalContractRepository.save(rentalContract);

        String txnRef = VNPayConfig.getRandomNumber(8);
        Invoice invoice = new Invoice();
        invoice.setContractId(savedRentalContract.getId());
        invoice.setTxnRef(txnRef);
        invoice.setAmount((long) (savedRentalContract.getTotalRentalValue() * 30L));
        invoice.setLesseeId(savedRentalContract.getLesseeId());
        invoice.setLessorId(savedRentalContract.getLessorId());
        invoice.setPaymentStatus(PaymentStatus.PENDING);

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
        cld.add(Calendar.HOUR, vnPayConfig.getTimezoneOffset());
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        vnpParams.put("vnp_CreateDate", formatter.format(cld.getTime()));
        invoice.setCreateDate(formatter.format(cld.getTime()));
        invoiceRepository.save(invoice);
        cld.add(Calendar.MINUTE, 15);
        vnpParams.put("vnp_ExpireDate", formatter.format(cld.getTime()));

        String queryUrl = generateQueryUrl(vnpParams);
        String vnpSecureHash = VNPayConfig.hmacSHA512(vnPayConfig.getSecretKey(), queryUrl);

        return vnPayConfig.getVnp_PayUrl() + "?" + queryUrl + "&vnp_SecureHash=" + vnpSecureHash;
    }

    public RentalContractDTO handlePaymentCallback(HttpServletRequest req) {
        Map<String, String> fields = extractFieldsFromRequest(req);

        Invoice invoice = invoiceRepository.findByTxnRef(fields.get("vnp_TxnRef"))
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), MessageKeys.INVOICE_NOT_FOUND.name()));

        String vnpSecureHash = req.getParameter("vnp_SecureHash");
        fields.remove("vnp_SecureHash");
        String signValue = vnPayConfig.hashAllFields(fields);

        if (!vnpSecureHash.equals(signValue)) {
            invoice.setPaymentStatus(PaymentStatus.CANCELLED);
            invoice.setContent("Giao dịch thất bại. Sai mã xác thực");

            invoiceRepository.save(invoice);
            throw new AppException(HttpStatus.FORBIDDEN.value(), MessageKeys.PAYMENT_NOT_VALID.name());
        }

        String vnpResponseCode = req.getParameter("vnp_ResponseCode");
        if ("00".equals(vnpResponseCode)) {
            invoice.setPaymentStatus(PaymentStatus.PAID);
            invoice.setContent("Thanh toán thành công");
            invoice.setTransactionNo(req.getParameter("vnp_TransactionNo"));
            invoice.setTransactionDate(Long.parseLong(req.getParameter("vnp_PayDate")));
            Invoice savedInvoice = invoiceRepository.save(invoice);
            RentalContract rentalContract = rentalContractRepository.findById(savedInvoice.getContractId())
                    .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), MessageKeys.CONTRACT_NOT_FOUND.name()));
            rentalContract.setRentalStatus(RentalStatus.SIGNED);

            rentalContractRepository.save(rentalContract);
            blockchainUtils.approveRentalContract(rentalContract.getId().toHexString());
            notificationUtils.createNotification(rentalContract.getLessorId(), NotificationMessage.LESSEE_SIGNED_CONTRACT, NotificationType.RENTAL_CONTRACT, "/rental-contracts/" + rentalContract.getId(), rentalContract.getId());
            return modelMapper.map(rentalContract, RentalContractDTO.class);
        } else {
            invoice.setPaymentStatus(PaymentStatus.CANCELLED);
            invoice.setContent("Giao dịch thất bại. Mã lỗi: " + vnpResponseCode);

            invoiceRepository.save(invoice);
            throw new AppException(HttpStatus.BAD_REQUEST.value(), MessageKeys.PAYMENT_FAILED.name());
        }
    }

    private String generateQueryUrl(Map<String, String> vnp_Params) {
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if (fieldValue != null && fieldValue.length() > 0) {
                try {
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()))
                            .append('=')
                            .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                } catch (UnsupportedEncodingException e) {
                    throw new RuntimeException(e);
                }
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

    public Page<InvoiceDTO> getUserInvoices(UserPrincipal userPrincipal, int page, int size, String sortBy, String sortDir) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir.toUpperCase()), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Invoice> invoicePage = invoiceRepository.findByLesseeId(userPrincipal.getId(), pageable);
        List<InvoiceDTO> invoiceDTOs = invoicePage.getContent().stream()
                .map(invoice -> modelMapper.map(invoice, InvoiceDTO.class))
                .toList();
        return new PageImpl<>(invoiceDTOs, pageable, invoicePage.getTotalElements());
    }

    public InvoiceDTO getInvoiceById(UserPrincipal userPrincipal, ObjectId invoiceId) {
        Invoice invoice = invoiceRepository.findByIdAndLesseeId(invoiceId, userPrincipal.getId()).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), MessageKeys.INVOICE_NOT_FOUND.name()));
        return modelMapper.map(invoice, InvoiceDTO.class);
    }
}
