package com.streaming.backend.features.user.service;

import com.streaming.backend.domain.User;
import com.streaming.backend.features.user.dto.UserWatchPageResponse;

import java.util.UUID;

public interface UserWatchPageService {

    UserWatchPageResponse getWatchPage(User currentUser, UUID videoId);
}
