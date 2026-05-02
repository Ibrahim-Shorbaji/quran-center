package com.qurancenter.quran_center.dto.response;

import com.qurancenter.quran_center.enums.HomeworkStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class HomeworkResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long sheikhId;
    private String sheikhName;
    private String fromSurah;
    private Integer fromAyah;
    private String toSurah;
    private Integer toAyah;
    private LocalDate assignedDate;
    private LocalDate dueDate;
    private String instructions;
    private HomeworkStatus status;
    private LocalDateTime createdAt;
}