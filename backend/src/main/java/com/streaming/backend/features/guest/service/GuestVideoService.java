package com.streaming.backend.features.guest.service;

import com.streaming.backend.features.guest.dto.PublicVideoResponse;

import java.util.List;
import java.util.UUID;

public interface GuestVideoService {

    List<PublicVideoResponse> getVideos();

    PublicVideoResponse getVideo(UUID videoId);

    List<PublicVideoResponse> getFeaturedVideos();

    List<PublicVideoResponse> getTrendingVideos();

    List<PublicVideoResponse> searchVideos(String query);
}
