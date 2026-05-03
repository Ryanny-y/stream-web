package com.streaming.backend.service;

import com.streaming.backend.dto.response.PublicCategoryResponse;
import com.streaming.backend.dto.response.PublicVideoResponse;

import java.util.List;

public interface PublicCategoryService {

    List<PublicCategoryResponse> getCategories();

    List<PublicVideoResponse> getCategoryVideos(Integer categoryId);
}
