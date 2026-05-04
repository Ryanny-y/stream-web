package com.streaming.backend.features.admin.service;

import com.streaming.backend.features.admin.dto.AdminCategoryResponse;
import com.streaming.backend.features.admin.dto.CreateCategoryRequest;
import com.streaming.backend.features.admin.dto.UpdateCategoryRequest;

import java.util.List;

public interface AdminCategoryService {

    List<AdminCategoryResponse> getCategories();

    AdminCategoryResponse createCategory(CreateCategoryRequest request);

    AdminCategoryResponse updateCategory(Integer categoryId, UpdateCategoryRequest request);

    void deleteCategory(Integer categoryId);
}
