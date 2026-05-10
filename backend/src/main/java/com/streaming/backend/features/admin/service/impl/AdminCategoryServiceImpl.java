package com.streaming.backend.features.admin.service.impl;

import com.streaming.backend.common.exceptions.BadRequestException;
import com.streaming.backend.common.exceptions.ResourceNotFoundException;
import com.streaming.backend.domain.Category;
import com.streaming.backend.domain.enums.CategoryStatus;
import com.streaming.backend.features.admin.dto.AdminCategoryResponse;
import com.streaming.backend.features.admin.dto.CreateCategoryRequest;
import com.streaming.backend.features.admin.dto.UpdateCategoryRequest;
import com.streaming.backend.features.admin.mapper.AdminCategoryMapper;
import com.streaming.backend.features.admin.repository.AdminCategoryRepository;
import com.streaming.backend.features.admin.service.AdminCategoryService;
import com.streaming.backend.features.admin.service.AdminLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminCategoryServiceImpl implements AdminCategoryService {

    private final AdminCategoryRepository adminCategoryRepository;
    private final AdminCategoryMapper adminCategoryMapper;
    private final AdminLogService adminLogService;

    @Override
    @Transactional(readOnly = true)
    public List<AdminCategoryResponse> getCategories() {
        return adminCategoryRepository.findAll().stream()
                .sorted(Comparator.comparing(Category::getCategoryName, String.CASE_INSENSITIVE_ORDER))
                .map(adminCategoryMapper::toAdminCategoryResponse)
                .toList();
    }

    @Override
    public AdminCategoryResponse createCategory(CreateCategoryRequest request) {
        validateUniqueCategoryName(request.getCategoryName());

        Category category = adminCategoryMapper.toCategory(request);
        category.setStatus(request.getStatus() == null ? CategoryStatus.ACTIVE : request.getStatus());
        AdminCategoryResponse response = adminCategoryMapper.toAdminCategoryResponse(adminCategoryRepository.save(category));

        adminLogService.createAuditLog("CREATE", "Category", response.getCategoryId().toString(), null, response);

        return response;
    }

    @Override
    public AdminCategoryResponse updateCategory(Integer categoryId, UpdateCategoryRequest request) {
        Category category = findCategory(categoryId);
        validateUniqueCategoryName(categoryId, request.getCategoryName());
        AdminCategoryResponse oldValue = adminCategoryMapper.toAdminCategoryResponse(category);

        adminCategoryMapper.updateCategoryFromRequest(request, category);
        if (request.getStatus() != null) {
            category.setStatus(request.getStatus());
        }
        AdminCategoryResponse response = adminCategoryMapper.toAdminCategoryResponse(adminCategoryRepository.save(category));

        adminLogService.createAuditLog("UPDATE", "Category", categoryId.toString(), oldValue, response);

        return response;
    }

    @Override
    public void deleteCategory(Integer categoryId) {
        Category category = findCategory(categoryId);
        if (category.getVideos() != null && !category.getVideos().isEmpty()) {
            throw new BadRequestException("Videos under this category should be reassigned first");
        }
        AdminCategoryResponse oldValue = adminCategoryMapper.toAdminCategoryResponse(category);

        adminCategoryRepository.delete(category);

        adminLogService.createAuditLog("DELETE", "Category", categoryId.toString(), oldValue, null);
    }

    private Category findCategory(Integer categoryId) {
        return adminCategoryRepository.findByCategoryId(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }

    private void validateUniqueCategoryName(String categoryName) {
        if (adminCategoryRepository.existsByCategoryName(categoryName)) {
            throw new BadRequestException("Category name is already taken");
        }
    }

    private void validateUniqueCategoryName(Integer categoryId, String categoryName) {
        if (categoryName != null && adminCategoryRepository.existsByCategoryNameAndCategoryIdNot(categoryName, categoryId)) {
            throw new BadRequestException("Category name is already taken");
        }
    }
}
