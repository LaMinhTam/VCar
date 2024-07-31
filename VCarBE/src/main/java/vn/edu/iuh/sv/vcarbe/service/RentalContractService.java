package vn.edu.iuh.sv.vcarbe.service;

import org.bson.types.ObjectId;
import vn.edu.iuh.sv.vcarbe.dto.ApprovalRequest;
import vn.edu.iuh.sv.vcarbe.dto.RentRequest;
import vn.edu.iuh.sv.vcarbe.dto.RentalContractDTO;

import java.util.List;

public interface RentalContractService {
    RentalContractDTO createRentalContract(RentRequest rentRequest, ObjectId lessee);

    RentalContractDTO getRentalContract(ObjectId id);

    List<RentalContractDTO> getRentalContractForLessor(ObjectId id, boolean sortDescending, int page, int size);

    List<RentalContractDTO> getRentalContractForLessee(ObjectId id, boolean sortDescending, int page, int size);

    RentalContractDTO approveRentalContract(ApprovalRequest approvalRequest);

    RentalContractDTO rejectRentalContract(ApprovalRequest approvalRequest);
}
