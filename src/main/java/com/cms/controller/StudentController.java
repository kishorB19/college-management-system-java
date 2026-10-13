package com.cms.controller;

import com.cms.dto.request.LeaveRequestDTO;
import com.cms.dto.request.SubmissionRequest;
import com.cms.dto.response.ApiResponse;
import com.cms.dto.response.DashboardStats;
import com.cms.entity.AssignmentSubmission;
import com.cms.entity.FeeRecord;
import com.cms.entity.LeaveRequest;
import com.cms.entity.Student;
import com.cms.exception.ResourceNotFoundException;
import com.cms.repository.StudentRepository;
import com.cms.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/student", "/student"})
@PreAuthorize("hasRole('STUDENT')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class StudentController {

    @Autowired
    private DashboardService dashboardService;
    @Autowired
    private AssignmentService assignmentService;
    @Autowired
    private LeaveService leaveService;
    @Autowired
    private AttendanceService attendanceService;
    @Autowired
    private ExamResultService examResultService;
    @Autowired
    private FeeService feeService;
    @Autowired
    private StudentRepository studentRepository;

    private Student getStudent(Long studentId) {
        return studentRepository.findById(studentId)
                .or(() -> studentRepository.findByUserId(studentId))
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));
    }

    @GetMapping("/dashboard/{studentId}")
    public ResponseEntity<ApiResponse> getDashboard(@PathVariable Long studentId) {
        DashboardStats stats = dashboardService.getStudentDashboard(studentId);
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved", stats));
    }

    @GetMapping("/{studentId}/profile")
    public ResponseEntity<ApiResponse> getProfile(@PathVariable Long studentId) {
        Student student = getStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success("Student profile retrieved", student));
    }

    @GetMapping("/{studentId}/attendance")
    public ResponseEntity<ApiResponse> getAttendance(@PathVariable Long studentId) {
        Student student = getStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success("Attendance retrieved",
                attendanceService.getStudentAttendanceList(student.getId())));
    }

    @GetMapping("/{studentId}/results")
    public ResponseEntity<ApiResponse> getResults(@PathVariable Long studentId) {
        Student student = getStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success("Results retrieved",
                examResultService.getStudentResults(student.getId())));
    }

    @GetMapping("/{studentId}/fees")
    public ResponseEntity<ApiResponse> getFees(@PathVariable Long studentId) {
        Student student = getStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success("Fees retrieved",
                feeService.getStudentFees(student.getId())));
    }

    @PostMapping("/fees/pay/{feeId}")
    public ResponseEntity<ApiResponse> payFee(@PathVariable Long feeId) {
        FeeRecord fee = feeService.payFee(feeId);
        return ResponseEntity.ok(ApiResponse.success("Fee paid successfully", fee));
    }

    @PostMapping("/assignments/submit")
    public ResponseEntity<ApiResponse> submitAssignment(
            @Valid @RequestBody SubmissionRequest request, Authentication auth) {
        AssignmentSubmission submission = assignmentService.submitAssignment(request, auth);
        return ResponseEntity.ok(ApiResponse.success("Assignment submitted successfully", submission));
    }

    @GetMapping("/{studentId}/assignments")
    public ResponseEntity<ApiResponse> getAssignments(@PathVariable Long studentId) {
        Student student = getStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success("Submissions retrieved",
                assignmentService.getStudentSubmissions(student.getId())));
    }

    @GetMapping("/{studentId}/available-assignments")
    public ResponseEntity<ApiResponse> getAvailableAssignments(@PathVariable Long studentId) {
        Student student = getStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success("Available assignments retrieved",
                assignmentService.getAssignmentsByDeptSemester(student.getDepartment(), student.getSemester())));
    }

    @PostMapping("/leaves/apply")
    public ResponseEntity<ApiResponse> applyLeave(
            @Valid @RequestBody LeaveRequestDTO request, Authentication auth) {
        LeaveRequest leave = leaveService.applyLeave(request, auth);
        return ResponseEntity.ok(ApiResponse.success("Leave applied successfully", leave));
    }

    @GetMapping("/{studentId}/leaves")
    public ResponseEntity<ApiResponse> getLeaves(@PathVariable Long studentId) {
        Student student = getStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success("Leaves retrieved",
                leaveService.getStudentLeaves(student.getId())));
    }
}
