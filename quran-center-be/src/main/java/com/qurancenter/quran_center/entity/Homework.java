package com.qurancenter.quran_center.entity;

import com.qurancenter.quran_center.enums.HomeworkStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "homeworks")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Homework {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "sheikh_id", nullable = false)
    private Sheikh sheikh;

    private String fromSurah;
    private Integer fromAyah;
    private String toSurah;
    private Integer toAyah;

    private LocalDate assignedDate;
    private LocalDate dueDate;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private HomeworkStatus status = HomeworkStatus.PENDING;

    @CreationTimestamp
    private LocalDateTime createdAt;
}