package com.qurancenter.quran_center.service;

import com.qurancenter.quran_center.dto.request.LoginRequest;
import com.qurancenter.quran_center.dto.response.JwtResponse;
import com.qurancenter.quran_center.entity.User;
import com.qurancenter.quran_center.exception.ResourceNotFoundException;
import com.qurancenter.quran_center.repository.UserRepository;
import com.qurancenter.quran_center.security.jwt.JwtUtils;
import com.qurancenter.quran_center.security.service.UserDetailsImpl;
import com.qurancenter.quran_center.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;


    @Override
    public JwtResponse login(LoginRequest loginRequest) {

        // 1. Authenticate the user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        // 2. Set authentication in security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 3. Generate JWT token
        String jwt = jwtUtils.generateJwtToken(authentication);

        // 4. Get user details from the authentication object
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .orElseThrow()
                .getAuthority()
                .replace("ROLE_", "");

        // 5. Return token + user info
        return new JwtResponse(
                jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                role
        );
    }

    @Override
    public Map<String, Object> getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "fullName", user.getFullName(),
                "role", user.getRole()
        );
    }


}