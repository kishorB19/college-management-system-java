package com.cms.service;

import com.cms.dto.request.AssignmentRequest;
import com.cms.dto.request.GradeSubmissionRequest;
import com.cms.dto.request.SubmissionRequest;
import com.cms.entity.Assignment;
import com.cms.entity.AssignmentSubmission;
import com.cms.entity.Student;
import com.cms.entity.Teacher;
import com.cms.enums.AssignmentStatus;
import com.cms.exception.BadRequestException;
import com.cms.exception.ResourceNotFoundException;
import com.cms.repository.AssignmentRepository;
import com.cms.repository.AssignmentSubmissionRepository;
import com.cms.repository.StudentRepository;
import com.cms.repository.TeacherRepository;
import com.cms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private AssignmentSubmissionRepository submissionRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Create a new assignment (teacher action).
     */
    @Transactional
    public Assignment createAssignment(AssignmentRequest request, Authentication auth) {
        Teacher teacher = teacherRepository.findByUserId(
                userRepository.findByUsername(auth.getName())
                        .orElseThrow(() -> new ResourceNotFoundException("User", "username", auth.getName()))
                        .getId()
        ).orElseThrow(() -> new ResourceNotFoundException("Teacher", "username", auth.getName()));

        Assignment assignment = Assignment.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .subject(request.getSubject())
                .department(request.getDepartment())
                .semester(request.getSemester())
                .dueDate(request.getDueDate())
                .totalMarks(request.getTotalMarks())
                .teacher(teacher)
                .build();

        return assignmentRepository.save(assignment);
    }

    /**
     * Submit an assignment (student action).
     */
    @Transactional
    public AssignmentSubmission submitAssignment(SubmissionRequest request, Authentication auth) {
        Assignment assignment = assignmentRepository.findById(request.getAssignmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Assignment", "id", request.getAssignmentId()));

        Student student = studentRepository.findByUserId(
                userRepository.findByUsername(auth.getName())
                        .orElseThrow(() -> new ResourceNotFoundException("User", "username", auth.getName()))
                        .getId()
        ).orElseThrow(() -> new ResourceNotFoundException("Student", "username", auth.getName()));

        // Check if already submitted
        submissionRepository.findByAssignmentIdAndStudentId(assignment.getId(), student.getId())
                .ifPresent(s -> {
                    throw new BadRequestException("Assignment already submitted");
                });

        AssignmentStatus status = LocalDate.now().isAfter(assignment.getDueDate())
                ? AssignmentStatus.LATE : AssignmentStatus.SUBMITTED;

        AssignmentSubmission submission = AssignmentSubmission.builder()
                .assignment(assignment)
                .student(student)
                .content(request.getContent())
                .fileUrl(request.getFileUrl())
                .status(status)
                .build();

        return submissionRepository.save(submission);
    }

    /**
     * Grade a submission (teacher action).
     */
    @Transactional
    public AssignmentSubmission gradeSubmission(Long submissionId, GradeSubmissionRequest request) {
        AssignmentSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission", "id", submissionId));

        submission.setMarksObtained(request.getMarksObtained());
        submission.setFeedback(request.getFeedback());
        submission.setStatus(AssignmentStatus.GRADED);
        submission.setGradedAt(LocalDateTime.now());

        return submissionRepository.save(submission);
    }

    public List<Assignment> getTeacherAssignments(Long teacherId) {
        return assignmentRepository.findByTeacherId(teacherId);
    }

    public Page<Assignment> getTeacherAssignmentsPaged(Long teacherId, Pageable pageable) {
        return assignmentRepository.findByTeacherId(teacherId, pageable);
    }

    public List<Assignment> getAssignmentsByDeptSemester(String department, String semester) {
        return assignmentRepository.findByDepartmentAndSemester(department, semester);
    }

    public List<AssignmentSubmission> getSubmissionsForAssignment(Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }

    public List<AssignmentSubmission> getStudentSubmissions(Long studentId) {
        return submissionRepository.findByStudentId(studentId);
    }

    public Assignment getAssignmentById(Long id) {
        return assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment", "id", id));
    }

    @Transactional
    public void deleteAssignment(Long id) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment", "id", id));
        assignmentRepository.delete(assignment);
    }
}
