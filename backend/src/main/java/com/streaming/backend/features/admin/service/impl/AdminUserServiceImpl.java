package com.streaming.backend.features.admin.service.impl;

import com.streaming.backend.common.exceptions.BadRequestException;
import com.streaming.backend.common.exceptions.ResourceNotFoundException;
import com.streaming.backend.domain.Role;
import com.streaming.backend.domain.User;
import com.streaming.backend.domain.enums.RoleName;
import com.streaming.backend.features.admin.dto.AdminUserResponse;
import com.streaming.backend.features.admin.dto.UpdateUserRequest;
import com.streaming.backend.features.admin.dto.UpdateUserRolesRequest;
import com.streaming.backend.features.admin.dto.UpdateUserStatusRequest;
import com.streaming.backend.features.admin.mapper.AdminUserMapper;
import com.streaming.backend.features.admin.repository.AdminUserRepository;
import com.streaming.backend.features.admin.service.AdminLogService;
import com.streaming.backend.features.admin.service.AdminUserService;
import com.streaming.backend.features.auth.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminUserServiceImpl implements AdminUserService {

    private final AdminUserRepository adminUserRepository;
    private final RoleRepository roleRepository;
    private final AdminUserMapper adminUserMapper;
    private final AdminLogService adminLogService;

    @Override
    @Transactional(readOnly = true)
    public List<AdminUserResponse> getUsers() {
        return adminUserRepository.findAll().stream()
                .sorted(Comparator.comparing(User::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(adminUserMapper::toAdminUserResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AdminUserResponse getUser(UUID userId) {
        return adminUserMapper.toAdminUserResponse(findUser(userId));
    }

    @Override
    public AdminUserResponse updateUser(UUID userId, UpdateUserRequest request) {
        User user = findUser(userId);
        validateUniqueUsername(userId, request.getUsername());
        validateUniqueEmail(userId, request.getEmail());
        AdminUserResponse oldValue = adminUserMapper.toAdminUserResponse(user);

        adminUserMapper.updateUserFromRequest(request, user);
        AdminUserResponse response = adminUserMapper.toAdminUserResponse(adminUserRepository.save(user));

        adminLogService.createAuditLog("UPDATE", "User", userId.toString(), oldValue, response);

        return response;
    }

    @Override
    public AdminUserResponse updateUserRoles(UUID userId, UpdateUserRolesRequest request) {
        User user = findUser(userId);
        AdminUserResponse oldValue = adminUserMapper.toAdminUserResponse(user);
        Set<Role> roles = request.getRoles().stream()
                .map(this::findRole)
                .collect(Collectors.toSet());

        user.setRoles(roles);
        AdminUserResponse response = adminUserMapper.toAdminUserResponse(adminUserRepository.save(user));

        adminLogService.createAuditLog("UPDATE_ROLES", "User", userId.toString(), oldValue, response);

        return response;
    }

    @Override
    public AdminUserResponse updateUserStatus(UUID userId, UpdateUserStatusRequest request) {
        User user = findUser(userId);
        AdminUserResponse oldValue = adminUserMapper.toAdminUserResponse(user);

        user.setStatus(request.getStatus());
        AdminUserResponse response = adminUserMapper.toAdminUserResponse(adminUserRepository.save(user));

        adminLogService.createAuditLog("UPDATE_STATUS", "User", userId.toString(), oldValue, response);

        return response;
    }

    @Override
    public void deleteUser(UUID userId) {
        User user = findUser(userId);
        AdminUserResponse oldValue = adminUserMapper.toAdminUserResponse(user);

        adminUserRepository.delete(user);

        adminLogService.createAuditLog("DELETE", "User", userId.toString(), oldValue, null);
    }

    private User findUser(UUID userId) {
        return adminUserRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Role findRole(RoleName roleName) {
        return roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName));
    }

    private void validateUniqueUsername(UUID userId, String username) {
        if (username != null && adminUserRepository.existsByUsernameAndUserIdNot(username, userId)) {
            throw new BadRequestException("Username is already taken");
        }
    }

    private void validateUniqueEmail(UUID userId, String email) {
        if (email != null && adminUserRepository.existsByEmailAndUserIdNot(email, userId)) {
            throw new BadRequestException("Email is already registered");
        }
    }
}
