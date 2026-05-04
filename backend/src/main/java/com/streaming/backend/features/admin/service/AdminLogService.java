package com.streaming.backend.features.admin.service;

import com.streaming.backend.domain.User;
import com.streaming.backend.features.admin.dto.AuditLogResponse;
import com.streaming.backend.features.admin.dto.LoginLogResponse;

import java.util.List;
import java.util.UUID;

public interface AdminLogService {

    List<AuditLogResponse> getAuditLogs();

    AuditLogResponse getAuditLog(UUID logId);

    List<LoginLogResponse> getLoginLogs();

    void createAuditLog(String action, String entityName, String entityId, Object oldValue, Object newValue);

    void createLoginLog(User user, String emailAttempt, boolean success);
}
