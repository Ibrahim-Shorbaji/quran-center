package com.qurancenter.quran_center.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class SheikhResponse {
    private Long id;
    private Long userId;
    private String fullName;
    private String username;
    private String phone;
    private String email;
    private int halqaCount;
    private LocalDateTime createdAt;
}