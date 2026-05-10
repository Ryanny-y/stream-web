package com.streaming.backend.features.user.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class UserWatchPageResponse {

    private UserDashboardVideoResponse video;
    private VideoProgressResponse progress;
    private List<UserDashboardVideoResponse> suggestedVideos;
}
