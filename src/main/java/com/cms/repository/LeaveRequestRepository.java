package com.cms.repository;

import com.cms.entity.LeaveRequest;
import com.cms.enums.LeaveStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    List<LeaveRequest> findByStudentId(Long studentId);

    Page<LeaveRequest> findByStudentId(Long studentId, Pageable pageable);

    List<LeaveRequest> findByStatus(LeaveStatus status);

    Page<LeaveRequest> findByStatus(LeaveStatus status, Pageable pageable);

    long countByStudentIdAndStatus(Long studentId, LeaveStatus status);

    long countByStatus(LeaveStatus status);
}
