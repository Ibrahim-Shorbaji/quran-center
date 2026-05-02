package com.qurancenter.quran_center.service;

import com.qurancenter.quran_center.dto.request.CreateTasmeeReportRequest;
import com.qurancenter.quran_center.dto.response.TasmeeReportResponse;

import java.util.List;

public interface TasmeeReportService {
    List<TasmeeReportResponse> getAllReports();
    List<TasmeeReportResponse> getReportsByStudent(Long studentId);
    List<TasmeeReportResponse> getReportsBySheikh(Long sheikhId);
    TasmeeReportResponse createReport(CreateTasmeeReportRequest request);
    void deleteReport(Long id);
}