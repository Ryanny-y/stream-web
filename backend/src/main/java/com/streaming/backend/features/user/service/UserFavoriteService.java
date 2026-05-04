package com.streaming.backend.features.user.service;

import com.streaming.backend.domain.User;
import com.streaming.backend.features.user.dto.FavoriteResponse;

import java.util.List;
import java.util.UUID;

public interface UserFavoriteService {

    List<FavoriteResponse> getFavorites(User currentUser);

    FavoriteResponse addToFavorites(User currentUser, UUID videoId);

    void removeFromFavorites(User currentUser, UUID videoId);
}
