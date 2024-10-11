package vn.edu.iuh.sv.vcarbe.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.sv.vcarbe.dto.ApiResponseWrapper;
import vn.edu.iuh.sv.vcarbe.dto.UpdateCarLicenseDTO;
import vn.edu.iuh.sv.vcarbe.dto.UpdateCitizenIdentificationDTO;
import vn.edu.iuh.sv.vcarbe.dto.UpdateUserDTO;
import vn.edu.iuh.sv.vcarbe.exception.MessageKeys;
import vn.edu.iuh.sv.vcarbe.security.CurrentUser;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.UserService;

@RestController
@RequestMapping("/users")
@Tag(name = "User Controller", description = "APIs related to user management")
public class UserController {
    @Autowired
    private UserService userService;

    @Operation(summary = "Get user by ID", description = "Retrieves a user by their ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseWrapper> getUserById(
            @Parameter(
                    description = "User ID (must be a valid ObjectId)",
                    schema = @Schema(type = "string", example = "66c1b604172236f7936e26c0")
            )
            @PathVariable ObjectId id) {
        return ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.SUCCESS.name(), userService.getUserDetailById(id)));
    }

    @Operation(summary = "Get current user", description = "Retrieves the details of the currently authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User retrieved successfully")
    })
    @GetMapping("/me")
    public ResponseEntity<ApiResponseWrapper> getCurrentUser(
            @CurrentUser UserPrincipal userPrincipal) {
        return ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.SUCCESS.name(), userService.getUserById(userPrincipal.getId())));
    }

    @Operation(summary = "Update user details", description = "Updates the details of the currently authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User updated successfully")
    })
    @PutMapping("/update")
    public ResponseEntity<ApiResponseWrapper> updateUser(
            @CurrentUser UserPrincipal userPrincipal,
            @Valid @RequestBody UpdateUserDTO updateUserDTO) {
        return ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.USER_UPDATE_SUCCESS.name(), userService.updateUser(userPrincipal.getId(), updateUserDTO)));
    }

    @Operation(summary = "Update car license", description = "Updates the car license of the currently authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Car license updated successfully")
    })
    @PutMapping("/update-license")
    public ResponseEntity<ApiResponseWrapper> updateCarLicense(
            @CurrentUser UserPrincipal userPrincipal,
            @Valid @RequestBody UpdateCarLicenseDTO updateCarLicenseDTO) {
        return ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.USER_UPDATE_IDENTIFICATION_SUCCESS.name(), userService.updateCarLicense(userPrincipal.getId(), updateCarLicenseDTO)));
    }

    @Operation(summary = "Update citizen identification", description = "Updates the citizen identification of the currently authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Citizen identification updated successfully")
    })
    @PutMapping("/update-citizen-identification")
    public ResponseEntity<ApiResponseWrapper> updateCitizenIdentification(
            @CurrentUser UserPrincipal userPrincipal,
            @Valid @RequestBody UpdateCitizenIdentificationDTO updateCitizenIdentificationDTO) {
        return ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.USER_UPDATE_IDENTIFICATION_SUCCESS.name(), userService.updateCitizenIdentification(userPrincipal.getId(), updateCitizenIdentificationDTO)));
    }
}
