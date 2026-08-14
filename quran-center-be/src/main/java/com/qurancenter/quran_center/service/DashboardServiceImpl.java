package com.qurancenter.quran_center.service;

import com.qurancenter.quran_center.dto.response.*;
import com.qurancenter.quran_center.entity.Halqa;
import com.qurancenter.quran_center.entity.Sheikh;
import com.qurancenter.quran_center.entity.Student;
import com.qurancenter.quran_center.enums.AttendanceStatus;
import com.qurancenter.quran_center.enums.HomeworkStatus;
import com.qurancenter.quran_center.exception.ResourceNotFoundException;
import com.qurancenter.quran_center.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final StudentRepository studentRepository;
    private final SheikhRepository sheikhRepository;
    private final HalqaRepository halqaRepository;
    private final AttendanceRepository attendanceRepository;
    private final HomeworkRepository homeworkRepository;
    private final TasmeeReportRepository tasmeeReportRepository;
    private final UserRepository userRepository;

    @Override
    public AdminDashboardResponse getAdminDashboard() {
        long totalStudents = studentRepository.count();
        long totalSheikhs = sheikhRepository.count();
        long totalHalqas = halqaRepository.count();

        // Attendance rate this month
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate today = LocalDate.now();
        List<com.qurancenter.quran_center.entity.Attendance> monthAttendance =
                attendanceRepository.findBySessionDateBetween(startOfMonth, today);
        double attendanceRate = 0;
        if (!monthAttendance.isEmpty()) {
            long presentCount = monthAttendance.stream()
                    .filter(a -> a.getStatus() == AttendanceStatus.PRESENT)
                    .count();
            attendanceRate = Math.round((presentCount * 100.0 / monthAttendance.size()) * 10.0) / 10.0;
        }

        // Today's schedule
        List<AdminDashboardResponse.TodayScheduleItem> todaySchedule = halqaRepository.findAll()
                .stream()
                .filter(h -> h.isActive())
                .map(h -> AdminDashboardResponse.TodayScheduleItem.builder()
                        .halqaName(h.getName())
                        .sheikhName(h.getSheikh() != null ? h.getSheikh().getUser().getFullName() : "—")
                        .schedule(h.getSchedule() != null ? h.getSchedule() : "—")
                        .studentCount(h.getStudents() != null ? h.getStudents().size() : 0)
                        .build())
                .collect(Collectors.toList());

        return AdminDashboardResponse.builder()
                .totalStudents(totalStudents)
                .totalSheikhs(totalSheikhs)
                .totalHalqas(totalHalqas)
                .attendanceRateThisMonth(attendanceRate)
                .todaySchedule(todaySchedule)
                .build();
    }

    @Override
    public SheikhDashboardResponse getSheikhDashboard(String username) {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Sheikh sheikh = sheikhRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Sheikh not found"));

        // Total students across all his halqas
        long totalStudents = sheikh.getHalqas() != null
                ? sheikh.getHalqas().stream()
                .mapToLong(h -> h.getStudents() != null ? h.getStudents().size() : 0)
                .sum()
                : 0;

        long totalHalqas = sheikh.getHalqas() != null ? sheikh.getHalqas().size() : 0;

        // Attendance rate this month for his students
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate today = LocalDate.now();
        List<com.qurancenter.quran_center.entity.Attendance> monthAttendance =
                attendanceRepository.findBySheikhIdAndSessionDateBetween(
                        sheikh.getId(), startOfMonth, today);
        double attendanceRate = 0;
        if (!monthAttendance.isEmpty()) {
            long presentCount = monthAttendance.stream()
                    .filter(a -> a.getStatus() == AttendanceStatus.PRESENT)
                    .count();
            attendanceRate = Math.round((presentCount * 100.0 / monthAttendance.size()) * 10.0) / 10.0;
        }

        // Pending homework count
        long pendingHomework = homeworkRepository.countBySheikhIdAndStatus(
                sheikh.getId(), HomeworkStatus.PENDING);

        // Recent tasmee sessions
        List<TasmeeReportResponse> recentSessions = tasmeeReportRepository
                .findBySheikhIdOrderBySessionDateDesc(sheikh.getId())
                .stream()
                .limit(5)
                .map(r -> TasmeeReportResponse.builder()
                        .id(r.getId())
                        .studentName(r.getStudent().getUser().getFullName())
                        .sessionDate(r.getSessionDate())
                        .grade(r.getGrade())
                        .build())
                .collect(Collectors.toList());

        return SheikhDashboardResponse.builder()
                .totalStudents(totalStudents)
                .totalHalqas(totalHalqas)
                .attendanceRateThisMonth(attendanceRate)
                .pendingHomeworkCount(pendingHomework)
                .recentTasmeeSessions(recentSessions)
                .build();
    }

    @Override
    public StudentDashboardResponse getStudentDashboard(String username) {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        // Halqa name
        String halqaName = student.getHalqa() != null ? student.getHalqa().getName() : null;

        // Attendance rate
        List<com.qurancenter.quran_center.entity.Attendance> allAttendance =
                attendanceRepository.findByStudentIdOrderBySessionDateDesc(student.getId());
        double attendanceRate = 0;
        if (!allAttendance.isEmpty()) {
            long presentCount = allAttendance.stream()
                    .filter(a -> a.getStatus() == AttendanceStatus.PRESENT)
                    .count();
            attendanceRate = Math.round((presentCount * 100.0 / allAttendance.size()) * 10.0) / 10.0;
        }

        // Pending homework
        long pendingHomework = homeworkRepository
                .countByStudentIdAndStatus(student.getId(), HomeworkStatus.PENDING);

        // Last tasmee
        var lastTasmee = tasmeeReportRepository
                .findByStudentIdOrderBySessionDateDesc(student.getId())
                .stream().findFirst().orElse(null);

        return StudentDashboardResponse.builder()
                .halqaName(halqaName)
                .attendanceRate(attendanceRate)
                .pendingHomeworkCount(pendingHomework)
                .lastTasmeeGrade(lastTasmee != null ? lastTasmee.getGrade() : null)
                .lastTasmeeDate(lastTasmee != null
                        ? lastTasmee.getSessionDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy"))
                        : null)
                .build();
    }
}