package com.qurancenter.quran_center.dto.request;

import com.qurancenter.quran_center.enums.EnrollmentStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateStudentRequest {
    private String fullName;
    private String phone;
    private Integer age;
    private LocalDate dateOfBirth;
    private String address;
    private String guardianName;
    private String guardianPhone;
    private Long halqaId;
    private EnrollmentStatus enrollmentStatus;
}