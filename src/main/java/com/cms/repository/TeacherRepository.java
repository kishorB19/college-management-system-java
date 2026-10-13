package com.cms.repository;

import com.cms.entity.Teacher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {

    Optional<Teacher> findByEmployeeId(String employeeId);

    Optional<Teacher> findByUserId(Long userId);

    List<Teacher> findByDepartment(String department);

    Page<Teacher> findByDepartment(String department, Pageable pageable);

    @Query("SELECT t FROM Teacher t WHERE " +
            "LOWER(t.user.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(t.employeeId) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(t.department) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Teacher> searchTeachers(@Param("keyword") String keyword, Pageable pageable);
}
