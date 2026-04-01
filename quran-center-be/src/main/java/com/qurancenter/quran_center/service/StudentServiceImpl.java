package com.qurancenter.quran_center.service;

import com.qurancenter.quran_center.dto.request.CreateStudentRequest;
import com.qurancenter.quran_center.dto.request.UpdateStudentRequest;
import com.qurancenter.quran_center.dto.response.StudentResponse;
import com.qurancenter.quran_center.entity.Halqa;
import com.qurancenter.quran_center.entity.Student;
import com.qurancenter.quran_center.entity.User;
import com.qurancenter.quran_center.enums.EnrollmentStatus;
import com.qurancenter.quran_center.enums.Role;
import com.qurancenter.quran_center.exception.BusinessException;
import com.qurancenter.quran_center.exception.ResourceNotFoundException;
import com.qurancenter.quran_center.repository.HalqaRepository;
import com.qurancenter.quran_center.repository.StudentRepository;
import com.qurancenter.quran_center.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final HalqaRepository halqaRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<StudentResponse> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return mapToResponse(student);
    }

    @Override
    @Transactional
    public StudentResponse createStudent(CreateStudentRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("Username already exists: " + request.getUsername());
        }

        // 1. Create User
        User user = User.builder()
                .fullName(request.getFullName())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(Role.STUDENT)
                .active(true)
                .build();
        userRepository.save(user);

        // 2. Get Halqa if provided
        Halqa halqa = null;
        if (request.getHalqaId() != null) {
            halqa = halqaRepository.findById(request.getHalqaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Halqa not found with id: " + request.getHalqaId()));
        }

        // 3. Create Student
        Student student = Student.builder()
                .user(user)
                .age(request.getAge())
                .dateOfBirth(request.getDateOfBirth())
                .address(request.getAddress())
                .guardianName(request.getGuardianName())
                .guardianPhone(request.getGuardianPhone())
                .enrollmentStatus(request.getEnrollmentStatus() != null
                        ? request.getEnrollmentStatus()
                        : EnrollmentStatus.ACTIVE)
                .halqa(halqa)
                .build();
        studentRepository.save(student);

        return mapToResponse(student);
    }

    @Override
    @Transactional
    public StudentResponse updateStudent(Long id, UpdateStudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        User user = student.getUser();
        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        userRepository.save(user);

        if (request.getAge() != null) student.setAge(request.getAge());
        if (request.getDateOfBirth() != null) student.setDateOfBirth(request.getDateOfBirth());
        if (request.getAddress() != null) student.setAddress(request.getAddress());
        if (request.getGuardianName() != null) student.setGuardianName(request.getGuardianName());
        if (request.getGuardianPhone() != null) student.setGuardianPhone(request.getGuardianPhone());
        if (request.getEnrollmentStatus() != null) student.setEnrollmentStatus(request.getEnrollmentStatus());
        if (request.getHalqaId() != null) {
            Halqa halqa = halqaRepository.findById(request.getHalqaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Halqa not found with id: " + request.getHalqaId()));
            student.setHalqa(halqa);
        }
        studentRepository.save(student);

        return mapToResponse(student);
    }

    @Override
    @Transactional
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        studentRepository.delete(student);
    }

    // ── Helper ─────────────────────────────────────────────────────────────
    private StudentResponse mapToResponse(Student student) {
        return StudentResponse.builder()
                .id(student.getId())
                .userId(student.getUser().getId())
                .fullName(student.getUser().getFullName())
                .username(student.getUser().getUsername())
                .phone(student.getUser().getPhone())
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