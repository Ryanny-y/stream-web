package com.streaming.backend.features.user.service.impl;

import com.streaming.backend.common.exceptions.ResourceNotFoundException;
import com.streaming.backend.domain.Category;
import com.streaming.backend.domain.Favorite;
import com.streaming.backend.domain.Rating;
import com.streaming.backend.domain.User;
import com.streaming.backend.domain.Video;
import com.streaming.backend.domain.WatchHistory;
import com.streaming.backend.domain.Watchlist;
import com.streaming.backend.domain.enums.VideoStatus;
import com.streaming.backend.domain.enums.Visibility;
import com.streaming.backend.features.guest.dto.PublicVideoResponse;
import com.streaming.backend.features.guest.mapper.GuestVideoMapper;
import com.streaming.backend.features.user.repository.UserFavoriteRepository;
import com.streaming.backend.features.user.repository.UserProfileRepository;
import com.streaming.backend.features.user.repository.UserRatingRepository;
import com.streaming.backend.features.user.repository.UserVideoRepository;
import com.streaming.backend.features.user.repository.UserWatchHistoryRepository;
import com.streaming.backend.features.user.repository.UserWatchlistRepository;
import com.streaming.backend.features.user.service.UserRecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserRecommendationServiceImpl implements UserRecommendationService {

    private static final int RECOMMENDATION_LIMIT = 20;

    private final UserProfileRepository userProfileRepository;
    private final UserVideoRepository userVideoRepository;
    private final UserWatchHistoryRepository userWatchHistoryRepository;
    private final UserWatchlistRepository userWatchlistRepository;
    private final UserFavoriteRepository userFavoriteRepository;
    private final UserRatingRepository userRatingRepository;
    private final GuestVideoMapper guestVideoMapper;

    @Override
    public List<PublicVideoResponse> getRecommendations(User currentUser) {
        User user = findCurrentUser(currentUser);
        RecommendationSignals signals = buildSignals(user.getUserId());

        return userVideoRepository.findPublicActiveVideos(Visibility.PUBLIC, VideoStatus.ACTIVE)
                .stream()
                .filter(video -> !signals.interactedVideoIds().contains(video.getVideoId()))
                .sorted(Comparator
                        .comparingDouble((Video video) -> score(video, signals)).reversed()
                        .thenComparing(Video::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(RECOMMENDATION_LIMIT)
                .map(guestVideoMapper::toPublicVideoResponse)
                .toList();
    }

    private RecommendationSignals buildSignals(UUID userId) {
        Set<UUID> interactedVideoIds = new HashSet<>();
        Set<Integer> preferredCategoryIds = new HashSet<>();

        userWatchHistoryRepository.findByUserIdWithVideo(userId)
                .forEach(history -> addVideoSignal(history.getVideo(), interactedVideoIds, preferredCategoryIds));

        userWatchlistRepository.findUserWatchlist(userId, Visibility.PUBLIC, VideoStatus.ACTIVE)
                .forEach(watchlist -> addVideoSignal(watchlist.getVideo(), interactedVideoIds, preferredCategoryIds));

        userFavoriteRepository.findUserFavorites(userId, Visibility.PUBLIC, VideoStatus.ACTIVE)
                .forEach(favorite -> addVideoSignal(favorite.getVideo(), interactedVideoIds, preferredCategoryIds));

        userRatingRepository.findByUserIdWithVideo(userId)
                .stream()
                .filter(rating -> rating.getRating() != null && rating.getRating() >= 4)
                .forEach(rating -> addVideoSignal(rating.getVideo(), interactedVideoIds, preferredCategoryIds));

        userRatingRepository.findByUserIdWithVideo(userId)
                .stream()
                .map(Rating::getVideo)
                .forEach(video -> {
                    if (video != null) {
                        interactedVideoIds.add(video.getVideoId());
                    }
                });

        return new RecommendationSignals(interactedVideoIds, preferredCategoryIds);
    }

    private void addVideoSignal(Video video, Set<UUID> interactedVideoIds, Set<Integer> preferredCategoryIds) {
        if (video == null) {
            return;
        }

        interactedVideoIds.add(video.getVideoId());

        if (video.getCategories() != null) {
            video.getCategories().stream()
                    .map(Category::getCategoryId)
                    .forEach(preferredCategoryIds::add);
        }
    }

    private double score(Video video, RecommendationSignals signals) {
        double score = 0;

        if (video.getCategories() != null) {
            long matchingCategories = video.getCategories().stream()
                    .map(Category::getCategoryId)
                    .filter(signals.preferredCategoryIds()::contains)
                    .count();
            score += matchingCategories * 10;
        }

        if (Boolean.TRUE.equals(video.getIsFeatured())) {
            score += 3;
        }

        if (Boolean.TRUE.equals(video.getIsTrending())) {
            score += 2;
        }

        score += Math.log10((video.getTotalViews() == null ? 0L : video.getTotalViews()) + 1);

        return score;
    }

    private User findCurrentUser(User currentUser) {
        if (currentUser == null || currentUser.getUserId() == null) {
            throw new ResourceNotFoundException("User not found");
        }

        return userProfileRepository.findByUserId(currentUser.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private record RecommendationSignals(
            Set<UUID> interactedVideoIds,
            Set<Integer> preferredCategoryIds
    ) {
    }
}
