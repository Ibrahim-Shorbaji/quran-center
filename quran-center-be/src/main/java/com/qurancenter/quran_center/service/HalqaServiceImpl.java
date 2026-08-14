package com.qurancenter.quran_center.service;

import com.qurancenter.quran_center.dto.request.CreateHalqaRequest;
import com.qurancenter.quran_center.dto.request.UpdateHalqaRequest;
import com.qurancenter.quran_center.dto.response.HalqaResponse;
import com.qurancenter.quran_center.entity.Halqa;
import com.qurancenter.quran_center.entity.Sheikh;
import com.qurancenter.quran_center.entity.User;
import com.qurancenter.quran_center.enums.Role;
import com.qurancenter.quran_center.exception.ResourceNotFoundException;
import com.qurancenter.quran_center.repository.HalqaRepository;
import com.qurancenter.quran_center.repository.SheikhRepository;
import com.qurancenter.quran_center.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HalqaServiceImpl implements HalqaService {

    private final HalqaRepository halqaRepository;
    private final SheikhRepository sheikhRepository;
    private final UserRepository userRepository;

    @Override
    public List<HalqaResponse> getHalqasForUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        List<Halqa> halqas;
        if (user.getRole() == Role.SHEIKH) {
            Sheikh sheikh = sheikhRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Sheikh not found for user: " + username));
            halqas = halqaRepository.findBySheikhId(sheikh.getId());
        } else {
            halqas = halqaRepository.findAll();
        }

        return halqas.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public HalqaResponse getHalqaById(Long id) {
        Halqa halqa = halqaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Halqa not found with id: " + id));
        return mapToResponse(halqa);
    }

    @Override
    @Transactional
    public HalqaResponse createHalqa(CreateHalqaRequest request) {
        Sheikh sheikh = sheikhRepository.findById(request.getSheikhId())
                .orElseThrow(() -> new ResourceNotFoundException("Sheikh not found with id: " + request.getSheikhId()));

        Halqa halqa = Halqa.builder()
                .name(request.getName())
                .schedule(request.getSchedule())
                .maxStudents(request.getMaxStudents())
                .sheikh(sheikh)
                .active(true)
                .build();

        halqaRepository.save(halqa);
        return mapToResponse(halqa);
    }

    @Override
    @Transactional
    public HalqaResponse updateHalqa(Long id, UpdateHalqaRequest request) {
        Halqa halqa = halqaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Halqa not found with id: " + id));

        if (request.getName() != null) halqa.setName(request.getName());
        if (request.getSchedule() != null) halqa.setSchedule(request.getSchedule());
        if (request.getMaxStudents() != null) halqa.setMaxStudents(request.getMaxStudents());
        if (request.getSheikhId() != null) {
            Sheikh sheikh = sheikhRepository.findById(request.getSheikhId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sheikh not found with id: " + request.getSheikhId()));
            halqa.setSheikh(sheikh);
        }

        halqaRepository.save(halqa);
        return mapToResponse(halqa);
    }

    @Override
    @Transactional
    public void deleteHalqa(Long id) {
        Halqa halqa = halqaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Halqa not found with id: " + id));
        halqaRepository.delete(halqa);
    }

    private HalqaResponse mapToResponse(Halqa halqa) {
        return HalqaResponse.builder()
                .id(halqa.getId())
                .name(halqa.getName())
                .schedule(halqa.getSchedule())
                .maxStudents(halqa.getMaxStudents())
                .currentStudents(halqa.getStudents() != null ? halqa.getStudents().size() : 0)
                .sheikhId(halqa.getSheikh() != null ? halqa.getSheikh().getId() : null)
                .sheikhName(halqa.getSheikh() != null ? halqa.getSheikh().getUser().getFullName() : null)
                .active(halqa.isActive())
                .createdAt(halqa.getCreatedAt())
                .build();
    }
}