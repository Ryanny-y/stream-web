package com.streaming.backend.features.user.controller;

import com.streaming.backend.domain.User;
import com.streaming.backend.features.user.dto.CommentResponse;
import com.streaming.backend.features.user.dto.CreateCommentRequest;
import com.streaming.backend.features.user.service.UserCommentService;
import com.streaming.backend.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RequestMapping
@RestController
@RequiredArgsConstructor
public class UserCommentController {

    private final UserCommentService userCommentService;

    @PostMapping("/api/user/videos/{videoId}/comments")
    public ResponseEntity<CommentResponse> createComment(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID videoId,
            @Valid @RequestBody CreateCommentRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userCommentService.createComment(getCurrentUser(userPrincipal), videoId, request));
    }

    @GetMapping("/api/user/videos/{videoId}/comments")
    public ResponseEntity<List<CommentResponse>> getVideoComments(
            @PathVariable UUID videoId
    ) {
        return ResponseEntity.ok(userCommentService.getVideoComments(videoId));
    }

    @DeleteMapping("/api/user/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID commentId
    ) {
        userCommentService.deleteComment(getCurrentUser(userPrincipal), commentId);

        return ResponseEntity.noContent().build();
    }

    private User getCurrentUser(UserPrincipal userPrincipal) {
        return userPrincipal == null ? null : userPrincipal.getUser();
    }
}
