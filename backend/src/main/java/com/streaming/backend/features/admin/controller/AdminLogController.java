package com.streaming.backend.features.admin.controller;

import com.streaming.backend.features.admin.dto.AuditLogResponse;
import com.streaming.backend.features.admin.dto.LoginLogResponse;
import com.streaming.backend.features.admin.service.AdminLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/logs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminLogController {

    private final AdminLogService adminLogService;

    @GetMapping("/audit")
    public ResponseEntity<List<AuditLogResponse>> getAuditLogs() {
        return ResponseEntity.ok(adminLogService.getAuditLogs());
    }

    @GetMapping("/audit/{logId}")
    public ResponseEntity<AuditLogResponse> getAuditLog(
            @PathVariable UUID logId
    ) {
        return ResponseEntity.ok(adminLogService.getAuditLog(logId));
    }

    @GetMapping("/login")
    public ResponseEntity<List<LoginLogResponse>> getLoginLogs() {
        return ResponseEntity.ok(adminLogService.getLoginLogs());
    }
}
