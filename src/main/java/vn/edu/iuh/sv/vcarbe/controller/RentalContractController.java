package vn.edu.iuh.sv.vcarbe.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.sv.vcarbe.dto.*;
import vn.edu.iuh.sv.vcarbe.security.CurrentUser;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.RentalContractService;
import vn.edu.iuh.sv.vcarbe.service.impl.InvoiceService;

import java.io.UnsupportedEncodingException;
import java.util.List;

@RestController
@RequestMapping("/rental-contracts")
public class RentalContractController {
    @Autowired
    private RentalContractService rentalContractService;
    @Autowired
    private InvoiceService invoiceService;

    @PostMapping("/lessee-approve")
    public ResponseEntity<?> createPayment(HttpServletRequest req, @CurrentUser UserPrincipal userPrincipal, @Valid @RequestBody SignRequest signRequest) throws UnsupportedEncodingException {
        String paymentUrl = invoiceService.createPaymentUrl(req, userPrincipal, signRequest);
        return ResponseEntity.ok(new ApiResponse(200, "Đường dẫn VNPAY", paymentUrl));
    }

    @PostMapping("/payment-callback")
    public ResponseEntity<ApiResponse> approveRentalRequest(HttpServletRequest req) throws Exception {
        RentalContractDTO updatedContract = invoiceService.handlePaymentCallback(req);
        return ResponseEntity.ok(new ApiResponse(200, "Rental contract signed successfully", updatedContract));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getRentalContract(@PathVariable ObjectId id) throws Exception {
        RentalContractDTO rentalContract = rentalContractService.getRentalContract(id);
        return ResponseEntity.ok(new ApiResponse(200, "success", rentalContract));
    }

    @GetMapping("/lessor")
    public ResponseEntity<ApiResponse> getRentalContractForLessor(
            @CurrentUser UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "createdAt") String sortField,
            @RequestParam(defaultValue = "false") boolean sortDescending,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<RentalContractDTO> rentalContracts = rentalContractService.getRentalContractForLessor(
                userPrincipal.getId(), sortField, sortDescending, page, size);
        return ResponseEntity.ok(new ApiResponse(200, "success", rentalContracts));
    }

    @GetMapping("/lessee")
    public ResponseEntity<ApiResponse> getRentalContractForLessee(
            @CurrentUser UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "createdAt") String sortField,
            @RequestParam(defaultValue = "false") boolean sortDescending,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<RentalContractDTO> rentalContracts = rentalContractService.getRentalContractForLessee(
                userPrincipal.getId(), sortField, sortDescending, page, size);
        return ResponseEntity.ok(new ApiResponse(200, "success", rentalContracts));
    }
}
