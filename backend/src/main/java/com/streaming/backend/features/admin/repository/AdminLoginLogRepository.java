package com.streaming.backend.features.admin.repository;

import com.streaming.backend.domain.LoginLog;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AdminLoginLogRepository extends JpaRepository<LoginLog, UUID> {

    @Override
    @EntityGraph(attributePaths = "user")
    List<LoginLog> findAll();
}
