package com.streaming.backend.features.user.service;

import com.streaming.backend.domain.User;
import com.streaming.backend.features.user.dto.ChangePasswordRequest;
import com.streaming.backend.features.user.dto.UpdateProfileRequest;
import com.streaming.backend.features.user.dto.UserProfileResponse;

public interface UserProfileService {

    UserProfileResponse getProfile(User currentUser);

    UserProfileResponse updateProfile(User currentUser, UpdateProfileRequest request);

    void changePassword(User currentUser, ChangePasswordRequest request);
}
