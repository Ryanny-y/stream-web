package com.streaming.backend.features.user.service.impl;

import com.streaming.backend.common.exceptions.BadRequestException;
import com.streaming.backend.common.exceptions.ResourceNotFoundException;
import com.streaming.backend.domain.User;
import com.streaming.backend.domain.WatchHistory;
import com.streaming.backend.features.admin.repository.AdminLoginLogRepository;
import com.streaming.backend.features.user.dto.ChangePasswordRequest;
import com.streaming.backend.features.user.dto.UpdateProfileRequest;
import com.streaming.backend.features.user.dto.UserProfileResponse;
import com.streaming.backend.features.user.mapper.UserProfileMapper;
import com.streaming.backend.features.user.repository.UserFavoriteRepository;
import com.streaming.backend.features.user.repository.UserProfileRepository;
import com.streaming.backend.features.user.repository.UserWatchHistoryRepository;
import com.streaming.backend.features.user.repository.UserWatchlistRepository;
import com.streaming.backend.features.user.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserProfileServiceImpl implements UserProfileService {

    private static final String IMAGE_UPLOAD_DIR = "upload/images";
    private static final long MAX_AVATAR_SIZE = 2 * 1024 * 1024;

    private final UserProfileRepository userProfileRepository;
    private final UserProfileMapper userProfileMapper;
    private final PasswordEncoder passwordEncoder;
    private final UserWatchHistoryRepository userWatchHistoryRepository;
    private final UserWatchlistRepository userWatchlistRepository;
    private final UserFavoriteRepository userFavoriteRepository;
    private final AdminLoginLogRepository adminLoginLogRepository;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(User currentUser) {
        return enrich(userProfileMapper.toUserProfileResponse(findCurrentUser(currentUser)));
    }

    @Override
    public UserProfileResponse updateProfile(User currentUser, UpdateProfileRequest request) {
        User user = findCurrentUser(currentUser);
        validateUniqueUsername(user, request.getUsername());
        validateUniqueEmail(user, request.getEmail());

        userProfileMapper.updateUserFromRequest(request, user);

        return enrich(userProfileMapper.toUserProfileResponse(userProfileRepository.save(user)));
    }

    @Override
    public UserProfileResponse updateAvatar(User currentUser, MultipartFile file) {
        User user = findCurrentUser(currentUser);
        validateAvatar(file);
        String filename = storeFile(file);
        user.setProfileImage(IMAGE_UPLOAD_DIR + "/" + filename);
        return enrich(userProfileMapper.toUserProfileResponse(userProfileRepository.save(user)));
    }

    @Override
    public UserProfileResponse removeAvatar(User currentUser) {
        User user = findCurrentUser(currentUser);
        user.setProfileImage(null);
        return enrich(userProfileMapper.toUserProfileResponse(userProfileRepository.save(user)));
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

    private UserProfileResponse enrich(UserProfileResponse response) {
        UUID userId = response.getUserId();
        long watchedCount = userWatchHistoryRepository.countByUser_UserId(userId);
        long watchlistCount = userWatchlistRepository.countByUser_UserId(userId);
        long favoritesCount = userFavoriteRepository.countByUser_UserId(userId);
        double watchHours = userWatchHistoryRepository.findByUserIdWithVideo(userId).stream()
                .map(WatchHistory::getWatchedSeconds)
                .filter(seconds -> seconds != null && seconds > 0)
                .mapToInt(Integer::intValue)
                .sum() / 3600.0;
        LocalDateTime lastLogin = adminLoginLogRepository
                .findFirstByUser_UserIdAndSuccessTrueOrderByAttemptedAtDesc(userId)
                .map(log -> log.getAttemptedAt())
                .orElse(null);

        return UserProfileResponse.builder()
                .userId(response.getUserId())
                .username(response.getUsername())
                .email(response.getEmail())
                .firstName(response.getFirstName())
                .lastName(response.getLastName())
                .fullName(response.getFullName())
                .phone(response.getPhone())
                .bio(response.getBio())
                .profileImage(response.getProfileImage())
                .status(response.getStatus())
                .emailVerified(response.getEmailVerified())
                .roles(response.getRoles())
                .createdAt(response.getCreatedAt())
                .updatedAt(response.getUpdatedAt())
                .videosWatched(watchedCount)
                .watchlistCount(watchlistCount)
                .favoritesCount(favoritesCount)
                .totalWatchHours(Math.round(watchHours * 10.0) / 10.0)
                .lastLoginAt(lastLogin)
                .build();
    }

    private void validateAvatar(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Avatar file is required");
        }
        if (file.getSize() > MAX_AVATAR_SIZE) {
            throw new BadRequestException("Avatar must be 2MB or smaller");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BadRequestException("Avatar must be an image");
        }
    }

    private String storeFile(MultipartFile file) {
        String originalFilename = StringUtils.cleanPath(
                file.getOriginalFilename() == null ? "avatar" : file.getOriginalFilename()
        );
        String safeFilename = UUID.randomUUID() + "-" + originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");
        Path uploadPath = Paths.get(IMAGE_UPLOAD_DIR).toAbsolutePath().normalize();
        Path targetPath = uploadPath.resolve(safeFilename).normalize();

        if (!targetPath.startsWith(uploadPath)) {
            throw new BadRequestException("Invalid file name");
        }

        try {
            Files.createDirectories(uploadPath);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new BadRequestException("Could not store avatar");
        }

        return safeFilename;
    }
}
