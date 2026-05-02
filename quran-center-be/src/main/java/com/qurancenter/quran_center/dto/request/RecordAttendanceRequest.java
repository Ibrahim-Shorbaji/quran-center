package com.qurancenter.quran_center.dto.request;

import com.qurancenter.quran_center.enums.AttendanceStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class RecordAttendanceRequest {

    @NotNull
    private Long sheikhId;

    @NotNull
    private LocalDate sessionDate;

    @NotNull
    private List<StudentAttendanceItem> attendances;

    @Data
    public static class StudentAttendanceItem {
        private Long studentId;
        private AttendanceStatus status;
        private String notes;
    }
}