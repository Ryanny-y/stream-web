package com.streaming.backend.features.user.repository;

import com.streaming.backend.domain.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRatingRepository extends JpaRepository<Rating, UUID> {

    Optional<Rating> findByUser_UserIdAndVideo_VideoId(UUID userId, UUID videoId);

    boolean existsByUser_UserIdAndVideo_VideoId(UUID userId, UUID videoId);

    @Query("""
            select distinct r
            from Rating r
            join fetch r.video v
            left join fetch v.categories
            where r.user.userId = :userId
            """)
    List<Rating> findByUserIdWithVideo(
            @Param("userId") UUID userId
    );
}
