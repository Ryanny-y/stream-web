package com.streaming.backend.features.user.service;

import com.streaming.backend.domain.User;
import com.streaming.backend.features.user.dto.RecordVideoViewRequest;
import com.streaming.backend.features.user.dto.VideoProgressResponse;

import java.util.UUID;

public interface UserVideoService {

    VideoProgressResponse recordView(User currentUser, UUID videoId, RecordVideoViewRequest request);

    VideoProgressResponse getProgress(User currentUser, UUID videoId);
}
