package com.streaming.backend.features.admin.repository;

import com.streaming.backend.domain.User;
import com.streaming.backend.domain.enums.RoleName;
import com.streaming.backend.domain.enums.UserStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdminUserRepository extends JpaRepository<User, UUID> {

    @Override
    @EntityGraph(attributePaths = "roles")
    List<User> findAll();

    @EntityGraph(attributePaths = "roles")
    Optional<User> findByUserId(UUID userId);

    boolean existsByUsernameAndUserIdNot(String username, UUID userId);

    boolean existsByEmailAndUserIdNot(String email, UUID userId);

    long countByStatus(UserStatus status);

    long countDistinctByRoles_RoleName(RoleName roleName);

    long countByCreatedAtGreaterThanEqualAndCreatedAtLessThan(
            LocalDateTime start,
            LocalDateTime end
    );
}
