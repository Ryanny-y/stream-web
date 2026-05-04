package com.streaming.backend.features.user.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class CommentResponse {

    private UUID commentId;
    private UUID videoId;
    private UUID userId;
    private String username;
    private String profileImage;
    private String commentText;
    private LocalDateTime createdAt;
}
