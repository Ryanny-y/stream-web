package com.streaming.backend.features.admin.dto;

import com.streaming.backend.domain.enums.UserStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Getter
@Builder
public class AdminUserResponse {

    private UUID userId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String profileImage;
    private UserStatus status;
    private Boolean emailVerified;
    private Integer failedAttempts;
    private LocalDateTime lockedUntil;
    private Set<String> roles;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
