package com.qurancenter.quran_center.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentDashboardResponse {
    private String halqaName;
    private double attendanceRate;
    private long pendingHomeworkCount;
    private Integer lastTasmeeGrade;
    private String lastTasmeeDate;
}