package com.cms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Department is required")
    private String department;

    private String semester;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    private double totalMarks;
}
