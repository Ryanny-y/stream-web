package com.streaming.backend.features.admin.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class AuditLogResponse {

    private UUID logId;
    private UUID userId;
    private String username;
    private String action;
    private String entityName;
    private String entityId;
    private String oldValue;
    private String newValue;
    private String ipAddress;
    private String userAgent;
    private LocalDateTime createdAt;
}
