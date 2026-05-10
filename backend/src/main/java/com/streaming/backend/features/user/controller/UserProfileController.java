package com.streaming.backend.features.user.controller;

import com.streaming.backend.domain.User;
import com.streaming.backend.common.response.ApiResponse;
import com.streaming.backend.features.user.dto.ChangePasswordRequest;
import com.streaming.backend.features.user.dto.UpdateProfileRequest;
import com.streaming.backend.features.user.dto.UserProfileResponse;
import com.streaming.backend.features.user.service.UserProfileService;
import com.streaming.backend.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity.ok(ApiResponse.success(userProfileService.getProfile(getCurrentUser(userPrincipal))));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated", userProfileService.updateProfile(getCurrentUser(userPrincipal), request)));
    }

    @PutMapping(value = "/profile/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateAvatar(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam("file") MultipartFile file
    ) {
        return ResponseEntity.ok(ApiResponse.success("Avatar updated", userProfileService.updateAvatar(getCurrentUser(userPrincipal), file)));
    }

    @DeleteMapping("/profile/avatar")
    public ResponseEntity<ApiResponse<UserProfileResponse>> removeAvatar(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity.ok(ApiResponse.success("Avatar removed", userProfileService.removeAvatar(getCurrentUser(userPrincipal))));
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        userProfileService.changePassword(getCurrentUser(userPrincipal), request);

        return ResponseEntity.ok(ApiResponse.success("Password updated", null));
    }

    private User getCurrentUser(UserPrincipal userPrincipal) {
        return userPrincipal == null ? null : userPrincipal.getUser();
    }
}
