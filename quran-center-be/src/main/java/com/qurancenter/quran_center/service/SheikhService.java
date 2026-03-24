package com.qurancenter.quran_center.service;

import com.qurancenter.quran_center.dto.request.CreateSheikhRequest;
import com.qurancenter.quran_center.dto.request.UpdateSheikhRequest;
import com.qurancenter.quran_center.dto.response.SheikhResponse;

import java.util.List;

public interface SheikhService {
    List<SheikhResponse> getAllSheikhs();
    SheikhResponse getSheikhById(Long id);
    SheikhResponse createSheikh(CreateSheikhRequest request);
    SheikhResponse updateSheikh(Long id, UpdateSheikhRequest request);
    void deleteSheikh(Long id);
}