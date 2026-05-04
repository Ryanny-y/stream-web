package com.streaming.backend.features.user.mapper;

import com.streaming.backend.domain.Role;
import com.streaming.backend.domain.User;
import com.streaming.backend.features.user.dto.UpdateProfileRequest;
import com.streaming.backend.features.user.dto.UserProfileResponse;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {

    default UserProfileResponse toUserProfileResponse(User user) {
        return UserProfileResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(buildFullName(user))
                .phone(user.getPhone())
                .profileImage(user.getProfileImage())
                .status(user.getStatus())
                .emailVerified(user.getEmailVerified())
                .roles(mapRoles(user.getRoles()))
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "emailVerified", ignore = true)
    @Mapping(target = "failedAttempts", ignore = true)
    @Mapping(target = "lockedUntil", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "uploadedVideos", ignore = true)
    @Mapping(target = "watchHistories", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateUserFromRequest(UpdateProfileRequest request, @MappingTarget User user);

    default Set<String> mapRoles(Set<Role> roles) {
        if (roles == null) {
            return Set.of();
        }

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
