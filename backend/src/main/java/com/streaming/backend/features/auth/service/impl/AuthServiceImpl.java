package com.streaming.backend.features.auth.service.impl;


import com.streaming.backend.common.exceptions.ApiException;
import com.streaming.backend.domain.Role;
import com.streaming.backend.domain.User;
import com.streaming.backend.domain.enums.RoleName;
import com.streaming.backend.domain.enums.UserStatus;
import com.streaming.backend.features.auth.dto.LoginRequest;
import com.streaming.backend.features.auth.dto.RegisterRequest;
import com.streaming.backend.features.auth.dto.AuthResponse;
import com.streaming.backend.features.auth.mapper.AuthMapper;
import com.streaming.backend.features.auth.repository.AuthRepository;
import com.streaming.backend.features.auth.repository.RoleRepository;
import com.streaming.backend.features.admin.service.AdminLogService;
import com.streaming.backend.security.UserPrincipal;
import com.streaming.backend.security.jwt.JwtService;
import com.streaming.backend.features.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final AuthRepository authRepository;
    private final AuthenticationManager authenticationManager;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthMapper authMapper;
    private final JwtService jwtService;
    private final AdminLogService adminLogService;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (authRepository.existsByUsername(request.getUsername())) {
            throw new ApiException(HttpStatus.CONFLICT, "Username is already taken.");
        }

        if (authRepository.existsByEmail(request.getEmail())) {
            throw new ApiException(HttpStatus.CONFLICT, "Email is already registered.");
        }

        Role userRole = roleRepository.findByRoleName(RoleName.USER)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Default USER role not found."));

        User user = authMapper.toUser(request);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setStatus(UserStatus.ACTIVE);
        user.setEmailVerified(false);
        user.setFailedAttempts(0);
        user.setRoles(Set.of(userRole));

        User savedUser = authRepository.save(user);

        String accessToken = jwtService.generateAccessToken(new UserPrincipal(savedUser));

        return authMapper.toAuthResponse(savedUser, accessToken);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = authRepository
                .findByUsernameOrEmail(request.getUsernameOrEmail(), request.getUsernameOrEmail())
                .orElse(null);

        if (user == null) {
            adminLogService.createLoginLog(null, request.getUsernameOrEmail(), false);
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid username/email or password.");
        }

        if (user.getStatus() != UserStatus.ACTIVE) {
            adminLogService.createLoginLog(user, request.getUsernameOrEmail(), false);
            throw new ApiException(HttpStatus.FORBIDDEN, "Account is not active.");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsernameOrEmail(),
                            request.getPassword()
                    )
            );

            String accessToken = jwtService.generateAccessToken(new UserPrincipal(user));
            adminLogService.createLoginLog(user, request.getUsernameOrEmail(), true);

            return authMapper.toAuthResponse(user, accessToken);
        } catch (AuthenticationException ex) {
            adminLogService.createLoginLog(user, request.getUsernameOrEmail(), false);
            throw new ApiException(HttpStatus.BAD_REQUEST, "Username/Email or Password is incorrect.");
        }
    }
    @Override
    public void logout(User user) {
        SecurityContextHolder.clearContext();
    }
}
