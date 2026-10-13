package com.cms.service;

import com.cms.dto.request.FeeRecordRequest;
import com.cms.entity.FeeRecord;
import com.cms.entity.Student;
import com.cms.enums.FeeStatus;
import com.cms.exception.ResourceNotFoundException;
import com.cms.repository.FeeRecordRepository;
import com.cms.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FeeService {

    @Autowired
    private FeeRecordRepository feeRecordRepository;

    @Autowired
    private StudentRepository studentRepository;

    /**
     * Create or update a fee record.
     */
    @Transactional
    public FeeRecord createFeeRecord(FeeRecordRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", request.getStudentId()));

        double amountPaid = request.getAmountPaid() != null ? request.getAmountPaid() : 0.0;
        double balanceDue = request.getAmount() - amountPaid;

        FeeRecord record = FeeRecord.builder()
                .student(student)
                .feeType(request.getFeeType())
                .amount(request.getAmount())
                .amountPaid(amountPaid)
                .balanceDue(balanceDue)
                .status(FeeStatus.valueOf(request.getStatus().toUpperCase()))
                .dueDate(request.getDueDate())
                .paymentDate(request.getPaymentDate())
                .transactionId(request.getTransactionId())
                .semester(request.getSemester())
                .remarks(request.getRemarks())
                .build();

        return feeRecordRepository.save(record);
    }

    public List<FeeRecord> getStudentFees(Long studentId) {
        return feeRecordRepository.findByStudentId(studentId);
    }

    public Page<FeeRecord> getStudentFeesPaged(Long studentId, Pageable pageable) {
        return feeRecordRepository.findByStudentId(studentId, pageable);
    }

    public Double getTotalBalanceDue(Long studentId) {
        Double balance = feeRecordRepository.getTotalBalanceDueByStudentId(studentId);
        return balance != null ? balance : 0.0;
    }

    public Double getTotalAmountPaid(Long studentId) {
        Double paid = feeRecordRepository.getTotalAmountPaidByStudentId(studentId);
        return paid != null ? paid : 0.0;
    }

    @Transactional
    public FeeRecord updateFeeRecord(Long id, FeeRecordRequest request) {
        FeeRecord record = feeRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FeeRecord", "id", id));

        double amountPaid = request.getAmountPaid() != null ? request.getAmountPaid() : record.getAmountPaid();
        record.setAmountPaid(amountPaid);
        record.setBalanceDue(record.getAmount() - amountPaid);
        record.setStatus(FeeStatus.valueOf(request.getStatus().toUpperCase()));
        record.setPaymentDate(request.getPaymentDate());
        record.setTransactionId(request.getTransactionId());
        record.setRemarks(request.getRemarks());

        return feeRecordRepository.save(record);
    }

    @Transactional
    public FeeRecord payFee(Long id) {
        FeeRecord record = feeRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FeeRecord", "id", id));
        record.setAmountPaid(record.getAmount());
        record.setBalanceDue(0.0);
        record.setStatus(FeeStatus.PAID);
        record.setPaymentDate(java.time.LocalDate.now());
        record.setTransactionId("TXN-" + System.currentTimeMillis());
        record.setRemarks("Paid online via student portal");
        return feeRecordRepository.save(record);
    }

    @Transactional
    public void deleteFeeRecord(Long id) {
        FeeRecord record = feeRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FeeRecord", "id", id));
        feeRecordRepository.delete(record);
    }
}
