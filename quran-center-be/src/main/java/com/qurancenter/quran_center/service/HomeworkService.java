package com.qurancenter.quran_center.service;

import com.qurancenter.quran_center.dto.request.CreateHomeworkRequest;
import com.qurancenter.quran_center.dto.response.HomeworkResponse;

import java.util.List;

public interface HomeworkService {
    List<HomeworkResponse> getHomeworkByStudent(Long studentId);
    HomeworkResponse createHomework(CreateHomeworkRequest request);
    HomeworkResponse markAsReviewed(Long id);
    void deleteHomework(Long id);
}