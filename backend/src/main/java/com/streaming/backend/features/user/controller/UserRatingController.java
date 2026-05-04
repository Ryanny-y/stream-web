package com.streaming.backend.features.user.controller;

import com.streaming.backend.domain.User;
import com.streaming.backend.features.user.dto.RatingRequest;
import com.streaming.backend.features.user.dto.RatingResponse;
import com.streaming.backend.features.user.service.UserRatingService;
import com.streaming.backend.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/user/videos/{videoId}/rating")
@RequiredArgsConstructor
public class UserRatingController {

    private final UserRatingService userRatingService;

    @PostMapping
    public ResponseEntity<RatingResponse> createRating(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID videoId,
            @Valid @RequestBody RatingRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userRatingService.createRating(getCurrentUser(userPrincipal), videoId, request));
    }

    @PutMapping
    public ResponseEntity<RatingResponse> updateRating(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID videoId,
            @Valid @RequestBody RatingRequest request
    ) {
        return ResponseEntity.ok(userRatingService.updateRating(getCurrentUser(userPrincipal), videoId, request));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteRating(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID videoId
    ) {
        userRatingService.deleteRating(getCurrentUser(userPrincipal), videoId);

        return ResponseEntity.noContent().build();
    }

    private User getCurrentUser(UserPrincipal userPrincipal) {
        return userPrincipal == null ? null : userPrincipal.getUser();
    }
}
