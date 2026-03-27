package com.qurancenter.quran_center.controller;

import com.qurancenter.quran_center.dto.request.CreateHalqaRequest;
import com.qurancenter.quran_center.dto.request.UpdateHalqaRequest;
import com.qurancenter.quran_center.dto.response.HalqaResponse;
import com.qurancenter.quran_center.service.HalqaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/halqas")
@RequiredArgsConstructor
public class HalqaController {

    private final HalqaService halqaService;

    @GetMapping
    public ResponseEntity<List<HalqaResponse>> getAllHalqas() {
        return ResponseEntity.ok(halqaService.getAllHalqas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HalqaResponse> getHalqaById(@PathVariable Long id) {
        return ResponseEntity.ok(halqaService.getHalqaById(id));
    }

    @PostMapping
    public ResponseEntity<HalqaResponse> createHalqa(@Valid @RequestBody CreateHalqaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(halqaService.createHalqa(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HalqaResponse> updateHalqa(@PathVariable Long id,
                                                     @RequestBody UpdateHalqaRequest request) {
        return ResponseEntity.ok(halqaService.updateHalqa(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHalqa(@PathVariable Long id) {
        halqaService.deleteHalqa(id);
        return ResponseEntity.noContent().build();
    }
}