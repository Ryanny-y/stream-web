package com.streaming.backend.features.user.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Builder
public class UserDashboardVideoResponse {

    private UUID videoId;
    private String title;
    private String description;
    private String slug;
    private String filePath;
    private String thumbnailPath;
    private Integer durationSeconds;
    private Long totalViews;
    private Double rating;
    private List<String> categories;
    private Integer watchedSeconds;
    private Double progressPercentage;
    private LocalDateTime lastWatchedAt;
    private LocalDateTime addedAt;
}
