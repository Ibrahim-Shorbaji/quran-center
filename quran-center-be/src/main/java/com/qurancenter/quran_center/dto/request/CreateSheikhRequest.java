package com.qurancenter.quran_center.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateSheikhRequest {

    @NotBlank
    private String fullName;

    @NotBlank
    private String username;

    @NotBlank
    private String password;

    private String phone;
    private String email;
}