package com.project.fitness.dto;

import com.project.fitness.model.ActivityType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActivityRequest {
    private String userId;
    private Map<String,Object> additional_metrics;

    @NotNull(message = "Activity type is required")
    private ActivityType type;

    @NotNull(message = "Duration is required")
    @Positive(message = "Duration must be positive")
    private Integer duration;

    @PositiveOrZero(message = "Calories burned cannot be negative")
    private Integer caloriesBurned;

    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;
}
