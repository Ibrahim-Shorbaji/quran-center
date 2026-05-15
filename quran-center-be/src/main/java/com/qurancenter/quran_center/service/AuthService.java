package com.qurancenter.quran_center.service;

import com.qurancenter.quran_center.dto.request.LoginRequest;
import com.qurancenter.quran_center.dto.response.JwtResponse;
import com.qurancenter.quran_center.dto.response.StudentResponse;

import java.util.Map;

public interface AuthService {
    JwtResponse login(LoginRequest loginRequest);
    Map<String, Object> getCurrentUser(String username);
    StudentResponse getMyProfile(String username);
}