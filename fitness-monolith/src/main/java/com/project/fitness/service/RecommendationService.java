package com.project.fitness.service;

import com.project.fitness.dto.RecommendationRequest;
import com.project.fitness.dto.RecommendationResponse;
import com.project.fitness.model.Activity;
import com.project.fitness.model.Recommendation;
import com.project.fitness.model.User;
import com.project.fitness.repository.ActivityRepository;
import com.project.fitness.repository.RecommendationRepository;
import com.project.fitness.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {
    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;
    private final RecommendationRepository recommendationRepository;

    public RecommendationResponse generateRecommendation(RecommendationRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found " + request.getUserId()));

        Activity activity = activityRepository.findById(request.getActivityId())
                .orElseThrow(() -> new RuntimeException("Activity not found " + request.getActivityId()));

        Recommendation recommendation = Recommendation.builder()
                .user(user)
                .activity(activity)
                .improvements(request.getImprovements())
                .safety(request.getSafety())
                .suggestions(request.getSuggestions())
                .build();

        Recommendation saved = recommendationRepository.save(recommendation);
        return mapToResponse(saved);
    }

    public List<RecommendationResponse> getRecommendationsByUser(String userId) {
        return recommendationRepository.findByUserId(userId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<RecommendationResponse> getActivityRecommendations(String activityId, String authenticatedUserId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found " + activityId));
        if (!activity.getUser().getId().equals(authenticatedUserId)) {
            throw new RuntimeException("Access denied: activity does not belong to the authenticated user");
        }
        return recommendationRepository.findByActivityId(activityId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private RecommendationResponse mapToResponse(Recommendation recommendation) {
        RecommendationResponse response = new RecommendationResponse();
        response.setId(recommendation.getId());
        response.setUserId(recommendation.getUser().getId());
        response.setActivityId(recommendation.getActivity().getId());
        response.setType(recommendation.getType());
        response.setRecommendation(recommendation.getRecommendation());
        response.setImprovements(recommendation.getImprovements());
        response.setSuggestions(recommendation.getSuggestions());
        response.setSafety(recommendation.getSafety());
        response.setCreatedAt(recommendation.getCreatedAt());
        response.setUpdatedAt(recommendation.getUpdatedAt());
        return response;
    }
}

