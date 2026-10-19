// In-browser demo engine for College Management System
const STORAGE_KEY = 'cms_demo_store_v2';

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
        fullName: 'Kishor Birajdar',
        email: 'kishor.birajdar@cms.edu',
        role: 'ROLE_STUDENT',
        department: 'Computer Science',
        semester: 'Semester 4',
        rollNumber: 'CS2024-001',
        section: 'A',
        guardianName: 'Suresh Birajdar',
        guardianPhone: '+91 98765 43210',
        phoneNumber: '+91 98230 12345',
        address: '42 Shivaji Nagar, Pune, Maharashtra 411005',
      },
      {
        userId: 2,
        studentId: 2,
        username: 'aarav',
        fullName: 'Aarav Sharma',
        email: 'aarav.sharma@cms.edu',
        role: 'ROLE_STUDENT',
        department: 'Computer Science',
        semester: 'Semester 4',
        rollNumber: 'CS2024-002',
        section: 'A',
        guardianName: 'Ramesh Sharma',
        guardianPhone: '+91 98765 43211',
        phoneNumber: '+91 98230 23456',
        address: '15 Kothrud, Pune, Maharashtra 411038',
      },
      {
        userId: 3,
        studentId: 3,
        username: 'priya',
        fullName: 'Priya Patel',
        email: 'priya.patel@cms.edu',
        role: 'ROLE_STUDENT',
        department: 'Computer Science',
        semester: 'Semester 4',
        rollNumber: 'CS2024-003',
        section: 'A',
        guardianName: 'Mahesh Patel',
        guardianPhone: '+91 98765 43212',
        phoneNumber: '+91 98230 34567',
        address: '88 Aundh, Pune, Maharashtra 411007',
      },
      {
        userId: 4,
        studentId: 4,
        username: 'rohan',
        fullName: 'Rohan Verma',
        email: 'rohan.verma@cms.edu',
        role: 'ROLE_STUDENT',
        department: 'Computer Science',
        semester: 'Semester 4',
        rollNumber: 'CS2024-004',
        section: 'A',
        guardianName: 'Vijay Verma',
        guardianPhone: '+91 98765 43213',
        phoneNumber: '+91 98230 45678',
        address: '22 Viman Nagar, Pune, Maharashtra 411014',
      },
      {
        userId: 5,
        studentId: 5,
        username: 'sneha',
        fullName: 'Sneha Kulkarni',
        email: 'sneha.kulkarni@cms.edu',
        role: 'ROLE_STUDENT',
        department: 'Computer Science',
        semester: 'Semester 4',
        rollNumber: 'CS2024-005',
        section: 'A',
        guardianName: 'Ganesh Kulkarni',
        guardianPhone: '+91 98765 43214',
        phoneNumber: '+91 98230 56789',
        address: '10 Deccan Gymkhana, Pune, Maharashtra 411004',
      },
      {
        userId: 6,
        studentId: 6,
        username: 'ananya',
        fullName: 'Ananya Deshmukh',
        email: 'ananya.deshmukh@cms.edu',
        role: 'ROLE_STUDENT',
        department: 'Computer Science',
        semester: 'Semester 4',
        rollNumber: 'CS2024-006',
        section: 'A',
        guardianName: 'Prakash Deshmukh',
        guardianPhone: '+91 98765 43215',
        phoneNumber: '+91 98230 67890',
        address: '34 Baner Road, Pune, Maharashtra 411045',
      },
      // Faculty Members
      {
        userId: 101,
        teacherId: 1,
        username: 'teacher',
        fullName: 'Dr. Rajesh Sharma',
        email: 'rajesh.sharma@cms.edu',
        role: 'ROLE_TEACHER',
        department: 'Computer Science',
        designation: 'Professor & Head of Department',
        employeeId: 'FAC-2024-001',
        qualification: 'Ph.D. in Computer Science (IIT Bombay)',
        specialization: 'Artificial Intelligence & Distributed Algorithms',
        experienceYears: 16,
        phoneNumber: '+91 98110 54321',
      },
      {
        userId: 102,
        teacherId: 2,
        username: 'teacher2',
        fullName: 'Prof. Sunita Deshmukh',
        email: 'sunita.deshmukh@cms.edu',
        role: 'ROLE_TEACHER',
        department: 'Computer Science',
        designation: 'Associate Professor',
        employeeId: 'FAC-2024-002',
        qualification: 'M.Tech, Ph.D. in Software Systems',
        specialization: 'Software Architecture & Cloud Engineering',
        experienceYears: 12,
        phoneNumber: '+91 98110 65432',
      },
      {
        userId: 103,
        teacherId: 3,
        username: 'teacher3',
        fullName: 'Prof. Amit Kulkarni',
        email: 'amit.kulkarni@cms.edu',
        role: 'ROLE_TEACHER',
        department: 'Computer Science',
        designation: 'Assistant Professor',
        employeeId: 'FAC-2024-003',
        qualification: 'M.Tech in Computer Engineering',
        specialization: 'Database Systems & PostgreSQL Internals',
        experienceYears: 8,
        phoneNumber: '+91 98110 76543',
      },
      {
        userId: 104,
        teacherId: 4,
        username: 'teacher4',
        fullName: 'Dr. Vikram Joshi',
        email: 'vikram.joshi@cms.edu',
        role: 'ROLE_TEACHER',
        department: 'Computer Science',
        designation: 'Senior Professor',
        employeeId: 'FAC-2024-004',
        qualification: 'Ph.D. in Computer Networks',
        specialization: 'Distributed Systems & Cyber Security',
        experienceYears: 18,
        phoneNumber: '+91 98110 87654',
      },
    ],
    notices: [
      {
        id: 1,
        title: 'Mid-Semester Theory & Lab Examination Schedule - Summer 2026',
        category: 'EXAMINATION',
        priority: 'URGENT',
        date: formatDate(-1),
        author: 'Dr. Rajesh Sharma (HOD CS)',
        targetAudience: 'Semester 4 Students',
        content: 'The Mid-Semester theory and laboratory examinations for Semester 4 Computer Science students will commence from 28th October 2026. Hall tickets and seating arrangements can be checked in the portal. Detailed subject-wise syllabus is uploaded.',
      },
      {
        id: 2,
        title: 'Diwali & Mid-Term Festival Break Announcement',
        category: 'HOLIDAY',
        priority: 'IMPORTANT',
        date: formatDate(-3),
        author: 'Academic Dean Office',
        targetAudience: 'All Students & Faculty',
        content: 'The institute will remain closed from 1st November to 6th November 2026 on account of Diwali festivities. All academic and administrative activities will resume as per regular timetable on 7th November.',
      },
      {
        id: 3,
        title: 'Annual Smart India Tech Expo & Innovation Hackathon 2026',
        category: 'EVENT',
        priority: 'GENERAL',
        date: formatDate(-5),
        author: 'Prof. Sunita Deshmukh',
        targetAudience: 'All Engineering Students',
        content: 'Registrations are now open for the Annual University Tech Expo. Teams of 3-4 students can submit their problem statements and architecture designs by 25th October. Cash prizes worth ₹50,000 for winning teams!',
      },
      {
        id: 4,
        title: 'Campus Recruitment & Industry Internship Drive',
        category: 'PLACEMENT',
        priority: 'IMPORTANT',
        date: formatDate(-7),
        author: 'Training & Placement Cell',
        targetAudience: 'Pre-final & Final Year Students',
        content: 'Pre-placement talks and technical assessment rounds by tier-1 technology partners will begin next Monday. Students are advised to verify their semester CGPA and update resumes on the portal.',
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
        teacherName: 'Dr. Rajesh Sharma',
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
        teacherName: 'Prof. Amit Kulkarni',
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
        teacherName: 'Dr. Vikram Joshi',
      },
    ],
    submissions: [
      {
        id: 1,
        assignmentId: 1,
        assignmentTitle: 'Full Stack Web Architecture & REST API Design',
        subject: 'Software Engineering',
        studentId: 1,
        studentName: 'Kishor Birajdar',
        rollNumber: 'CS2024-001',
        content: 'Submitted the complete architecture documentation and GitHub repository link containing Spring Boot REST controllers and React Vite frontend.',
        fileUrl: 'https://github.com/kishorB19/college-management-system-java',
        status: 'GRADED',
        marksObtained: 98.0,
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
        studentName: 'Kishor Birajdar',
        rollNumber: 'CS2024-001',
        content: 'Completed the leader election algorithm. Partition tolerance tested against 5 virtual nodes with zero message drops.',
        fileUrl: 'https://github.com/example/raft-consensus',
        status: 'SUBMITTED',
        marksObtained: null,
        totalMarks: 100.0,
        feedback: null,
        submittedAt: formatDate(-1) + 'T16:45:00',
      },
    ],
    attendance: [
      { id: 1, studentId: 1, studentName: 'Kishor Birajdar', subject: 'Software Engineering', date: formatDate(-14), status: 'PRESENT', remarks: 'On time & participated' },
      { id: 2, studentId: 1, studentName: 'Kishor Birajdar', subject: 'Database Systems', date: formatDate(-13), status: 'PRESENT', remarks: 'On time & participated' },
      { id: 3, studentId: 1, studentName: 'Kishor Birajdar', subject: 'Distributed Systems', date: formatDate(-12), status: 'PRESENT', remarks: 'On time & participated' },
      { id: 4, studentId: 1, studentName: 'Kishor Birajdar', subject: 'Cloud Computing', date: formatDate(-11), status: 'PRESENT', remarks: 'On time & participated' },
      { id: 5, studentId: 1, studentName: 'Kishor Birajdar', subject: 'Software Engineering', date: formatDate(-10), status: 'PRESENT', remarks: 'Active in Q&A' },
      { id: 6, studentId: 1, studentName: 'Kishor Birajdar', subject: 'Database Systems', date: formatDate(-9), status: 'PRESENT', remarks: 'On time & participated' },
      { id: 7, studentId: 1, studentName: 'Kishor Birajdar', subject: 'Distributed Systems', date: formatDate(-8), status: 'PRESENT', remarks: 'On time & participated' },
      { id: 8, studentId: 1, studentName: 'Kishor Birajdar', subject: 'Cloud Computing', date: formatDate(-7), status: 'PRESENT', remarks: 'On time & participated' },
      { id: 9, studentId: 1, studentName: 'Kishor Birajdar', subject: 'Software Engineering', date: formatDate(-6), status: 'PRESENT', remarks: 'On time & participated' },
      { id: 10, studentId: 1, studentName: 'Kishor Birajdar', subject: 'Database Systems', date: formatDate(-5), status: 'LATE', remarks: 'Traffic delay' },
      { id: 11, studentId: 1, studentName: 'Kishor Birajdar', subject: 'Distributed Systems', date: formatDate(-4), status: 'PRESENT', remarks: 'On time & participated' },
      { id: 12, studentId: 1, studentName: 'Kishor Birajdar', subject: 'Cloud Computing', date: formatDate(-3), status: 'PRESENT', remarks: 'On time & participated' },
    ],
    results: [
      {
        id: 1,
        studentId: 1,
        subject: 'Software Engineering',
        examType: 'MIDTERM',
        semester: 'Semester 4',
        marksObtained: 96.0,
        totalMarks: 100.0,
        grade: 'A+',
        remarks: 'Exceptional conceptual understanding and architecture design',
      },
      {
        id: 2,
        studentId: 1,
        subject: 'Database Systems',
        examType: 'MIDTERM',
        semester: 'Semester 4',
        marksObtained: 92.0,
        totalMarks: 100.0,
        grade: 'A+',
        remarks: 'Strong SQL query crafting and schema design',
      },
      {
        id: 3,
        studentId: 1,
        subject: 'Distributed Systems',
        examType: 'INTERNAL',
        semester: 'Semester 4',
        marksObtained: 48.0,
        totalMarks: 50.0,
        grade: 'A+',
        remarks: 'Excellent lab demonstration of consensus protocol',
      },
    ],
    fees: [
      {
        id: 1,
        studentId: 1,
        feeType: 'SEMESTER TUITION FEE',
        amount: 25000.0,
        amountPaid: 25000.0,
        balanceDue: 0.0,
        status: 'PAID',
        dueDate: formatDate(-30),
        paymentDate: formatDate(-25),
        transactionId: 'TXN-98472918',
        semester: 'Semester 4',
        remarks: 'Spring Semester Tuition paid in full via UPI',
      },
      {
        id: 2,
        studentId: 1,
        feeType: 'ADVANCED LAB & LIBRARY FEE',
        amount: 4500.0,
        amountPaid: 0.0,
        balanceDue: 4500.0,
        status: 'UNPAID',
        dueDate: formatDate(20),
        paymentDate: null,
        transactionId: null,
        semester: 'Semester 4',
        remarks: 'High Performance Computing Lab & Digital Library Access',
      },
    ],
    leaves: [
      {
        id: 1,
        studentId: 1,
        studentName: 'Kishor Birajdar',
        rollNumber: 'CS2024-001',
        reason: 'National Technical Symposium & Paper Presentation',
        description: 'Attending IEEE Student Tech Symposium to present research paper on distributed consensus systems.',
        startDate: formatDate(5),
        endDate: formatDate(7),
        status: 'PENDING',
        createdAt: formatDate(-2),
      },
      {
        id: 2,
        studentId: 1,
        studentName: 'Kishor Birajdar',
        rollNumber: 'CS2024-001',
        reason: 'Medical Recovery',
        description: 'Recovering from viral fever under medical observation.',
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

    let user = store.users.find(
      (u) =>
        u.username.toLowerCase() === cleanUser ||
        u.email.toLowerCase() === cleanUser ||
        (cleanUser === 'student1' && u.username === 'student') ||
        (cleanUser === 'teacher1' && u.username === 'teacher') ||
        (cleanUser === 'kishor' && u.username === 'student') ||
        (cleanUser === 'rajesh' && u.username === 'teacher')
    );

    if (!user) {
      // Auto-assign based on pattern
      const isTeacher = cleanUser.includes('teacher') || cleanUser.includes('prof') || cleanUser.includes('dr');
      user = {
        userId: isTeacher ? 101 : 1,
        studentId: isTeacher ? undefined : 1,
        teacherId: isTeacher ? 1 : undefined,
        username: cleanUser || (isTeacher ? 'teacher' : 'student'),
        fullName: isTeacher ? 'Dr. Rajesh Sharma' : 'Kishor Birajdar',
        email: `${cleanUser || (isTeacher ? 'teacher' : 'student')}@cms.edu`,
        role: isTeacher ? 'ROLE_TEACHER' : 'ROLE_STUDENT',
        department: 'Computer Science',
        semester: 'Semester 4',
      };
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
    const isTeacher = body.role === 'TEACHER';
    const newUser = {
      userId: store.users.length + 1,
      username: body.username || 'user' + Date.now(),
      fullName: body.fullName || (isTeacher ? 'Prof. Faculty' : 'Student Member'),
      email: body.email || 'user@cms.edu',
      role: isTeacher ? 'ROLE_TEACHER' : 'ROLE_STUDENT',
      department: body.department || 'Computer Science',
    };
    if (!isTeacher) {
      newUser.studentId = store.users.filter((u) => u.studentId).length + 1;
      newUser.rollNumber = body.rollNumber || `CS-${Date.now().toString().slice(-4)}`;
      newUser.semester = body.semester || 'Semester 4';
    } else {
      newUser.teacherId = store.users.filter((u) => u.teacherId).length + 1;
      newUser.designation = body.designation || 'Assistant Professor';
    }
    store.users.push(newUser);
    saveStore(store);
    return ok(newUser, 'User registered successfully');
  }

  if (endpoint === '/auth/me') {
    const user = store.users[0];
    return ok(user);
  }

  // --- Notice Board Endpoints ---
  if (endpoint === '/notices' && method === 'GET') {
    return ok(store.notices);
  }

  if (endpoint === '/notices/create' && method === 'POST') {
    const newNotice = {
      id: store.notices.length + 1,
      title: body.title,
      category: body.category || 'ACADEMIC',
      priority: body.priority || 'GENERAL',
      date: new Date().toISOString().split('T')[0],
      author: body.author || 'Faculty Office',
      targetAudience: body.targetAudience || 'All Students',
      content: body.content,
    };
    store.notices.unshift(newNotice);
    saveStore(store);
    return ok(newNotice, 'Notice posted successfully!');
  }

  // --- Student Endpoints ---
  if (endpoint.startsWith('/student/dashboard/')) {
    const studentAttendance = store.attendance;
    const presentCount = studentAttendance.filter((a) => a.status === 'PRESENT' || a.status === 'LATE').length;
    const attPct = studentAttendance.length > 0 ? Math.round((presentCount / studentAttendance.length) * 100) : 92;

    const unpaidFees = store.fees.filter((f) => f.status === 'UNPAID');
    const totalDue = unpaidFees.reduce((acc, f) => acc + (f.balanceDue || f.amount || 0), 0);

    const pendingSubmissions = Math.max(0, store.assignments.length - store.submissions.length);

    return ok({
      attendancePercentage: attPct,
      pendingAssignments: pendingSubmissions,
      totalFeesDue: totalDue,
      averageMarks: 94.5,
    });
  }

  if (endpoint.includes('/profile') && endpoint.startsWith('/student/')) {
    const student = store.users.find((u) => u.studentId === 1) || store.users[0];
    return ok({
      id: student.studentId || 1,
      fullName: student.fullName,
      rollNumber: student.rollNumber || 'CS2024-001',
      department: student.department || 'Computer Science',
      semester: student.semester || 'Semester 4',
      section: 'A',
      email: student.email,
      phoneNumber: student.phoneNumber || '+91 98230 12345',
      address: student.address || '42 Shivaji Nagar, Pune, Maharashtra 411005',
      guardianName: student.guardianName || 'Suresh Birajdar',
      guardianPhone: student.guardianPhone || '+91 98765 43210',
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
      fee.transactionId = 'UPI-' + Math.floor(10000000 + Math.random() * 90000000);
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
      studentName: 'Kishor Birajdar',
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
      studentName: 'Kishor Birajdar',
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
    const totalStudents = store.users.filter((u) => u.role === 'ROLE_STUDENT').length;
    const pendingLeaves = store.leaves.filter((l) => l.status === 'PENDING').length;
    return ok({
      totalStudents,
      activeAssignments: store.assignments.length,
      pendingLeaves,
      averageAttendance: 93,
    });
  }

  if (endpoint.includes('/profile') && endpoint.startsWith('/teacher/')) {
    const teacher = store.users.find((u) => u.teacherId === 1) || store.users.find((u) => u.role === 'ROLE_TEACHER');
    return ok({
      id: teacher.teacherId || 1,
      fullName: teacher.fullName,
      employeeId: teacher.employeeId || 'FAC-2024-001',
      department: teacher.department || 'Computer Science',
      designation: teacher.designation || 'Professor & Head of Department',
      qualification: teacher.qualification || 'Ph.D. in Computer Science',
      specialization: teacher.specialization || 'Artificial Intelligence & Distributed Algorithms',
      experienceYears: teacher.experienceYears || 16,
      email: teacher.email,
      phoneNumber: teacher.phoneNumber || '+91 98110 54321',
    });
  }

  if (endpoint.startsWith('/teacher/students')) {
    const students = store.users
      .filter((u) => u.role === 'ROLE_STUDENT')
      .map((s) => ({
        id: s.studentId || s.userId,
        fullName: s.fullName,
        rollNumber: s.rollNumber,
        department: s.department || 'Computer Science',
        semester: s.semester || 'Semester 4',
        section: s.section || 'A',
        email: s.email,
        guardianName: s.guardianName,
        guardianPhone: s.guardianPhone,
      }));
    return ok(students);
  }

  // Bulk Attendance Marking for Whole Class
  if (endpoint === '/teacher/attendance/mark-batch' && method === 'POST') {
    const { subject, date, records } = body;
    if (Array.isArray(records)) {
      records.forEach((rec) => {
        const student = store.users.find((u) => u.studentId === rec.studentId) || {};
        store.attendance.push({
          id: store.attendance.length + 1,
          studentId: rec.studentId,
          studentName: student.fullName || 'Student',
          subject: subject || 'Software Engineering',
          date: date || new Date().toISOString().split('T')[0],
          status: rec.status || 'PRESENT',
          remarks: rec.remarks || 'Class attendance recorded',
        });
      });
      saveStore(store);
      return ok({ count: records.length }, `Class attendance recorded for ${records.length} students!`);
    }
    return err('Invalid attendance records', 400);
  }

  if (endpoint === '/teacher/attendance/mark' && method === 'POST') {
    const { studentId, subject, date, status, remarks } = body;
    const student = store.users.find((u) => u.studentId === studentId) || {};
    const newAtt = {
      id: store.attendance.length + 1,
      studentId: studentId || 1,
      studentName: student.fullName || 'Kishor Birajdar',
      subject: subject || 'Software Engineering',
      date: date || new Date().toISOString().split('T')[0],
      status: status || 'PRESENT',
      remarks: remarks || 'Recorded in portal',
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
      grade: body.grade || 'A+',
      remarks: body.remarks || 'Recorded in portal',
    };
    store.results.push(newRes);
    saveStore(store);
    return ok(newRes, 'Exam score saved successfully!');
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
      teacherName: 'Dr. Rajesh Sharma',
    };
    store.assignments.push(newAsg);
    saveStore(store);
    return ok(newAsg, 'Assignment published successfully!');
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
      sub.feedback = body.feedback || 'Excellent work!';
      sub.gradedAt = new Date().toISOString();
      saveStore(store);
      return ok(sub, 'Submission evaluated successfully!');
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
      leave.responseMessage = urlObj.searchParams.get('responseMessage') || 'Approved by faculty in charge.';
      saveStore(store);
      return ok(leave, 'Leave status updated successfully!');
    }
    return err('Leave request not found', 404);
  }

  return ok({}, 'Operation completed');
}
