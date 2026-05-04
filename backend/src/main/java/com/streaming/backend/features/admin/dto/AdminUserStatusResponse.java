package com.streaming.backend.features.admin.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminUserStatusResponse {

    private Long totalUsers;
    private Long totalActiveUsers;
    private Long suspendedUsers;
    private Long bannedUsers;
    private Long systemAdmin;
}
