package com.cms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Dashboard statistics for student and teacher views.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStats {
    private long totalStudents;
    private long totalTeachers;
    private double attendancePercentage;
    private long pendingAssignments;
    private long pendingLeaves;
    private double totalFeesDue;
    private double totalFeesPaid;
    private long totalAssignments;
    private long submittedAssignments;
    private double averageMarks;
}
