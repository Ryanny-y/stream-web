package com.streaming.backend.features.admin.mapper;

import com.streaming.backend.domain.Category;
import com.streaming.backend.features.admin.dto.AdminCategoryResponse;
import com.streaming.backend.features.admin.dto.CreateCategoryRequest;
import com.streaming.backend.features.admin.dto.UpdateCategoryRequest;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface AdminCategoryMapper {

    AdminCategoryResponse toAdminCategoryResponse(Category category);

    @Mapping(target = "categoryId", ignore = true)
    @Mapping(target = "videos", ignore = true)
    Category toCategory(CreateCategoryRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "categoryId", ignore = true)
    @Mapping(target = "videos", ignore = true)
    void updateCategoryFromRequest(UpdateCategoryRequest request, @MappingTarget Category category);
}
