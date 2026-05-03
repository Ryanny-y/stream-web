package com.streaming.backend.controller;

import com.streaming.backend.dto.response.PublicCategoryResponse;
import com.streaming.backend.dto.response.PublicVideoResponse;
import com.streaming.backend.service.PublicCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/categories")
@RequiredArgsConstructor
public class PublicCategoryController {

    private final PublicCategoryService publicCategoryService;

    @GetMapping
    public ResponseEntity<List<PublicCategoryResponse>> getCategories() {
        return ResponseEntity.ok(publicCategoryService.getCategories());
    }

    @GetMapping("/{id}/videos")
    public ResponseEntity<List<PublicVideoResponse>> getCategoryVideos(
            @PathVariable Integer id
    ) {
        return ResponseEntity.ok(publicCategoryService.getCategoryVideos(id));
    }
}
