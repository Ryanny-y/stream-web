package com.streaming.backend.features.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequest {

    @Size(min = 3, max = 50)
    private String username;

    @Email
    @Size(max = 120)
    private String email;

    @Size(max = 80)
    private String firstName;

    @Size(max = 80)
    private String lastName;

    @Size(max = 30)
    private String phone;

    private String profileImage;
}
