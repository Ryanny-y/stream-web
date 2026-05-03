package com.streaming.backend.mapper;

import com.streaming.backend.domain.entities.Role;
import com.streaming.backend.domain.entities.User;
import com.streaming.backend.dto.requests.RegisterRequest;
import com.streaming.backend.dto.response.AuthResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface AuthMapper {

    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "profileImage", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "emailVerified", ignore = true)
    @Mapping(target = "failedAttempts", ignore = true)
    @Mapping(target = "lockedUntil", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "uploadedVideos", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "watchHistories", ignore = true)
    User toUser(RegisterRequest request);

    default AuthResponse toAuthResponse(User user, String accessToken) {
        return AuthResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(buildFullName(user))
                .roles(mapRoles(user.getRoles()))
                .accessToken(accessToken)
                .build();
    }

    default Set<String> mapRoles(Set<Role> roles) {
        return roles.stream()
                .map(role -> role.getRoleName().name())
                .collect(Collectors.toSet());
    }

    default String buildFullName(User user) {
        String firstName = user.getFirstName() == null ? "" : user.getFirstName();
        String lastName = user.getLastName() == null ? "" : user.getLastName();

        String fullName = (firstName + " " + lastName).trim();

        return fullName.isBlank() ? user.getUsername() : fullName;
    }
}