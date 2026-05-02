package com.qurancenter.quran_center.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateHomeworkRequest {

    @NotNull
    private Long studentId;

    @NotNull
    private Long sheikhId;

    @NotBlank
    private String fromSurah;

    @NotNull
    private Integer fromAyah;

    @NotBlank
    private String toSurah;

    @NotNull
    private Integer toAyah;

    private LocalDate assignedDate;
    private LocalDate dueDate;

    private String instructions;
}