package com.streaming.backend.features.admin.dto;

import com.streaming.backend.domain.enums.VideoStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateVideoStatusRequest {

    @NotNull
    private VideoStatus status;
}
