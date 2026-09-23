package com.project.fitness.controller;

import com.project.fitness.dto.LoginRequest;
import com.project.fitness.dto.LoginResponse;
import com.project.fitness.dto.RegisterRequest;
import com.project.fitness.dto.UserResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import com.project.fitness.model.User;
import com.project.fitness.security.JwtUtils;
import com.project.fitness.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtUtils jwtUtils;

    @PostMapping("/register")

    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest){
        Authentication authentication;
        try {
            User user = userService.authenticate(loginRequest);
            String token = jwtUtils.generateToken(user.getId(), user.getRole().name());
            return ResponseEntity.ok(new LoginResponse(token, userService.mapToResponse(user)));



        }catch (AuthenticationException e){
            log.error("Login failed for email {}: {}", loginRequest.getEmail(), e.getMessage());
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/oauth2/google")
    public ResponseEntity<LoginResponse> googleLogin(@Valid @RequestBody com.project.fitness.dto.OAuth2GoogleRequest request) {
        try {
            User user = userService.loginOrRegisterGoogleUser(request.getCredential());
            String token = jwtUtils.generateToken(user.getId(), user.getRole().name());
            return ResponseEntity.ok(new LoginResponse(token, userService.mapToResponse(user)));
        } catch (Exception e) {
            log.error("Google login failed: {}", e.getMessage());
            return ResponseEntity.status(401).build();
        }
    }
}
