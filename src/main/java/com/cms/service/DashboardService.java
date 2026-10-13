package com.cms.service;

import com.cms.dto.response.DashboardStats;
import com.cms.entity.Student;
import com.cms.entity.Teacher;
import com.cms.enums.AssignmentStatus;
import com.cms.enums.LeaveStatus;
import com.cms.exception.ResourceNotFoundException;
import com.cms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private TeacherRepository teacherRepository;
    @Autowired
    private AttendanceRepository attendanceRepository;
    @Autowired
    private ExamResultRepository examResultRepository;
    @Autowired
    private FeeRecordRepository feeRecordRepository;
    @Autowired
    private AssignmentRepository assignmentRepository;
    @Autowired
    private AssignmentSubmissionRepository submissionRepository;
    @Autowired
    private LeaveRequestRepository leaveRequestRepository;
    @Autowired
    private AttendanceService attendanceService;

    /**
     * Get dashboard stats for a student.
     */
    public DashboardStats getStudentDashboard(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));

        double attendancePercentage = attendanceService.getAttendancePercentage(studentId);
        long pendingAssignments = submissionRepository.countByStudentIdAndStatus(studentId, AssignmentStatus.PENDING);
        long submittedAssignments = submissionRepository.countByStudentId(studentId);
        long pendingLeaves = leaveRequestRepository.countByStudentIdAndStatus(studentId, LeaveStatus.PENDING);

        Double totalFeesDue = feeRecordRepository.getTotalBalanceDueByStudentId(studentId);
        Double totalFeesPaid = feeRecordRepository.getTotalAmountPaidByStudentId(studentId);
        Double averageMarks = examResultRepository.getAveragePercentageByStudentId(studentId);

        return DashboardStats.builder()
                .attendancePercentage(Math.round(attendancePercentage * 100.0) / 100.0)
                .pendingAssignments(pendingAssignments)
                .submittedAssignments(submittedAssignments)
                .pendingLeaves(pendingLeaves)
                .totalFeesDue(totalFeesDue != null ? totalFeesDue : 0.0)
                .totalFeesPaid(totalFeesPaid != null ? totalFeesPaid : 0.0)
                .averageMarks(averageMarks != null ? Math.round(averageMarks * 100.0) / 100.0 : 0.0)
                .build();
    }

    /**
     * Get dashboard stats for a teacher.
     */
    public DashboardStats getTeacherDashboard(Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", teacherId));

        long totalStudents = studentRepository.countByDepartment(teacher.getDepartment());
        long totalAssignments = assignmentRepository.countByTeacherId(teacherId);
        long pendingLeaves = leaveRequestRepository.countByStatus(LeaveStatus.PENDING);

        return DashboardStats.builder()
                .totalStudents(totalStudents)
                .totalAssignments(totalAssignments)
                .pendingLeaves(pendingLeaves)
                .build();
    }
}
