package com.streaming.backend.service.impl;

import com.streaming.backend.common.exceptions.ApiException;
import com.streaming.backend.domain.enums.VideoStatus;
import com.streaming.backend.domain.enums.Visibility;
import com.streaming.backend.dto.response.PublicCategoryResponse;
import com.streaming.backend.dto.response.PublicVideoResponse;
import com.streaming.backend.mapper.CategoryMapper;
import com.streaming.backend.mapper.VideoMapper;
import com.streaming.backend.repositories.CategoryRepository;
import com.streaming.backend.repositories.VideoRepository;
import com.streaming.backend.service.PublicCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PublicCategoryServiceImpl implements PublicCategoryService {

    private final CategoryRepository categoryRepository;
    private final VideoRepository videoRepository;
    private final CategoryMapper categoryMapper;
    private final VideoMapper videoMapper;

    @Override
    public List<PublicCategoryResponse> getCategories() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toPublicCategoryResponse)
                .toList();
    }

    @Override
    public List<PublicVideoResponse> getCategoryVideos(Integer categoryId) {
        ensureCategoryExists(categoryId);

        return videoRepository.findPublicVideosByCategoryId(
                        categoryId,
                        Visibility.PUBLIC,
                        VideoStatus.ACTIVE
                ).stream()
                .map(videoMapper::toPublicVideoResponse)
                .toList();
    }

    private void ensureCategoryExists(Integer categoryId) {
        categoryRepository.findByCategoryId(categoryId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Category not found"));
    }
}
