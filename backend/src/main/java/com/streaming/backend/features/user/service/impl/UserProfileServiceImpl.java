package com.streaming.backend.features.user.service.impl;

import com.streaming.backend.common.exceptions.BadRequestException;
import com.streaming.backend.common.exceptions.ResourceNotFoundException;
import com.streaming.backend.domain.User;
import com.streaming.backend.features.user.dto.ChangePasswordRequest;
import com.streaming.backend.features.user.dto.UpdateProfileRequest;
import com.streaming.backend.features.user.dto.UserProfileResponse;
import com.streaming.backend.features.user.mapper.UserProfileMapper;
import com.streaming.backend.features.user.repository.UserProfileRepository;
import com.streaming.backend.features.user.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserProfileMapper userProfileMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(User currentUser) {
        return userProfileMapper.toUserProfileResponse(findCurrentUser(currentUser));
    }

    @Override
    public UserProfileResponse updateProfile(User currentUser, UpdateProfileRequest request) {
        User user = findCurrentUser(currentUser);
        validateUniqueUsername(user, request.getUsername());
        validateUniqueEmail(user, request.getEmail());

        userProfileMapper.updateUserFromRequest(request, user);

        return userProfileMapper.toUserProfileResponse(userProfileRepository.save(user));
    }

    @Override
    public void changePassword(User currentUser, ChangePasswordRequest request) {
        User user = findCurrentUser(currentUser);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new BadRequestException("New password must be different from the current password");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userProfileRepository.save(user);
    }

    private User findCurrentUser(User currentUser) {
        if (currentUser == null || currentUser.getUserId() == null) {
            throw new ResourceNotFoundException("User not found");
        }

        return userProfileRepository.findByUserId(currentUser.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private void validateUniqueUsername(User user, String username) {
        if (username != null && userProfileRepository.existsByUsernameAndUserIdNot(username, user.getUserId())) {
            throw new BadRequestException("Username is already taken");
        }
    }

    private void validateUniqueEmail(User user, String email) {
        if (email != null && userProfileRepository.existsByEmailAndUserIdNot(email, user.getUserId())) {
            throw new BadRequestException("Email is already registered");
        }
    }
}
