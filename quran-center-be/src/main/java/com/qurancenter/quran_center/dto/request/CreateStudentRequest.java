package com.qurancenter.quran_center.dto.request;

import com.qurancenter.quran_center.enums.EnrollmentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateStudentRequest {

    @NotBlank
    private String fullName;

    @NotBlank
    private String username;

    @NotBlank
    private String password;

    private String phone;
    private Integer age;
    private LocalDate dateOfBirth;
    private String address;
    private String guardianName;
    private String guardianPhone;
    private Long halqaId;
    private EnrollmentStatus enrollmentStatus;
}