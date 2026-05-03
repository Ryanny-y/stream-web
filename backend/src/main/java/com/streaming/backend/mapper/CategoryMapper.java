package com.streaming.backend.mapper;

import com.streaming.backend.domain.entities.Category;
import com.streaming.backend.dto.response.PublicCategoryResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    PublicCategoryResponse toPublicCategoryResponse(Category category);
}
