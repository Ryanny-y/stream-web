package com.streaming.backend.features.user.repository;

import com.streaming.backend.domain.WatchHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserWatchHistoryRepository extends JpaRepository<WatchHistory, UUID> {

    Optional<WatchHistory> findByUser_UserIdAndVideo_VideoId(UUID userId, UUID videoId);
}
