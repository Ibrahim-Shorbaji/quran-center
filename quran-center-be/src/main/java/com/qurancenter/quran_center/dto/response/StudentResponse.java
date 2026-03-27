package com.qurancenter.quran_center.dto.response;

import com.qurancenter.quran_center.enums.EnrollmentStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class StudentResponse {
    private Long id;
    private Long userId;
    private String fullName;
    private String username;
    private String phone;
    private Integer age;
    private LocalDate dateOfBirth;
    private String address;
    private String guardianName;
    private String guardianPhone;
    private EnrollmentStatus enrollmentStatus;
    private Long halqaId;
    private String halqaName;
    private LocalDateTime createdAt;
}