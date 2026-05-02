package com.qurancenter.quran_center.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class TasmeeReportResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long sheikhId;
    private String sheikhName;
    private LocalDate sessionDate;
    private String fromSurah;
    private Integer fromAyah;
    private String toSurah;
    private Integer toAyah;
    private Integer grade;
    private String mistakes;
    private String sheikhNotes;
    private LocalDateTime createdAt;
}