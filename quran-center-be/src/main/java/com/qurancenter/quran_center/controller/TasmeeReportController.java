package com.qurancenter.quran_center.controller;

import com.qurancenter.quran_center.dto.request.CreateTasmeeReportRequest;
import com.qurancenter.quran_center.dto.response.TasmeeReportResponse;
import com.qurancenter.quran_center.service.TasmeeReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasmee")
@RequiredArgsConstructor
public class TasmeeReportController {

    private final TasmeeReportService tasmeeReportService;

    @GetMapping
    public ResponseEntity<List<TasmeeReportResponse>> getAllReports() {
        return ResponseEntity.ok(tasmeeReportService.getAllReports());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<TasmeeReportResponse>> getReportsByStudent(
            @PathVariable Long studentId) {
        return ResponseEntity.ok(tasmeeReportService.getReportsByStudent(studentId));
    }

    @GetMapping("/sheikh/{sheikhId}")
    public ResponseEntity<List<TasmeeReportResponse>> getReportsBySheikh(
            @PathVariable Long sheikhId) {
        return ResponseEntity.ok(tasmeeReportService.getReportsBySheikh(sheikhId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SHEIKH')")
    public ResponseEntity<TasmeeReportResponse> createReport(
            @Valid @RequestBody CreateTasmeeReportRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tasmeeReportService.createReport(request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SHEIKH')")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        tasmeeReportService.deleteReport(id);
        return ResponseEntity.noContent().build();
    }
}