package com.streaming.backend.features.guest.service.impl;

import com.streaming.backend.common.exceptions.ApiException;
import com.streaming.backend.domain.enums.VideoStatus;
import com.streaming.backend.domain.enums.Visibility;
import com.streaming.backend.features.guest.dto.PublicCategoryResponse;
import com.streaming.backend.features.guest.dto.PublicVideoResponse;
import com.streaming.backend.features.guest.mapper.GuestCategoryMapper;
import com.streaming.backend.features.guest.mapper.GuestVideoMapper;
import com.streaming.backend.features.guest.repository.GuestCategoryRepository;
import com.streaming.backend.features.guest.repository.GuestVideoRepository;
import com.streaming.backend.features.guest.service.GuestCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GuestCategoryServiceImpl implements GuestCategoryService {

    private final GuestCategoryRepository guestCategoryRepository;
    private final GuestVideoRepository guestVideoRepository;
    private final GuestCategoryMapper guestCategoryMapper;
    private final GuestVideoMapper guestVideoMapper;

    @Override
    public List<PublicCategoryResponse> getCategories() {
        return guestCategoryRepository.findAll().stream()
                .map(guestCategoryMapper::toPublicCategoryResponse)
                .toList();
    }

    @Override
    public List<PublicVideoResponse> getCategoryVideos(Integer categoryId) {
        ensureCategoryExists(categoryId);

        return guestVideoRepository.findPublicVideosByCategoryId(
                        categoryId,
                        Visibility.PUBLIC,
                        VideoStatus.ACTIVE
                ).stream()
                .map(guestVideoMapper::toPublicVideoResponse)
                .toList();
    }

    private void ensureCategoryExists(Integer categoryId) {
        guestCategoryRepository.findByCategoryId(categoryId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Category not found"));
    }
}
