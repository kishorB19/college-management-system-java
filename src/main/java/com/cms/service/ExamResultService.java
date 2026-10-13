package com.cms.service;

import com.cms.dto.request.ExamResultRequest;
import com.cms.entity.ExamResult;
import com.cms.entity.Student;
import com.cms.entity.Teacher;
import com.cms.exception.ResourceNotFoundException;
import com.cms.repository.ExamResultRepository;
import com.cms.repository.StudentRepository;
import com.cms.repository.TeacherRepository;
import com.cms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ExamResultService {

    @Autowired
    private ExamResultRepository examResultRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Add exam result for a student (teacher action).
     */
    @Transactional
    public ExamResult addResult(ExamResultRequest request, Authentication auth) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", request.getStudentId()));

        Teacher teacher = teacherRepository.findByUserId(
                userRepository.findByUsername(auth.getName())
                        .orElseThrow(() -> new ResourceNotFoundException("User", "username", auth.getName()))
                        .getId()
        ).orElse(null);

        // Auto-calculate grade if not provided
        String grade = request.getGrade();
        if (grade == null || grade.isBlank()) {
            double percentage = (request.getMarksObtained() / request.getTotalMarks()) * 100;
            grade = calculateGrade(percentage);
        }

        ExamResult result = ExamResult.builder()
                .student(student)
                .subject(request.getSubject())
                .examType(request.getExamType())
                .semester(request.getSemester())
                .marksObtained(request.getMarksObtained())
                .totalMarks(request.getTotalMarks())
                .grade(grade)
                .remarks(request.getRemarks())
                .enteredBy(teacher)
                .build();

        return examResultRepository.save(result);
    }

    /**
     * Get results for a student.
     */
    public List<ExamResult> getStudentResults(Long studentId) {
        return examResultRepository.findByStudentId(studentId);
    }

    public Page<ExamResult> getStudentResultsPaged(Long studentId, Pageable pageable) {
        return examResultRepository.findByStudentId(studentId, pageable);
    }

    public List<ExamResult> getStudentResultsBySemester(Long studentId, String semester) {
        return examResultRepository.findByStudentIdAndSemester(studentId, semester);
    }

    public Double getAveragePercentage(Long studentId) {
        Double avg = examResultRepository.getAveragePercentageByStudentId(studentId);
        return avg != null ? avg : 0.0;
    }

    @Transactional
    public void deleteResult(Long id) {
        ExamResult result = examResultRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ExamResult", "id", id));
        examResultRepository.delete(result);
    }

    private String calculateGrade(double percentage) {
        if (percentage >= 90) return "A+";
        if (percentage >= 80) return "A";
        if (percentage >= 70) return "B+";
        if (percentage >= 60) return "B";
        if (percentage >= 50) return "C";
        if (percentage >= 40) return "D";
        return "F";
    }
}
