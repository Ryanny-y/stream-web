package com.streaming.backend.features.admin.repository;

import com.streaming.backend.domain.Video;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdminVideoRepository extends JpaRepository<Video, UUID> {

    @Override
    @EntityGraph(attributePaths = {"categories", "uploadedBy"})
    List<Video> findAll();

    @EntityGraph(attributePaths = {"categories", "uploadedBy"})
    Optional<Video> findByVideoId(UUID videoId);

    boolean existsBySlugAndVideoIdNot(String slug, UUID videoId);
}
