package com.streaming.backend.features.user.repository;

import com.streaming.backend.domain.UserVideoId;
import com.streaming.backend.domain.Watchlist;
import com.streaming.backend.domain.enums.VideoStatus;
import com.streaming.backend.domain.enums.Visibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserWatchlistRepository extends JpaRepository<Watchlist, UserVideoId> {

    @Query("""
            select distinct w
            from Watchlist w
            join fetch w.video v
            left join fetch v.categories
            left join fetch v.uploadedBy
            where w.user.userId = :userId
              and v.visibility = :visibility
              and v.status = :status
            order by w.addedAt desc
            """)
    List<Watchlist> findUserWatchlist(
            @Param("userId") UUID userId,
            @Param("visibility") Visibility visibility,
            @Param("status") VideoStatus status
    );

    Optional<Watchlist> findByUser_UserIdAndVideo_VideoId(UUID userId, UUID videoId);

    boolean existsByUser_UserIdAndVideo_VideoId(UUID userId, UUID videoId);

    long countByUser_UserId(UUID userId);
}
