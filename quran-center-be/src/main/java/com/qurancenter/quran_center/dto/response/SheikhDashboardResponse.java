package com.qurancenter.quran_center.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class SheikhDashboardResponse {
    private long totalStudents;
    private long totalHalqas;
    private double attendanceRateThisMonth;
    private long pendingHomeworkCount;
    private List<TasmeeReportResponse> recentTasmeeSessions;
}