package com.streaming.backend.features.user.controller;

import com.streaming.backend.domain.User;
import com.streaming.backend.features.user.dto.FavoriteResponse;
import com.streaming.backend.features.user.service.UserFavoriteService;
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
@RequestMapping("/api/user/favorites")
@RequiredArgsConstructor
public class UserFavoriteController {

    private final UserFavoriteService userFavoriteService;

    @GetMapping
    public ResponseEntity<List<FavoriteResponse>> getFavorites(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity.ok(userFavoriteService.getFavorites(getCurrentUser(userPrincipal)));
    }

    @PostMapping("/{videoId}")
    public ResponseEntity<FavoriteResponse> addToFavorites(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID videoId
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userFavoriteService.addToFavorites(getCurrentUser(userPrincipal), videoId));
    }

    @DeleteMapping("/{videoId}")
    public ResponseEntity<Void> removeFromFavorites(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID videoId
    ) {
        userFavoriteService.removeFromFavorites(getCurrentUser(userPrincipal), videoId);

        return ResponseEntity.noContent().build();
    }

    private User getCurrentUser(UserPrincipal userPrincipal) {
        return userPrincipal == null ? null : userPrincipal.getUser();
    }
}
