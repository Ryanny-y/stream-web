package com.streaming.backend.features.admin.controller;

import com.streaming.backend.features.admin.dto.AdminCategoryResponse;
import com.streaming.backend.features.admin.dto.CreateCategoryRequest;
import com.streaming.backend.features.admin.dto.UpdateCategoryRequest;
import com.streaming.backend.features.admin.service.AdminCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminCategoryController {

    private final AdminCategoryService adminCategoryService;

    @GetMapping
    public ResponseEntity<List<AdminCategoryResponse>> getCategories() {
        return ResponseEntity.ok(adminCategoryService.getCategories());
    }

    @PostMapping
    public ResponseEntity<AdminCategoryResponse> createCategory(
            @Valid @RequestBody CreateCategoryRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(adminCategoryService.createCategory(request));
    }

    @PutMapping("/{categoryId}")
    public ResponseEntity<AdminCategoryResponse> updateCategory(
            @PathVariable Integer categoryId,
            @Valid @RequestBody UpdateCategoryRequest request
    ) {
        return ResponseEntity.ok(adminCategoryService.updateCategory(categoryId, request));
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable Integer categoryId
    ) {
        adminCategoryService.deleteCategory(categoryId);

        return ResponseEntity.noContent().build();
    }
}
