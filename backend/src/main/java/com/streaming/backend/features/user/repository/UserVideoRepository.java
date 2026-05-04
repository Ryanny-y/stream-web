package com.streaming.backend.features.user.repository;

import com.streaming.backend.domain.Video;
import com.streaming.backend.domain.enums.VideoStatus;
import com.streaming.backend.domain.enums.Visibility;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserVideoRepository extends JpaRepository<Video, UUID> {

    Optional<Video> findByVideoIdAndVisibilityAndStatus(
            UUID videoId,
            Visibility visibility,
            VideoStatus status
    );

    @Query("""
            select distinct v
            from Video v
            left join fetch v.categories
            left join fetch v.uploadedBy
            where v.visibility = :visibility
              and v.status = :status
            """)
    List<Video> findPublicActiveVideos(
            @Param("visibility") Visibility visibility,
            @Param("status") VideoStatus status
    );
}
