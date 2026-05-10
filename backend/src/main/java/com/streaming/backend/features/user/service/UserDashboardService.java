package com.streaming.backend.features.user.service;

import com.streaming.backend.domain.User;
import com.streaming.backend.features.user.dto.UserDashboardResponse;

public interface UserDashboardService {

    UserDashboardResponse getDashboard(User currentUser);
}
