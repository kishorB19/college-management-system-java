package com.cms.repository;

import com.cms.entity.Assignment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    List<Assignment> findByTeacherId(Long teacherId);

    Page<Assignment> findByTeacherId(Long teacherId, Pageable pageable);

    List<Assignment> findByDepartmentAndSemester(String department, String semester);

    Page<Assignment> findByDepartmentAndSemester(String department, String semester, Pageable pageable);

    List<Assignment> findByDepartment(String department);

    long countByTeacherId(Long teacherId);
}
