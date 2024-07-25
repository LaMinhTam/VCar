package vn.edu.iuh.sv.vcarbe.controller;

import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import vn.edu.iuh.sv.vcarbe.dto.*;
import vn.edu.iuh.sv.vcarbe.entity.AuthProvider;
import vn.edu.iuh.sv.vcarbe.entity.User;
import vn.edu.iuh.sv.vcarbe.exception.BadRequestException;
import vn.edu.iuh.sv.vcarbe.exception.InternalServerErrorException;
import vn.edu.iuh.sv.vcarbe.repository.UserRepository;
import vn.edu.iuh.sv.vcarbe.security.CustomUserDetailsService;
import vn.edu.iuh.sv.vcarbe.security.TokenProvider;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.util.MailSenderHelper;

import java.io.UnsupportedEncodingException;
import java.net.URI;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private TokenProvider tokenProvider;
    @Autowired
    private CustomUserDetailsService userDetailsService;
    @Autowired
    private MailSenderHelper mailSenderHelper;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = tokenProvider.createToken(authentication);
        String refreshToken = tokenProvider.refreshToken((UserPrincipal) authentication.getPrincipal());
        return ResponseEntity.ok(new TokenRefreshResponse(accessToken, refreshToken));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new BadRequestException("Email address already in use.");
        }

        // Creating user's account
        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setImageUrl("https://source.unsplash.com/random");
        user.setDisplayName(signUpRequest.getName());
        user.setPhoneNumber(signUpRequest.getPhoneNumber());
        user.setPassword(signUpRequest.getPassword());
        user.setProvider(AuthProvider.local);
        String verificationCode = generateVerificationCode();
        user.setVerificationCode(verificationCode);

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User result = userRepository.save(user);
        try {
            mailSenderHelper.sendVerificationEmail(user.getEmail(), verificationCode);
        } catch (MessagingException | UnsupportedEncodingException e) {
            // Handle the exception
            e.printStackTrace();
            throw new InternalServerErrorException("Failed to send verification email");
        }


        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/user/me")
                .buildAndExpand(result.getId()).toUri();

        return ResponseEntity.created(location)
                .body(new ApiResponse(true, "User registered successfully", result));
    }

    private String generateVerificationCode() {
        return String.valueOf((int) ((Math.random() * 900000) + 100000));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(userPrincipal.getEmail());
        String accessToken = tokenProvider.accessToken((UserPrincipal) userDetails);
        String refreshToken = tokenProvider.refreshToken((UserPrincipal) userDetails);
        return ResponseEntity.ok(new TokenRefreshResponse(accessToken, refreshToken));
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@Valid @RequestBody VerificationRequest verificationRequest) {
        User user = userRepository.findByEmail(verificationRequest.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found with this email"));

        if (user.getVerificationCode().equals(verificationRequest.getVerificationCode())) {
            user.setEmailVerified(true);
            user.setVerificationCode(null);
            userRepository.save(user);
            return ResponseEntity.ok(new ApiResponse(true, "User verified successfully", null));
        } else {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Invalid verification code", null));
        }
    }

}
