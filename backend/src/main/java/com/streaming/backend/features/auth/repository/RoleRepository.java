package com.streaming.backend.features.auth.repository;

import com.streaming.backend.domain.Role;
import com.streaming.backend.domain.enums.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {

    Optional<Role> findByRoleName(RoleName roleName);
}