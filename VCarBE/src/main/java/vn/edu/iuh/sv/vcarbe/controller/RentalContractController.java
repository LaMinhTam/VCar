package vn.edu.iuh.sv.vcarbe.controller;

import jakarta.validation.Valid;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.sv.vcarbe.dto.ApiResponse;
import vn.edu.iuh.sv.vcarbe.dto.ApprovalRequest;
import vn.edu.iuh.sv.vcarbe.dto.RentRequest;
import vn.edu.iuh.sv.vcarbe.dto.RentalContractDTO;
import vn.edu.iuh.sv.vcarbe.security.CurrentUser;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.RentalContractService;

import java.util.List;

@RestController
@RequestMapping("/rental-contracts")
public class RentalContractController {
    @Autowired
    private RentalContractService rentalContractService;

    @PostMapping("/rent")
    public ResponseEntity<ApiResponse> createRentalContract(
            @RequestBody RentRequest rentRequest,
            @CurrentUser UserPrincipal userPrincipal) {
        if (!userPrincipal.isVerify()) {
            return ResponseEntity.badRequest().body(new ApiResponse(400, "You must verify your email, car license, citizen identification first", null));
        }
        RentalContractDTO createdContract = rentalContractService.createRentalContract(rentRequest, userPrincipal.getId());
        return ResponseEntity.ok(new ApiResponse(200, "Rental contract created successfully", createdContract));
    }

    @PostMapping("/approve")
    public ResponseEntity<ApiResponse> approveRentalContract(@Valid @RequestBody ApprovalRequest approvalRequest) {
        RentalContractDTO updatedContract = rentalContractService.approveRentalContract(approvalRequest);
        return ResponseEntity.ok(new ApiResponse(200, "Rental contract approved successfully", updatedContract));
    }

    @PostMapping("/reject")
    public ResponseEntity<ApiResponse> rejectRentalContract(@Valid @RequestBody ApprovalRequest approvalRequest) {
        RentalContractDTO updatedContract = rentalContractService.rejectRentalContract(approvalRequest);
        return ResponseEntity.ok(new ApiResponse(200, "Rental contract rejected successfully", updatedContract));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getRentalContract(@PathVariable ObjectId id) {
        RentalContractDTO rentalContract = rentalContractService.getRentalContract(id);
        return ResponseEntity.ok(new ApiResponse(200, "success", rentalContract));
    }

    @GetMapping("/lessor")
    public ResponseEntity<ApiResponse> getRentalContractForLessor(@CurrentUser UserPrincipal userPrincipal, @RequestParam(defaultValue = "false") boolean isSortDescending, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        List<RentalContractDTO> rentalContracts = rentalContractService.getRentalContractForLessor(userPrincipal.getId(), isSortDescending, page, size);
        return ResponseEntity.ok(new ApiResponse(200, "success", rentalContracts));
    }

    @GetMapping("/lessee")
    public ResponseEntity<ApiResponse> getRentalContractForLessee(@CurrentUser UserPrincipal userPrincipal, @RequestParam(defaultValue = "false") boolean isSortDescending, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        List<RentalContractDTO> rentalContracts = rentalContractService.getRentalContractForLessee(userPrincipal.getId(), isSortDescending, page, size);
        return ResponseEntity.ok(new ApiResponse(200, "success", rentalContracts));
    }
}
