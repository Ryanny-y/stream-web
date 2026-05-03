package com.streaming.backend.features.auth.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.Set;
import java.util.UUID;

@Getter
@Builder
public class CurrentUserResponse {

    private UUID userId;
    private String username;
    private String email;
    private String fullName;
    private Set<String> roles;
}
