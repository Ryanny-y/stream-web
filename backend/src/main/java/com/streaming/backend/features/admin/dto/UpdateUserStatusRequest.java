package com.streaming.backend.features.admin.dto;

import com.streaming.backend.domain.enums.UserStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserStatusRequest {

    @NotNull
    private UserStatus status;
}
