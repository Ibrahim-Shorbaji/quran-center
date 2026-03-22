package com.qurancenter.quran_center.service;

import com.qurancenter.quran_center.dto.request.LoginRequest;
import com.qurancenter.quran_center.dto.response.JwtResponse;

public interface AuthService {
    JwtResponse login(LoginRequest loginRequest);
}