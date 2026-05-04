package com.streaming.backend.features.user.repository;

import com.streaming.backend.domain.Video;
import com.streaming.backend.domain.enums.VideoStatus;
import com.streaming.backend.domain.enums.Visibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserVideoRepository extends JpaRepository<Video, UUID> {

    Optional<Video> findByVideoIdAndVisibilityAndStatus(
            UUID videoId,
            Visibility visibility,
            VideoStatus status
    );
}
