package com.qurancenter.quran_center.dto.request;

import lombok.Data;

@Data
public class UpdateHalqaRequest {
    private String name;
    private String schedule;
    private Integer maxStudents;
    private Long sheikhId;
}