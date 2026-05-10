package com.streaming.backend.features.user.controller;

import com.streaming.backend.domain.User;
import com.streaming.backend.features.user.dto.UserDashboardVideoResponse;
import com.streaming.backend.features.user.service.UserWatchHistoryService;
import com.streaming.backend.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/user/history")
@RequiredArgsConstructor
public class UserWatchHistoryController {

    private final UserWatchHistoryService userWatchHistoryService;

    @GetMapping
    public ResponseEntity<List<UserDashboardVideoResponse>> getWatchHistory(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity.ok(userWatchHistoryService.getWatchHistory(getCurrentUser(userPrincipal)));
    }

    @DeleteMapping("/{videoId}")
    public ResponseEntity<Void> removeFromWatchHistory(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID videoId
    ) {
        userWatchHistoryService.removeFromWatchHistory(getCurrentUser(userPrincipal), videoId);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearWatchHistory(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        userWatchHistoryService.clearWatchHistory(getCurrentUser(userPrincipal));

        return ResponseEntity.noContent().build();
    }

    private User getCurrentUser(UserPrincipal userPrincipal) {
        return userPrincipal == null ? null : userPrincipal.getUser();
    }
}
