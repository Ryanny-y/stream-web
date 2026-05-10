package com.streaming.backend.features.user.repository;

import com.streaming.backend.domain.WatchHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserWatchHistoryRepository extends JpaRepository<WatchHistory, UUID> {

    Optional<WatchHistory> findByUser_UserIdAndVideo_VideoId(UUID userId, UUID videoId);

    @Query("""
            select distinct h
            from WatchHistory h
            join fetch h.video v
            left join fetch v.categories
            where h.user.userId = :userId
            """)
    List<WatchHistory> findByUserIdWithVideo(
            @Param("userId") UUID userId
    );

    long countByUser_UserId(UUID userId);

    @Modifying
    long deleteByUser_UserIdAndVideo_VideoId(UUID userId, UUID videoId);

    @Modifying
    long deleteByUser_UserId(UUID userId);
}
