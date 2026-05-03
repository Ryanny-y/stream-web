package com.streaming.backend.features.guest.service.impl;

import com.streaming.backend.common.exceptions.ApiException;
import com.streaming.backend.domain.Video;
import com.streaming.backend.domain.enums.VideoStatus;
import com.streaming.backend.domain.enums.Visibility;
import com.streaming.backend.features.guest.dto.PublicVideoResponse;
import com.streaming.backend.features.guest.mapper.GuestVideoMapper;
import com.streaming.backend.features.guest.repository.GuestVideoRepository;
import com.streaming.backend.features.guest.service.GuestVideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GuestVideoServiceImpl implements GuestVideoService {

    private final GuestVideoRepository guestVideoRepository;
    private final GuestVideoMapper guestVideoMapper;

    @Override
    public List<PublicVideoResponse> getVideos() {
        return mapVideos(guestVideoRepository.findByVisibilityAndStatusOrderByCreatedAtDesc(
                Visibility.PUBLIC,
                VideoStatus.ACTIVE
        ));
    }

    @Override
    public PublicVideoResponse getVideo(UUID videoId) {
        Video video = guestVideoRepository.findByVideoIdAndVisibilityAndStatus(
                        videoId,
                        Visibility.PUBLIC,
                        VideoStatus.ACTIVE
                )
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Video not found"));

        return guestVideoMapper.toPublicVideoResponse(video);
    }

    @Override
    public List<PublicVideoResponse> getFeaturedVideos() {
        return mapVideos(guestVideoRepository.findByVisibilityAndStatusAndIsFeaturedTrueOrderByCreatedAtDesc(
                Visibility.PUBLIC,
                VideoStatus.ACTIVE
        ));
    }

    @Override
    public List<PublicVideoResponse> getTrendingVideos() {
        return mapVideos(guestVideoRepository.findByVisibilityAndStatusAndIsTrendingTrueOrderByTotalViewsDescCreatedAtDesc(
                Visibility.PUBLIC,
                VideoStatus.ACTIVE
        ));
    }

    @Override
    public List<PublicVideoResponse> searchVideos(String query) {
        String trimmedQuery = query == null ? "" : query.trim();
        if (trimmedQuery.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Search query is required");
        }

        return mapVideos(guestVideoRepository.searchPublicVideos(
                trimmedQuery,
                Visibility.PUBLIC,
                VideoStatus.ACTIVE
        ));
    }

    private List<PublicVideoResponse> mapVideos(List<Video> videos) {
        return videos.stream()
                .map(guestVideoMapper::toPublicVideoResponse)
                .toList();
    }
}
