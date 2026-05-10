package com.streaming.backend.features.admin.service;

import com.streaming.backend.domain.User;
import com.streaming.backend.features.admin.dto.AdminVideoResponse;
import com.streaming.backend.features.admin.dto.CreateVideoRequest;
import com.streaming.backend.features.admin.dto.UpdateVideoRequest;
import com.streaming.backend.features.admin.dto.UpdateVideoStatusRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface AdminVideoService {

    List<AdminVideoResponse> getVideos();

    AdminVideoResponse createVideo(CreateVideoRequest request, User uploadedBy);

    AdminVideoResponse updateVideo(UUID videoId, UpdateVideoRequest request);

    void deleteVideo(UUID videoId);

    AdminVideoResponse updateVideoStatus(UUID videoId, UpdateVideoStatusRequest request);

    AdminVideoResponse uploadThumbnail(UUID videoId, MultipartFile file);

    AdminVideoResponse uploadVideoFile(UUID videoId, MultipartFile file);
}
