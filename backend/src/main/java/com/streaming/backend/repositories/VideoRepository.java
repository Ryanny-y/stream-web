package com.streaming.backend.repositories;

import com.streaming.backend.domain.entities.Video;
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
public interface VideoRepository extends JpaRepository<Video, UUID> {

    @EntityGraph(attributePaths = {"categories", "uploadedBy"})
    @Query("""
            select distinct v
            from Video v
            where v.visibility = :visibility
              and v.status = :status
            order by v.createdAt desc
            """)
    List<Video> findByVisibilityAndStatusOrderByCreatedAtDesc(
            @Param("visibility") Visibility visibility,
            @Param("status") VideoStatus status
    );

    @EntityGraph(attributePaths = {"categories", "uploadedBy"})
    @Query("""
            select distinct v
            from Video v
            where v.videoId = :videoId
              and v.visibility = :visibility
              and v.status = :status
            """)
    Optional<Video> findByVideoIdAndVisibilityAndStatus(
            @Param("videoId") UUID videoId,
            @Param("visibility") Visibility visibility,
            @Param("status") VideoStatus status
    );

    @EntityGraph(attributePaths = {"categories", "uploadedBy"})
    @Query("""
            select distinct v
            from Video v
            where v.visibility = :visibility
              and v.status = :status
              and v.isFeatured = true
            order by v.createdAt desc
            """)
    List<Video> findByVisibilityAndStatusAndIsFeaturedTrueOrderByCreatedAtDesc(
            @Param("visibility") Visibility visibility,
            @Param("status") VideoStatus status
    );

    @EntityGraph(attributePaths = {"categories", "uploadedBy"})
    @Query("""
            select distinct v
            from Video v
            where v.visibility = :visibility
              and v.status = :status
              and v.isTrending = true
            order by v.totalViews desc, v.createdAt desc
            """)
    List<Video> findByVisibilityAndStatusAndIsTrendingTrueOrderByTotalViewsDescCreatedAtDesc(
            @Param("visibility") Visibility visibility,
            @Param("status") VideoStatus status
    );
}
