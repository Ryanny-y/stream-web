package com.streaming.backend.features.admin.service.impl;

import com.streaming.backend.domain.enums.UserStatus;
import com.streaming.backend.features.admin.dto.AdminDashboardResponse;
import com.streaming.backend.features.admin.dto.DashboardCategoryStatsResponse;
import com.streaming.backend.features.admin.dto.DashboardUserGrowthResponse;
import com.streaming.backend.features.admin.mapper.AdminLogMapper;
import com.streaming.backend.features.admin.mapper.AdminVideoMapper;
import com.streaming.backend.features.admin.repository.AdminAuditLogRepository;
import com.streaming.backend.features.admin.repository.AdminCategoryRepository;
import com.streaming.backend.features.admin.repository.AdminUserRepository;
import com.streaming.backend.features.admin.repository.AdminVideoRepository;
import com.streaming.backend.features.admin.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private static final int RECENT_ACTIVITY_LIMIT = 10;
    private static final int USER_GROWTH_MONTHS = 6;
    private static final int MOST_WATCHED_CATEGORY_LIMIT = 5;
    private static final int RECENT_VIDEO_LIMIT = 5;

    private final AdminUserRepository adminUserRepository;
    private final AdminVideoRepository adminVideoRepository;
    private final AdminCategoryRepository adminCategoryRepository;
    private final AdminAuditLogRepository adminAuditLogRepository;
    private final AdminLogMapper adminLogMapper;
    private final AdminVideoMapper adminVideoMapper;

    @Override
    public AdminDashboardResponse getDashboard() {
        return AdminDashboardResponse.builder()
                .totalUsers(adminUserRepository.count())
                .totalActiveUsers(adminUserRepository.countByStatus(UserStatus.ACTIVE))
                .totalVideos(adminVideoRepository.count())
                .totalCategories(adminCategoryRepository.count())
                .totalViews(adminVideoRepository.sumTotalViews())
                .userGrowth(getUserGrowth())
                .mostWatchedCategories(adminCategoryRepository.findMostWatchedCategories(
                                PageRequest.of(0, MOST_WATCHED_CATEGORY_LIMIT)
                        )
                        .stream()
                        .map(category -> DashboardCategoryStatsResponse.builder()
                                .categoryId(category.getCategoryId())
                                .categoryName(category.getCategoryName())
                                .totalViews(category.getTotalViews())
                                .build())
                        .toList())
                .recentVideos(adminVideoRepository.findByOrderByCreatedAtDesc(
                                PageRequest.of(0, RECENT_VIDEO_LIMIT)
                        )
                        .stream()
                        .map(adminVideoMapper::toAdminVideoResponse)
                        .toList())
                .recentActivity(adminAuditLogRepository.findByOrderByCreatedAtDesc(
                                PageRequest.of(0, RECENT_ACTIVITY_LIMIT)
                        )
                        .stream()
                        .map(adminLogMapper::toAuditLogResponse)
                        .toList())
                .build();
    }

    private List<DashboardUserGrowthResponse> getUserGrowth() {
        YearMonth currentMonth = YearMonth.from(LocalDate.now());
        YearMonth firstMonth = currentMonth.minusMonths(USER_GROWTH_MONTHS - 1L);

        return IntStream.range(0, USER_GROWTH_MONTHS)
                .mapToObj(firstMonth::plusMonths)
                .map(month -> DashboardUserGrowthResponse.builder()
                        .month(month.toString())
                        .totalUsers(adminUserRepository.countByCreatedAtGreaterThanEqualAndCreatedAtLessThan(
                                month.atDay(1).atStartOfDay(),
                                month.plusMonths(1).atDay(1).atStartOfDay()
                        ))
                        .build())
                .toList();
    }
}
