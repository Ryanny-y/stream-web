package com.streaming.backend.features.user.service.impl;

import com.streaming.backend.common.exceptions.BadRequestException;
import com.streaming.backend.common.exceptions.ResourceNotFoundException;
import com.streaming.backend.domain.User;
import com.streaming.backend.domain.UserVideoId;
import com.streaming.backend.domain.Video;
import com.streaming.backend.domain.Watchlist;
import com.streaming.backend.domain.enums.VideoStatus;
import com.streaming.backend.domain.enums.Visibility;
import com.streaming.backend.features.guest.mapper.GuestVideoMapper;
import com.streaming.backend.features.user.dto.WatchlistResponse;
import com.streaming.backend.features.user.repository.UserProfileRepository;
import com.streaming.backend.features.user.repository.UserVideoRepository;
import com.streaming.backend.features.user.repository.UserWatchlistRepository;
import com.streaming.backend.features.user.service.UserWatchlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserWatchlistServiceImpl implements UserWatchlistService {

    private final UserProfileRepository userProfileRepository;
    private final UserVideoRepository userVideoRepository;
    private final UserWatchlistRepository userWatchlistRepository;
    private final GuestVideoMapper guestVideoMapper;

    @Override
    @Transactional(readOnly = true)
    public List<WatchlistResponse> getWatchlist(User currentUser) {
        User user = findCurrentUser(currentUser);

        return userWatchlistRepository.findUserWatchlist(
                        user.getUserId(),
                        Visibility.PUBLIC,
                        VideoStatus.ACTIVE
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public WatchlistResponse addToWatchlist(User currentUser, UUID videoId) {
        User user = findCurrentUser(currentUser);
        Video video = findPublicActiveVideo(videoId);

        if (userWatchlistRepository.existsByUser_UserIdAndVideo_VideoId(user.getUserId(), videoId)) {
            throw new BadRequestException("Video is already in watchlist");
        }

        Watchlist watchlist = new Watchlist();
        watchlist.setId(new UserVideoId(user.getUserId(), video.getVideoId()));
        watchlist.setUser(user);
        watchlist.setVideo(video);
        watchlist.setAddedAt(LocalDateTime.now());

        return toResponse(userWatchlistRepository.save(watchlist));
    }

    @Override
    public void removeFromWatchlist(User currentUser, UUID videoId) {
        User user = findCurrentUser(currentUser);
        Watchlist watchlist = userWatchlistRepository
                .findByUser_UserIdAndVideo_VideoId(user.getUserId(), videoId)
                .orElseThrow(() -> new ResourceNotFoundException("Watchlist item not found"));

        userWatchlistRepository.delete(watchlist);
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

    private WatchlistResponse toResponse(Watchlist watchlist) {
        return WatchlistResponse.builder()
                .video(guestVideoMapper.toPublicVideoResponse(watchlist.getVideo()))
                .addedAt(watchlist.getAddedAt())
                .build();
    }
}
