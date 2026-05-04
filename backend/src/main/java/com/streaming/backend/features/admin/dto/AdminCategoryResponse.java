package com.streaming.backend.features.admin.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminCategoryResponse {

    private Integer categoryId;
    private String categoryName;
    private String description;
}
