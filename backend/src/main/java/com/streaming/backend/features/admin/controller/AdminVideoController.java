package com.streaming.backend.features.admin.controller;

import com.streaming.backend.domain.User;
import com.streaming.backend.features.admin.dto.AdminVideoResponse;
import com.streaming.backend.features.admin.dto.CreateVideoRequest;
import com.streaming.backend.features.admin.dto.UpdateVideoRequest;
import com.streaming.backend.features.admin.dto.UpdateVideoStatusRequest;
import com.streaming.backend.features.admin.service.AdminVideoService;
import com.streaming.backend.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/videos")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminVideoController {

    private final AdminVideoService adminVideoService;

    @PostMapping
    public ResponseEntity<AdminVideoResponse> createVideo(
            @Valid @RequestBody CreateVideoRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        User uploadedBy = userPrincipal == null ? null : userPrincipal.getUser();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(adminVideoService.createVideo(request, uploadedBy));
    }

    @PutMapping("/{videoId}")
    public ResponseEntity<AdminVideoResponse> updateVideo(
            @PathVariable UUID videoId,
            @Valid @RequestBody UpdateVideoRequest request
    ) {
        return ResponseEntity.ok(adminVideoService.updateVideo(videoId, request));
    }

    @DeleteMapping("/{videoId}")
    public ResponseEntity<Void> deleteVideo(
            @PathVariable UUID videoId
    ) {
        adminVideoService.deleteVideo(videoId);

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{videoId}/status")
    public ResponseEntity<AdminVideoResponse> updateVideoStatus(
            @PathVariable UUID videoId,
            @Valid @RequestBody UpdateVideoStatusRequest request
    ) {
        return ResponseEntity.ok(adminVideoService.updateVideoStatus(videoId, request));
    }

    @PostMapping(
            value = "/{videoId}/thumbnail",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<AdminVideoResponse> uploadThumbnail(
            @PathVariable UUID videoId,
            @RequestParam("file") MultipartFile file
    ) {
        return ResponseEntity.ok(adminVideoService.uploadThumbnail(videoId, file));
    }

    @PostMapping(
            value = "/{videoId}/file",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<AdminVideoResponse> uploadVideoFile(
            @PathVariable UUID videoId,
            @RequestParam("file") MultipartFile file
    ) {
        return ResponseEntity.ok(adminVideoService.uploadVideoFile(videoId, file));
    }
}
