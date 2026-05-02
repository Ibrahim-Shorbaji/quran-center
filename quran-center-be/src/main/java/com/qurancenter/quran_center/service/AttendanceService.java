package com.qurancenter.quran_center.service;

import com.qurancenter.quran_center.dto.request.RecordAttendanceRequest;
import com.qurancenter.quran_center.dto.response.AttendanceResponse;

import java.util.List;

public interface AttendanceService {
    List<AttendanceResponse> recordAttendance(RecordAttendanceRequest request);
    List<AttendanceResponse> getAttendanceByStudent(Long studentId);
}