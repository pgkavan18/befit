package com.project.fitness.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileUpdateRequest {
    @Size(max = 50, message = "First name must not exceed 50 characters")
    private String firstName;

    @Size(max = 50, message = "Last name must not exceed 50 characters")
    private String lastName;

    @Min(value = 1, message = "Age must be at least 1")
    @Max(value = 130, message = "Age must be at most 130")
    private Integer age;

    @DecimalMin(value = "30.0", message = "Height must be at least 30 cm")
    @DecimalMax(value = "300.0", message = "Height must be at most 300 cm")
    private Double height;

    @DecimalMin(value = "10.0", message = "Weight must be at least 10 kg")
    @DecimalMax(value = "500.0", message = "Weight must be at most 500 kg")
    private Double weight;
}
