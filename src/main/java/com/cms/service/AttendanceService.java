package com.cms.service;

import com.cms.dto.request.AttendanceRequest;
import com.cms.entity.Attendance;
import com.cms.entity.Student;
import com.cms.entity.Teacher;
import com.cms.enums.AttendanceStatus;
import com.cms.exception.ResourceNotFoundException;
import com.cms.repository.AttendanceRepository;
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
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Mark attendance for a student (teacher action).
     */
    @Transactional
    public Attendance markAttendance(AttendanceRequest request, Authentication auth) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", request.getStudentId()));

        Teacher teacher = teacherRepository.findByUserId(
                userRepository.findByUsername(auth.getName())
                        .orElseThrow(() -> new ResourceNotFoundException("User", "username", auth.getName()))
                        .getId()
        ).orElse(null);

        Attendance attendance = Attendance.builder()
                .student(student)
                .subject(request.getSubject())
                .date(request.getDate())
                .status(AttendanceStatus.valueOf(request.getStatus().toUpperCase()))
                .remarks(request.getRemarks())
                .markedBy(teacher)
                .build();

        return attendanceRepository.save(attendance);
    }

    /**
     * Get attendance records for a student.
     */
    public Page<Attendance> getStudentAttendance(Long studentId, Pageable pageable) {
        return attendanceRepository.findByStudentId(studentId, pageable);
    }

    /**
     * Get attendance by student ID (list).
     */
    public List<Attendance> getStudentAttendanceList(Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    /**
     * Calculate attendance percentage for a student.
     */
    public double getAttendancePercentage(Long studentId) {
        long total = attendanceRepository.countByStudentId(studentId);
        if (total == 0) return 0.0;
        long present = attendanceRepository.countByStudentIdAndStatus(studentId, AttendanceStatus.PRESENT);
        long late = attendanceRepository.countByStudentIdAndStatus(studentId, AttendanceStatus.LATE);
        return ((double) (present + late) / total) * 100.0;
    }

    /**
     * Delete attendance record.
     */
    @Transactional
    public void deleteAttendance(Long id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance", "id", id));
        attendanceRepository.delete(attendance);
    }
}
