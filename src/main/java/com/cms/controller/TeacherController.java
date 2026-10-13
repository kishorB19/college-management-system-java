package com.cms.controller;

import com.cms.dto.request.AssignmentRequest;
import com.cms.dto.request.AttendanceRequest;
import com.cms.dto.request.ExamResultRequest;
import com.cms.dto.request.GradeSubmissionRequest;
import com.cms.dto.response.ApiResponse;
import com.cms.dto.response.DashboardStats;
import com.cms.entity.Assignment;
import com.cms.entity.AssignmentSubmission;
import com.cms.entity.Attendance;
import com.cms.entity.ExamResult;
import com.cms.entity.LeaveRequest;
import com.cms.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/teacher", "/teacher"})
@PreAuthorize("hasRole('TEACHER')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TeacherController {

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

    @GetMapping("/dashboard/{teacherId}")
    public ResponseEntity<ApiResponse> getDashboard(@PathVariable Long teacherId) {
        DashboardStats stats = dashboardService.getTeacherDashboard(teacherId);
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved", stats));
    }

    @PostMapping("/attendance/mark")
    public ResponseEntity<ApiResponse> markAttendance(
            @Valid @RequestBody AttendanceRequest request, Authentication auth) {
        Attendance attendance = attendanceService.markAttendance(request, auth);
        return ResponseEntity.ok(ApiResponse.success("Attendance marked", attendance));
    }

    @PostMapping("/results/add")
    public ResponseEntity<ApiResponse> addResult(
            @Valid @RequestBody ExamResultRequest request, Authentication auth) {
        ExamResult result = examResultService.addResult(request, auth);
        return ResponseEntity.ok(ApiResponse.success("Result added", result));
    }

    @PostMapping("/assignments/create")
    public ResponseEntity<ApiResponse> createAssignment(
            @Valid @RequestBody AssignmentRequest request, Authentication auth) {
        Assignment assignment = assignmentService.createAssignment(request, auth);
        return ResponseEntity.ok(ApiResponse.success("Assignment created", assignment));
    }

    @GetMapping("/{teacherId}/assignments")
    public ResponseEntity<ApiResponse> getAssignments(@PathVariable Long teacherId) {
        return ResponseEntity.ok(ApiResponse.success("Assignments retrieved",
                assignmentService.getTeacherAssignments(teacherId)));
    }

    @PostMapping("/assignments/grade/{submissionId}")
    public ResponseEntity<ApiResponse> gradeSubmission(
            @PathVariable Long submissionId,
            @Valid @RequestBody GradeSubmissionRequest request) {
        AssignmentSubmission submission = assignmentService.gradeSubmission(submissionId, request);
        return ResponseEntity.ok(ApiResponse.success("Submission graded", submission));
    }

    @PostMapping("/leaves/review/{leaveId}")
    public ResponseEntity<ApiResponse> reviewLeave(
            @PathVariable Long leaveId,
            @RequestParam String status,
            @RequestParam(required = false) String responseMessage,
            Authentication auth) {
        LeaveRequest leave = leaveService.reviewLeave(leaveId, status, responseMessage, auth);
        return ResponseEntity.ok(ApiResponse.success("Leave reviewed", leave));
    }

    @GetMapping("/leaves/pending")
    public ResponseEntity<ApiResponse> getPendingLeaves() {
        return ResponseEntity.ok(ApiResponse.success("Pending leaves retrieved",
                leaveService.getPendingLeaves()));
    }
}
