package vn.edu.iuh.sv.vcarbe.service.impl;

import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.iuh.sv.vcarbe.dto.*;
import vn.edu.iuh.sv.vcarbe.entity.CarLicense;
import vn.edu.iuh.sv.vcarbe.entity.CitizenIdentification;
import vn.edu.iuh.sv.vcarbe.entity.User;
import vn.edu.iuh.sv.vcarbe.exception.AppException;
import vn.edu.iuh.sv.vcarbe.repository.UserRepository;
import vn.edu.iuh.sv.vcarbe.service.UserService;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ModelMapper modelMapper;

    public User getUserByIdFromRepository(ObjectId userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(404, "User not found with id " + userId));
    }

    @Override
    public UserDTO getUserById(ObjectId id) {
        User user = getUserByIdFromRepository(id);
        return modelMapper.map(user, UserDTO.class);
    }

    @Override
    public UserDTO updateUser(ObjectId userId, UpdateUserDTO updateUserDTO) {
        User user = getUserByIdFromRepository(userId);
        user.setDisplayName(updateUserDTO.displayName());
        user.setPhoneNumber(updateUserDTO.phoneNumber());
        User savedUser = userRepository.save(user);
        return modelMapper.map(savedUser, UserDTO.class);
    }

    @Override
    public UserDTO updateCarLicense(ObjectId userId, UpdateCarLicenseDTO updateCarLicenseDTO) {
        User user = getUserByIdFromRepository(userId);
        CarLicense license = new CarLicense(updateCarLicenseDTO.id(), updateCarLicenseDTO.fullName(), updateCarLicenseDTO.dob(), updateCarLicenseDTO.licenseImageUrl());
        user.setCarLicense(license);
        User savedUser = userRepository.save(user);
        return modelMapper.map(savedUser, UserDTO.class);
    }

    @Override
    public UserDTO updateCitizenIdentification(ObjectId userId, UpdateCitizenIdentificationDTO updateCitizenIdentificationDTO) {
        User user = getUserByIdFromRepository(userId);
        CitizenIdentification citizenIdentification = new CitizenIdentification(
                updateCitizenIdentificationDTO.identificationNumber(),
                updateCitizenIdentificationDTO.passportNumber(),
                updateCitizenIdentificationDTO.issuedDate(),
                updateCitizenIdentificationDTO.issuedLocation(),
                updateCitizenIdentificationDTO.permanentAddress(),
                updateCitizenIdentificationDTO.contactAddress(),
                updateCitizenIdentificationDTO.identificationImageUrl()
        );
        user.setCitizenIdentification(citizenIdentification);
        User savedUser = userRepository.save(user);
        return modelMapper.map(savedUser, UserDTO.class);
    }

    @Override
    public UserDetailDTO getUserDetailById(ObjectId id) {
        UserDetailDTO user = userRepository.getUserDetailById(id);
        return modelMapper.map(user, UserDetailDTO.class);
    }

}
