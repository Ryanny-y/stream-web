package com.streaming.backend.features.user.repository;

import com.streaming.backend.domain.Favorite;
import com.streaming.backend.domain.UserVideoId;
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
public interface UserFavoriteRepository extends JpaRepository<Favorite, UserVideoId> {

    @Query("""
            select distinct f
            from Favorite f
            join fetch f.video v
            left join fetch v.categories
            left join fetch v.uploadedBy
            where f.user.userId = :userId
              and v.visibility = :visibility
              and v.status = :status
            order by f.addedAt desc
            """)
    List<Favorite> findUserFavorites(
            @Param("userId") UUID userId,
            @Param("visibility") Visibility visibility,
            @Param("status") VideoStatus status
    );

    Optional<Favorite> findByUser_UserIdAndVideo_VideoId(UUID userId, UUID videoId);

    boolean existsByUser_UserIdAndVideo_VideoId(UUID userId, UUID videoId);
}
