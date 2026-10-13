package com.cms.repository;

import com.cms.entity.FeeRecord;
import com.cms.enums.FeeStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeeRecordRepository extends JpaRepository<FeeRecord, Long> {

    List<FeeRecord> findByStudentId(Long studentId);

    Page<FeeRecord> findByStudentId(Long studentId, Pageable pageable);

    List<FeeRecord> findByStudentIdAndStatus(Long studentId, FeeStatus status);

    @Query("SELECT SUM(f.balanceDue) FROM FeeRecord f WHERE f.student.id = :studentId")
    Double getTotalBalanceDueByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT SUM(f.amountPaid) FROM FeeRecord f WHERE f.student.id = :studentId")
    Double getTotalAmountPaidByStudentId(@Param("studentId") Long studentId);

    List<FeeRecord> findByStatus(FeeStatus status);
}
