package com.streaming.backend.features.user.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RatingSummaryResponse {

    private Double averageRating;
    private Long totalRatings;
    private Integer userRating;
}
