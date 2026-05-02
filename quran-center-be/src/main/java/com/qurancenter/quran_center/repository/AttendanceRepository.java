package com.qurancenter.quran_center.repository;

import com.qurancenter.quran_center.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudentIdOrderBySessionDateDesc(Long studentId);
    List<Attendance> findBySheikhIdAndSessionDate(Long sheikhId, LocalDate date);
    Optional<Attendance> findByStudentIdAndSessionDate(Long studentId, LocalDate sessionDate);
}