package com.cms.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String phoneNumber;

    // Role: STUDENT or TEACHER
    @NotBlank(message = "Role is required")
    private String role;

    // Student-specific fields
    private String rollNumber;
    private String department;
    private String semester;
    private String section;
    private LocalDate dateOfBirth;
    private String address;
    private String guardianName;
    private String guardianPhone;
    private int year;

    // Teacher-specific fields
    private String employeeId;
    private String designation;
    private String qualification;
    private String specialization;
    private int experienceYears;
}
