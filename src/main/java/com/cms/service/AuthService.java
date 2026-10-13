package com.cms.service;

import com.cms.dto.request.LoginRequest;
import com.cms.dto.request.RegisterRequest;
import com.cms.dto.response.JwtResponse;
import com.cms.entity.Student;
import com.cms.entity.Teacher;
import com.cms.entity.User;
import com.cms.enums.Role;
import com.cms.exception.BadRequestException;
import com.cms.repository.StudentRepository;
import com.cms.repository.TeacherRepository;
import com.cms.repository.UserRepository;
import com.cms.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Authentication service handling login and registration.
 */
@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     * Authenticate user and return JWT token.
     */
    public JwtResponse login(LoginRequest loginRequest) {
        String identifier = loginRequest.getUsernameOrEmail();
        if (identifier == null || identifier.trim().isEmpty()) {
            throw new BadRequestException("Username or email is required");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        identifier,
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByUsernameOrEmail(identifier, identifier)
                .orElseThrow(() -> new BadRequestException("User not found"));

        Long studentId = null;
        Long teacherId = null;
        Long profileId = null;
        String department = null;
        String semester = null;

        if (user.getRole() == Role.ROLE_STUDENT) {
            var studentOpt = studentRepository.findByUserId(user.getId());
            if (studentOpt.isPresent()) {
                var s = studentOpt.get();
                studentId = s.getId();
                profileId = s.getId();
                department = s.getDepartment();
                semester = s.getSemester();
            }
        } else if (user.getRole() == Role.ROLE_TEACHER) {
            var teacherOpt = teacherRepository.findByUserId(user.getId());
            if (teacherOpt.isPresent()) {
                var t = teacherOpt.get();
                teacherId = t.getId();
                profileId = t.getId();
                department = t.getDepartment();
            }
        }

        return JwtResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .profileId(profileId)
                .studentId(studentId)
                .teacherId(teacherId)
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .department(department)
                .semester(semester)
                .build();
    }

    /**
     * Get details of currently logged-in user.
     */
    public JwtResponse getCurrentUser(String username) {
        User user = userRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new BadRequestException("User not found"));

        Long studentId = null;
        Long teacherId = null;
        Long profileId = null;
        String department = null;
        String semester = null;

        if (user.getRole() == Role.ROLE_STUDENT) {
            var studentOpt = studentRepository.findByUserId(user.getId());
            if (studentOpt.isPresent()) {
                var s = studentOpt.get();
                studentId = s.getId();
                profileId = s.getId();
                department = s.getDepartment();
                semester = s.getSemester();
            }
        } else if (user.getRole() == Role.ROLE_TEACHER) {
            var teacherOpt = teacherRepository.findByUserId(user.getId());
            if (teacherOpt.isPresent()) {
                var t = teacherOpt.get();
                teacherId = t.getId();
                profileId = t.getId();
                department = t.getDepartment();
            }
        }

        return JwtResponse.builder()
                .userId(user.getId())
                .profileId(profileId)
                .studentId(studentId)
                .teacherId(teacherId)
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .department(department)
                .semester(semester)
                .build();
    }

    /**
     * Register a new user (student or teacher).
     */
    @Transactional
    public String register(RegisterRequest request) {
        // Check for existing username/email
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        // Build user entity
        Role role = Role.valueOf(request.getRole().toUpperCase().startsWith("ROLE_")
                ? request.getRole().toUpperCase()
                : "ROLE_" + request.getRole().toUpperCase());

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .role(role)
                .enabled(true)
                .build();

        user = userRepository.save(user);

        // Create role-specific profile
        if (role == Role.ROLE_STUDENT) {
            Student student = Student.builder()
                    .user(user)
                    .rollNumber(request.getRollNumber() != null ? request.getRollNumber()
                            : "STU" + String.format("%05d", user.getId()))
                    .department(request.getDepartment())
                    .semester(request.getSemester())
                    .section(request.getSection())
                    .dateOfBirth(request.getDateOfBirth())
                    .address(request.getAddress())
                    .guardianName(request.getGuardianName())
                    .guardianPhone(request.getGuardianPhone())
                    .year(request.getYear())
                    .build();
            studentRepository.save(student);
        } else if (role == Role.ROLE_TEACHER) {
            Teacher teacher = Teacher.builder()
                    .user(user)
                    .employeeId(request.getEmployeeId() != null ? request.getEmployeeId()
                            : "EMP" + String.format("%05d", user.getId()))
                    .department(request.getDepartment())
                    .designation(request.getDesignation())
                    .qualification(request.getQualification())
                    .specialization(request.getSpecialization())
                    .experienceYears(request.getExperienceYears())
                    .build();
            teacherRepository.save(teacher);
        }

        return "User registered successfully as " + role.name();
    }
}
