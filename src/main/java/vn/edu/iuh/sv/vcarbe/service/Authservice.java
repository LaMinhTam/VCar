package vn.edu.iuh.sv.vcarbe.service;

import vn.edu.iuh.sv.vcarbe.controller.TokenResponse;
import vn.edu.iuh.sv.vcarbe.dto.LoginRequest;
import vn.edu.iuh.sv.vcarbe.dto.SignUpRequest;
import vn.edu.iuh.sv.vcarbe.dto.UpdatePhoneRequest;
import vn.edu.iuh.sv.vcarbe.dto.VerificationRequest;
import vn.edu.iuh.sv.vcarbe.entity.User;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;

public interface Authservice {
    TokenResponse authenticateUser(LoginRequest loginRequest);

    User registerUser(SignUpRequest signUpRequest);

    TokenResponse refreshToken(UserPrincipal userPrincipal);

    void verifyUser(VerificationRequest verificationRequest);

    User updatePhoneNumber(UserPrincipal userPrincipal, UpdatePhoneRequest updatePhoneRequest);
}
