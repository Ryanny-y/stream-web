package com.streaming.backend.features.user.service.impl;

import com.streaming.backend.common.exceptions.ResourceNotFoundException;
import com.streaming.backend.domain.Category;
import com.streaming.backend.domain.User;
import com.streaming.backend.domain.Video;
import com.streaming.backend.domain.WatchHistory;
import com.streaming.backend.features.user.dto.UserDashboardVideoResponse;
import com.streaming.backend.features.user.repository.UserProfileRepository;
import com.streaming.backend.features.user.repository.UserWatchHistoryRepository;
import com.streaming.backend.features.user.service.UserWatchHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserWatchHistoryServiceImpl implements UserWatchHistoryService {

    private final UserProfileRepository userProfileRepository;
    private final UserWatchHistoryRepository userWatchHistoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<UserDashboardVideoResponse> getWatchHistory(User currentUser) {
        User user = findCurrentUser(currentUser);

        return userWatchHistoryRepository.findByUserIdWithVideo(user.getUserId()).stream()
                .sorted(Comparator.comparing(WatchHistory::getLastWatchedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::toVideoResponse)
                .toList();
    }

    @Override
    public void removeFromWatchHistory(User currentUser, UUID videoId) {
        User user = findCurrentUser(currentUser);
        long removed = userWatchHistoryRepository.deleteByUser_UserIdAndVideo_VideoId(user.getUserId(), videoId);

        if (removed == 0) {
            throw new ResourceNotFoundException("Watch history item not found");
        }
    }

    @Override
    public void clearWatchHistory(User currentUser) {
        User user = findCurrentUser(currentUser);
        userWatchHistoryRepository.deleteByUser_UserId(user.getUserId());
    }

    private User findCurrentUser(User currentUser) {
        if (currentUser == null || currentUser.getUserId() == null) {
            throw new ResourceNotFoundException("User not found");
        }

        return userProfileRepository.findByUserId(currentUser.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private UserDashboardVideoResponse toVideoResponse(WatchHistory history) {
        Video video = history.getVideo();

        return UserDashboardVideoResponse.builder()
                .videoId(video.getVideoId())
                .title(video.getTitle())
                .description(video.getDescription())
                .slug(video.getSlug())
                .filePath(video.getFilePath())
                .thumbnailPath(video.getThumbnailPath())
                .durationSeconds(video.getDurationSeconds())
                .totalViews(video.getTotalViews())
                .rating(0.0)
                .categories(mapCategories(video))
                .watchedSeconds(history.getWatchedSeconds())
                .progressPercentage(calculateProgressPercentage(history.getWatchedSeconds(), video.getDurationSeconds()))
                .lastWatchedAt(history.getLastWatchedAt())
                .build();
    }

    private List<String> mapCategories(Video video) {
        if (video.getCategories() == null) {
            return List.of();
        }

        return video.getCategories().stream()
                .map(Category::getCategoryName)
                .sorted()
                .toList();
    }

    private Double calculateProgressPercentage(Integer watchedSeconds, Integer durationSeconds) {
        if (watchedSeconds == null || durationSeconds == null || durationSeconds <= 0) {
            return 0.0;
        }

        return Math.min(100.0, (watchedSeconds * 100.0) / durationSeconds);
    }
}
