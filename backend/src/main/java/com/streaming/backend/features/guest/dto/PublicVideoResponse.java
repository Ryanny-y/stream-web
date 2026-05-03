package com.streaming.backend.features.guest.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Builder
public class PublicVideoResponse {

    private UUID videoId;
    private String title;
    private String description;
    private String slug;
    private String filePath;
    private String thumbnailPath;
    private Integer durationSeconds;
    private LocalDate releaseDate;
    private Boolean featured;
    private Boolean trending;
    private Long totalViews;
    private String uploadedBy;
    private List<String> categories;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
