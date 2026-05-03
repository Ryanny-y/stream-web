package com.streaming.backend.features.auth.service;

import com.streaming.backend.domain.User;
import com.streaming.backend.features.auth.dto.LoginRequest;
import com.streaming.backend.features.auth.dto.RegisterRequest;
import com.streaming.backend.features.auth.dto.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
    void logout(User user);
}