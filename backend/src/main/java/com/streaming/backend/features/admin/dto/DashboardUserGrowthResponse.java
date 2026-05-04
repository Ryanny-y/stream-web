package com.streaming.backend.features.admin.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardUserGrowthResponse {

    private String month;
    private Long totalUsers;
}
