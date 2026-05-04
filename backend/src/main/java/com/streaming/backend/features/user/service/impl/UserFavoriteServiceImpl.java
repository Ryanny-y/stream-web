package com.streaming.backend.features.user.service.impl;

import com.streaming.backend.common.exceptions.BadRequestException;
import com.streaming.backend.common.exceptions.ResourceNotFoundException;
import com.streaming.backend.domain.Favorite;
import com.streaming.backend.domain.User;
import com.streaming.backend.domain.UserVideoId;
import com.streaming.backend.domain.Video;
import com.streaming.backend.domain.enums.VideoStatus;
import com.streaming.backend.domain.enums.Visibility;
import com.streaming.backend.features.guest.mapper.GuestVideoMapper;
import com.streaming.backend.features.user.dto.FavoriteResponse;
import com.streaming.backend.features.user.repository.UserFavoriteRepository;
import com.streaming.backend.features.user.repository.UserProfileRepository;
import com.streaming.backend.features.user.repository.UserVideoRepository;
import com.streaming.backend.features.user.service.UserFavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserFavoriteServiceImpl implements UserFavoriteService {

    private final UserProfileRepository userProfileRepository;
    private final UserVideoRepository userVideoRepository;
    private final UserFavoriteRepository userFavoriteRepository;
    private final GuestVideoMapper guestVideoMapper;

    @Override
    @Transactional(readOnly = true)
    public List<FavoriteResponse> getFavorites(User currentUser) {
        User user = findCurrentUser(currentUser);

        return userFavoriteRepository.findUserFavorites(
                        user.getUserId(),
                        Visibility.PUBLIC,
                        VideoStatus.ACTIVE
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public FavoriteResponse addToFavorites(User currentUser, UUID videoId) {
        User user = findCurrentUser(currentUser);
        Video video = findPublicActiveVideo(videoId);

        if (userFavoriteRepository.existsByUser_UserIdAndVideo_VideoId(user.getUserId(), videoId)) {
            throw new BadRequestException("Video is already in favorites");
        }

        Favorite favorite = new Favorite();
        favorite.setId(new UserVideoId(user.getUserId(), video.getVideoId()));
        favorite.setUser(user);
        favorite.setVideo(video);
        favorite.setAddedAt(LocalDateTime.now());

        return toResponse(userFavoriteRepository.save(favorite));
    }

    @Override
    public void removeFromFavorites(User currentUser, UUID videoId) {
        User user = findCurrentUser(currentUser);
        Favorite favorite = userFavoriteRepository
                .findByUser_UserIdAndVideo_VideoId(user.getUserId(), videoId)
                .orElseThrow(() -> new ResourceNotFoundException("Favorite item not found"));

        userFavoriteRepository.delete(favorite);
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

    private FavoriteResponse toResponse(Favorite favorite) {
        return FavoriteResponse.builder()
                .video(guestVideoMapper.toPublicVideoResponse(favorite.getVideo()))
                .addedAt(favorite.getAddedAt())
                .build();
    }
}
