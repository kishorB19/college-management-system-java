package com.cms.service;

import com.cms.dto.request.LeaveRequestDTO;
import com.cms.entity.LeaveRequest;
import com.cms.entity.Student;
import com.cms.entity.Teacher;
import com.cms.enums.LeaveStatus;
import com.cms.exception.BadRequestException;
import com.cms.exception.ResourceNotFoundException;
import com.cms.repository.LeaveRequestRepository;
import com.cms.repository.StudentRepository;
import com.cms.repository.TeacherRepository;
import com.cms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LeaveService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Apply for leave (student action).
     */
    @Transactional
    public LeaveRequest applyLeave(LeaveRequestDTO request, Authentication auth) {
        Student student = studentRepository.findByUserId(
                userRepository.findByUsername(auth.getName())
                        .orElseThrow(() -> new ResourceNotFoundException("User", "username", auth.getName()))
                        .getId()
        ).orElseThrow(() -> new ResourceNotFoundException("Student", "username", auth.getName()));

        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new BadRequestException("Start date cannot be after end date");
        }

        LeaveRequest leave = LeaveRequest.builder()
                .student(student)
                .reason(request.getReason())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(LeaveStatus.PENDING)
                .build();

        return leaveRequestRepository.save(leave);
    }

    /**
     * Approve or reject a leave request (teacher action).
     */
    @Transactional
    public LeaveRequest reviewLeave(Long leaveId, String status, String responseMessage, Authentication auth) {
        LeaveRequest leave = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("LeaveRequest", "id", leaveId));

        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new BadRequestException("Leave request has already been " + leave.getStatus().name().toLowerCase());
        }

        Teacher teacher = teacherRepository.findByUserId(
                userRepository.findByUsername(auth.getName())
                        .orElseThrow(() -> new ResourceNotFoundException("User", "username", auth.getName()))
                        .getId()
        ).orElse(null);

        leave.setStatus(LeaveStatus.valueOf(status.toUpperCase()));
        leave.setResponseMessage(responseMessage);
        leave.setReviewedBy(teacher);
        leave.setReviewedAt(LocalDateTime.now());

        return leaveRequestRepository.save(leave);
    }

    public List<LeaveRequest> getStudentLeaves(Long studentId) {
        return leaveRequestRepository.findByStudentId(studentId);
    }

    public Page<LeaveRequest> getStudentLeavesPaged(Long studentId, Pageable pageable) {
        return leaveRequestRepository.findByStudentId(studentId, pageable);
    }

    public List<LeaveRequest> getPendingLeaves() {
        return leaveRequestRepository.findByStatus(LeaveStatus.PENDING);
    }

    public Page<LeaveRequest> getPendingLeavesPaged(Pageable pageable) {
        return leaveRequestRepository.findByStatus(LeaveStatus.PENDING, pageable);
    }

    public long countPendingLeaves() {
        return leaveRequestRepository.countByStatus(LeaveStatus.PENDING);
    }

    @Transactional
    public void deleteLeave(Long id) {
        LeaveRequest leave = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LeaveRequest", "id", id));
        leaveRequestRepository.delete(leave);
    }
}
