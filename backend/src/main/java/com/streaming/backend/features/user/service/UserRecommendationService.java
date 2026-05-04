package com.streaming.backend.features.user.service;

import com.streaming.backend.domain.User;
import com.streaming.backend.features.guest.dto.PublicVideoResponse;

import java.util.List;

public interface UserRecommendationService {

    List<PublicVideoResponse> getRecommendations(User currentUser);
}
