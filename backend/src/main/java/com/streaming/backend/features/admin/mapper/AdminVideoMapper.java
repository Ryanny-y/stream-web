package com.streaming.backend.features.admin.mapper;

import com.streaming.backend.domain.Category;
import com.streaming.backend.domain.User;
import com.streaming.backend.domain.Video;
import com.streaming.backend.features.admin.dto.AdminVideoResponse;
import com.streaming.backend.features.admin.dto.CreateVideoRequest;
import com.streaming.backend.features.admin.dto.UpdateVideoRequest;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.Comparator;
import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface AdminVideoMapper {

    @Mapping(target = "featured", source = "isFeatured")
    @Mapping(target = "trending", source = "isTrending")
    @Mapping(target = "uploadedBy", source = "uploadedBy")
    @Mapping(target = "categories", source = "categories")
    AdminVideoResponse toAdminVideoResponse(Video video);

    @Mapping(target = "videoId", ignore = true)
    @Mapping(target = "filePath", ignore = true)
    @Mapping(target = "thumbnailPath", ignore = true)
    @Mapping(target = "fileSize", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "isFeatured", source = "featured")
    @Mapping(target = "isTrending", source = "trending")
    @Mapping(target = "totalViews", ignore = true)
    @Mapping(target = "uploadedBy", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Video toVideo(CreateVideoRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "videoId", ignore = true)
    @Mapping(target = "filePath", ignore = true)
    @Mapping(target = "thumbnailPath", ignore = true)
    @Mapping(target = "fileSize", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "isFeatured", source = "featured")
    @Mapping(target = "isTrending", source = "trending")
    @Mapping(target = "totalViews", ignore = true)
    @Mapping(target = "uploadedBy", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateVideoFromRequest(UpdateVideoRequest request, @MappingTarget Video video);

    default String map(User uploadedBy) {
        return uploadedBy == null ? null : uploadedBy.getUsername();
    }

    default List<String> map(Set<Category> categories) {
        if (categories == null) {
            return List.of();
        }

        return categories.stream()
                .map(Category::getCategoryName)
                .sorted(Comparator.naturalOrder())
                .toList();
    }
}
