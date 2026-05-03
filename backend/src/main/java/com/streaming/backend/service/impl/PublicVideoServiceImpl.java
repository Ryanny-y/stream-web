package com.streaming.backend.service.impl;

import com.streaming.backend.common.exceptions.ApiException;
import com.streaming.backend.domain.entities.Video;
import com.streaming.backend.domain.enums.VideoStatus;
import com.streaming.backend.domain.enums.Visibility;
import com.streaming.backend.dto.response.PublicVideoResponse;
import com.streaming.backend.mapper.VideoMapper;
import com.streaming.backend.repositories.VideoRepository;
import com.streaming.backend.service.PublicVideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PublicVideoServiceImpl implements PublicVideoService {

    private final VideoRepository videoRepository;
    private final VideoMapper videoMapper;

    @Override
    public List<PublicVideoResponse> getVideos() {
        return mapVideos(videoRepository.findByVisibilityAndStatusOrderByCreatedAtDesc(
                Visibility.PUBLIC,
                VideoStatus.ACTIVE
        ));
    }

    @Override
    public PublicVideoResponse getVideo(UUID videoId) {
        Video video = videoRepository.findByVideoIdAndVisibilityAndStatus(
                        videoId,
                        Visibility.PUBLIC,
                        VideoStatus.ACTIVE
                )
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Video not found"));

        return videoMapper.toPublicVideoResponse(video);
    }

    @Override
    public List<PublicVideoResponse> getFeaturedVideos() {
        return mapVideos(videoRepository.findByVisibilityAndStatusAndIsFeaturedTrueOrderByCreatedAtDesc(
                Visibility.PUBLIC,
                VideoStatus.ACTIVE
        ));
    }

    @Override
    public List<PublicVideoResponse> getTrendingVideos() {
        return mapVideos(videoRepository.findByVisibilityAndStatusAndIsTrendingTrueOrderByTotalViewsDescCreatedAtDesc(
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

        return mapVideos(videoRepository.searchPublicVideos(
                trimmedQuery,
                Visibility.PUBLIC,
                VideoStatus.ACTIVE
        ));
    }

    private List<PublicVideoResponse> mapVideos(List<Video> videos) {
        return videos.stream()
                .map(videoMapper::toPublicVideoResponse)
                .toList();
    }
}
