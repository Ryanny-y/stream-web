package com.streaming.backend.features.user.controller;

import com.streaming.backend.domain.User;
import com.streaming.backend.features.user.dto.WatchlistResponse;
import com.streaming.backend.features.user.service.UserWatchlistService;
import com.streaming.backend.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/user/watchlist")
@RequiredArgsConstructor
public class UserWatchlistController {

    private final UserWatchlistService userWatchlistService;

    @GetMapping
    public ResponseEntity<List<WatchlistResponse>> getWatchlist(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity.ok(userWatchlistService.getWatchlist(getCurrentUser(userPrincipal)));
    }

    @PostMapping("/{videoId}")
    public ResponseEntity<WatchlistResponse> addToWatchlist(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID videoId
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userWatchlistService.addToWatchlist(getCurrentUser(userPrincipal), videoId));
    }

    @DeleteMapping("/{videoId}")
    public ResponseEntity<Void> removeFromWatchlist(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID videoId
    ) {
        userWatchlistService.removeFromWatchlist(getCurrentUser(userPrincipal), videoId);

        return ResponseEntity.noContent().build();
    }

    private User getCurrentUser(UserPrincipal userPrincipal) {
        return userPrincipal == null ? null : userPrincipal.getUser();
    }
}
