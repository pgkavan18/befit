package com.project.fitness.controller;

import com.project.fitness.dto.ActivityRequest;
import com.project.fitness.dto.ActivityResponse;
import com.project.fitness.service.ActivityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/activities")

public class ActivityController {

    private final ActivityService activityService;

    @PostMapping
    public ResponseEntity<ActivityResponse> trackActivity(
            @Valid @RequestBody ActivityRequest activityRequest, Authentication authentication) {
        String userId = authentication.getName();
        activityRequest.setUserId(userId);
        return ResponseEntity.ok(activityService.trackActivity(activityRequest));
    }
    @GetMapping
    public ResponseEntity<List<ActivityResponse>> getUserActivity(Authentication authentication) {
        String userId = authentication.getName();
        return ResponseEntity.ok(activityService.getUserActivity(userId));
    }
}
