package com.qurancenter.quran_center.controller;

import com.qurancenter.quran_center.dto.request.CreateHalqaRequest;
import com.qurancenter.quran_center.dto.request.UpdateHalqaRequest;
import com.qurancenter.quran_center.dto.response.HalqaResponse;
import com.qurancenter.quran_center.service.HalqaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/halqas")
@RequiredArgsConstructor
public class HalqaController {

    private final HalqaService halqaService;

    @GetMapping
    public ResponseEntity<List<HalqaResponse>> getHalqas(Authentication authentication) {
        return ResponseEntity.ok(halqaService.getHalqasForUser(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HalqaResponse> getHalqaById(@PathVariable Long id) {
        return ResponseEntity.ok(halqaService.getHalqaById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HalqaResponse> createHalqa(@Valid @RequestBody CreateHalqaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(halqaService.createHalqa(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HalqaResponse> updateHalqa(@PathVariable Long id,
                                                     @RequestBody UpdateHalqaRequest request) {
        return ResponseEntity.ok(halqaService.updateHalqa(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteHalqa(@PathVariable Long id) {
        halqaService.deleteHalqa(id);
        return ResponseEntity.noContent().build();
    }
}