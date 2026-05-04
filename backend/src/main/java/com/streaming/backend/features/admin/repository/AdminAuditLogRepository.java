package com.streaming.backend.features.admin.repository;

import com.streaming.backend.domain.AuditLog;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdminAuditLogRepository extends JpaRepository<AuditLog, UUID> {

    @Override
    @EntityGraph(attributePaths = "user")
    List<AuditLog> findAll();

    @EntityGraph(attributePaths = "user")
    Optional<AuditLog> findByLogId(UUID logId);

    @EntityGraph(attributePaths = "user")
    List<AuditLog> findByOrderByCreatedAtDesc(Pageable pageable);
}
