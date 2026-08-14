package com.qurancenter.quran_center.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class AdminDashboardResponse {
    private long totalStudents;
    private long totalSheikhs;
    private long totalHalqas;
    private double attendanceRateThisMonth;
    private List<TodayScheduleItem> todaySchedule;

    @Data
    @Builder
    public static class TodayScheduleItem {
        private String halqaName;
        private String sheikhName;
        private String schedule;
        private int studentCount;
    }
}