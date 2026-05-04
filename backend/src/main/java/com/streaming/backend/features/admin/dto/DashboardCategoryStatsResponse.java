package com.streaming.backend.features.admin.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardCategoryStatsResponse {

    private Integer categoryId;
    private String categoryName;
    private Long totalViews;
}
