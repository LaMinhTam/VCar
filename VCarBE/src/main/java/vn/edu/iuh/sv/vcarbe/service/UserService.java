package vn.edu.iuh.sv.vcarbe.service;

import org.bson.types.ObjectId;
import vn.edu.iuh.sv.vcarbe.dto.UpdateCarLicenseDTO;
import vn.edu.iuh.sv.vcarbe.dto.UpdateCitizenIdentificationDTO;
import vn.edu.iuh.sv.vcarbe.dto.UpdateUserDTO;
import vn.edu.iuh.sv.vcarbe.dto.UserDTO;

public interface UserService {
    UserDTO updateUser(ObjectId userId, UpdateUserDTO updateUserDTO);

    UserDTO updateCarLicense(ObjectId userId, UpdateCarLicenseDTO updateCarLicenseDTO);

    UserDTO getUserById(ObjectId id);

    UserDTO updateCitizenIdentification(ObjectId userId, UpdateCitizenIdentificationDTO updateCitizenIdentificationDTO);
}
