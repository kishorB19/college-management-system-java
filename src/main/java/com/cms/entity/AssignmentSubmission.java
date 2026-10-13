package com.cms.entity;

import com.cms.enums.AssignmentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Student submission for an assignment.
 */
@Entity
@Table(name = "assignment_submissions")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class AssignmentSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String fileUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssignmentStatus status;

    private double marksObtained;

    private String feedback;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime submittedAt;

    private LocalDateTime gradedAt;
}
