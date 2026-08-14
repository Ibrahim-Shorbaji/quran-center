package com.qurancenter.quran_center.service;

import com.qurancenter.quran_center.dto.response.AdminDashboardResponse;
import com.qurancenter.quran_center.dto.response.SheikhDashboardResponse;
import com.qurancenter.quran_center.dto.response.StudentDashboardResponse;

public interface DashboardService {
    AdminDashboardResponse getAdminDashboard();
    SheikhDashboardResponse getSheikhDashboard(String username);
    StudentDashboardResponse getStudentDashboard(String username);
}
