package com.streaming.backend.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PublicCategoryResponse {

    private Integer categoryId;
    private String categoryName;
    private String description;
}
