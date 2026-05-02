package com.qurancenter.quran_center.controller;

import com.qurancenter.quran_center.dto.request.CreateHomeworkRequest;
import com.qurancenter.quran_center.dto.response.HomeworkResponse;
import com.qurancenter.quran_center.service.HomeworkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/homework")
@RequiredArgsConstructor
public class HomeworkController {

    private final HomeworkService homeworkService;

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<HomeworkResponse>> getHomeworkByStudent(
            @PathVariable Long studentId) {
        return ResponseEntity.ok(homeworkService.getHomeworkByStudent(studentId));
    }

    @PostMapping
    public ResponseEntity<HomeworkResponse> createHomework(
            @Valid @RequestBody CreateHomeworkRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(homeworkService.createHomework(request));
    }

    @PatchMapping("/{id}/review")
    public ResponseEntity<HomeworkResponse> markAsReviewed(@PathVariable Long id) {
        return ResponseEntity.ok(homeworkService.markAsReviewed(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHomework(@PathVariable Long id) {
        homeworkService.deleteHomework(id);
        return ResponseEntity.noContent().build();
    }
}