package vn.edu.iuh.sv.vcarbe.service.impl;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.dto.*;
import vn.edu.iuh.sv.vcarbe.entity.AuthProvider;
import vn.edu.iuh.sv.vcarbe.entity.User;
import vn.edu.iuh.sv.vcarbe.exception.AppException;
import vn.edu.iuh.sv.vcarbe.exception.BadRequestException;
import vn.edu.iuh.sv.vcarbe.exception.InternalServerErrorException;
import vn.edu.iuh.sv.vcarbe.repository.UserRepository;
import vn.edu.iuh.sv.vcarbe.security.CustomReactiveUserDetailsService;
import vn.edu.iuh.sv.vcarbe.security.TokenProvider;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.Authservice;
import vn.edu.iuh.sv.vcarbe.util.MailSenderHelper;

import java.io.UnsupportedEncodingException;
import java.time.Duration;

@Service
public class AuthServiceImpl implements Authservice {
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
    @Autowired
    private CustomReactiveUserDetailsService userDetailsService;

    @Override
    public Mono<SignInResponse> authenticateUser(LoginRequest loginRequest) {
        return userDetailsService.findByUsername(loginRequest.getEmail())
                .flatMap(userDetails -> {
                    if (passwordEncoder.matches(loginRequest.getPassword(), userDetails.getPassword())) {
                        UserPrincipal userPrincipal = (UserPrincipal) userDetails;
                        String accessToken = tokenProvider.accessToken(userPrincipal);
                        String refreshToken = tokenProvider.refreshToken(userPrincipal);
                        return Mono.just(new SignInResponse(
                                userPrincipal.getId().toHexString(),
                                userPrincipal.getDisplayName(),
                                userPrincipal.getUsername(),
                                userPrincipal.getImageUrl(),
                                userPrincipal.getPhoneNumber(),
                                accessToken,
                                refreshToken
                        ));
                    } else {
                        return Mono.error(new RuntimeException("Invalid email or password"));
                    }
                })
                .switchIfEmpty(Mono.error(new RuntimeException("User not found")));
    }

    public Mono<User> registerUser(SignUpRequest signUpRequest) {
        return userRepository.existsByEmail(signUpRequest.getEmail())
                .flatMap(exists -> {
                    if (Boolean.TRUE.equals(exists)) {
                        return Mono.error(new BadRequestException("Email address already in use."));
                    }

                    User user = new User();
                    user.setEmail(signUpRequest.getEmail());
                    user.setImageUrl("https://source.unsplash.com/random");
                    user.setDisplayName(signUpRequest.getName());
                    user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
                    user.setProvider(AuthProvider.local);
                    String verificationCode = generateVerificationCode();
                    user.setVerificationCode(verificationCode);

                    return userRepository.save(user)
                            .doOnSuccess(savedUser -> {
                                try {
                                    mailSenderHelper.sendVerificationEmail(savedUser.getEmail(), verificationCode);
                                } catch (MessagingException | UnsupportedEncodingException e) {
                                    throw new InternalServerErrorException("Failed to send verification email");
                                }
                            });
                });
    }


    @Override
    public Mono<TokenResponse> refreshToken(UserPrincipal userPrincipal, String oldRefreshToken) {
        if (redisTemplate.opsForValue().get(oldRefreshToken) != null) {
            return Mono.error(new AppException(400, "Refresh token already used"));
        }
        redisTemplate.opsForValue().set(oldRefreshToken, true, Duration.ofMinutes(tokenProvider.getRefreshTokenExpiryMinutes()));

        String accessToken = tokenProvider.accessToken(userPrincipal);
        String refreshToken = tokenProvider.refreshToken(userPrincipal);
        return Mono.just(new TokenResponse(accessToken, refreshToken));
    }

    @Override
    public Mono<SignInResponse> verifyUser(VerificationRequest verificationRequest) {
        return userRepository.findByEmail(verificationRequest.getEmail())
                .flatMap(user -> {
                    if (Boolean.TRUE.equals(user.getEmailVerified())) {
                        return Mono.error(new AppException(400, "Email already verified"));
                    }
                    if (!user.getVerificationCode().equals(verificationRequest.getVerificationCode())) {
                        return Mono.error(new AppException(400, "Invalid verification code"));
                    }
                    user.setEmailVerified(true);
                    user.setVerificationCode(null);
                    return userRepository.save(user)
                            .map(savedUser -> {
                                UserPrincipal userPrincipal = UserPrincipal.create(savedUser);
                                return new SignInResponse(
                                        savedUser.getId().toHexString(),
                                        savedUser.getDisplayName(),
                                        savedUser.getEmail(),
                                        savedUser.getImageUrl(),
                                        savedUser.getPhoneNumber(),
                                        tokenProvider.accessToken(userPrincipal),
                                        tokenProvider.refreshToken(userPrincipal)
                                );
                            });
                })
                .switchIfEmpty(Mono.error(new AppException(400, "User not found")));
    }


    public Mono<User> updatePhoneNumber(UserPrincipal userPrincipal, UpdatePhoneRequest updatePhoneRequest) {
        return userRepository.findById(userPrincipal.getId())
                .flatMap(user -> {
                    user.setPhoneNumber(updatePhoneRequest.phone());
                    return userRepository.save(user);
                })
                .switchIfEmpty(Mono.error(new AppException(404, "User not found")));
    }

    private String generateVerificationCode() {
        return String.valueOf((int) ((Math.random() * 90000) + 10000));
    }
}
