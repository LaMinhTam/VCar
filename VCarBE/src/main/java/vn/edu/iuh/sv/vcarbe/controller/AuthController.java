package vn.edu.iuh.sv.vcarbe.controller;

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
import vn.edu.iuh.sv.vcarbe.dto.ApiResponse;
import vn.edu.iuh.sv.vcarbe.dto.LoginRequest;
import vn.edu.iuh.sv.vcarbe.dto.SignUpRequest;
import vn.edu.iuh.sv.vcarbe.dto.TokenRefreshRequest;
import vn.edu.iuh.sv.vcarbe.entity.AuthProvider;
import vn.edu.iuh.sv.vcarbe.entity.User;
import vn.edu.iuh.sv.vcarbe.exception.BadRequestException;
import vn.edu.iuh.sv.vcarbe.repository.UserRepository;
import vn.edu.iuh.sv.vcarbe.security.CustomUserDetailsService;
import vn.edu.iuh.sv.vcarbe.security.TokenProvider;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;

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

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User result = userRepository.save(user);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/user/me")
                .buildAndExpand(result.getId()).toUri();

        return ResponseEntity.created(location)
                .body(new ApiResponse(true, "User registered successfully", result));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(userPrincipal.getEmail());
        String accessToken = tokenProvider.accessToken((UserPrincipal) userDetails);
        String refreshToken = tokenProvider.refreshToken((UserPrincipal) userDetails);
        return ResponseEntity.ok(new TokenRefreshResponse(accessToken, refreshToken));
    }
}
