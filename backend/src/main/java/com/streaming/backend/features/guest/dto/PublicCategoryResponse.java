package com.streaming.backend.features.guest.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PublicCategoryResponse {

    private Integer categoryId;
    private String categoryName;
    private String description;
}
