package com.streaming.backend.features.user.dto;

import com.streaming.backend.features.guest.dto.PublicVideoResponse;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class FavoriteResponse {

    private PublicVideoResponse video;
    private LocalDateTime addedAt;
}
