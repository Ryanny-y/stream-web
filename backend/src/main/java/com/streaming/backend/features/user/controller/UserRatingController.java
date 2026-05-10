package com.streaming.backend.features.user.controller;

import com.streaming.backend.common.response.ApiResponse;
import com.streaming.backend.domain.User;
import com.streaming.backend.features.user.dto.RatingRequest;
import com.streaming.backend.features.user.dto.RatingResponse;
import com.streaming.backend.features.user.dto.RatingSummaryResponse;
import com.streaming.backend.features.user.service.UserRatingService;
import com.streaming.backend.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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

    @GetMapping
    public ResponseEntity<ApiResponse<RatingSummaryResponse>> getRatingSummary(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID videoId
    ) {
        return ResponseEntity.ok(ApiResponse.success(userRatingService.getRatingSummary(getCurrentUser(userPrincipal), videoId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RatingResponse>> createRating(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID videoId,
            @Valid @RequestBody RatingRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Rating saved", userRatingService.createRating(getCurrentUser(userPrincipal), videoId, request)));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<RatingResponse>> updateRating(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID videoId,
            @Valid @RequestBody RatingRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Rating updated", userRatingService.updateRating(getCurrentUser(userPrincipal), videoId, request)));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteRating(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID videoId
    ) {
        userRatingService.deleteRating(getCurrentUser(userPrincipal), videoId);

        return ResponseEntity.ok(ApiResponse.success("Rating deleted", null));
    }

    private User getCurrentUser(UserPrincipal userPrincipal) {
        return userPrincipal == null ? null : userPrincipal.getUser();
    }
}
