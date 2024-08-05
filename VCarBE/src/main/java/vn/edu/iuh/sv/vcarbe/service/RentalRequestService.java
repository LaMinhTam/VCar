package vn.edu.iuh.sv.vcarbe.service;

import org.bson.types.ObjectId;
import vn.edu.iuh.sv.vcarbe.dto.ApprovalRequest;
import vn.edu.iuh.sv.vcarbe.dto.RentRequestDTO;
import vn.edu.iuh.sv.vcarbe.dto.RentalContractDTO;
import vn.edu.iuh.sv.vcarbe.dto.RentalRequestDTO;
import vn.edu.iuh.sv.vcarbe.entity.RentRequestStatus;
import vn.edu.iuh.sv.vcarbe.entity.RentalRequest;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;

import java.util.List;

public interface RentalRequestService {
    RentalRequestDTO createRentalRequest(RentRequestDTO rentRequestDTO, ObjectId lesseeId);

    RentalContractDTO approveRentalContract(UserPrincipal userPrincipal, ApprovalRequest approvalRequest);

    RentalRequest rejectRentalContract(ApprovalRequest approvalRequest);

    List<RentalRequestDTO> getRentalRequestForLessor(ObjectId id, String sortField, boolean sortDescending, RentRequestStatus status, int page, int size);

    List<RentalRequestDTO> getRentalRequestForLessee(ObjectId id, String sortField, boolean sortDescending, RentRequestStatus status, int page, int size);
}
