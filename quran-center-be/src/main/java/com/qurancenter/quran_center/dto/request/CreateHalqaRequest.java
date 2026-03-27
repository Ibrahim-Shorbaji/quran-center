package com.qurancenter.quran_center.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateHalqaRequest {

    @NotBlank
    private String name;

    private String schedule;

    private Integer maxStudents;

    @NotNull
    private Long sheikhId;
}