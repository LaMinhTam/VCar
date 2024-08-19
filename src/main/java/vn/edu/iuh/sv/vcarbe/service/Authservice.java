package vn.edu.iuh.sv.vcarbe.service;

import vn.edu.iuh.sv.vcarbe.controller.TokenResponse;
import vn.edu.iuh.sv.vcarbe.dto.*;
import vn.edu.iuh.sv.vcarbe.entity.User;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;

public interface Authservice {
    SignInResponse authenticateUser(LoginRequest loginRequest);

    User registerUser(SignUpRequest signUpRequest);

    TokenResponse refreshToken(UserPrincipal userPrincipal);

    SignInResponse verifyUser(VerificationRequest verificationRequest);

    User updatePhoneNumber(UserPrincipal userPrincipal, UpdatePhoneRequest updatePhoneRequest);
}
