package com.qurancenter.quran_center.service;

import com.qurancenter.quran_center.dto.request.CreateHalqaRequest;
import com.qurancenter.quran_center.dto.request.UpdateHalqaRequest;
import com.qurancenter.quran_center.dto.response.HalqaResponse;

import java.util.List;

public interface HalqaService {
    /**
     * Admins see every halqa; a sheikh sees only the halqas they teach.
     */
    List<HalqaResponse> getHalqasForUser(String username);
    HalqaResponse getHalqaById(Long id);
    HalqaResponse createHalqa(CreateHalqaRequest request);
    HalqaResponse updateHalqa(Long id, UpdateHalqaRequest request);
    void deleteHalqa(Long id);
}