package com.streaming.backend.features.admin.dto;

import com.streaming.backend.domain.enums.RoleName;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class UpdateUserRolesRequest {

    @NotEmpty
    private Set<RoleName> roles;
}
