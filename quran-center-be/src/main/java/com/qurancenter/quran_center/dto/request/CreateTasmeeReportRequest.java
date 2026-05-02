package com.qurancenter.quran_center.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateTasmeeReportRequest {

    @NotNull
    private Long studentId;

    @NotNull
    private Long sheikhId;

    @NotNull
    private LocalDate sessionDate;

    @NotBlank
    private String fromSurah;

    @NotNull
    private Integer fromAyah;

    @NotBlank
    private String toSurah;

    @NotNull
    private Integer toAyah;

    @NotNull
    @Min(0) @Max(10)
    private Integer grade;

    private String mistakes;
    private String sheikhNotes;
}