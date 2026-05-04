package com.streaming.backend.features.user.dto;

import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecordVideoViewRequest {

    @PositiveOrZero
    private Integer watchedSeconds;

    private Boolean completed;
}
