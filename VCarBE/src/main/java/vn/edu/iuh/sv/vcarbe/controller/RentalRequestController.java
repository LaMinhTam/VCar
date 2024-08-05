package vn.edu.iuh.sv.vcarbe.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.sv.vcarbe.dto.*;
import vn.edu.iuh.sv.vcarbe.entity.RentRequestStatus;
import vn.edu.iuh.sv.vcarbe.entity.RentalRequest;
import vn.edu.iuh.sv.vcarbe.security.CurrentUser;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.RentalRequestService;

import java.util.List;

@RestController
@RequestMapping("/rental-requests")
public class RentalRequestController {
    @Autowired
    private RentalRequestService rentalRequestService;

    @PostMapping("/rent")
    public ResponseEntity<ApiResponse> createRentalContract(
            @RequestBody RentRequestDTO rentRequestDTO,
            @CurrentUser UserPrincipal userPrincipal) {
        if (!userPrincipal.isVerify()) {
            return ResponseEntity.badRequest().body(new ApiResponse(400, "You must verify your email, car license, citizen identification first", null));
        }
        RentalRequestDTO createdContract = rentalRequestService.createRentalRequest(rentRequestDTO, userPrincipal.getId());
        return ResponseEntity.ok(new ApiResponse(200, "Rental contract created successfully", createdContract));
    }

    @PostMapping("/approve")
    public ResponseEntity<ApiResponse> approveRentalRequest(@CurrentUser UserPrincipal userPrincipal, @Valid @RequestBody ApprovalRequest approvalRequest) {
        RentalContractDTO updatedContract = rentalRequestService.approveRentalContract(userPrincipal, approvalRequest);
        return ResponseEntity.ok(new ApiResponse(200, "Rental contract approved successfully", updatedContract));
    }

    @PostMapping("/reject")
    public ResponseEntity<ApiResponse> rejectRentalRequest(@Valid @RequestBody ApprovalRequest approvalRequest) {
        RentalRequest updatedContract = rentalRequestService.rejectRentalContract(approvalRequest);
        return ResponseEntity.ok(new ApiResponse(200, "Rental contract rejected successfully", updatedContract));
    }

    @GetMapping("/lessor")
    public ResponseEntity<ApiResponse> getRentalRequestForLessor(
            @CurrentUser UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "createdAt") String sortField,
            @RequestParam(defaultValue = "false") boolean sortDescending,
            @RequestParam RentRequestStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<RentalRequestDTO> rentalRequests = rentalRequestService.getRentalRequestForLessor(
                userPrincipal.getId(), sortField, sortDescending, status, page, size);
        return ResponseEntity.ok(new ApiResponse(200, "success", rentalRequests));
    }

    @GetMapping("/lessee")
    public ResponseEntity<ApiResponse> getRentalRequestForLessee(
            @CurrentUser UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "createdAt") String sortField,
            @RequestParam(defaultValue = "false") boolean sortDescending,
            @RequestParam RentRequestStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<RentalRequestDTO> rentalRequests = rentalRequestService.getRentalRequestForLessee(
                userPrincipal.getId(), sortField, sortDescending, status, page, size);
        return ResponseEntity.ok(new ApiResponse(200, "success", rentalRequests));
    }
}
