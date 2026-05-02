package com.qurancenter.quran_center.entity;

import com.qurancenter.quran_center.enums.AttendanceStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"student_id", "session_date"}
        ))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "sheikh_id", nullable = false)
    private Sheikh sheikh;

    @Column(name = "session_date")
    private LocalDate sessionDate;

    @Enumerated(EnumType.STRING)
    private AttendanceStatus status;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    private LocalDateTime recordedAt;
}