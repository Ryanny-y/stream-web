package com.streaming.backend.features.user.repository;

import com.streaming.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserProfileRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
}
