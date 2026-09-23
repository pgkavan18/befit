package com.project.fitness.controller;

import com.project.fitness.dto.UserProfileUpdateRequest;
import com.project.fitness.dto.UserResponse;
import com.project.fitness.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(Authentication authentication) {
        String userId = authentication.getName();
        return ResponseEntity.ok(userService.getProfile(userId));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @Valid @RequestBody UserProfileUpdateRequest request,
            Authentication authentication
    ) {
        String userId = authentication.getName();
        log.info("Updating profile metrics for user: {}", userId);
        return ResponseEntity.ok(userService.updateProfile(userId, request));
    }
}
