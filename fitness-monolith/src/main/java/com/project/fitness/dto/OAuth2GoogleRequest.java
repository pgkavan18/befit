package com.project.fitness.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OAuth2GoogleRequest {
    @NotBlank(message = "Google ID token credential is required")
    private String credential;
}
