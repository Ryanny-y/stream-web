package com.streaming.backend.mapper;

import com.streaming.backend.domain.entities.Category;
import com.streaming.backend.domain.entities.User;
import com.streaming.backend.domain.entities.Video;
import com.streaming.backend.dto.response.PublicVideoResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Comparator;
import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface VideoMapper {

    @Mapping(target = "featured", source = "isFeatured")
    @Mapping(target = "trending", source = "isTrending")
    @Mapping(target = "uploadedBy", source = "uploadedBy")
    @Mapping(target = "categories", source = "categories")
    PublicVideoResponse toPublicVideoResponse(Video video);

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
