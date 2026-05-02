package com.qurancenter.quran_center.controller;

import com.qurancenter.quran_center.dto.request.RecordAttendanceRequest;
import com.qurancenter.quran_center.dto.response.AttendanceResponse;
import com.qurancenter.quran_center.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping
    public ResponseEntity<List<AttendanceResponse>> recordAttendance(
            @Valid @RequestBody RecordAttendanceRequest request) {
        return ResponseEntity.ok(attendanceService.recordAttendance(request));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<AttendanceResponse>> getAttendanceByStudent(
            @PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByStudent(studentId));
    }
}