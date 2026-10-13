package com.cms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamResultRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Exam type is required")
    private String examType;

    @NotBlank(message = "Semester is required")
    private String semester;

    @NotNull(message = "Marks obtained is required")
    private Double marksObtained;

    @NotNull(message = "Total marks is required")
    private Double totalMarks;

    private String grade;
    private String remarks;
}
