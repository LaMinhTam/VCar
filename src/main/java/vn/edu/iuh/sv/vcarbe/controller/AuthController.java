package vn.edu.iuh.sv.vcarbe.controller;

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
public class AuthController {

    @Autowired
    private Authservice authService;

    @PostMapping("/signin")
    public ResponseEntity<ApiResponse> authenticateUser(@RequestBody LoginRequest loginRequest) {
        SignInResponse tokenResponse = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(new ApiResponse(200, "User authenticated successfully", tokenResponse));
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        User user = authService.registerUser(signUpRequest);
        return ResponseEntity.ok().body(new ApiResponse(200, "User registered successfully", user));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse> refreshToken(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        TokenResponse token = authService.refreshToken(userPrincipal);
        return ResponseEntity.ok(new ApiResponse(200, "Token refreshed successfully", token));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse> verifyUser(@Valid @RequestBody VerificationRequest verificationRequest) {
        SignInResponse signInResponse = authService.verifyUser(verificationRequest);
        return ResponseEntity.ok(new ApiResponse(200, "User verified successfully", signInResponse));
    }

    @PostMapping("/update-phone")
    public ResponseEntity<ApiResponse> updatePhoneNumber(@AuthenticationPrincipal UserPrincipal userPrincipal, @Valid @RequestBody UpdatePhoneRequest updatePhoneRequest) {
        User user = authService.updatePhoneNumber(userPrincipal, updatePhoneRequest);
        return ResponseEntity.ok(new ApiResponse(200, "Phone number updated successfully", user));
    }
}
