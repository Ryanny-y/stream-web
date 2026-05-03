package com.streaming.backend.features.guest.service;

import com.streaming.backend.features.guest.dto.PublicCategoryResponse;
import com.streaming.backend.features.guest.dto.PublicVideoResponse;

import java.util.List;

public interface GuestCategoryService {

    List<PublicCategoryResponse> getCategories();

    List<PublicVideoResponse> getCategoryVideos(Integer categoryId);
}
