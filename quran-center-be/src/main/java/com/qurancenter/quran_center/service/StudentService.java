package com.qurancenter.quran_center.service;

import com.qurancenter.quran_center.dto.request.CreateStudentRequest;
import com.qurancenter.quran_center.dto.request.UpdateStudentRequest;
import com.qurancenter.quran_center.dto.response.StudentResponse;

import java.util.List;

public interface StudentService {
    List<StudentResponse> getAllStudents();
    StudentResponse getStudentById(Long id);
    StudentResponse createStudent(CreateStudentRequest request);
    StudentResponse updateStudent(Long id, UpdateStudentRequest request);
    void deleteStudent(Long id);
    List<StudentResponse> getStudentsByHalqa(Long halqaId);

}