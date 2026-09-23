package com.project.fitness.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private Integer age;
    private Double height;
    private Double weight;
    private Double bmi;
    private String bmiCategory;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
