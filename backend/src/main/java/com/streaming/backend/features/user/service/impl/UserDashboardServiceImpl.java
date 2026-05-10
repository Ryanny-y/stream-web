package com.streaming.backend.features.user.service.impl;

import com.streaming.backend.domain.Category;
import com.streaming.backend.domain.User;
import com.streaming.backend.domain.Video;
import com.streaming.backend.domain.WatchHistory;
import com.streaming.backend.domain.Watchlist;
import com.streaming.backend.domain.enums.VideoStatus;
import com.streaming.backend.domain.enums.Visibility;
import com.streaming.backend.features.user.dto.UserDashboardResponse;
import com.streaming.backend.features.user.dto.UserDashboardVideoResponse;
import com.streaming.backend.features.user.repository.UserVideoRepository;
import com.streaming.backend.features.user.repository.UserWatchHistoryRepository;
import com.streaming.backend.features.user.repository.UserWatchlistRepository;
import com.streaming.backend.features.user.service.UserDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserDashboardServiceImpl implements UserDashboardService {

    private static final int SECTION_LIMIT = 8;
    private static final int HISTORY_LIMIT = 6;

    private final UserVideoRepository userVideoRepository;
    private final UserWatchHistoryRepository userWatchHistoryRepository;
    private final UserWatchlistRepository userWatchlistRepository;

    @Override
    public UserDashboardResponse getDashboard(User currentUser) {
        List<Video> publicVideos = userVideoRepository.findPublicActiveVideos(Visibility.PUBLIC, VideoStatus.ACTIVE);
        List<WatchHistory> history = userWatchHistoryRepository.findByUserIdWithVideo(currentUser.getUserId());
        List<Watchlist> watchlist = userWatchlistRepository.findUserWatchlist(
                currentUser.getUserId(),
                Visibility.PUBLIC,
                VideoStatus.ACTIVE
        );

        List<UserDashboardVideoResponse> continueWatching = history.stream()
                .filter(item -> !Boolean.TRUE.equals(item.getCompleted()))
                .filter(item -> item.getWatchedSeconds() != null && item.getWatchedSeconds() > 0)
                .sorted(Comparator.comparing(WatchHistory::getLastWatchedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(SECTION_LIMIT)
                .map(this::toVideoResponse)
                .toList();

        List<UserDashboardVideoResponse> watchHistory = history.stream()
                .sorted(Comparator.comparing(WatchHistory::getLastWatchedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(HISTORY_LIMIT)
                .map(this::toVideoResponse)
                .toList();

        List<UserDashboardVideoResponse> watchlistVideos = watchlist.stream()
                .limit(SECTION_LIMIT)
                .map(this::toVideoResponse)
                .toList();

        List<UserDashboardVideoResponse> trendingVideos = publicVideos.stream()
                .filter(video -> Boolean.TRUE.equals(video.getIsTrending()))
                .sorted(Comparator.comparing(Video::getTotalViews, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(SECTION_LIMIT)
                .map(this::toVideoResponse)
                .toList();

        if (trendingVideos.isEmpty()) {
            trendingVideos = publicVideos.stream()
                    .sorted(Comparator.comparing(Video::getTotalViews, Comparator.nullsLast(Comparator.reverseOrder())))
                    .limit(SECTION_LIMIT)
                    .map(this::toVideoResponse)
                    .toList();
        }

        List<UserDashboardVideoResponse> recommendedVideos = publicVideos.stream()
                .filter(video -> history.stream().noneMatch(item -> item.getVideo().getVideoId().equals(video.getVideoId())))
                .sorted(Comparator.comparing(Video::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(SECTION_LIMIT)
                .map(this::toVideoResponse)
                .toList();

        UserDashboardVideoResponse featuredVideo = publicVideos.stream()
                .filter(video -> Boolean.TRUE.equals(video.getIsFeatured()))
                .findFirst()
                .map(this::toVideoResponse)
                .orElseGet(() -> recommendedVideos.isEmpty() ? null : recommendedVideos.get(0));

        return UserDashboardResponse.builder()
                .featuredVideo(featuredVideo)
                .continueWatching(continueWatching)
                .recommendedVideos(recommendedVideos)
                .watchHistory(watchHistory)
                .watchlist(watchlistVideos)
                .trendingVideos(trendingVideos)
                .build();
    }

    private UserDashboardVideoResponse toVideoResponse(WatchHistory history) {
        Video video = history.getVideo();
        return baseVideoBuilder(video)
                .watchedSeconds(history.getWatchedSeconds())
                .progressPercentage(calculateProgressPercentage(history.getWatchedSeconds(), video.getDurationSeconds()))
                .lastWatchedAt(history.getLastWatchedAt())
                .build();
    }

    private UserDashboardVideoResponse toVideoResponse(Watchlist watchlist) {
        return baseVideoBuilder(watchlist.getVideo())
                .addedAt(watchlist.getAddedAt())
                .build();
    }

    private UserDashboardVideoResponse toVideoResponse(Video video) {
        return baseVideoBuilder(video).build();
    }

    private UserDashboardVideoResponse.UserDashboardVideoResponseBuilder baseVideoBuilder(Video video) {
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
                .categories(mapCategories(video));
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
