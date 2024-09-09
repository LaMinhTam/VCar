package vn.edu.iuh.sv.vcarbe.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
import vn.edu.iuh.sv.vcarbe.service.RentalRequestService;

import java.util.List;

@RestController
@RequestMapping("/rental-requests")
@Tag(name = "Rental Request Controller", description = "APIs related to rental requests management")
public class RentalRequestController {

    @Autowired
    private RentalRequestService rentalRequestService;

    @Operation(summary = "Create a new rental contract", description = "Creates a new rental contract for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Rental contract created successfully"),
            @ApiResponse(responseCode = "400", description = "User is not verified or request is invalid")
    })
    @PostMapping("/rent")
    public ResponseEntity<ApiResponseWrapper> createRentalContract(
            @RequestBody RentRequestDTO rentRequestDTO,
            @CurrentUser UserPrincipal userPrincipal) {
        if (!userPrincipal.isVerify()) {
            return ResponseEntity.badRequest().body(new ApiResponseWrapper(400, "You must verify your email, car license, citizen identification first", null));
        }
        RentalRequestDTO createdContract = rentalRequestService.createRentalRequest(rentRequestDTO, userPrincipal.getId());
        return ResponseEntity.ok(new ApiResponseWrapper(200, "Rental contract created successfully", createdContract));
    }

    @Operation(summary = "Approve a rental request", description = "Approves a rental request")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Rental contract approved successfully"),
            @ApiResponse(responseCode = "400", description = "Request is invalid or user is not authorized")
    })
    @PostMapping("/approve")
    public ResponseEntity<ApiResponseWrapper> approveRentalRequest(
            @CurrentUser UserPrincipal userPrincipal,
            @Valid @RequestBody ApprovalRequest approvalRequest) throws Exception {
        RentalContractDTO updatedContract = rentalRequestService.approveRentalContract(userPrincipal, approvalRequest);
        return ResponseEntity.ok(new ApiResponseWrapper(200, "Rental contract approved successfully", updatedContract));
    }

    @Operation(summary = "Reject a rental request", description = "Rejects a rental request")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Rental contract rejected successfully"),
            @ApiResponse(responseCode = "400", description = "Request is invalid")
    })
    @PostMapping("/reject")
    public ResponseEntity<ApiResponseWrapper> rejectRentalRequest(
            @Valid @RequestBody ApprovalRequest approvalRequest) {
        RentalRequest updatedContract = rentalRequestService.rejectRentalContract(approvalRequest);
        return ResponseEntity.ok(new ApiResponseWrapper(200, "Rental contract rejected successfully", updatedContract));
    }

    @Operation(summary = "Get rental requests for lessor", description = "Retrieves rental requests for the lessor based on various criteria")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Rental requests retrieved successfully")
    })
    @GetMapping("/lessor")
    public ResponseEntity<ApiResponseWrapper> getRentalRequestForLessor(
            @CurrentUser UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "createdAt") String sortField,
            @RequestParam(defaultValue = "false") boolean sortDescending,
            @RequestParam(required = false) RentRequestStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<RentalRequestDTO> rentalRequests = rentalRequestService.getRentalRequestForLessor(
                userPrincipal.getId(), sortField, sortDescending, status, page, size);
        return ResponseEntity.ok(new ApiResponseWrapper(200, "success", rentalRequests));
    }

    @Operation(summary = "Get rental requests for lessee", description = "Retrieves rental requests for the lessee based on various criteria")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Rental requests retrieved successfully")
    })
    @GetMapping("/lessee")
    public ResponseEntity<ApiResponseWrapper> getRentalRequestForLessee(
            @CurrentUser UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "createdAt") String sortField,
            @RequestParam(defaultValue = "false") boolean sortDescending,
            @RequestParam(required = false) RentRequestStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<RentalRequestDTO> rentalRequests = rentalRequestService.getRentalRequestForLessee(
                userPrincipal.getId(), sortField, sortDescending, status, page, size);
        return ResponseEntity.ok(new ApiResponseWrapper(200, "success", rentalRequests));
    }

    @Operation(summary = "Get a rental request by ID", description = "Finds a rental request by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Rental request found successfully"),
            @ApiResponse(responseCode = "404", description = "Rental request not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseWrapper> getRentalRequest(
            @Parameter(description = "Rental request ID (must be a valid ObjectId)", schema = @Schema(type = "string", example = "64b64c8f12e94c080e8e4567"))
            @PathVariable ObjectId id) {
        RentalRequestDTO rentalRequest = rentalRequestService.getRentalRequest(id);
        return ResponseEntity.ok(new ApiResponseWrapper(200, "success", rentalRequest));
    }
}
