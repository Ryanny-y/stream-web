package com.streaming.backend.service;

import com.streaming.backend.dto.response.PublicVideoResponse;

import java.util.List;
import java.util.UUID;

public interface PublicVideoService {

    List<PublicVideoResponse> getVideos();

    PublicVideoResponse getVideo(UUID videoId);

    List<PublicVideoResponse> getFeaturedVideos();

    List<PublicVideoResponse> getTrendingVideos();

    List<PublicVideoResponse> searchVideos(String query);
}
