package com.streaming.backend.features.admin.mapper;

import com.streaming.backend.domain.AuditLog;
import com.streaming.backend.domain.LoginLog;
import com.streaming.backend.domain.User;
import com.streaming.backend.features.admin.dto.AuditLogResponse;
import com.streaming.backend.features.admin.dto.LoginLogResponse;
import org.springframework.stereotype.Component;

@Component
public class AdminLogMapper {

    public AuditLogResponse toAuditLogResponse(AuditLog auditLog) {
        User user = auditLog.getUser();

        return AuditLogResponse.builder()
                .logId(auditLog.getLogId())
                .userId(user == null ? null : user.getUserId())
                .username(user == null ? null : user.getUsername())
                .action(auditLog.getAction())
                .entityName(auditLog.getEntityName())
                .entityId(auditLog.getEntityId())
                .oldValue(auditLog.getOldValue())
                .newValue(auditLog.getNewValue())
                .ipAddress(auditLog.getIpAddress())
                .userAgent(auditLog.getUserAgent())
                .createdAt(auditLog.getCreatedAt())
                .build();
    }

    public LoginLogResponse toLoginLogResponse(LoginLog loginLog) {
        User user = loginLog.getUser();

        return LoginLogResponse.builder()
                .loginId(loginLog.getLoginId())
                .userId(user == null ? null : user.getUserId())
                .username(user == null ? null : user.getUsername())
                .emailAttempt(loginLog.getEmailAttempt())
                .success(loginLog.getSuccess())
                .ipAddress(loginLog.getIpAddress())
                .attemptedAt(loginLog.getAttemptedAt())
                .build();
    }
}
