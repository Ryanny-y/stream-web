package com.streaming.backend.features.admin.dto;

import com.streaming.backend.domain.enums.Visibility;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
public class UpdateVideoRequest {

    @Size(max = 255)
    private String title;

    private String description;

    @Size(max = 255)
    private String slug;

    @PositiveOrZero
    private Integer durationSeconds;

    private LocalDate releaseDate;
    private Visibility visibility;
    private Boolean featured;
    private Boolean trending;
    private Set<Integer> categoryIds;
}
