package com.cms.config;

import com.cms.entity.*;
import com.cms.enums.AssignmentStatus;
import com.cms.enums.AttendanceStatus;
import com.cms.enums.FeeStatus;
import com.cms.enums.LeaveStatus;
import com.cms.enums.Role;
import com.cms.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private AssignmentSubmissionRepository submissionRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private ExamResultRepository examResultRepository;

    @Autowired
    private FeeRecordRepository feeRecordRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded with {} users. Skipping initialization.", userRepository.count());
            return;
        }

        log.info("Seeding initial data for College Management System in PostgreSQL...");

        // 1. Create Teacher
        User teacherUser = User.builder()
                .username("teacher")
                .email("teacher@cms.edu")
                .fullName("Dr. Alan Turing")
                .password(passwordEncoder.encode("password123"))
                .phoneNumber("+1-555-0101")
                .role(Role.ROLE_TEACHER)
                .enabled(true)
                .build();
        teacherUser = userRepository.save(teacherUser);

        Teacher teacher = Teacher.builder()
                .user(teacherUser)
                .employeeId("FAC-2024-001")
                .department("Computer Science")
                .designation("Professor & Head of Department")
                .qualification("Ph.D. in Computer Science")
                .specialization("Artificial Intelligence & Algorithms")
                .experienceYears(15)
                .build();
        teacher = teacherRepository.save(teacher);

        // 2. Create Student 1 (Alice)
        User studentUser1 = User.builder()
                .username("student")
                .email("student@cms.edu")
                .fullName("Alice Walker")
                .password(passwordEncoder.encode("password123"))
                .phoneNumber("+1-555-0102")
                .role(Role.ROLE_STUDENT)
                .enabled(true)
                .build();
        studentUser1 = userRepository.save(studentUser1);

        Student student1 = Student.builder()
                .user(studentUser1)
                .rollNumber("CS2024-001")
                .department("Computer Science")
                .semester("Semester 4")
                .section("A")
                .dateOfBirth(LocalDate.of(2004, 5, 14))
                .address("42 Campus Avenue, Silicon Valley")
                .guardianName("Robert Walker")
                .guardianPhone("+1-555-0199")
                .year(2024)
                .build();
        student1 = studentRepository.save(student1);

        // 3. Create Student 2 (Bob)
        User studentUser2 = User.builder()
                .username("bob")
                .email("bob@cms.edu")
                .fullName("Bob Miller")
                .password(passwordEncoder.encode("password123"))
                .phoneNumber("+1-555-0103")
                .role(Role.ROLE_STUDENT)
                .enabled(true)
                .build();
        studentUser2 = userRepository.save(studentUser2);

        Student student2 = Student.builder()
                .user(studentUser2)
                .rollNumber("CS2024-002")
                .department("Computer Science")
                .semester("Semester 4")
                .section("A")
                .dateOfBirth(LocalDate.of(2004, 8, 22))
                .address("108 University Boulevard")
                .guardianName("Sandra Miller")
                .guardianPhone("+1-555-0198")
                .year(2024)
                .build();
        student2 = studentRepository.save(student2);

        // 3b. Create Admin
        User adminUser = User.builder()
                .username("admin")
                .email("admin@cms.edu")
                .fullName("System Administrator")
                .password(passwordEncoder.encode("password123"))
                .phoneNumber("+1-555-0001")
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .build();
        userRepository.save(adminUser);

        // 4. Create Assignments
        Assignment asg1 = Assignment.builder()
                .teacher(teacher)
                .title("Full Stack Web Architecture & REST API Design")
                .subject("Software Engineering")
                .department("Computer Science")
                .semester("Semester 4")
                .dueDate(LocalDate.now().plusDays(7))
                .totalMarks(100.0)
                .description("Design and document a full-stack educational portal using Spring Boot backend and React frontend. Include ER diagrams and OpenAPI specifications.")
                .build();
        asg1 = assignmentRepository.save(asg1);

        Assignment asg2 = Assignment.builder()
                .teacher(teacher)
                .title("Database Normalization & PostgreSQL Optimization")
                .subject("Database Systems")
                .department("Computer Science")
                .semester("Semester 4")
                .dueDate(LocalDate.now().plusDays(14))
                .totalMarks(50.0)
                .description("Analyze BCNF vs 3NF trade-offs in relational database indexing. Write queries with EXPLAIN ANALYZE demonstrating index scans.")
                .build();
        asg2 = assignmentRepository.save(asg2);

        Assignment asg3 = Assignment.builder()
                .teacher(teacher)
                .title("Distributed Consensus & Raft Algorithm Lab")
                .subject("Distributed Systems")
                .department("Computer Science")
                .semester("Semester 4")
                .dueDate(LocalDate.now().minusDays(2))
                .totalMarks(100.0)
                .description("Implement leader election and log replication logic using simulated network partition scenarios.")
                .build();
        asg3 = assignmentRepository.save(asg3);

        // 5. Create Submissions
        AssignmentSubmission sub1 = AssignmentSubmission.builder()
                .assignment(asg1)
                .student(student1)
                .content("Submitted the architecture documentation and GitHub repository link containing Spring Boot REST controllers and React Vite frontend.")
                .fileUrl("https://github.com/example/cms-project")
                .status(AssignmentStatus.GRADED)
                .marksObtained(96.0)
                .feedback("Outstanding architecture design and clean REST API structure. Excellent adherence to standards!")
                .submittedAt(LocalDateTime.now().minusDays(1))
                .gradedAt(LocalDateTime.now())
                .build();
        submissionRepository.save(sub1);

        AssignmentSubmission sub2 = AssignmentSubmission.builder()
                .assignment(asg3)
                .student(student1)
                .content("Completed the leader election algorithm. Partition tolerance tested against 5 virtual nodes.")
                .status(AssignmentStatus.SUBMITTED)
                .submittedAt(LocalDateTime.now().minusDays(1))
                .build();
        submissionRepository.save(sub2);

        // 6. Create Attendance Records for Alice
        String[] subjects = {"Software Engineering", "Database Systems", "Distributed Systems", "Cloud Computing"};
        for (int i = 0; i < 12; i++) {
            AttendanceStatus status = (i == 4) ? AttendanceStatus.LATE : (i == 9 ? AttendanceStatus.ABSENT : AttendanceStatus.PRESENT);
            Attendance att = Attendance.builder()
                    .student(student1)
                    .subject(subjects[i % subjects.length])
                    .date(LocalDate.now().minusDays(14 - i))
                    .status(status)
                    .remarks(status == AttendanceStatus.PRESENT ? "On time & participated" : (status == AttendanceStatus.LATE ? "Traffic delay" : "Medical sick leave"))
                    .markedBy(teacher)
                    .build();
            attendanceRepository.save(att);
        }

        // Attendance for Bob
        for (int i = 0; i < 8; i++) {
            Attendance att = Attendance.builder()
                    .student(student2)
                    .subject(subjects[i % subjects.length])
                    .date(LocalDate.now().minusDays(10 - i))
                    .status(AttendanceStatus.PRESENT)
                    .remarks("Attended")
                    .markedBy(teacher)
                    .build();
            attendanceRepository.save(att);
        }

        // 7. Exam Results for Alice
        examResultRepository.save(ExamResult.builder()
                .student(student1)
                .subject("Software Engineering")
                .examType("MIDTERM")
                .semester("Semester 4")
                .marksObtained(94.0)
                .totalMarks(100.0)
                .grade("A+")
                .remarks("Exceptional conceptual understanding")
                .enteredBy(teacher)
                .build());

        examResultRepository.save(ExamResult.builder()
                .student(student1)
                .subject("Database Systems")
                .examType("MIDTERM")
                .semester("Semester 4")
                .marksObtained(88.0)
                .totalMarks(100.0)
                .grade("A")
                .remarks("Strong SQL query crafting")
                .enteredBy(teacher)
                .build());

        examResultRepository.save(ExamResult.builder()
                .student(student1)
                .subject("Distributed Systems")
                .examType("INTERNAL")
                .semester("Semester 4")
                .marksObtained(47.0)
                .totalMarks(50.0)
                .grade("A+")
                .remarks("Excellent lab demonstration")
                .enteredBy(teacher)
                .build());

        // 8. Fee Records for Alice
        feeRecordRepository.save(FeeRecord.builder()
                .student(student1)
                .feeType("TUITION")
                .amount(2500.0)
                .amountPaid(2500.0)
                .balanceDue(0.0)
                .status(FeeStatus.PAID)
                .dueDate(LocalDate.now().minusDays(30))
                .paymentDate(LocalDate.now().minusDays(25))
                .transactionId("TXN-98472918")
                .semester("Semester 4")
                .remarks("Spring Semester Tuition paid in full")
                .build());

        feeRecordRepository.save(FeeRecord.builder()
                .student(student1)
                .feeType("LAB_AND_LIBRARY")
                .amount(450.0)
                .amountPaid(0.0)
                .balanceDue(450.0)
                .status(FeeStatus.UNPAID)
                .dueDate(LocalDate.now().plusDays(20))
                .semester("Semester 4")
                .remarks("Advanced High Performance Computing Lab Fee")
                .build());

        // 9. Leave Requests for Alice
        leaveRequestRepository.save(LeaveRequest.builder()
                .student(student1)
                .reason("Academic Conference Presentation")
                .description("Attending IEEE Student Tech Symposium to present research paper on distributed consensus.")
                .startDate(LocalDate.now().plusDays(5))
                .endDate(LocalDate.now().plusDays(7))
                .status(LeaveStatus.PENDING)
                .build());

        leaveRequestRepository.save(LeaveRequest.builder()
                .student(student1)
                .reason("Medical Recovery")
                .description("Recovering from seasonal viral fever under medical observation.")
                .startDate(LocalDate.now().minusDays(8))
                .endDate(LocalDate.now().minusDays(7))
                .status(LeaveStatus.APPROVED)
                .responseMessage("Approved. Please submit medical certificate upon return.")
                .reviewedBy(teacher)
                .reviewedAt(LocalDateTime.now().minusDays(7))
                .build());

        log.info("Sample database initialization completed successfully!");
    }
}
