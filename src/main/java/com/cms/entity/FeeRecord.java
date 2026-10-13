package com.cms.entity;

import com.cms.enums.FeeStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Fee record entity tracking student fee payments.
 */
@Entity
@Table(name = "fee_records")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class FeeRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "user"})
    private Student student;

    @Column(nullable = false)
    private String feeType; // TUITION, EXAM, LIBRARY, LAB, HOSTEL

    @Column(nullable = false)
    private double amount;

    private double amountPaid;

    private double balanceDue;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FeeStatus status;

    private LocalDate dueDate;

    private LocalDate paymentDate;

    private String transactionId;

    private String semester;

    private String remarks;
}
