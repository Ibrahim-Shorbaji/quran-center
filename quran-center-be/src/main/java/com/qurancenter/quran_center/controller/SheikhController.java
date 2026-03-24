package com.qurancenter.quran_center.controller;

import com.qurancenter.quran_center.dto.request.CreateSheikhRequest;
import com.qurancenter.quran_center.dto.request.UpdateSheikhRequest;
import com.qurancenter.quran_center.dto.response.SheikhResponse;
import com.qurancenter.quran_center.service.SheikhService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sheikhs")
@RequiredArgsConstructor
public class SheikhController {

    private final SheikhService sheikhService;

    @GetMapping
    public ResponseEntity<List<SheikhResponse>> getAllSheikhs() {
        return ResponseEntity.ok(sheikhService.getAllSheikhs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SheikhResponse> getSheikhById(@PathVariable Long id) {
        return ResponseEntity.ok(sheikhService.getSheikhById(id));
    }

    @PostMapping
    public ResponseEntity<SheikhResponse> createSheikh(@Valid @RequestBody CreateSheikhRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sheikhService.createSheikh(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SheikhResponse> updateSheikh(@PathVariable Long id,
                                                       @RequestBody UpdateSheikhRequest request) {
        return ResponseEntity.ok(sheikhService.updateSheikh(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSheikh(@PathVariable Long id) {
        sheikhService.deleteSheikh(id);
        return ResponseEntity.noContent().build();
    }
}