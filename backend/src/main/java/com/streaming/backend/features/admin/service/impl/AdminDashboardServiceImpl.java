package com.streaming.backend.features.admin.service.impl;

import com.streaming.backend.features.admin.dto.AdminDashboardResponse;
import com.streaming.backend.features.admin.mapper.AdminLogMapper;
import com.streaming.backend.features.admin.repository.AdminAuditLogRepository;
import com.streaming.backend.features.admin.repository.AdminCategoryRepository;
import com.streaming.backend.features.admin.repository.AdminUserRepository;
import com.streaming.backend.features.admin.repository.AdminVideoRepository;
import com.streaming.backend.features.admin.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private static final int RECENT_ACTIVITY_LIMIT = 10;

    private final AdminUserRepository adminUserRepository;
    private final AdminVideoRepository adminVideoRepository;
    private final AdminCategoryRepository adminCategoryRepository;
    private final AdminAuditLogRepository adminAuditLogRepository;
    private final AdminLogMapper adminLogMapper;

    @Override
    public AdminDashboardResponse getDashboard() {
        return AdminDashboardResponse.builder()
                .totalUsers(adminUserRepository.count())
                .totalVideos(adminVideoRepository.count())
                .totalCategories(adminCategoryRepository.count())
                .totalViews(adminVideoRepository.sumTotalViews())
                .recentActivity(adminAuditLogRepository.findByOrderByCreatedAtDesc(
                                PageRequest.of(0, RECENT_ACTIVITY_LIMIT)
                        )
                        .stream()
                        .map(adminLogMapper::toAuditLogResponse)
                        .toList())
                .build();
    }
}
