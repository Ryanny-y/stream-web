package com.streaming.backend.features.guest.controller;

import com.streaming.backend.features.guest.dto.PublicCategoryResponse;
import com.streaming.backend.features.guest.dto.PublicVideoResponse;
import com.streaming.backend.features.guest.service.GuestCategoryService;
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
public class GuestCategoryController {

    private final GuestCategoryService guestCategoryService;

    @GetMapping
    public ResponseEntity<List<PublicCategoryResponse>> getCategories() {
        return ResponseEntity.ok(guestCategoryService.getCategories());
    }

    @GetMapping("/{id}/videos")
    public ResponseEntity<List<PublicVideoResponse>> getCategoryVideos(
            @PathVariable Integer id
    ) {
        return ResponseEntity.ok(guestCategoryService.getCategoryVideos(id));
    }
}
