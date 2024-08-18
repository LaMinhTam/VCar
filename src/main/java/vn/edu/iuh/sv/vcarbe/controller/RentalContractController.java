package vn.edu.iuh.sv.vcarbe.controller;

import jakarta.validation.Valid;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.sv.vcarbe.dto.*;
import vn.edu.iuh.sv.vcarbe.entity.RentRequestStatus;
import vn.edu.iuh.sv.vcarbe.entity.RentalRequest;
import vn.edu.iuh.sv.vcarbe.security.CurrentUser;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.RentalContractService;
import vn.edu.iuh.sv.vcarbe.service.RentalRequestService;

import java.util.List;

@RestController
@RequestMapping("/rental-contracts")
public class RentalContractController {
    @Autowired
    private RentalContractService rentalContractService;

    @PostMapping("/sign")
    public ResponseEntity<ApiResponse> signRentalContract(@CurrentUser UserPrincipal userPrincipal, @Valid @RequestBody SignRequest signRequest) {
        RentalContractDTO updatedContract = rentalContractService.signRentalContract(userPrincipal, signRequest);
        return ResponseEntity.ok(new ApiResponse(200, "Rental contract signed successfully", updatedContract));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getRentalContract(@PathVariable ObjectId id) {
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
