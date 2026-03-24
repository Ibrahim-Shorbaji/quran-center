package com.qurancenter.quran_center.dto.request;

import lombok.Data;

@Data
public class UpdateSheikhRequest {
    private String fullName;
    private String phone;
    private String email;
}