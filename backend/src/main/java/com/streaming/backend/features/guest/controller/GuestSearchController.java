package com.streaming.backend.features.guest.controller;

import com.streaming.backend.features.guest.dto.PublicVideoResponse;
import com.streaming.backend.features.guest.service.GuestVideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/videos/search")
@RequiredArgsConstructor
public class GuestSearchController {

    private final GuestVideoService guestVideoService;

    @GetMapping
    public ResponseEntity<List<PublicVideoResponse>> searchVideos(
            @RequestParam String query
    ) {
        return ResponseEntity.ok(guestVideoService.searchVideos(query));
    }
}
