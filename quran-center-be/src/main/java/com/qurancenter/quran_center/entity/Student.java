package com.qurancenter.quran_center.entity;

import com.qurancenter.quran_center.enums.EnrollmentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Integer age;
    private LocalDate dateOfBirth;
    private String address;
    private String guardianName;
    private String guardianPhone;


    @Enumerated(EnumType.STRING)
    @Builder.Default
    private EnrollmentStatus enrollmentStatus = EnrollmentStatus.ACTIVE;

    @ManyToOne
    @JoinColumn(name = "halqa_id")
    private Halqa halqa;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}