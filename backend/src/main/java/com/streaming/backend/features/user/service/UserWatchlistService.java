package com.streaming.backend.features.user.service;

import com.streaming.backend.domain.User;
import com.streaming.backend.features.user.dto.WatchlistResponse;

import java.util.List;
import java.util.UUID;

public interface UserWatchlistService {

    List<WatchlistResponse> getWatchlist(User currentUser);

    WatchlistResponse addToWatchlist(User currentUser, UUID videoId);

    void removeFromWatchlist(User currentUser, UUID videoId);
}
