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
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.dto.ApiResponseWrapper;
import vn.edu.iuh.sv.vcarbe.dto.VehicleHandoverDocumentDTO;
import vn.edu.iuh.sv.vcarbe.dto.VehicleHandoverRequest;
import vn.edu.iuh.sv.vcarbe.dto.VehicleReturnRequest;
import vn.edu.iuh.sv.vcarbe.security.CurrentUser;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.impl.VehicleHandoverServiceImpl;

@RestController
@RequestMapping("/vehicle-handover")
@Tag(name = "Vehicle Handover Controller", description = "APIs related to vehicle handover and return")
public class VehicleHandoverController {
    @Autowired
    private VehicleHandoverServiceImpl vehicleHandoverService;

    @Operation(summary = "Create a new vehicle handover document", description = "Creates a new vehicle handover document for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicle handover document created successfully"),
            @ApiResponse(responseCode = "404", description = "Rental contract not found")
    })
    @PostMapping
    public Mono<ResponseEntity<ApiResponseWrapper>> createVehicleHandover(
            @CurrentUser UserPrincipal userPrincipal,
            @RequestBody @Valid VehicleHandoverRequest request) {
        return vehicleHandoverService.createVehicleHandover(userPrincipal, request)
                .map(document -> ResponseEntity.ok(new ApiResponseWrapper(200, "Vehicle handover document created successfully", document)));
    }

    @Operation(summary = "Approve vehicle handover by lessee", description = "Approves the vehicle handover document by the lessee")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicle handover document approved by lessee"),
            @ApiResponse(responseCode = "403", description = "User is not authorized to approve the document"),
            @ApiResponse(responseCode = "404", description = "Vehicle handover document not found")
    })
    @PutMapping("/{id}/approve-lessee")
    public Mono<ResponseEntity<ApiResponseWrapper>> approveVehicleHandoverByLessee(
            @CurrentUser UserPrincipal userPrincipal,
            @Parameter(description = "Vehicle Handover Document ID (must be a valid ObjectId)", schema = @Schema(type = "string", example = "60c72b2f9b1e8c001f0a0b4e"))
            @PathVariable ObjectId id) {
        return vehicleHandoverService.approveByLessee(id, userPrincipal)
                .map(document -> ResponseEntity.ok(new ApiResponseWrapper(200, "Vehicle handover document approved by lessee", document)));
    }

    @Operation(summary = "Approve vehicle return by lessor", description = "Approves the vehicle return document by the lessor")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicle return document approved by lessor"),
            @ApiResponse(responseCode = "403", description = "User is not authorized to approve the document"),
            @ApiResponse(responseCode = "404", description = "Vehicle handover document not found")
    })
    @PutMapping("/{id}/approve-lessor")
    public Mono<ResponseEntity<ApiResponseWrapper>> approveVehicleReturnByLessor(
            @CurrentUser UserPrincipal userPrincipal,
            @Parameter(description = "Vehicle Handover Document ID (must be a valid ObjectId)", schema = @Schema(type = "string", example = "60c72b2f9b1e8c001f0a0b4e"))
            @PathVariable ObjectId id) {
        return vehicleHandoverService.approveByLessor(id, userPrincipal)
                .map(document -> ResponseEntity.ok(new ApiResponseWrapper(200, "Vehicle return document approved by lessor", document)));
    }

    @Operation(summary = "Update vehicle handover document with return details", description = "Updates the vehicle handover document with return details by the lessee")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicle return document updated successfully"),
            @ApiResponse(responseCode = "403", description = "User is not authorized to update the document"),
            @ApiResponse(responseCode = "404", description = "Vehicle handover document not found")
    })
    @PutMapping("/{id}/return")
    public Mono<ResponseEntity<ApiResponseWrapper>> updateVehicleHandover(
            @CurrentUser UserPrincipal userPrincipal,
            @Parameter(description = "Vehicle Handover Document ID (must be a valid ObjectId)", schema = @Schema(type = "string", example = "60c72b2f9b1e8c001f0a0b4e"))
            @PathVariable ObjectId id,
            @RequestBody @Valid VehicleReturnRequest request) {
        return vehicleHandoverService.updateVehicleReturn(id, request, userPrincipal)
                .map(document -> ResponseEntity.ok(new ApiResponseWrapper(200, "Vehicle return document updated successfully", document)));
    }

    @Operation(summary = "Retrieve vehicle handover document by rental contract ID", description = "Retrieves the vehicle handover document associated with a rental contract ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicle handover document retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Vehicle handover document not found")
    })
    @GetMapping("/rental-contract/{rentalContractId}")
    public Mono<ResponseEntity<ApiResponseWrapper>> getVehicleHandoverByRentalContractId(
            @Parameter(description = "Rental Contract ID (must be a valid ObjectId)", schema = @Schema(type = "string", example = "60c72b2f9b1e8c001f0a0b4e"))
            @PathVariable ObjectId rentalContractId) {
        return vehicleHandoverService.getVehicleHandoverByRentalContractId(rentalContractId)
                .map(document -> ResponseEntity.ok(new ApiResponseWrapper(200, "Vehicle handover document retrieved successfully", document)));
    }
}
