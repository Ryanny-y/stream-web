package com.streaming.backend.features.user.controller;

import com.streaming.backend.domain.User;
import com.streaming.backend.features.user.dto.UserWatchPageResponse;
import com.streaming.backend.features.user.service.UserWatchPageService;
import com.streaming.backend.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/user/watch")
@RequiredArgsConstructor
public class UserWatchPageController {

    private final UserWatchPageService userWatchPageService;

    @GetMapping("/{videoId}")
    public ResponseEntity<UserWatchPageResponse> getWatchPage(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID videoId
    ) {
        User user = userPrincipal == null ? null : userPrincipal.getUser();
        return ResponseEntity.ok(userWatchPageService.getWatchPage(user, videoId));
    }
}
