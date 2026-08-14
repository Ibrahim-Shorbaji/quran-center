package com.qurancenter.quran_center.repository;

import com.qurancenter.quran_center.entity.Homework;
import com.qurancenter.quran_center.enums.HomeworkStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HomeworkRepository extends JpaRepository<Homework, Long> {
    List<Homework> findByStudentIdOrderByDueDateDesc(Long studentId);
    List<Homework> findByStudentIdAndStatusOrderByDueDateDesc(Long studentId, HomeworkStatus status);
    List<Homework> findBySheikhIdOrderByDueDateDesc(Long sheikhId);
    long countBySheikhIdAndStatus(Long sheikhId, HomeworkStatus status);
    long countByStudentIdAndStatus(Long studentId, HomeworkStatus status);
}