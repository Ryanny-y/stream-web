package com.streaming.backend.features.admin.dto;

import com.streaming.backend.domain.enums.CategoryStatus;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCategoryRequest {

    @Size(max = 100)
    private String categoryName;

    private String description;

    private CategoryStatus status;
}
