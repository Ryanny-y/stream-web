package com.streaming.backend.features.user.controller;

import com.streaming.backend.domain.User;
import com.streaming.backend.features.user.dto.RecordVideoViewRequest;
import com.streaming.backend.features.user.dto.VideoProgressResponse;
import com.streaming.backend.features.user.service.UserVideoService;
import com.streaming.backend.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/user/videos")
@RequiredArgsConstructor
public class UserVideoController {

    private final UserVideoService userVideoService;

    @PostMapping("/{videoId}/view")
    public ResponseEntity<VideoProgressResponse> recordView(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID videoId,
            @Valid @RequestBody(required = false) RecordVideoViewRequest request
    ) {
        return ResponseEntity.ok(userVideoService.recordView(getCurrentUser(userPrincipal), videoId, request));
    }

    @GetMapping("/{videoId}/progress")
    public ResponseEntity<VideoProgressResponse> getProgress(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID videoId
    ) {
        return ResponseEntity.ok(userVideoService.getProgress(getCurrentUser(userPrincipal), videoId));
    }

    private User getCurrentUser(UserPrincipal userPrincipal) {
        return userPrincipal == null ? null : userPrincipal.getUser();
    }
}
