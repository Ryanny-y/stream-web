package com.streaming.backend.features.admin.service.impl;

import com.streaming.backend.common.exceptions.BadRequestException;
import com.streaming.backend.common.exceptions.ResourceNotFoundException;
import com.streaming.backend.domain.Category;
import com.streaming.backend.domain.User;
import com.streaming.backend.domain.Video;
import com.streaming.backend.domain.enums.VideoStatus;
import com.streaming.backend.domain.enums.Visibility;
import com.streaming.backend.features.admin.dto.AdminVideoResponse;
import com.streaming.backend.features.admin.dto.CreateVideoRequest;
import com.streaming.backend.features.admin.dto.UpdateVideoRequest;
import com.streaming.backend.features.admin.dto.UpdateVideoStatusRequest;
import com.streaming.backend.features.admin.mapper.AdminVideoMapper;
import com.streaming.backend.features.admin.repository.AdminCategoryRepository;
import com.streaming.backend.features.admin.repository.AdminVideoRepository;
import com.streaming.backend.features.admin.service.AdminLogService;
import com.streaming.backend.features.admin.service.AdminVideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminVideoServiceImpl implements AdminVideoService {

    private static final String VIDEO_UPLOAD_DIR = "upload/videos";
    private static final String IMAGE_UPLOAD_DIR = "upload/images";

    private final AdminVideoRepository adminVideoRepository;
    private final AdminCategoryRepository adminCategoryRepository;
    private final AdminVideoMapper adminVideoMapper;
    private final AdminLogService adminLogService;

    @Override
    public AdminVideoResponse createVideo(CreateVideoRequest request, User uploadedBy) {
        validateUniqueSlug(null, request.getSlug());

        Video video = adminVideoMapper.toVideo(request);
        video.setFilePath("");
        video.setStatus(VideoStatus.ACTIVE);
        video.setVisibility(request.getVisibility() == null ? Visibility.PUBLIC : request.getVisibility());
        video.setIsFeatured(Boolean.TRUE.equals(request.getFeatured()));
        video.setIsTrending(Boolean.TRUE.equals(request.getTrending()));
        video.setTotalViews(0L);
        video.setUploadedBy(uploadedBy);
        video.setCategories(findCategories(request.getCategoryIds()));
        AdminVideoResponse response = adminVideoMapper.toAdminVideoResponse(adminVideoRepository.save(video));

        adminLogService.createAuditLog("CREATE", "Video", response.getVideoId().toString(), null, response);

        return response;
    }

    @Override
    public AdminVideoResponse updateVideo(UUID videoId, UpdateVideoRequest request) {
        Video video = findVideo(videoId);
        validateUniqueSlug(videoId, request.getSlug());
        AdminVideoResponse oldValue = adminVideoMapper.toAdminVideoResponse(video);

        adminVideoMapper.updateVideoFromRequest(request, video);
        if (request.getCategoryIds() != null) {
            video.setCategories(findCategories(request.getCategoryIds()));
        }
        AdminVideoResponse response = adminVideoMapper.toAdminVideoResponse(adminVideoRepository.save(video));

        adminLogService.createAuditLog("UPDATE", "Video", videoId.toString(), oldValue, response);

        return response;
    }

    @Override
    public void deleteVideo(UUID videoId) {
        Video video = findVideo(videoId);
        AdminVideoResponse oldValue = adminVideoMapper.toAdminVideoResponse(video);

        adminVideoRepository.delete(video);
        deleteStoredFile(video.getFilePath());
        deleteStoredFile(video.getThumbnailPath());

        adminLogService.createAuditLog("DELETE", "Video", videoId.toString(), oldValue, null);
    }

    @Override
    public AdminVideoResponse updateVideoStatus(UUID videoId, UpdateVideoStatusRequest request) {
        Video video = findVideo(videoId);
        AdminVideoResponse oldValue = adminVideoMapper.toAdminVideoResponse(video);

        video.setStatus(request.getStatus());
        AdminVideoResponse response = adminVideoMapper.toAdminVideoResponse(adminVideoRepository.save(video));

        adminLogService.createAuditLog("UPDATE_STATUS", "Video", videoId.toString(), oldValue, response);

        return response;
    }

    @Override
    public AdminVideoResponse uploadThumbnail(UUID videoId, MultipartFile file) {
        Video video = findVideo(videoId);
        AdminVideoResponse oldValue = adminVideoMapper.toAdminVideoResponse(video);

        String filename = storeFile(file, IMAGE_UPLOAD_DIR);
        video.setThumbnailPath(buildPublicFileUrl("images", filename));
        AdminVideoResponse response = adminVideoMapper.toAdminVideoResponse(adminVideoRepository.save(video));

        adminLogService.createAuditLog("UPDATE_THUMBNAIL", "Video", videoId.toString(), oldValue, response);

        return response;
    }

    @Override
    public AdminVideoResponse uploadVideoFile(UUID videoId, MultipartFile file) {
        Video video = findVideo(videoId);
        AdminVideoResponse oldValue = adminVideoMapper.toAdminVideoResponse(video);

        String filename = storeFile(file, VIDEO_UPLOAD_DIR);
        video.setFilePath(buildPublicFileUrl("videos", filename));
        video.setFileSize(file.getSize());
        AdminVideoResponse response = adminVideoMapper.toAdminVideoResponse(adminVideoRepository.save(video));

        adminLogService.createAuditLog("UPDATE_FILE", "Video", videoId.toString(), oldValue, response);

        return response;
    }

    private Video findVideo(UUID videoId) {
        return adminVideoRepository.findByVideoId(videoId)
                .orElseThrow(() -> new ResourceNotFoundException("Video not found"));
    }

    private Set<Category> findCategories(Set<Integer> categoryIds) {
        if (categoryIds == null || categoryIds.isEmpty()) {
            return new HashSet<>();
        }

        Set<Category> categories = new HashSet<>(adminCategoryRepository.findAllById(categoryIds));
        if (categories.size() != categoryIds.size()) {
            throw new ResourceNotFoundException("One or more categories were not found");
        }

        return categories;
    }

    private void validateUniqueSlug(UUID videoId, String slug) {
        if (slug == null || slug.isBlank()) {
            return;
        }

        UUID excludedVideoId = videoId == null ? new UUID(0L, 0L) : videoId;
        if (adminVideoRepository.existsBySlugAndVideoIdNot(slug, excludedVideoId)) {
            throw new BadRequestException("Slug is already taken");
        }
    }

    private String storeFile(MultipartFile file, String uploadDir) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is required");
        }

        String originalFilename = StringUtils.cleanPath(
                file.getOriginalFilename() == null ? "upload" : file.getOriginalFilename()
        );
        String safeFilename = UUID.randomUUID() + "-" + originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Path targetPath = uploadPath.resolve(safeFilename).normalize();

        if (!targetPath.startsWith(uploadPath)) {
            throw new BadRequestException("Invalid file name");
        }

        try {
            Files.createDirectories(uploadPath);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new BadRequestException("Could not store file");
        }

        return safeFilename;
    }

    private String buildPublicFileUrl(String resourcePath, String filename) {
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/")
                .path(resourcePath)
                .path("/")
                .path(filename)
                .toUriString();
    }

    private void deleteStoredFile(String filePath) {
        if (filePath == null || filePath.isBlank()) {
            return;
        }

        String uploadRelativePath = toUploadRelativePath(filePath);
        if (uploadRelativePath == null) {
            return;
        }

        Path rootPath = Paths.get("").toAbsolutePath().normalize();
        Path targetPath = rootPath.resolve(uploadRelativePath).normalize();
        Path uploadPath = rootPath.resolve("upload").normalize();

        if (!targetPath.startsWith(uploadPath)) {
            return;
        }

        try {
            Files.deleteIfExists(targetPath);
        } catch (IOException ex) {
            throw new BadRequestException("Could not delete stored file");
        }
    }

    private String toUploadRelativePath(String filePath) {
        if (filePath.startsWith("upload/")) {
            return filePath;
        }

        try {
            URI uri = new URI(filePath);
            String path = uri.getPath();
            if (path == null) {
                return null;
            }

            if (path.startsWith("/videos/")) {
                return VIDEO_UPLOAD_DIR + "/" + path.substring("/videos/".length());
            }

            if (path.startsWith("/images/")) {
                return IMAGE_UPLOAD_DIR + "/" + path.substring("/images/".length());
            }
        } catch (URISyntaxException ex) {
            return null;
        }

        return null;
    }
}
