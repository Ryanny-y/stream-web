package com.streaming.backend.features.user.controller;

import com.streaming.backend.domain.User;
import com.streaming.backend.features.guest.dto.PublicVideoResponse;
import com.streaming.backend.features.user.service.UserRecommendationService;
import com.streaming.backend.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/user/recommendations")
@RequiredArgsConstructor
public class UserRecommendationController {

    private final UserRecommendationService userRecommendationService;

    @GetMapping
    public ResponseEntity<List<PublicVideoResponse>> getRecommendations(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity.ok(userRecommendationService.getRecommendations(getCurrentUser(userPrincipal)));
    }

    private User getCurrentUser(UserPrincipal userPrincipal) {
        return userPrincipal == null ? null : userPrincipal.getUser();
    }
}
