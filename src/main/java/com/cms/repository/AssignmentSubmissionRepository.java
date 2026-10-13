package com.cms.repository;

import com.cms.entity.AssignmentSubmission;
import com.cms.enums.AssignmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Long> {

    List<AssignmentSubmission> findByStudentId(Long studentId);

    Page<AssignmentSubmission> findByStudentId(Long studentId, Pageable pageable);

    List<AssignmentSubmission> findByAssignmentId(Long assignmentId);

    Optional<AssignmentSubmission> findByAssignmentIdAndStudentId(Long assignmentId, Long studentId);

    long countByStudentIdAndStatus(Long studentId, AssignmentStatus status);

    long countByStudentId(Long studentId);
}
