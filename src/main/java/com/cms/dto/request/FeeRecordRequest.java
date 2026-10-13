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
public class FeeRecordRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotBlank(message = "Fee type is required")
    private String feeType;

    @NotNull(message = "Amount is required")
    private Double amount;

    private Double amountPaid;

    @NotBlank(message = "Status is required")
    private String status;

    private LocalDate dueDate;
    private LocalDate paymentDate;
    private String transactionId;
    private String semester;
    private String remarks;
}
