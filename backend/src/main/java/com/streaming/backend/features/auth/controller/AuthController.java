package com.streaming.backend.features.auth.controller;

import com.streaming.backend.domain.User;
import com.streaming.backend.features.auth.dto.LoginRequest;
import com.streaming.backend.features.auth.dto.RegisterRequest;
import com.streaming.backend.features.auth.dto.AuthResponse;
import com.streaming.backend.security.UserPrincipal;
import com.streaming.backend.features.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        AuthResponse response = authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        AuthResponse response = authService.login(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        User user = userPrincipal != null ? userPrincipal.getUser() : null;
        authService.logout(user);
        return ResponseEntity.noContent().build();
    }
}