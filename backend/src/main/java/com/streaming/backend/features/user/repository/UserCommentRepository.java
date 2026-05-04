package com.streaming.backend.features.user.repository;

import com.streaming.backend.domain.Comment;
import com.streaming.backend.domain.enums.VideoStatus;
import com.streaming.backend.domain.enums.Visibility;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserCommentRepository extends JpaRepository<Comment, UUID> {

    @EntityGraph(attributePaths = "user")
    @Query("""
            select c
            from Comment c
            where c.video.videoId = :videoId
              and c.video.visibility = :visibility
              and c.video.status = :status
            order by c.createdAt desc
            """)
    List<Comment> findVideoComments(
            @Param("videoId") UUID videoId,
            @Param("visibility") Visibility visibility,
            @Param("status") VideoStatus status
    );

    @EntityGraph(attributePaths = {"user", "video"})
    Optional<Comment> findByCommentId(UUID commentId);
}
