package com.qurancenter.quran_center.repository;

import com.qurancenter.quran_center.entity.Sheikh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SheikhRepository extends JpaRepository<Sheikh, Long> {
    Optional<Sheikh> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}