package vn.edu.iuh.sv.vcarbe.service.impl;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.edu.iuh.sv.vcarbe.controller.TokenResponse;
import vn.edu.iuh.sv.vcarbe.dto.*;
import vn.edu.iuh.sv.vcarbe.entity.AuthProvider;
import vn.edu.iuh.sv.vcarbe.entity.User;
import vn.edu.iuh.sv.vcarbe.exception.BadRequestException;
import vn.edu.iuh.sv.vcarbe.exception.InternalServerErrorException;
import vn.edu.iuh.sv.vcarbe.exception.AppException;
import vn.edu.iuh.sv.vcarbe.repository.UserRepository;
import vn.edu.iuh.sv.vcarbe.security.TokenProvider;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.Authservice;
import vn.edu.iuh.sv.vcarbe.util.MailSenderHelper;

import java.io.UnsupportedEncodingException;
import java.time.Duration;

@Service
public class AuthServiceImpl implements Authservice {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private TokenProvider tokenProvider;
    @Autowired
    private MailSenderHelper mailSenderHelper;
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public SignInResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String accessToken = tokenProvider.accessToken(userPrincipal);
        String refreshToken = tokenProvider.refreshToken(userPrincipal);
        return new SignInResponse(
                userPrincipal.getId().toHexString(),
                userPrincipal.getDisplayName(),
                userPrincipal.getUsername(),
                userPrincipal.getImageUrl(),
                userPrincipal.getPhoneNumber(),
                accessToken,
                refreshToken);
    }

    public User registerUser(SignUpRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new BadRequestException("Email address already in use.");
        }

        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setImageUrl("https://source.unsplash.com/random");
        user.setDisplayName(signUpRequest.getName());
        user.setPassword(signUpRequest.getPassword());
        user.setProvider(AuthProvider.local);
        String verificationCode = generateVerificationCode();
        user.setVerificationCode(verificationCode);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User result = userRepository.save(user);
        try {
            mailSenderHelper.sendVerificationEmail(user.getEmail(), verificationCode);
        } catch (MessagingException | UnsupportedEncodingException e) {
            e.printStackTrace();
            throw new InternalServerErrorException("Failed to send verification email");
        }

        return result;
    }

    @Override
    public TokenResponse refreshToken(UserPrincipal userPrincipal, String oldRefreshToken) {
        if (redisTemplate.opsForValue().get(oldRefreshToken) != null) {
            throw new AppException(400, "Refresh token already used");
        }
        redisTemplate.opsForValue().set(oldRefreshToken, true, Duration.ofMinutes(tokenProvider.getRefreshTokenExpiryMinutes()));

        String accessToken = tokenProvider.accessToken(userPrincipal);
        String refreshToken = tokenProvider.refreshToken(userPrincipal);
        return new TokenResponse(accessToken, refreshToken);
    }

    @Override
    public SignInResponse verifyUser(VerificationRequest verificationRequest) {
        User user = userRepository.findByEmail(verificationRequest.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found with this email"));

        if (!user.getVerificationCode().equals(verificationRequest.getVerificationCode())) {
            throw new AppException(400, "Invalid verification code");
        }
        user.setEmailVerified(true);
        user.setVerificationCode(null);
        userRepository.save(user);
        UserPrincipal userPrincipal = UserPrincipal.create(user);

        return new SignInResponse(
                user.getId().toHexString(),
                user.getDisplayName(),
                user.getEmail(),
                user.getImageUrl(),
                user.getPhoneNumber(),
                tokenProvider.accessToken(userPrincipal),
                tokenProvider.refreshToken(userPrincipal)
        );
    }

    @Override
    public User updatePhoneNumber(UserPrincipal userPrincipal, UpdatePhoneRequest updatePhoneRequest) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new BadRequestException("User not found"));

        user.setPhoneNumber(updatePhoneRequest.phone());
        return userRepository.save(user);
    }

    private String generateVerificationCode() {
        return String.valueOf((int) ((Math.random() * 90000) + 10000));
    }
}
