package com.streaming.backend.features.user.service;

import com.streaming.backend.domain.User;
import com.streaming.backend.features.user.dto.CommentResponse;
import com.streaming.backend.features.user.dto.CreateCommentRequest;

import java.util.List;
import java.util.UUID;

public interface UserCommentService {

    CommentResponse createComment(User currentUser, UUID videoId, CreateCommentRequest request);

    List<CommentResponse> getVideoComments(UUID videoId);

    void deleteComment(User currentUser, UUID commentId);
}
