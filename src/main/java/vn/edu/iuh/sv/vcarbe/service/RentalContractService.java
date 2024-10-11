package vn.edu.iuh.sv.vcarbe.service;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import vn.edu.iuh.sv.vcarbe.dto.RentalContractDTO;

public interface RentalContractService {
    RentalContractDTO getRentalContract(ObjectId id) throws Exception;

    Page<RentalContractDTO> getRentalContractForLessor(ObjectId id, String sortField, boolean sortDescending, int page, int size);

    Page<RentalContractDTO> getRentalContractForLessee(ObjectId id, String sortField, boolean sortDescending, int page, int size);
}
