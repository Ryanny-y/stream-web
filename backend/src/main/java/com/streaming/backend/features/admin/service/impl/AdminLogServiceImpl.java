package com.streaming.backend.features.admin.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.streaming.backend.common.exceptions.ResourceNotFoundException;
import com.streaming.backend.domain.AuditLog;
import com.streaming.backend.domain.LoginLog;
import com.streaming.backend.domain.User;
import com.streaming.backend.features.admin.dto.AuditLogResponse;
import com.streaming.backend.features.admin.dto.LoginLogResponse;
import com.streaming.backend.features.admin.mapper.AdminLogMapper;
import com.streaming.backend.features.admin.repository.AdminAuditLogRepository;
import com.streaming.backend.features.admin.repository.AdminLoginLogRepository;
import com.streaming.backend.features.admin.service.AdminLogService;
import com.streaming.backend.security.UserPrincipal;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminLogServiceImpl implements AdminLogService {

    private final AdminAuditLogRepository adminAuditLogRepository;
    private final AdminLoginLogRepository adminLoginLogRepository;
    private final AdminLogMapper adminLogMapper;
    private final ObjectMapper objectMapper = JsonMapper.builder().findAndAddModules().build();

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogResponse> getAuditLogs() {
        return adminAuditLogRepository.findAll().stream()
                .sorted(Comparator.comparing(AuditLog::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(adminLogMapper::toAuditLogResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AuditLogResponse getAuditLog(UUID logId) {
        return adminLogMapper.toAuditLogResponse(
                adminAuditLogRepository.findByLogId(logId)
                        .orElseThrow(() -> new ResourceNotFoundException("Audit log not found"))
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<LoginLogResponse> getLoginLogs() {
        return adminLoginLogRepository.findAll().stream()
                .sorted(Comparator.comparing(LoginLog::getAttemptedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(adminLogMapper::toLoginLogResponse)
                .toList();
    }

    @Override
    public void createAuditLog(String action, String entityName, String entityId, Object oldValue, Object newValue) {
        HttpServletRequest request = currentRequest();

        AuditLog auditLog = new AuditLog();
        auditLog.setUser(currentUser());
        auditLog.setAction(action);
        auditLog.setEntityName(entityName);
        auditLog.setEntityId(entityId);
        auditLog.setOldValue(toJson(oldValue));
        auditLog.setNewValue(toJson(newValue));
        auditLog.setIpAddress(resolveIpAddress(request));
        auditLog.setUserAgent(request == null ? null : request.getHeader("User-Agent"));
        auditLog.setCreatedAt(LocalDateTime.now());

        adminAuditLogRepository.save(auditLog);
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void createLoginLog(User user, String emailAttempt, boolean success) {
        HttpServletRequest request = currentRequest();

        LoginLog loginLog = new LoginLog();
        loginLog.setUser(user);
        loginLog.setEmailAttempt(emailAttempt);
        loginLog.setSuccess(success);
        loginLog.setIpAddress(resolveIpAddress(request));
        loginLog.setAttemptedAt(LocalDateTime.now());

        adminLoginLogRepository.save(loginLog);
    }

    private User currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal userPrincipal)) {
            return null;
        }

        return userPrincipal.getUser();
    }

    private HttpServletRequest currentRequest() {
        if (!(RequestContextHolder.getRequestAttributes() instanceof ServletRequestAttributes attributes)) {
            return null;
        }

        return attributes.getRequest();
    }

    private String resolveIpAddress(HttpServletRequest request) {
        if (request == null) {
            return null;
        }

        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }

        return request.getRemoteAddr();
    }

    private String toJson(Object value) {
        if (value == null) {
            return null;
        }

        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException ex) {
            return "{\"error\":\"Unable to serialize log value\"}";
        }
    }
}
