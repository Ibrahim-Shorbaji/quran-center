package com.qurancenter.quran_center.service;

import com.qurancenter.quran_center.dto.request.LoginRequest;
import com.qurancenter.quran_center.dto.response.JwtResponse;
import com.qurancenter.quran_center.dto.response.StudentResponse;
import com.qurancenter.quran_center.entity.Student;
import com.qurancenter.quran_center.entity.User;
import com.qurancenter.quran_center.exception.ResourceNotFoundException;
import com.qurancenter.quran_center.repository.SheikhRepository;
import com.qurancenter.quran_center.repository.StudentRepository;
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
    private final StudentRepository studentRepository;
    private final SheikhRepository sheikhRepository;


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


    @Override
    public StudentResponse getMyProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        return StudentResponse.builder()
                .id(student.getId())
                .userId(user.getId())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .phone(user.getPhone())
                .age(student.getAge())
                .dateOfBirth(student.getDateOfBirth())
                .address(student.getAddress())
                .guardianName(student.getGuardianName())
                .guardianPhone(student.getGuardianPhone())
                .enrollmentStatus(student.getEnrollmentStatus())
                .halqaId(student.getHalqa() != null ? student.getHalqa().getId() : null)
                .halqaName(student.getHalqa() != null ? student.getHalqa().getName() : null)
                .createdAt(student.getCreatedAt())
                .build();
    }

}