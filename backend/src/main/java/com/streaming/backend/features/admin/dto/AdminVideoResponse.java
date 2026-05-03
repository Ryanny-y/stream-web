package com.streaming.backend.features.admin.dto;

import com.streaming.backend.domain.enums.VideoStatus;
import com.streaming.backend.domain.enums.Visibility;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Builder
public class AdminVideoResponse {

    private UUID videoId;
    private String title;
    private String description;
    private String slug;
    private String filePath;
    private String thumbnailPath;
    private Integer durationSeconds;
    private Long fileSize;
    private LocalDate releaseDate;
    private Visibility visibility;
    private VideoStatus status;
    private Boolean featured;
    private Boolean trending;
    private Long totalViews;
    private String uploadedBy;
    private List<String> categories;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
