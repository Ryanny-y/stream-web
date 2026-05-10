package com.streaming.backend.features.auth.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.Set;
import java.util.UUID;

@Getter
@Builder
public class AuthResponse {

    private UUID userId;
    private String username;
    private String email;
    private String fullName;
    private String profileImage;
    private Set<String> roles;
    private String accessToken;
}
