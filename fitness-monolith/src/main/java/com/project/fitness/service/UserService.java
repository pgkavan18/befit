package com.project.fitness.service;

import com.project.fitness.dto.LoginRequest;
import com.project.fitness.dto.RegisterRequest;
import com.project.fitness.dto.UserProfileUpdateRequest;
import com.project.fitness.dto.UserResponse;
import com.project.fitness.model.User;
import com.project.fitness.model.UserRole;
import com.project.fitness.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()) != null) {
            throw new IllegalArgumentException("An account with this email already exists");
        }
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstname(request.getFirstName())
                .lastname(request.getLastName())
                .age(request.getAge())
                .height(request.getHeight())
                .weight(request.getWeight())
                .role(UserRole.USER)
                .build();
        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    public UserResponse mapToResponse(User savedUser) {
        UserResponse userResponse = new UserResponse();
        userResponse.setId(savedUser.getId());
        userResponse.setEmail(savedUser.getEmail());
        userResponse.setFirstName(savedUser.getFirstname());
        userResponse.setLastName(savedUser.getLastname());
        userResponse.setAge(savedUser.getAge());
        userResponse.setHeight(savedUser.getHeight());
        userResponse.setWeight(savedUser.getWeight());
        userResponse.setBmi(savedUser.getBmi());
        userResponse.setBmiCategory(savedUser.getBmiCategory());
        userResponse.setCreatedAt(savedUser.getCreatedAt());
        userResponse.setUpdatedAt(savedUser.getUpdatedAt());
        return userResponse;
    }

    public UserResponse getProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return mapToResponse(user);
    }

    public UserResponse updateProfile(String userId, UserProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (request.getFirstName() != null && !request.getFirstName().isBlank()) {
            user.setFirstname(request.getFirstName().trim());
        }
        if (request.getLastName() != null) {
            user.setLastname(request.getLastName().trim());
        }
        if (request.getAge() != null) {
            user.setAge(request.getAge());
        }
        if (request.getHeight() != null) {
            user.setHeight(request.getHeight());
        }
        if (request.getWeight() != null) {
            user.setWeight(request.getWeight());
        }

        User updatedUser = userRepository.save(user);
        return mapToResponse(updatedUser);
    }

    public User authenticate(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail());
        if (user == null)
            throw new RuntimeException("Invalid email or password");
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid email or password");
        return user;
    }

    public User loginOrRegisterGoogleUser(String credential) {
        try {
            String email = null;
            String firstName = "Google";
            String lastName = "User";

            // Attempt online verification with Google's tokeninfo endpoint first
            try {
                java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
                java.net.http.HttpRequest httpRequest = java.net.http.HttpRequest.newBuilder()
                        .uri(java.net.URI.create("https://oauth2.googleapis.com/tokeninfo?id_token=" + credential))
                        .GET()
                        .build();
                java.net.http.HttpResponse<String> response = client.send(httpRequest, java.net.http.HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() == 200) {
                    com.fasterxml.jackson.databind.JsonNode jsonNode = new com.fasterxml.jackson.databind.ObjectMapper().readTree(response.body());
                    if (jsonNode.has("email")) {
                        email = jsonNode.get("email").asText();
                    }
                    if (jsonNode.has("given_name")) {
                        firstName = jsonNode.get("given_name").asText();
                    }
                    if (jsonNode.has("family_name")) {
                        lastName = jsonNode.get("family_name").asText();
                    }
                }
            } catch (Exception e) {
                // If offline or network issue, fallback to JWT payload
            }

            // Fallback: parse JWT payload directly if online tokeninfo was not reached
            if (email == null) {
                String[] parts = credential.split("\\.");
                if (parts.length >= 2) {
                    byte[] decoded = java.util.Base64.getUrlDecoder().decode(parts[1]);
                    String payloadJson = new String(decoded, java.nio.charset.StandardCharsets.UTF_8);
                    com.fasterxml.jackson.databind.JsonNode jsonNode = new com.fasterxml.jackson.databind.ObjectMapper().readTree(payloadJson);
                    if (jsonNode.has("email")) {
                        email = jsonNode.get("email").asText();
                    }
                    if (jsonNode.has("given_name")) {
                        firstName = jsonNode.get("given_name").asText();
                    }
                    if (jsonNode.has("family_name")) {
                        lastName = jsonNode.get("family_name").asText();
                    }
                }
            }

            if (email == null || email.isBlank()) {
                throw new IllegalArgumentException("Invalid Google ID token: email claim missing");
            }

            User user = userRepository.findByEmail(email);
            if (user == null) {
                user = User.builder()
                        .email(email)
                        .password(passwordEncoder.encode(java.util.UUID.randomUUID().toString()))
                        .firstname(firstName)
                        .lastname(lastName)
                        .role(UserRole.USER)
                        .build();
                user = userRepository.save(user);
            }
            return user;
        } catch (Exception e) {
            throw new RuntimeException("Google authentication failed: " + e.getMessage(), e);
        }
    }
}

