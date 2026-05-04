package com.streaming.backend.features.user.service.impl;

import com.streaming.backend.common.exceptions.BadRequestException;
import com.streaming.backend.common.exceptions.ResourceNotFoundException;
import com.streaming.backend.domain.Rating;
import com.streaming.backend.domain.User;
import com.streaming.backend.domain.Video;
import com.streaming.backend.domain.enums.VideoStatus;
import com.streaming.backend.domain.enums.Visibility;
import com.streaming.backend.features.user.dto.RatingRequest;
import com.streaming.backend.features.user.dto.RatingResponse;
import com.streaming.backend.features.user.repository.UserProfileRepository;
import com.streaming.backend.features.user.repository.UserRatingRepository;
import com.streaming.backend.features.user.repository.UserVideoRepository;
import com.streaming.backend.features.user.service.UserRatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserRatingServiceImpl implements UserRatingService {

    private final UserProfileRepository userProfileRepository;
    private final UserVideoRepository userVideoRepository;
    private final UserRatingRepository userRatingRepository;

    @Override
    public RatingResponse createRating(User currentUser, UUID videoId, RatingRequest request) {
        User user = findCurrentUser(currentUser);
        Video video = findPublicActiveVideo(videoId);

        if (userRatingRepository.existsByUser_UserIdAndVideo_VideoId(user.getUserId(), videoId)) {
            throw new BadRequestException("Video is already rated by this user");
        }

        Rating rating = new Rating();
        rating.setUser(user);
        rating.setVideo(video);
        rating.setRating(request.getRating());

        return toResponse(userRatingRepository.save(rating));
    }

    @Override
    public RatingResponse updateRating(User currentUser, UUID videoId, RatingRequest request) {
        User user = findCurrentUser(currentUser);
        findPublicActiveVideo(videoId);

        Rating rating = userRatingRepository.findByUser_UserIdAndVideo_VideoId(user.getUserId(), videoId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found"));
        rating.setRating(request.getRating());

        return toResponse(userRatingRepository.save(rating));
    }

    @Override
    public void deleteRating(User currentUser, UUID videoId) {
        User user = findCurrentUser(currentUser);
        Rating rating = userRatingRepository.findByUser_UserIdAndVideo_VideoId(user.getUserId(), videoId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found"));

        userRatingRepository.delete(rating);
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

    private RatingResponse toResponse(Rating rating) {
        return RatingResponse.builder()
                .ratingId(rating.getRatingId())
                .videoId(rating.getVideo().getVideoId())
                .rating(rating.getRating())
                .createdAt(rating.getCreatedAt())
                .build();
    }
}
