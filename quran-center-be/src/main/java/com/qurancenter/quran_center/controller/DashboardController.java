package com.qurancenter.quran_center.controller;

import com.qurancenter.quran_center.dto.response.*;
import com.qurancenter.quran_center.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardResponse> getAdminDashboard() {
        return ResponseEntity.ok(dashboardService.getAdminDashboard());
    }

    @GetMapping("/sheikh")
    @PreAuthorize("hasRole('SHEIKH')")
    public ResponseEntity<SheikhDashboardResponse> getSheikhDashboard(
            Authentication authentication) {
        return ResponseEntity.ok(dashboardService.getSheikhDashboard(
                authentication.getName()));
    }

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentDashboardResponse> getStudentDashboard(
            Authentication authentication) {
        return ResponseEntity.ok(dashboardService.getStudentDashboard(
                authentication.getName()));
    }
}