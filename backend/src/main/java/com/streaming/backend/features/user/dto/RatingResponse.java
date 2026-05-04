package com.streaming.backend.features.user.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class RatingResponse {

    private UUID ratingId;
    private UUID videoId;
    private Integer rating;
    private LocalDateTime createdAt;
}
