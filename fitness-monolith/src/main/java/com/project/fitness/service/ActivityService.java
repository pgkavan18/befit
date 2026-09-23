package com.project.fitness.service;

import com.project.fitness.dto.ActivityRequest;
import com.project.fitness.dto.ActivityResponse;
import com.project.fitness.model.Activity;
import com.project.fitness.model.User;
import com.project.fitness.repository.ActivityRepository;
import com.project.fitness.repository.UserRepository;
import com.project.fitness.util.CalorieCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityService {
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    public ActivityResponse trackActivity(ActivityRequest activityRequest) {
        User user = userRepository.findById(activityRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("Invalid user id "  + activityRequest.getUserId()));

        Integer calories = activityRequest.getCaloriesBurned();
        if (calories == null || calories <= 0) {
            calories = CalorieCalculator.calculateCalories(
                    activityRequest.getType(),
                    activityRequest.getDuration(),
                    activityRequest.getAdditional_metrics(),
                    user.getWeight()
            );
        }

        Activity activity = Activity.builder()
                .user(user)
                .type(activityRequest.getType())
                .duration(activityRequest.getDuration())
                .caloriesBurned(calories)
                .startTime(activityRequest.getStartTime())
                .additional_metrics(activityRequest.getAdditional_metrics())
                .build();
        Activity savedActivity = activityRepository.save(activity);
        return mapToResponse(savedActivity);
    }

    private ActivityResponse mapToResponse(Activity savedActivity) {
        ActivityResponse activityResponse = new ActivityResponse();
        activityResponse.setId(savedActivity.getId());
        activityResponse.setUserId(savedActivity.getUser().getId());
        activityResponse.setType(savedActivity.getType());
        activityResponse.setDuration(savedActivity.getDuration());
        activityResponse.setCaloriesBurned(savedActivity.getCaloriesBurned());
        activityResponse.setStartTime(savedActivity.getStartTime());
        activityResponse.setAdditional_metrics(savedActivity.getAdditional_metrics());
        activityResponse.setCreatedAt(savedActivity.getCreatedAt());
        activityResponse.setUpdatedAt(savedActivity.getUpdatedAt());
        return activityResponse;
    }

    public List<ActivityResponse> getUserActivity(String userId) {
        List<Activity> activityList = activityRepository.findByUserId(userId);

        return activityList.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}
