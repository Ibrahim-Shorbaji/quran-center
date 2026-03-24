package com.qurancenter.quran_center.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "halqas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Halqa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String schedule;
    private Integer maxStudents;

    @ManyToOne
    @JoinColumn(name = "sheikh_id")
    private Sheikh sheikh;

    @OneToMany(mappedBy = "halqa")
    private List<Student> students;

    private boolean active = true;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}