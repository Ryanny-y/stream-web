package com.streaming.backend.features.admin.service;

import com.streaming.backend.features.admin.dto.AdminUserResponse;
import com.streaming.backend.features.admin.dto.AdminUserStatusResponse;
import com.streaming.backend.features.admin.dto.UpdateUserRequest;
import com.streaming.backend.features.admin.dto.UpdateUserRolesRequest;
import com.streaming.backend.features.admin.dto.UpdateUserStatusRequest;

import java.util.List;
import java.util.UUID;

public interface AdminUserService {

    List<AdminUserResponse> getUsers();

    AdminUserStatusResponse getUserStatus();

    AdminUserResponse getUser(UUID userId);

    AdminUserResponse updateUser(UUID userId, UpdateUserRequest request);

    AdminUserResponse updateUserRoles(UUID userId, UpdateUserRolesRequest request);

    AdminUserResponse updateUserStatus(UUID userId, UpdateUserStatusRequest request);

    void deleteUser(UUID userId);
}
