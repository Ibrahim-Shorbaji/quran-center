package com.qurancenter.quran_center.service;

import com.qurancenter.quran_center.dto.request.RecordAttendanceRequest;
import com.qurancenter.quran_center.dto.response.AttendanceResponse;
import com.qurancenter.quran_center.entity.Attendance;
import com.qurancenter.quran_center.entity.Sheikh;
import com.qurancenter.quran_center.entity.Student;
import com.qurancenter.quran_center.exception.ResourceNotFoundException;
import com.qurancenter.quran_center.repository.AttendanceRepository;
import com.qurancenter.quran_center.repository.SheikhRepository;
import com.qurancenter.quran_center.repository.StudentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final SheikhRepository sheikhRepository;

    @Override
    @Transactional
    public List<AttendanceResponse> recordAttendance(RecordAttendanceRequest request) {
        Sheikh sheikh = sheikhRepository.findById(request.getSheikhId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Sheikh not found with id: " + request.getSheikhId()));

        List<AttendanceResponse> responses = new ArrayList<>();

        for (RecordAttendanceRequest.StudentAttendanceItem item : request.getAttendances()) {
            Student student = studentRepository.findById(item.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Student not found with id: " + item.getStudentId()));

            // Check if attendance already exists for this student on this date
            Optional<Attendance> existing = attendanceRepository
                    .findByStudentIdAndSessionDate(item.getStudentId(), request.getSessionDate());

            Attendance attendance;
            if (existing.isPresent()) {
                // Update existing record
                attendance = existing.get();
                attendance.setStatus(item.getStatus());
                attendance.setNotes(item.getNotes());
            } else {
                // Create new record
                attendance = Attendance.builder()
                        .student(student)
                        .sheikh(sheikh)
                        .sessionDate(request.getSessionDate())
                        .status(item.getStatus())
                        .notes(item.getNotes())
                        .build();
            }

            attendanceRepository.save(attendance);
            responses.add(mapToResponse(attendance));
        }

        return responses;
    }

    @Override
    public List<AttendanceResponse> getAttendanceByStudent(Long studentId) {
        return attendanceRepository.findByStudentIdOrderBySessionDateDesc(studentId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Helper ─────────────────────────────────────────────────────────────
    private AttendanceResponse mapToResponse(Attendance attendance) {
        return AttendanceResponse.builder()
                .id(attendance.getId())
                .studentId(attendance.getStudent().getId())
                .studentName(attendance.getStudent().getUser().getFullName())
                .sheikhId(attendance.getSheikh().getId())
                .sheikhName(attendance.getSheikh().getUser().getFullName())
                .sessionDate(attendance.getSessionDate())
                .status(attendance.getStatus())
                .notes(attendance.getNotes())
                .recordedAt(attendance.getRecordedAt())
                .build();
    }
}