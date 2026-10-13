package com.cms.repository;

import com.cms.entity.ExamResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamResultRepository extends JpaRepository<ExamResult, Long> {

    List<ExamResult> findByStudentId(Long studentId);

    Page<ExamResult> findByStudentId(Long studentId, Pageable pageable);

    List<ExamResult> findByStudentIdAndSemester(Long studentId, String semester);

    List<ExamResult> findByStudentIdAndExamType(Long studentId, String examType);

    @Query("SELECT AVG(e.marksObtained / e.totalMarks * 100) FROM ExamResult e WHERE e.student.id = :studentId")
    Double getAveragePercentageByStudentId(@Param("studentId") Long studentId);

    List<ExamResult> findBySubjectAndExamType(String subject, String examType);
}
