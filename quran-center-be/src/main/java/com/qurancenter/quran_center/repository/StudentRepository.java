package com.qurancenter.quran_center.repository;

import com.qurancenter.quran_center.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByHalqaId(Long halqaId);
    Optional<Student> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}