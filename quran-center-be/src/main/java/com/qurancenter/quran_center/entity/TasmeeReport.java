package com.qurancenter.quran_center.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasmee_reports")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TasmeeReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "sheikh_id", nullable = false)
    private Sheikh sheikh;

    private LocalDate sessionDate;

    private String fromSurah;
    private Integer fromAyah;
    private String toSurah;
    private Integer toAyah;


    private Integer grade;

    @Column(columnDefinition = "TEXT")
    private String mistakes;

    @Column(columnDefinition = "TEXT")
    private String sheikhNotes;

    @CreationTimestamp
    private LocalDateTime createdAt;
}