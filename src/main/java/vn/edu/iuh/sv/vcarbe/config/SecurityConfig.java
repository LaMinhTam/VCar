package vn.edu.iuh.sv.vcarbe.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.security.JwtReactiveAuthenticationManager;
import vn.edu.iuh.sv.vcarbe.security.SecurityContextRepository;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http, JwtReactiveAuthenticationManager jwtReactiveAuthenticationManager, SecurityContextRepository securityContextRepository) {
        http
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .logout(ServerHttpSecurity.LogoutSpec::disable)
                .exceptionHandling(exceptionHandlingSpec ->
                        exceptionHandlingSpec.authenticationEntryPoint((swe, e) ->
                                Mono.fromRunnable(() -> swe.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED))
                        ).accessDeniedHandler((swe, e) ->
                                Mono.fromRunnable(() -> swe.getResponse().setStatusCode(HttpStatus.FORBIDDEN))
                        ))
                .securityContextRepository(securityContextRepository)
                .authenticationManager(jwtReactiveAuthenticationManager)
                .authorizeExchange(auth -> auth
                        .pathMatchers("/v2/api-docs", "/v3/api-docs", "/swagger-resources/**", "/swagger-ui/**", "/webjars/**", "/swagger-ui.html", "/api-docs/**")
                        .permitAll()
                        .pathMatchers("/actuator/**", "/auth/signup", "/auth/login", "/auth/signin", "/auth/verify", "/oauth2/**", "/socket.io/")
                        .permitAll()
                        .pathMatchers(HttpMethod.GET, "/cars/**", "/reviews/**")
                        .permitAll()
                        .anyExchange()
                        .authenticated());

        return http.build();
    }
}
