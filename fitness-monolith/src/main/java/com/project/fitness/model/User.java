package com.project.fitness.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true)
    private String email;
    private String password;
    private String firstname;
    private String lastname;

    private Integer age;
    private Double height; // Height in cm
    private Double weight; // Weight in kg

    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.USER;

    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Activity> activities = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Recommendation> recommendations = new ArrayList<>();

    public Double getBmi() {
        if (height != null && weight != null && height > 0) {
            double heightM = height / 100.0;
            double rawBmi = weight / (heightM * heightM);
            return Math.round(rawBmi * 10.0) / 10.0;
        }
        return null;
    }

    public String getBmiCategory() {
        Double bmiVal = getBmi();
        if (bmiVal == null) return null;
        if (bmiVal < 18.5) return "Underweight";
        if (bmiVal < 25.0) return "Normal weight";
        if (bmiVal < 30.0) return "Overweight";
        return "Obese";
    }

}
