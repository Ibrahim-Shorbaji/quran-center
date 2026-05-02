package com.qurancenter.quran_center.repository;

import com.qurancenter.quran_center.entity.TasmeeReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TasmeeReportRepository extends JpaRepository<TasmeeReport, Long> {
    List<TasmeeReport> findByStudentIdOrderBySessionDateDesc(Long studentId);
    List<TasmeeReport> findBySheikhIdOrderBySessionDateDesc(Long sheikhId);
    List<TasmeeReport> findAllByOrderBySessionDateDesc();
}