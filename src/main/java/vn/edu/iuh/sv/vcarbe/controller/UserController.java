package vn.edu.iuh.sv.vcarbe.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.sv.vcarbe.dto.*;
import vn.edu.iuh.sv.vcarbe.security.CurrentUser;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse> getCurrentUser(@CurrentUser UserPrincipal userPrincipal) {
        UserDTO user = userService.getUserById(userPrincipal.getId());
        return ResponseEntity.ok(new ApiResponse(200, "User retrieved successfully", user));
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse> updateUser(@CurrentUser UserPrincipal userPrincipal, @RequestBody UpdateUserDTO updateUserDTO) {
        UserDTO updatedUser = userService.updateUser(userPrincipal.getId(), updateUserDTO);
        return ResponseEntity.ok(new ApiResponse(200, "User retrieved successfully", updatedUser));
    }

    @PutMapping("/update-license")
    public ResponseEntity<ApiResponse> updateCarLicense(@CurrentUser UserPrincipal userPrincipal, @RequestBody UpdateCarLicenseDTO updateCarLicenseDTO) {
        UserDTO updatedUser = userService.updateCarLicense(userPrincipal.getId(), updateCarLicenseDTO);
        return ResponseEntity.ok(new ApiResponse(200, "User retrieved successfully", updatedUser));
    }

    @PutMapping("/update-citizen-identification")
    public ResponseEntity<ApiResponse> updateCitizenIdentification(@CurrentUser UserPrincipal userPrincipal, @RequestBody UpdateCitizenIdentificationDTO updateCitizenIdentificationDTO) {
        UserDTO updatedUser = userService.updateCitizenIdentification(userPrincipal.getId(), updateCitizenIdentificationDTO);
        return ResponseEntity.ok(new ApiResponse(200, "Citizen identification updated successfully", updatedUser));
    }
}
