package com.qurancenter.quran_center.repository;

import com.qurancenter.quran_center.entity.Halqa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HalqaRepository extends JpaRepository<Halqa, Long> {
    List<Halqa> findBySheikhId(Long sheikhId);
    boolean existsByName(String name);
}