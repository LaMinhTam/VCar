package vn.edu.iuh.sv.vcarbe.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.sv.vcarbe.dto.*;
import vn.edu.iuh.sv.vcarbe.entity.User;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.Authservice;

@RestController
@RequestMapping("/auth")
@Tag(name = "Auth Controller", description = "APIs related to user authentication and management")
public class AuthController {
    @Autowired
    private Authservice authService;

    @Operation(summary = "Sign in user", description = "Authenticates a user and returns access and refresh tokens")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User authenticated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid email or password")
    })
    @PostMapping("/signin")
    public ResponseEntity<ApiResponseWrapper> authenticateUser(
            @RequestBody @Valid LoginRequest loginRequest) {
        SignInResponse tokenResponse = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(new ApiResponseWrapper(200, "User authenticated successfully", tokenResponse));
    }

    @Operation(summary = "Sign up user", description = "Registers a new user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User registered successfully"),
            @ApiResponse(responseCode = "400", description = "Email address already in use")
    })
    @PostMapping("/signup")
    public ResponseEntity<ApiResponseWrapper> registerUser(
            @RequestBody @Valid SignUpRequest signUpRequest) {
        User user = authService.registerUser(signUpRequest);
        return ResponseEntity.ok().body(new ApiResponseWrapper(200, "User registered successfully", user));
    }

    @Operation(summary = "Refresh token", description = "Refreshes the access token using the provided refresh token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token refreshed successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid or expired refresh token")
    })
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponseWrapper> refreshToken(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody @Valid TokenRefreshRequest tokenRequest) {
        TokenResponse token = authService.refreshToken(userPrincipal, tokenRequest.refreshToken());
        return ResponseEntity.ok(new ApiResponseWrapper(200, "Token refreshed successfully", token));
    }

    @Operation(summary = "Verify user", description = "Verifies a user's email address with a verification code")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User verified successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid verification code or user not found")
    })
    @PostMapping("/verify")
    public ResponseEntity<ApiResponseWrapper> verifyUser(
            @RequestBody @Valid VerificationRequest verificationRequest) {
        SignInResponse signInResponse = authService.verifyUser(verificationRequest);
        return ResponseEntity.ok(new ApiResponseWrapper(200, "User verified successfully", signInResponse));
    }

    @Operation(summary = "Update phone number", description = "Updates the phone number for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Phone number updated successfully"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PostMapping("/update-phone")
    public ResponseEntity<ApiResponseWrapper> updatePhoneNumber(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody @Valid UpdatePhoneRequest updatePhoneRequest) {
        User user = authService.updatePhoneNumber(userPrincipal, updatePhoneRequest);
        return ResponseEntity.ok(new ApiResponseWrapper(200, "Phone number updated successfully", user));
    }
}
