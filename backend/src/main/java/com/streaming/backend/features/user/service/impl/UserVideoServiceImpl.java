package com.streaming.backend.features.user.service.impl;

import com.streaming.backend.common.exceptions.ResourceNotFoundException;
import com.streaming.backend.domain.User;
import com.streaming.backend.domain.Video;
import com.streaming.backend.domain.WatchHistory;
import com.streaming.backend.domain.enums.VideoStatus;
import com.streaming.backend.domain.enums.Visibility;
import com.streaming.backend.features.user.dto.RecordVideoViewRequest;
import com.streaming.backend.features.user.dto.VideoProgressResponse;
import com.streaming.backend.features.user.repository.UserProfileRepository;
import com.streaming.backend.features.user.repository.UserVideoRepository;
import com.streaming.backend.features.user.repository.UserWatchHistoryRepository;
import com.streaming.backend.features.user.service.UserVideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserVideoServiceImpl implements UserVideoService {

    private final UserProfileRepository userProfileRepository;
    private final UserVideoRepository userVideoRepository;
    private final UserWatchHistoryRepository userWatchHistoryRepository;

    @Override
    public VideoProgressResponse recordView(User currentUser, UUID videoId, RecordVideoViewRequest request) {
        User user = findCurrentUser(currentUser);
        Video video = findPublicActiveVideo(videoId);
        WatchHistory watchHistory = userWatchHistoryRepository
                .findByUser_UserIdAndVideo_VideoId(user.getUserId(), videoId)
                .orElse(null);

        Integer previousWatchedSeconds = watchHistory == null || watchHistory.getWatchedSeconds() == null
                ? 0
                : watchHistory.getWatchedSeconds();

        if (watchHistory == null) {
            watchHistory = new WatchHistory();
            watchHistory.setUser(user);
            watchHistory.setVideo(video);
        }

        Integer requestedWatchedSeconds = request == null ? null : request.getWatchedSeconds();
        if (requestedWatchedSeconds != null) {
            int currentWatchedSeconds = watchHistory.getWatchedSeconds() == null ? 0 : watchHistory.getWatchedSeconds();
            watchHistory.setWatchedSeconds(Math.max(currentWatchedSeconds, requestedWatchedSeconds));
        }

        watchHistory.setCompleted(resolveCompleted(video, watchHistory, request));
        watchHistory.setLastWatchedAt(LocalDateTime.now());

        if (crossedHalfway(previousWatchedSeconds, watchHistory.getWatchedSeconds(), video.getDurationSeconds())) {
            video.setTotalViews((video.getTotalViews() == null ? 0L : video.getTotalViews()) + 1L);
            userVideoRepository.save(video);
        }

        return toResponse(userWatchHistoryRepository.save(watchHistory), video);
    }

    @Override
    @Transactional(readOnly = true)
    public VideoProgressResponse getProgress(User currentUser, UUID videoId) {
        User user = findCurrentUser(currentUser);
        Video video = findPublicActiveVideo(videoId);

        return userWatchHistoryRepository.findByUser_UserIdAndVideo_VideoId(user.getUserId(), videoId)
                .map(watchHistory -> toResponse(watchHistory, video))
                .orElseGet(() -> VideoProgressResponse.builder()
                        .videoId(video.getVideoId())
                        .watchedSeconds(0)
                        .durationSeconds(video.getDurationSeconds())
                        .progressPercentage(0.0)
                        .completed(false)
                        .lastWatchedAt(null)
                        .build());
    }

    private User findCurrentUser(User currentUser) {
        if (currentUser == null || currentUser.getUserId() == null) {
            throw new ResourceNotFoundException("User not found");
        }

        return userProfileRepository.findByUserId(currentUser.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Video findPublicActiveVideo(UUID videoId) {
        return userVideoRepository.findByVideoIdAndVisibilityAndStatus(
                        videoId,
                        Visibility.PUBLIC,
                        VideoStatus.ACTIVE
                )
                .orElseThrow(() -> new ResourceNotFoundException("Video not found"));
    }

    private Boolean resolveCompleted(Video video, WatchHistory watchHistory, RecordVideoViewRequest request) {
        if (request != null && request.getCompleted() != null) {
            return request.getCompleted() || Boolean.TRUE.equals(watchHistory.getCompleted());
        }

        Integer durationSeconds = video.getDurationSeconds();
        Integer watchedSeconds = watchHistory.getWatchedSeconds();

        if (durationSeconds == null || durationSeconds <= 0 || watchedSeconds == null) {
            return Boolean.TRUE.equals(watchHistory.getCompleted());
        }

        return Boolean.TRUE.equals(watchHistory.getCompleted()) || watchedSeconds >= durationSeconds;
    }

    private VideoProgressResponse toResponse(WatchHistory watchHistory, Video video) {
        Integer watchedSeconds = watchHistory.getWatchedSeconds() == null ? 0 : watchHistory.getWatchedSeconds();

        return VideoProgressResponse.builder()
                .videoId(video.getVideoId())
                .watchedSeconds(watchedSeconds)
                .durationSeconds(video.getDurationSeconds())
                .progressPercentage(calculateProgressPercentage(watchedSeconds, video.getDurationSeconds()))
                .completed(Boolean.TRUE.equals(watchHistory.getCompleted()))
                .lastWatchedAt(watchHistory.getLastWatchedAt())
                .build();
    }

    private Double calculateProgressPercentage(Integer watchedSeconds, Integer durationSeconds) {
        if (durationSeconds == null || durationSeconds <= 0) {
            return 0.0;
        }

        double percentage = (watchedSeconds * 100.0) / durationSeconds;

        return Math.min(100.0, percentage);
    }

    private boolean crossedHalfway(Integer previousWatchedSeconds, Integer currentWatchedSeconds, Integer durationSeconds) {
        if (durationSeconds == null || durationSeconds <= 0 || currentWatchedSeconds == null) {
            return false;
        }

        double halfway = durationSeconds / 2.0;
        return previousWatchedSeconds < halfway && currentWatchedSeconds >= halfway;
    }
}
