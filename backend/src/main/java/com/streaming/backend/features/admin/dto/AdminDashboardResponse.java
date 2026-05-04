package com.streaming.backend.features.admin.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class AdminDashboardResponse {

    private Long totalUsers;
    private Long totalVideos;
    private Long totalCategories;
    private Long totalViews;
    private List<AuditLogResponse> recentActivity;
}
