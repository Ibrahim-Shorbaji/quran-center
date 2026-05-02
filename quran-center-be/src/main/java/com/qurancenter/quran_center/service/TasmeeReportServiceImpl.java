package com.qurancenter.quran_center.service;

import com.qurancenter.quran_center.dto.request.CreateTasmeeReportRequest;
import com.qurancenter.quran_center.dto.response.TasmeeReportResponse;
import com.qurancenter.quran_center.entity.Sheikh;
import com.qurancenter.quran_center.entity.Student;
import com.qurancenter.quran_center.entity.TasmeeReport;
import com.qurancenter.quran_center.exception.ResourceNotFoundException;
import com.qurancenter.quran_center.repository.SheikhRepository;
import com.qurancenter.quran_center.repository.StudentRepository;
import com.qurancenter.quran_center.repository.TasmeeReportRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TasmeeReportServiceImpl implements TasmeeReportService {

    private final TasmeeReportRepository tasmeeReportRepository;
    private final StudentRepository studentRepository;
    private final SheikhRepository sheikhRepository;

    @Override
    public List<TasmeeReportResponse> getAllReports() {
        return tasmeeReportRepository.findAllByOrderBySessionDateDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TasmeeReportResponse> getReportsByStudent(Long studentId) {
        return tasmeeReportRepository.findByStudentIdOrderBySessionDateDesc(studentId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TasmeeReportResponse> getReportsBySheikh(Long sheikhId) {
        return tasmeeReportRepository.findBySheikhIdOrderBySessionDateDesc(sheikhId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TasmeeReportResponse createReport(CreateTasmeeReportRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student not found with id: " + request.getStudentId()));

        Sheikh sheikh = sheikhRepository.findById(request.getSheikhId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Sheikh not found with id: " + request.getSheikhId()));

        TasmeeReport report = TasmeeReport.builder()
                .student(student)
                .sheikh(sheikh)
                .sessionDate(request.getSessionDate())
                .fromSurah(request.getFromSurah())
                .fromAyah(request.getFromAyah())
                .toSurah(request.getToSurah())
                .toAyah(request.getToAyah())
                .grade(request.getGrade())
                .mistakes(request.getMistakes())
                .sheikhNotes(request.getSheikhNotes())
                .build();

        tasmeeReportRepository.save(report);
        return mapToResponse(report);
    }

    @Override
    @Transactional
    public void deleteReport(Long id) {
        TasmeeReport report = tasmeeReportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Report not found with id: " + id));
        tasmeeReportRepository.delete(report);
    }

    // ── Helper ─────────────────────────────────────────────────────────────
    private TasmeeReportResponse mapToResponse(TasmeeReport report) {
        return TasmeeReportResponse.builder()
                .id(report.getId())
                .studentId(report.getStudent().getId())
                .studentName(report.getStudent().getUser().getFullName())
                .sheikhId(report.getSheikh().getId())
                .sheikhName(report.getSheikh().getUser().getFullName())
                .sessionDate(report.getSessionDate())
                .fromSurah(report.getFromSurah())
                .fromAyah(report.getFromAyah())
                .toSurah(report.getToSurah())
                .toAyah(report.getToAyah())
                .grade(report.getGrade())
                .mistakes(report.getMistakes())
                .sheikhNotes(report.getSheikhNotes())
                .createdAt(report.getCreatedAt())
                .build();
    }
}