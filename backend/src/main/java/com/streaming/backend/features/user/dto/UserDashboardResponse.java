package com.streaming.backend.features.user.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class UserDashboardResponse {

    private UserDashboardVideoResponse featuredVideo;
    private List<UserDashboardVideoResponse> continueWatching;
    private List<UserDashboardVideoResponse> recommendedVideos;
    private List<UserDashboardVideoResponse> watchHistory;
    private List<UserDashboardVideoResponse> watchlist;
    private List<UserDashboardVideoResponse> trendingVideos;
}
