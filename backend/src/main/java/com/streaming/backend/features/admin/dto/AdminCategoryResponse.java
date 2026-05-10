package com.streaming.backend.features.admin.dto;

import com.streaming.backend.domain.enums.CategoryStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class AdminCategoryResponse {

    private Integer categoryId;
    private String categoryName;
    private String description;
    private CategoryStatus status;
    private Integer videoCount;
    private List<String> recentVideos;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
