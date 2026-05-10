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

import java.util.Comparator;

@Mapper(componentModel = "spring")
public interface AdminCategoryMapper {

    default AdminCategoryResponse toAdminCategoryResponse(Category category) {
        return AdminCategoryResponse.builder()
                .categoryId(category.getCategoryId())
                .categoryName(category.getCategoryName())
                .description(category.getDescription())
                .status(category.getStatus())
                .videoCount(category.getVideos() == null ? 0 : category.getVideos().size())
                .recentVideos(category.getVideos() == null
                        ? java.util.List.of()
                        : category.getVideos().stream()
                                .sorted(Comparator.comparing(video -> video.getCreatedAt(), Comparator.nullsLast(Comparator.reverseOrder())))
                                .limit(5)
                                .map(video -> video.getTitle())
                                .toList())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }

    @Mapping(target = "categoryId", ignore = true)
    @Mapping(target = "videos", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Category toCategory(CreateCategoryRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "categoryId", ignore = true)
    @Mapping(target = "videos", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateCategoryFromRequest(UpdateCategoryRequest request, @MappingTarget Category category);
}
