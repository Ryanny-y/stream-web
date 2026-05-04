package com.streaming.backend.features.user.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class VideoProgressResponse {

    private UUID videoId;
    private Integer watchedSeconds;
    private Integer durationSeconds;
    private Double progressPercentage;
    private Boolean completed;
    private LocalDateTime lastWatchedAt;
}
