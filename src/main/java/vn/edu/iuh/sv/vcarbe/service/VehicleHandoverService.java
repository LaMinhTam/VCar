package vn.edu.iuh.sv.vcarbe.service;

import org.bson.types.ObjectId;
import vn.edu.iuh.sv.vcarbe.dto.VehicleHandoverDocumentDTO;
import vn.edu.iuh.sv.vcarbe.dto.VehicleHandoverRequest;
import vn.edu.iuh.sv.vcarbe.dto.VehicleReturnRequest;
import vn.edu.iuh.sv.vcarbe.entity.VehicleHandoverDocument;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;

public interface VehicleHandoverService {
    VehicleHandoverDocumentDTO createVehicleHandover(UserPrincipal userPrincipal, VehicleHandoverRequest request);

    VehicleHandoverDocumentDTO approveByLessee(ObjectId id, UserPrincipal userPrincipal);

    VehicleHandoverDocumentDTO approveByLessor(ObjectId id, UserPrincipal userPrincipal);

    VehicleHandoverDocumentDTO updateVehicleReturn(ObjectId id, VehicleReturnRequest request, UserPrincipal userPrincipal);

    VehicleHandoverDocumentDTO getVehicleHandoverByRentalContractId(ObjectId rentalContractId);
}
