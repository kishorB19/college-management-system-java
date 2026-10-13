package com.cms.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Exam results entity storing marks for each subject.
 */
@Entity
@Table(name = "exam_results")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ExamResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private String examType; // MIDTERM, FINAL, QUIZ, INTERNAL

    @Column(nullable = false)
    private String semester;

    private double marksObtained;

    private double totalMarks;

    private String grade;

    private String remarks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entered_by")
    private Teacher enteredBy;
}
