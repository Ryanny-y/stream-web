package com.streaming.backend.features.user.service;

import com.streaming.backend.domain.User;
import com.streaming.backend.features.user.dto.RatingRequest;
import com.streaming.backend.features.user.dto.RatingResponse;

import java.util.UUID;

public interface UserRatingService {

    RatingResponse createRating(User currentUser, UUID videoId, RatingRequest request);

    RatingResponse updateRating(User currentUser, UUID videoId, RatingRequest request);

    void deleteRating(User currentUser, UUID videoId);
}
