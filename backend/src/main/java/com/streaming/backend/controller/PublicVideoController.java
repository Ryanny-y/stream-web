package com.streaming.backend.controller;

import com.streaming.backend.dto.response.PublicVideoResponse;
import com.streaming.backend.service.PublicVideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/public/videos")
@RequiredArgsConstructor
public class PublicVideoController {

    private final PublicVideoService publicVideoService;

    @GetMapping
    public ResponseEntity<List<PublicVideoResponse>> getVideos() {
        return ResponseEntity.ok(publicVideoService.getVideos());
    }

    @GetMapping("/{videoId}")
    public ResponseEntity<PublicVideoResponse> getVideo(
            @PathVariable UUID videoId
    ) {
        return ResponseEntity.ok(publicVideoService.getVideo(videoId));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<PublicVideoResponse>> getFeaturedVideos() {
        return ResponseEntity.ok(publicVideoService.getFeaturedVideos());
    }

    @GetMapping("/trending")
    public ResponseEntity<List<PublicVideoResponse>> getTrendingVideos() {
        return ResponseEntity.ok(publicVideoService.getTrendingVideos());
    }

    @GetMapping("/search")
    public ResponseEntity<List<PublicVideoResponse>> searchVideos(
            @RequestParam String query
    ) {
        return ResponseEntity.ok(publicVideoService.searchVideos(query));
    }
}
