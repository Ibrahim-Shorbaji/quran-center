package com.qurancenter.quran_center.service;

import com.qurancenter.quran_center.dto.request.CreateSheikhRequest;
import com.qurancenter.quran_center.dto.request.UpdateSheikhRequest;
import com.qurancenter.quran_center.dto.response.SheikhResponse;
import com.qurancenter.quran_center.entity.Sheikh;
import com.qurancenter.quran_center.entity.User;
import com.qurancenter.quran_center.enums.Role;
import com.qurancenter.quran_center.repository.SheikhRepository;
import com.qurancenter.quran_center.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SheikhServiceImpl implements SheikhService {

    private final SheikhRepository sheikhRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<SheikhResponse> getAllSheikhs() {
        return sheikhRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SheikhResponse getSheikhById(Long id) {
        Sheikh sheikh = sheikhRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sheikh not found with id: " + id));
        return mapToResponse(sheikh);
    }

    @Override
    @Transactional
    public SheikhResponse createSheikh(CreateSheikhRequest request) {
        // 1. Check username not taken
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists: " + request.getUsername());
        }

        // 2. Create User
        User user = User.builder()
                .fullName(request.getFullName())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .email(request.getEmail())
                .role(Role.SHEIKH)
                .active(true)
                .build();
        userRepository.save(user);

        // 3. Create Sheikh
        Sheikh sheikh = Sheikh.builder()
                .user(user)
                .build();
        sheikhRepository.save(sheikh);

        return mapToResponse(sheikh);
    }

    @Override
    @Transactional
    public SheikhResponse updateSheikh(Long id, UpdateSheikhRequest request) {
        Sheikh sheikh = sheikhRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sheikh not found with id: " + id));

        User user = sheikh.getUser();
        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        userRepository.save(user);

        return mapToResponse(sheikh);
    }

    @Override
    @Transactional
    public void deleteSheikh(Long id) {
        Sheikh sheikh = sheikhRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sheikh not found with id: " + id));
        sheikhRepository.delete(sheikh);
    }

    private SheikhResponse mapToResponse(Sheikh sheikh) {
        return SheikhResponse.builder()
                .id(sheikh.getId())
                .userId(sheikh.getUser().getId())
                .fullName(sheikh.getUser().getFullName())
                .username(sheikh.getUser().getUsername())
                .phone(sheikh.getUser().getPhone())
                .email(sheikh.getUser().getEmail())
                .halqaCount(sheikh.getHalqas() != null ? sheikh.getHalqas().size() : 0)
                .createdAt(sheikh.getCreatedAt())
                .build();
    }
}