package vn.edu.iuh.sv.vcarbe.controller;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.sv.vcarbe.dto.ApiResponse;
import vn.edu.iuh.sv.vcarbe.dto.VehicleHandoverDocumentDTO;
import vn.edu.iuh.sv.vcarbe.dto.VehicleHandoverRequest;
import vn.edu.iuh.sv.vcarbe.dto.VehicleReturnRequest;
import vn.edu.iuh.sv.vcarbe.entity.VehicleHandoverDocument;
import vn.edu.iuh.sv.vcarbe.security.CurrentUser;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.impl.VehicleHandoverServiceImpl;

@RestController
@RequestMapping("/vehicle-handover")
public class VehicleHandoverController {
    @Autowired
    private VehicleHandoverServiceImpl vehicleHandoverService;

    @PostMapping
    public ResponseEntity<ApiResponse> createVehicleHandover(@CurrentUser UserPrincipal userPrincipal, @RequestBody VehicleHandoverRequest request) {
        VehicleHandoverDocumentDTO document = vehicleHandoverService.createVehicleHandover(userPrincipal, request);
        return ResponseEntity.ok(new ApiResponse(200, "Vehicle handover document created successfully", document));
    }

    @PutMapping("/{id}/approve-lessee")
    public ResponseEntity<ApiResponse> approveVehicleHandoverByLessee(@CurrentUser UserPrincipal userPrincipal, @PathVariable ObjectId id) {
        VehicleHandoverDocumentDTO document = vehicleHandoverService.approveByLessee(id, userPrincipal);
        return ResponseEntity.ok(new ApiResponse(200, "Vehicle handover document approved by lessee", document));
    }

    @PutMapping("/{id}/approve-lessor")
    public ResponseEntity<ApiResponse> approveVehicleReturnByLessor(@CurrentUser UserPrincipal userPrincipal, @PathVariable ObjectId id) {
        VehicleHandoverDocumentDTO document = vehicleHandoverService.approveByLessor(id, userPrincipal);
        return ResponseEntity.ok(new ApiResponse(200, "Vehicle return document approved by lessor", document));
    }

    @PutMapping("/{id}/return")
    public ResponseEntity<ApiResponse> updateVehicleHandover(@CurrentUser UserPrincipal userPrincipal, @PathVariable ObjectId id, @RequestBody VehicleReturnRequest request) {
        VehicleHandoverDocumentDTO document = vehicleHandoverService.updateVehicleReturn(id, request, userPrincipal);
        return ResponseEntity.ok(new ApiResponse(200, "Vehicle return document updated successfully", document));
    }

    @GetMapping("/rental-contract/{rentalContractId}")
    public ResponseEntity<ApiResponse> getVehicleHandoverByRentalContractId(@PathVariable ObjectId rentalContractId) {
        VehicleHandoverDocumentDTO document = vehicleHandoverService.getVehicleHandoverByRentalContractId(rentalContractId);
        return ResponseEntity.ok(new ApiResponse(200, "Vehicle handover document retrieved successfully", document));
    }
}
