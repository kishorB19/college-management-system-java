package com.cms.repository;

import com.cms.entity.Attendance;
import com.cms.enums.AttendanceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByStudentId(Long studentId);

    Page<Attendance> findByStudentId(Long studentId, Pageable pageable);

    List<Attendance> findByStudentIdAndSubject(Long studentId, String subject);

    List<Attendance> findByStudentIdAndDateBetween(Long studentId, LocalDate start, LocalDate end);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.status = :status")
    long countByStudentIdAndStatus(@Param("studentId") Long studentId, @Param("status") AttendanceStatus status);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId")
    long countByStudentId(@Param("studentId") Long studentId);

    List<Attendance> findBySubjectAndDate(String subject, LocalDate date);
}
