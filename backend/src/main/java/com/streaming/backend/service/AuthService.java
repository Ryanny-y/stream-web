package com.streaming.backend.service;

import com.streaming.backend.domain.entities.User;
import com.streaming.backend.dto.requests.LoginRequest;
import com.streaming.backend.dto.requests.RegisterRequest;
import com.streaming.backend.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
    void logout(User user);
}