package com.qurancenter.quran_center.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class HalqaResponse {
    private Long id;
    private String name;
    private String schedule;
    private Integer maxStudents;
    private Integer currentStudents;
    private Long sheikhId;
    private String sheikhName;
    private boolean active;
    private LocalDateTime createdAt;
}