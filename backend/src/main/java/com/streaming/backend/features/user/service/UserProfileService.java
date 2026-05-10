package com.streaming.backend.features.user.service;

import com.streaming.backend.domain.User;
import com.streaming.backend.features.user.dto.ChangePasswordRequest;
import com.streaming.backend.features.user.dto.UpdateProfileRequest;
import com.streaming.backend.features.user.dto.UserProfileResponse;
import org.springframework.web.multipart.MultipartFile;

public interface UserProfileService {

    UserProfileResponse getProfile(User currentUser);

    UserProfileResponse updateProfile(User currentUser, UpdateProfileRequest request);

    UserProfileResponse updateAvatar(User currentUser, MultipartFile file);

    UserProfileResponse removeAvatar(User currentUser);

    void changePassword(User currentUser, ChangePasswordRequest request);
}
