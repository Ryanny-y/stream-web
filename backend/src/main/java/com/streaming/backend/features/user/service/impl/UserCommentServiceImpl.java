package com.streaming.backend.features.user.service.impl;

import com.streaming.backend.common.exceptions.ApiException;
import com.streaming.backend.common.exceptions.ResourceNotFoundException;
import com.streaming.backend.domain.Comment;
import com.streaming.backend.domain.User;
import com.streaming.backend.domain.Video;
import com.streaming.backend.domain.enums.VideoStatus;
import com.streaming.backend.domain.enums.Visibility;
import com.streaming.backend.features.user.dto.CommentResponse;
import com.streaming.backend.features.user.dto.CreateCommentRequest;
import com.streaming.backend.features.user.repository.UserCommentRepository;
import com.streaming.backend.features.user.repository.UserProfileRepository;
import com.streaming.backend.features.user.repository.UserVideoRepository;
import com.streaming.backend.features.user.service.UserCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserCommentServiceImpl implements UserCommentService {

    private final UserProfileRepository userProfileRepository;
    private final UserVideoRepository userVideoRepository;
    private final UserCommentRepository userCommentRepository;

    @Override
    public CommentResponse createComment(User currentUser, UUID videoId, CreateCommentRequest request) {
        User user = findCurrentUser(currentUser);
        Video video = findPublicActiveVideo(videoId);

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setVideo(video);
        comment.setCommentText(request.getCommentText());

        return toResponse(userCommentRepository.save(comment));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> getVideoComments(UUID videoId) {
        findPublicActiveVideo(videoId);

        return userCommentRepository.findVideoComments(
                        videoId,
                        Visibility.PUBLIC,
                        VideoStatus.ACTIVE
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public void deleteComment(User currentUser, UUID commentId) {
        User user = findCurrentUser(currentUser);
        Comment comment = userCommentRepository.findByCommentId(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (comment.getUser() == null || !user.getUserId().equals(comment.getUser().getUserId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You can only delete your own comments");
        }

        userCommentRepository.delete(comment);
    }

    private User findCurrentUser(User currentUser) {
        if (currentUser == null || currentUser.getUserId() == null) {
            throw new ResourceNotFoundException("User not found");
        }

        return userProfileRepository.findByUserId(currentUser.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Video findPublicActiveVideo(UUID videoId) {
        return userVideoRepository.findByVideoIdAndVisibilityAndStatus(
                        videoId,
                        Visibility.PUBLIC,
                        VideoStatus.ACTIVE
                )
                .orElseThrow(() -> new ResourceNotFoundException("Video not found"));
    }

    private CommentResponse toResponse(Comment comment) {
        User user = comment.getUser();

        return CommentResponse.builder()
                .commentId(comment.getCommentId())
                .videoId(comment.getVideo().getVideoId())
                .userId(user == null ? null : user.getUserId())
                .username(user == null ? null : user.getUsername())
                .profileImage(user == null ? null : user.getProfileImage())
                .commentText(comment.getCommentText())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
