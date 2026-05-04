package com.streaming.backend.features.admin.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class LoginLogResponse {

    private UUID loginId;
    private UUID userId;
    private String username;
    private String emailAttempt;
    private Boolean success;
    private String ipAddress;
    private LocalDateTime attemptedAt;
}
