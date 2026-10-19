// Seamless in-browser demo engine for cloud deployments when backend is offline
const STORAGE_KEY = 'cms_demo_store_v1';

function getInitialState() {
  const today = new Date();
  const formatDate = (daysOffset) => {
    const d = new Date(today);
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split('T')[0];
  };

  return {
    users: [
      {
        userId: 1,
        studentId: 1,
        username: 'student',
        fullName: 'Alice Walker',
        email: 'student@cms.edu',
        role: 'ROLE_STUDENT',
        department: 'Computer Science',
        semester: 'Semester 4',
        rollNumber: 'CS2024-001',
        section: 'A',
      },
      {
        userId: 2,
        studentId: 2,
        username: 'bob',
        fullName: 'Bob Miller',
        email: 'bob@cms.edu',
        role: 'ROLE_STUDENT',
        department: 'Computer Science',
        semester: 'Semester 4',
        rollNumber: 'CS2024-002',
        section: 'A',
      },
      {
        userId: 3,
        teacherId: 1,
        username: 'teacher',
        fullName: 'Dr. Alan Turing',
        email: 'teacher@cms.edu',
        role: 'ROLE_TEACHER',
        department: 'Computer Science',
        designation: 'Professor & Head of Department',
        employeeId: 'FAC-2024-001',
        qualification: 'Ph.D. in Computer Science',
        specialization: 'Artificial Intelligence & Algorithms',
        experienceYears: 15,
      },
      {
        userId: 4,
        username: 'admin',
        fullName: 'System Administrator',
        email: 'admin@cms.edu',
        role: 'ROLE_ADMIN',
      },
    ],
    assignments: [
      {
        id: 1,
        title: 'Full Stack Web Architecture & REST API Design',
        subject: 'Software Engineering',
        department: 'Computer Science',
        semester: 'Semester 4',
        dueDate: formatDate(7),
        totalMarks: 100.0,
        description: 'Design and document a full-stack educational portal using Spring Boot backend and React frontend. Include ER diagrams and OpenAPI specifications.',
        teacherName: 'Dr. Alan Turing',
      },
      {
        id: 2,
        title: 'Database Normalization & PostgreSQL Optimization',
        subject: 'Database Systems',
        department: 'Computer Science',
        semester: 'Semester 4',
        dueDate: formatDate(14),
        totalMarks: 50.0,
        description: 'Analyze BCNF vs 3NF trade-offs in relational database indexing. Write queries with EXPLAIN ANALYZE demonstrating index scans.',
        teacherName: 'Dr. Alan Turing',
      },
      {
        id: 3,
        title: 'Distributed Consensus & Raft Algorithm Lab',
        subject: 'Distributed Systems',
        department: 'Computer Science',
        semester: 'Semester 4',
        dueDate: formatDate(-2),
        totalMarks: 100.0,
        description: 'Implement leader election and log replication logic using simulated network partition scenarios.',
        teacherName: 'Dr. Alan Turing',
      },
    ],
    submissions: [
      {
        id: 1,
        assignmentId: 1,
        assignmentTitle: 'Full Stack Web Architecture & REST API Design',
        subject: 'Software Engineering',
        studentId: 1,
        studentName: 'Alice Walker',
        rollNumber: 'CS2024-001',
        content: 'Submitted the architecture documentation and GitHub repository link containing Spring Boot REST controllers and React Vite frontend.',
        fileUrl: 'https://github.com/example/cms-project',
        status: 'GRADED',
        marksObtained: 96.0,
        totalMarks: 100.0,
        feedback: 'Outstanding architecture design and clean REST API structure. Excellent adherence to standards!',
        submittedAt: formatDate(-1) + 'T14:30:00',
        gradedAt: formatDate(0) + 'T10:15:00',
      },
      {
        id: 2,
        assignmentId: 3,
        assignmentTitle: 'Distributed Consensus & Raft Algorithm Lab',
        subject: 'Distributed Systems',
        studentId: 1,
        studentName: 'Alice Walker',
        rollNumber: 'CS2024-001',
        content: 'Completed the leader election algorithm. Partition tolerance tested against 5 virtual nodes.',
        fileUrl: 'https://github.com/example/raft-consensus',
        status: 'SUBMITTED',
        marksObtained: null,
        totalMarks: 100.0,
        feedback: null,
        submittedAt: formatDate(-1) + 'T16:45:00',
      },
    ],
    attendance: [
      { id: 1, studentId: 1, subject: 'Software Engineering', date: formatDate(-14), status: 'PRESENT', remarks: 'On time & participated' },
      { id: 2, studentId: 1, subject: 'Database Systems', date: formatDate(-13), status: 'PRESENT', remarks: 'On time & participated' },
      { id: 3, studentId: 1, subject: 'Distributed Systems', date: formatDate(-12), status: 'PRESENT', remarks: 'On time & participated' },
      { id: 4, studentId: 1, subject: 'Cloud Computing', date: formatDate(-11), status: 'PRESENT', remarks: 'On time & participated' },
      { id: 5, studentId: 1, subject: 'Software Engineering', date: formatDate(-10), status: 'LATE', remarks: 'Traffic delay' },
      { id: 6, studentId: 1, subject: 'Database Systems', date: formatDate(-9), status: 'PRESENT', remarks: 'On time & participated' },
      { id: 7, studentId: 1, subject: 'Distributed Systems', date: formatDate(-8), status: 'PRESENT', remarks: 'On time & participated' },
      { id: 8, studentId: 1, subject: 'Cloud Computing', date: formatDate(-7), status: 'PRESENT', remarks: 'On time & participated' },
      { id: 9, studentId: 1, subject: 'Software Engineering', date: formatDate(-6), status: 'PRESENT', remarks: 'On time & participated' },
      { id: 10, studentId: 1, subject: 'Database Systems', date: formatDate(-5), status: 'ABSENT', remarks: 'Medical sick leave' },
      { id: 11, studentId: 1, subject: 'Distributed Systems', date: formatDate(-4), status: 'PRESENT', remarks: 'On time & participated' },
      { id: 12, studentId: 1, subject: 'Cloud Computing', date: formatDate(-3), status: 'PRESENT', remarks: 'On time & participated' },
    ],
    results: [
      {
        id: 1,
        studentId: 1,
        subject: 'Software Engineering',
        examType: 'MIDTERM',
        semester: 'Semester 4',
        marksObtained: 94.0,
        totalMarks: 100.0,
        grade: 'A+',
        remarks: 'Exceptional conceptual understanding',
      },
      {
        id: 2,
        studentId: 1,
        subject: 'Database Systems',
        examType: 'MIDTERM',
        semester: 'Semester 4',
        marksObtained: 88.0,
        totalMarks: 100.0,
        grade: 'A',
        remarks: 'Strong SQL query crafting',
      },
      {
        id: 3,
        studentId: 1,
        subject: 'Distributed Systems',
        examType: 'INTERNAL',
        semester: 'Semester 4',
        marksObtained: 47.0,
        totalMarks: 50.0,
        grade: 'A+',
        remarks: 'Excellent lab demonstration',
      },
    ],
    fees: [
      {
        id: 1,
        studentId: 1,
        feeType: 'TUITION',
        amount: 2500.0,
        amountPaid: 2500.0,
        balanceDue: 0.0,
        status: 'PAID',
        dueDate: formatDate(-30),
        paymentDate: formatDate(-25),
        transactionId: 'TXN-98472918',
        semester: 'Semester 4',
        remarks: 'Spring Semester Tuition paid in full',
      },
      {
        id: 2,
        studentId: 1,
        feeType: 'LAB_AND_LIBRARY',
        amount: 450.0,
        amountPaid: 0.0,
        balanceDue: 450.0,
        status: 'UNPAID',
        dueDate: formatDate(20),
        paymentDate: null,
        transactionId: null,
        semester: 'Semester 4',
        remarks: 'Advanced High Performance Computing Lab Fee',
      },
    ],
    leaves: [
      {
        id: 1,
        studentId: 1,
        studentName: 'Alice Walker',
        rollNumber: 'CS2024-001',
        reason: 'Academic Conference Presentation',
        description: 'Attending IEEE Student Tech Symposium to present research paper on distributed consensus.',
        startDate: formatDate(5),
        endDate: formatDate(7),
        status: 'PENDING',
        createdAt: formatDate(-2),
      },
      {
        id: 2,
        studentId: 1,
        studentName: 'Alice Walker',
        rollNumber: 'CS2024-001',
        reason: 'Medical Recovery',
        description: 'Recovering from seasonal viral fever under medical observation.',
        startDate: formatDate(-8),
        endDate: formatDate(-7),
        status: 'APPROVED',
        responseMessage: 'Approved. Please submit medical certificate upon return.',
        createdAt: formatDate(-9),
      },
    ],
  };
}

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse mock store:', e);
  }
  const initial = getInitialState();
  saveStore(initial);
  return initial;
}

function saveStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('Failed to save mock store:', e);
  }
}

export function handleMockRequest(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};
  const store = loadStore();

  // Helper response wrapper
  const ok = (data, message = 'Success') => ({
    success: true,
    message,
    data,
  });

  const err = (message, status = 400) => {
    const error = new Error(message);
    error.status = status;
    error.data = { success: false, message };
    throw error;
  };

  // --- Auth Endpoints ---
  if (endpoint === '/auth/login' && method === 'POST') {
    const { usernameOrEmail } = body;
    const cleanUser = (usernameOrEmail || '').trim().toLowerCase();

    // Match by student/teacher/admin or email
    let user = store.users.find(
      (u) =>
        u.username.toLowerCase() === cleanUser ||
        u.email.toLowerCase() === cleanUser ||
        (cleanUser === 'student1' && u.username === 'student') ||
        (cleanUser === 'teacher1' && u.username === 'teacher')
    );

    if (!user) {
      // Default to student if quick testing
      user = {
        userId: 1,
        studentId: 1,
        username: cleanUser || 'student',
        fullName: cleanUser.includes('teacher') ? 'Dr. Alan Turing' : (cleanUser.includes('admin') ? 'System Administrator' : 'Alice Walker'),
        email: `${cleanUser || 'user'}@cms.edu`,
        role: cleanUser.includes('teacher') ? 'ROLE_TEACHER' : (cleanUser.includes('admin') ? 'ROLE_ADMIN' : 'ROLE_STUDENT'),
        department: 'Computer Science',
        semester: 'Semester 4',
      };
      if (user.role === 'ROLE_TEACHER') user.teacherId = 1;
    }

    return ok({
      accessToken: 'demo-jwt-token-' + Date.now(),
      tokenType: 'Bearer',
      userId: user.userId,
      studentId: user.studentId,
      teacherId: user.teacherId,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    }, 'Login successful');
  }

  if (endpoint === '/auth/register' && method === 'POST') {
    const newUser = {
      userId: store.users.length + 1,
      username: body.username || 'user' + Date.now(),
      fullName: body.fullName || 'New Member',
      email: body.email || 'user@cms.edu',
      role: body.role === 'TEACHER' ? 'ROLE_TEACHER' : 'ROLE_STUDENT',
      department: body.department || 'Computer Science',
    };
    if (newUser.role === 'ROLE_STUDENT') {
      newUser.studentId = store.users.filter((u) => u.studentId).length + 1;
      newUser.rollNumber = body.rollNumber || `CS-${Date.now().toString().slice(-4)}`;
      newUser.semester = body.semester || 'Semester 4';
    } else {
      newUser.teacherId = store.users.filter((u) => u.teacherId).length + 1;
      newUser.designation = body.designation || 'Faculty Member';
    }
    store.users.push(newUser);
    saveStore(store);
    return ok(newUser, 'User registered successfully');
  }

  if (endpoint === '/auth/me') {
    const user = store.users[0];
    return ok(user);
  }

  // --- Student Endpoints ---
  if (endpoint.startsWith('/student/dashboard/')) {
    const studentAttendance = store.attendance;
    const presentCount = studentAttendance.filter((a) => a.status === 'PRESENT' || a.status === 'LATE').length;
    const attPct = studentAttendance.length > 0 ? Math.round((presentCount / studentAttendance.length) * 100) : 85;

    const unpaidFees = store.fees.filter((f) => f.status === 'UNPAID');
    const totalDue = unpaidFees.reduce((acc, f) => acc + (f.balanceDue || f.amount || 0), 0);

    const pendingSubmissions = store.assignments.length - store.submissions.length;

    return ok({
      attendancePercentage: attPct,
      pendingAssignments: Math.max(0, pendingSubmissions),
      totalFeesDue: totalDue,
      averageMarks: 89.5,
    });
  }

  if (endpoint.includes('/profile') && endpoint.startsWith('/student/')) {
    const student = store.users.find((u) => u.studentId) || store.users[0];
    return ok({
      id: student.studentId || 1,
      fullName: student.fullName,
      rollNumber: student.rollNumber || 'CS2024-001',
      department: student.department || 'Computer Science',
      semester: student.semester || 'Semester 4',
      section: 'A',
      email: student.email,
      phoneNumber: '+1-555-0102',
      address: '42 Campus Avenue, Silicon Valley',
      guardianName: 'Robert Walker',
      guardianPhone: '+1-555-0199',
    });
  }

  if (endpoint.includes('/attendance') && endpoint.startsWith('/student/')) {
    return ok(store.attendance);
  }

  if (endpoint.includes('/results') && endpoint.startsWith('/student/')) {
    return ok(store.results);
  }

  if (endpoint.includes('/fees') && !endpoint.includes('/pay/')) {
    return ok(store.fees);
  }

  if (endpoint.startsWith('/student/fees/pay/')) {
    const feeId = parseInt(endpoint.split('/').pop(), 10);
    const fee = store.fees.find((f) => f.id === feeId);
    if (fee) {
      fee.status = 'PAID';
      fee.amountPaid = fee.amount;
      fee.balanceDue = 0.0;
      fee.paymentDate = new Date().toISOString().split('T')[0];
      fee.transactionId = 'TXN-' + Math.floor(10000000 + Math.random() * 90000000);
      saveStore(store);
      return ok(fee, 'Fee payment processed successfully!');
    }
    return err('Fee record not found', 404);
  }

  if (endpoint.endsWith('/available-assignments')) {
    return ok(store.assignments);
  }

  if (endpoint.includes('/assignments') && endpoint.startsWith('/student/')) {
    return ok(store.submissions);
  }

  if (endpoint === '/student/assignments/submit') {
    const newSub = {
      id: store.submissions.length + 1,
      assignmentId: body.assignmentId,
      assignmentTitle: body.assignmentTitle || 'Coursework Assignment',
      subject: body.subject || 'Computer Science',
      studentId: 1,
      studentName: 'Alice Walker',
      rollNumber: 'CS2024-001',
      content: body.content,
      fileUrl: body.fileUrl,
      status: 'SUBMITTED',
      marksObtained: null,
      totalMarks: 100.0,
      feedback: null,
      submittedAt: new Date().toISOString(),
    };
    store.submissions.push(newSub);
    saveStore(store);
    return ok(newSub, 'Assignment submitted successfully!');
  }

  if (endpoint.includes('/leaves') && endpoint.startsWith('/student/')) {
    return ok(store.leaves);
  }

  if (endpoint === '/student/leaves/apply') {
    const newLeave = {
      id: store.leaves.length + 1,
      studentId: 1,
      studentName: 'Alice Walker',
      rollNumber: 'CS2024-001',
      reason: body.reason,
      description: body.description,
      startDate: body.startDate,
      endDate: body.endDate,
      status: 'PENDING',
      createdAt: new Date().toISOString().split('T')[0],
    };
    store.leaves.push(newLeave);
    saveStore(store);
    return ok(newLeave, 'Leave application submitted successfully!');
  }

  // --- Teacher Endpoints ---
  if (endpoint.startsWith('/teacher/dashboard/')) {
    const totalStudents = store.users.filter((u) => u.role === 'ROLE_STUDENT').length || 2;
    const pendingLeaves = store.leaves.filter((l) => l.status === 'PENDING').length;
    return ok({
      totalStudents,
      activeAssignments: store.assignments.length,
      pendingLeaves,
      averageAttendance: 91,
    });
  }

  if (endpoint.includes('/profile') && endpoint.startsWith('/teacher/')) {
    const teacher = store.users.find((u) => u.teacherId) || store.users[2];
    return ok({
      id: teacher.teacherId || 1,
      fullName: teacher.fullName,
      employeeId: teacher.employeeId || 'FAC-2024-001',
      department: teacher.department || 'Computer Science',
      designation: teacher.designation || 'Professor & Head of Department',
      qualification: teacher.qualification || 'Ph.D. in Computer Science',
      specialization: teacher.specialization || 'Artificial Intelligence & Algorithms',
      experienceYears: teacher.experienceYears || 15,
      email: teacher.email,
      phoneNumber: '+1-555-0101',
    });
  }

  if (endpoint.startsWith('/teacher/students')) {
    const students = store.users
      .filter((u) => u.role === 'ROLE_STUDENT')
      .map((s) => ({
        id: s.studentId || s.userId,
        fullName: s.fullName,
        rollNumber: s.rollNumber || 'CS2024-00' + s.userId,
        department: s.department || 'Computer Science',
        semester: s.semester || 'Semester 4',
        section: s.section || 'A',
        email: s.email,
      }));
    return ok(students);
  }

  if (endpoint === '/teacher/attendance/mark') {
    const { studentId, subject, date, status, remarks } = body;
    const newAtt = {
      id: store.attendance.length + 1,
      studentId: studentId || 1,
      subject: subject || 'Software Engineering',
      date: date || new Date().toISOString().split('T')[0],
      status: status || 'PRESENT',
      remarks: remarks || 'Marked in portal',
    };
    store.attendance.push(newAtt);
    saveStore(store);
    return ok(newAtt, 'Attendance marked successfully!');
  }

  if (endpoint === '/teacher/results/add') {
    const newRes = {
      id: store.results.length + 1,
      studentId: body.studentId || 1,
      subject: body.subject,
      examType: body.examType || 'MIDTERM',
      semester: body.semester || 'Semester 4',
      marksObtained: Number(body.marksObtained),
      totalMarks: Number(body.totalMarks || 100),
      grade: body.grade || 'A',
      remarks: body.remarks || 'Recorded in portal',
    };
    store.results.push(newRes);
    saveStore(store);
    return ok(newRes, 'Exam result saved successfully!');
  }

  if (endpoint === '/teacher/assignments/create') {
    const newAsg = {
      id: store.assignments.length + 1,
      title: body.title,
      subject: body.subject,
      department: body.department || 'Computer Science',
      semester: body.semester || 'Semester 4',
      dueDate: body.dueDate,
      totalMarks: Number(body.totalMarks || 100),
      description: body.description,
      teacherName: 'Dr. Alan Turing',
    };
    store.assignments.push(newAsg);
    saveStore(store);
    return ok(newAsg, 'Assignment created successfully!');
  }

  if (endpoint.includes('/assignments') && endpoint.startsWith('/teacher/')) {
    return ok(store.assignments);
  }

  if (endpoint.includes('/submissions') && endpoint.startsWith('/teacher/')) {
    return ok(store.submissions);
  }

  if (endpoint.includes('/assignments/grade/')) {
    const submissionId = parseInt(endpoint.split('/').pop(), 10);
    const sub = store.submissions.find((s) => s.id === submissionId);
    if (sub) {
      sub.status = 'GRADED';
      sub.marksObtained = Number(body.marksObtained);
      sub.feedback = body.feedback || 'Great work!';
      sub.gradedAt = new Date().toISOString();
      saveStore(store);
      return ok(sub, 'Submission graded successfully!');
    }
    return err('Submission not found', 404);
  }

  if (endpoint === '/teacher/leaves/pending') {
    const pending = store.leaves.filter((l) => l.status === 'PENDING');
    return ok(pending);
  }

  if (endpoint.startsWith('/teacher/leaves/review/')) {
    const parts = endpoint.split('?')[0].split('/');
    const leaveId = parseInt(parts.pop(), 10);
    const leave = store.leaves.find((l) => l.id === leaveId);
    if (leave) {
      const urlObj = new URL('http://dummy.com' + endpoint);
      leave.status = urlObj.searchParams.get('status') || 'APPROVED';
      leave.responseMessage = urlObj.searchParams.get('responseMessage') || 'Reviewed by instructor.';
      saveStore(store);
      return ok(leave, 'Leave status updated successfully!');
    }
    return err('Leave request not found', 404);
  }

  // Fallback for any other endpoint
  return ok({}, 'Operation completed');
}
