package com.streaming.backend.features.guest.mapper;

import com.streaming.backend.domain.Category;
import com.streaming.backend.features.guest.dto.PublicCategoryResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface GuestCategoryMapper {

    PublicCategoryResponse toPublicCategoryResponse(Category category);
}
