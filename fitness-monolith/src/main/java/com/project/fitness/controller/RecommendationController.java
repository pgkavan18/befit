package com.project.fitness.controller;

import com.project.fitness.dto.RecommendationRequest;
import com.project.fitness.dto.RecommendationResponse;
import com.project.fitness.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendation")
@RequiredArgsConstructor
public class RecommendationController {
    private final RecommendationService recommendationService;

    @PostMapping("/generate")
    public ResponseEntity<RecommendationResponse> generateRecommendation(
            @RequestBody RecommendationRequest request, Authentication authentication
    ) {
        String authenticatedUserId = authentication.getName();
        request.setUserId(authenticatedUserId);
        RecommendationResponse recommendation = recommendationService.generateRecommendation(request);
        return ResponseEntity.ok(recommendation);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RecommendationResponse>> getRecommendationsByUser(
            @PathVariable("userId") String userId, Authentication authentication) {
        String authenticatedUserId = authentication.getName();
        if (!authenticatedUserId.equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<RecommendationResponse> recommendationList = recommendationService.getRecommendationsByUser(userId);
        return ResponseEntity.ok(recommendationList);
    }

    @GetMapping("/activity/{activityId}")
    public ResponseEntity<List<RecommendationResponse>> getActivityRecommendations(
            @PathVariable("activityId") String activityId, Authentication authentication) {
        String authenticatedUserId = authentication.getName();
        List<RecommendationResponse> recommendationList = recommendationService.getActivityRecommendations(activityId, authenticatedUserId);
        return ResponseEntity.ok(recommendationList);
    }
}

