package com.streaming.backend.features.guest.controller;

import com.streaming.backend.features.guest.dto.PublicVideoResponse;
import com.streaming.backend.features.guest.service.GuestVideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/public/videos")
@RequiredArgsConstructor
public class GuestVideoController {

    private final GuestVideoService guestVideoService;

    @GetMapping
    public ResponseEntity<List<PublicVideoResponse>> getVideos() {
        return ResponseEntity.ok(guestVideoService.getVideos());
    }

    @GetMapping("/{videoId}")
    public ResponseEntity<PublicVideoResponse> getVideo(
            @PathVariable UUID videoId
    ) {
        return ResponseEntity.ok(guestVideoService.getVideo(videoId));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<PublicVideoResponse>> getFeaturedVideos() {
        return ResponseEntity.ok(guestVideoService.getFeaturedVideos());
    }

    @GetMapping("/trending")
    public ResponseEntity<List<PublicVideoResponse>> getTrendingVideos() {
        return ResponseEntity.ok(guestVideoService.getTrendingVideos());
    }
}
