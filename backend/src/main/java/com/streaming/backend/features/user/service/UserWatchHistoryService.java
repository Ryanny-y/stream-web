package com.streaming.backend.features.user.service;

import com.streaming.backend.domain.User;
import com.streaming.backend.features.user.dto.UserDashboardVideoResponse;

import java.util.List;
import java.util.UUID;

public interface UserWatchHistoryService {

    List<UserDashboardVideoResponse> getWatchHistory(User currentUser);

    void removeFromWatchHistory(User currentUser, UUID videoId);

    void clearWatchHistory(User currentUser);
}
