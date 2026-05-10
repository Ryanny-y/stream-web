package com.streaming.backend.features.user.controller;

import com.streaming.backend.domain.User;
import com.streaming.backend.features.user.dto.UserDashboardResponse;
import com.streaming.backend.features.user.service.UserDashboardService;
import com.streaming.backend.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user/dashboard")
@RequiredArgsConstructor
public class UserDashboardController {

    private final UserDashboardService userDashboardService;

    @GetMapping
    public ResponseEntity<UserDashboardResponse> getDashboard(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        User user = userPrincipal.getUser();
        return ResponseEntity.ok(userDashboardService.getDashboard(user));
    }
}
