package com.qurancenter.quran_center.service;

import com.qurancenter.quran_center.dto.request.CreateHomeworkRequest;
import com.qurancenter.quran_center.dto.response.HomeworkResponse;
import com.qurancenter.quran_center.entity.Homework;
import com.qurancenter.quran_center.entity.Sheikh;
import com.qurancenter.quran_center.entity.Student;
import com.qurancenter.quran_center.enums.HomeworkStatus;
import com.qurancenter.quran_center.exception.ResourceNotFoundException;
import com.qurancenter.quran_center.repository.HomeworkRepository;
import com.qurancenter.quran_center.repository.SheikhRepository;
import com.qurancenter.quran_center.repository.StudentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HomeworkServiceImpl implements HomeworkService {

    private final HomeworkRepository homeworkRepository;
    private final StudentRepository studentRepository;
    private final SheikhRepository sheikhRepository;

    @Override
    public List<HomeworkResponse> getHomeworkByStudent(Long studentId) {
        return homeworkRepository.findByStudentIdOrderByDueDateDesc(studentId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public HomeworkResponse createHomework(CreateHomeworkRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student not found with id: " + request.getStudentId()));

        Sheikh sheikh = sheikhRepository.findById(request.getSheikhId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Sheikh not found with id: " + request.getSheikhId()));

        Homework homework = Homework.builder()
                .student(student)
                .sheikh(sheikh)
                .fromSurah(request.getFromSurah())
                .fromAyah(request.getFromAyah())
                .toSurah(request.getToSurah())
                .toAyah(request.getToAyah())
                .assignedDate(request.getAssignedDate())
                .dueDate(request.getDueDate())
                .instructions(request.getInstructions())
                .status(HomeworkStatus.PENDING)
                .build();

        homeworkRepository.save(homework);
        return mapToResponse(homework);
    }

    @Override
    @Transactional
    public HomeworkResponse markAsReviewed(Long id) {
        Homework homework = homeworkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Homework not found with id: " + id));
        homework.setStatus(HomeworkStatus.REVIEWED);
        homeworkRepository.save(homework);
        return mapToResponse(homework);
    }

    @Override
    @Transactional
    public void deleteHomework(Long id) {
        Homework homework = homeworkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Homework not found with id: " + id));
        homeworkRepository.delete(homework);
    }

    // ── Helper ─────────────────────────────────────────────────────────────
    private HomeworkResponse mapToResponse(Homework homework) {
        return HomeworkResponse.builder()
                .id(homework.getId())
                .studentId(homework.getStudent().getId())
                .studentName(homework.getStudent().getUser().getFullName())
                .sheikhId(homework.getSheikh().getId())
                .sheikhName(homework.getSheikh().getUser().getFullName())
                .fromSurah(homework.getFromSurah())
                .fromAyah(homework.getFromAyah())
                .toSurah(homework.getToSurah())
                .toAyah(homework.getToAyah())
                .assignedDate(homework.getAssignedDate())
                .dueDate(homework.getDueDate())
                .instructions(homework.getInstructions())
                .status(homework.getStatus())
                .createdAt(homework.getCreatedAt())
                .build();
    }
}