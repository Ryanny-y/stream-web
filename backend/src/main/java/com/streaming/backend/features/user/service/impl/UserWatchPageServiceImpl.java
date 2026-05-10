package com.streaming.backend.features.user.service.impl;

import com.streaming.backend.common.exceptions.ResourceNotFoundException;
import com.streaming.backend.domain.Category;
import com.streaming.backend.domain.User;
import com.streaming.backend.domain.Video;
import com.streaming.backend.domain.WatchHistory;
import com.streaming.backend.domain.enums.VideoStatus;
import com.streaming.backend.domain.enums.Visibility;
import com.streaming.backend.features.user.dto.UserDashboardVideoResponse;
import com.streaming.backend.features.user.dto.UserWatchPageResponse;
import com.streaming.backend.features.user.dto.VideoProgressResponse;
import com.streaming.backend.features.user.repository.UserProfileRepository;
import com.streaming.backend.features.user.repository.UserVideoRepository;
import com.streaming.backend.features.user.repository.UserWatchHistoryRepository;
import com.streaming.backend.features.user.service.UserWatchPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserWatchPageServiceImpl implements UserWatchPageService {

    private static final int SUGGESTION_LIMIT = 8;

    private final UserProfileRepository userProfileRepository;
    private final UserVideoRepository userVideoRepository;
    private final UserWatchHistoryRepository userWatchHistoryRepository;

    @Override
    public UserWatchPageResponse getWatchPage(User currentUser, UUID videoId) {
        User user = findCurrentUser(currentUser);
        Video video = userVideoRepository.findByVideoIdAndVisibilityAndStatus(videoId, Visibility.PUBLIC, VideoStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("Video not found"));
        WatchHistory progress = userWatchHistoryRepository
                .findByUser_UserIdAndVideo_VideoId(user.getUserId(), videoId)
                .orElse(null);

        List<Integer> categoryIds = video.getCategories() == null
                ? List.of()
                : video.getCategories().stream().map(Category::getCategoryId).toList();

        List<UserDashboardVideoResponse> suggestions = userVideoRepository.findPublicActiveVideos(Visibility.PUBLIC, VideoStatus.ACTIVE)
                .stream()
                .filter(candidate -> !candidate.getVideoId().equals(videoId))
                .sorted(Comparator
                        .comparing((Video candidate) -> sharesCategory(candidate, categoryIds)).reversed()
                        .thenComparing(Video::getTotalViews, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(SUGGESTION_LIMIT)
                .map(this::toVideoResponse)
                .toList();

        return UserWatchPageResponse.builder()
                .video(toVideoResponse(video))
                .progress(toProgressResponse(video, progress))
                .suggestedVideos(suggestions)
                .build();
    }

    private User findCurrentUser(User currentUser) {
        if (currentUser == null || currentUser.getUserId() == null) {
            throw new ResourceNotFoundException("User not found");
        }

        return userProfileRepository.findByUserId(currentUser.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private boolean sharesCategory(Video video, List<Integer> categoryIds) {
        if (video.getCategories() == null || categoryIds.isEmpty()) {
            return false;
        }

        return video.getCategories().stream().anyMatch(category -> categoryIds.contains(category.getCategoryId()));
    }

    private UserDashboardVideoResponse toVideoResponse(Video video) {
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
                .build();
    }

    private VideoProgressResponse toProgressResponse(Video video, WatchHistory progress) {
        int watchedSeconds = progress == null || progress.getWatchedSeconds() == null ? 0 : progress.getWatchedSeconds();
        return VideoProgressResponse.builder()
                .videoId(video.getVideoId())
                .watchedSeconds(watchedSeconds)
                .durationSeconds(video.getDurationSeconds())
                .progressPercentage(calculateProgressPercentage(watchedSeconds, video.getDurationSeconds()))
                .completed(progress != null && Boolean.TRUE.equals(progress.getCompleted()))
                .lastWatchedAt(progress == null ? null : progress.getLastWatchedAt())
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
        if (durationSeconds == null || durationSeconds <= 0) {
            return 0.0;
        }

        return Math.min(100.0, (watchedSeconds * 100.0) / durationSeconds);
    }
}
