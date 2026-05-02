package com.qurancenter.quran_center.dto.response;

import com.qurancenter.quran_center.enums.AttendanceStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class AttendanceResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long sheikhId;
    private String sheikhName;
    private LocalDate sessionDate;
    private AttendanceStatus status;
    private String notes;
    private LocalDateTime recordedAt;
}