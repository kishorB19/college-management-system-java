import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  Award, 
  FilePlus, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Send, 
  User, 
  PlusCircle, 
  BookOpen, 
  ExternalLink,
  Search,
  Filter,
  Sparkles,
  ClipboardList
} from 'lucide-react';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const teacherId = user?.teacherId || user?.profileId || user?.userId;

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [successToast, setSuccessToast] = useState('');

  // Dashboard Stats
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAssignments: 0,
    pendingLeaves: 0,
  });
  const [profile, setProfile] = useState(null);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);

  // Filter state for students
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedSem, setSelectedSem] = useState('');

  // Modals
  const [showCreateAsgModal, setShowCreateAsgModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);

  // Assignment Creation Form
  const [asgForm, setAsgForm] = useState({
    title: '',
    subject: 'Software Engineering',
    department: 'Computer Science',
    semester: 'Semester 4',
    dueDate: '',
    totalMarks: 100,
    description: '',
  });
  const [creatingAsg, setCreatingAsg] = useState(false);

  // Submissions State for an assignment
  const [activeAsg, setActiveAsg] = useState(null);
  const [asgSubmissions, setAsgSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Grading Form
  const [selectedSub, setSelectedSub] = useState(null);
  const [gradeForm, setGradeForm] = useState({ marksObtained: 90, feedback: 'Well done!' });
  const [grading, setGrading] = useState(false);

  // Attendance Marking Form
  const [attForm, setAttForm] = useState({
    studentId: '',
    subject: 'Software Engineering',
    date: new Date().toISOString().split('T')[0],
    status: 'PRESENT',
    remarks: 'Active participation',
  });
  const [markingAtt, setMarkingAtt] = useState(false);

  // Results Posting Form
  const [resultForm, setResultForm] = useState({
    studentId: '',
    subject: 'Software Engineering',
    examType: 'MIDTERM',
    semester: 'Semester 4',
    marksObtained: 85,
    totalMarks: 100,
    remarks: 'Strong analytical skills demonstrated',
  });
  const [postingResult, setPostingResult] = useState(false);

  // Review Leave Form
  const [reviewLeaveMsg, setReviewLeaveMsg] = useState({});

  const showNotification = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const loadData = async () => {
    if (!teacherId) return;
    setLoading(true);

    try {
      const [statsRes, profRes, studRes, asgRes, leavesRes] = await Promise.allSettled([
        api.getTeacherDashboard(teacherId),
        api.getTeacherProfile(teacherId),
        api.getStudents(),
        api.getTeacherAssignments(teacherId),
        api.getPendingLeaves(),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.success) {
        setStats(statsRes.value.data);
      }
      if (profRes.status === 'fulfilled' && profRes.value?.success) {
        setProfile(profRes.value.data);
      }
      if (studRes.status === 'fulfilled' && studRes.value?.success) {
        setStudents(studRes.value.data);
        if (studRes.value.data.length > 0) {
          setAttForm((prev) => ({ ...prev, studentId: studRes.value.data[0].id }));
          setResultForm((prev) => ({ ...prev, studentId: studRes.value.data[0].id }));
        }
      }
      if (asgRes.status === 'fulfilled' && asgRes.value?.success) {
        setAssignments(asgRes.value.data);
      }
      if (leavesRes.status === 'fulfilled' && leavesRes.value?.success) {
        setPendingLeaves(leavesRes.value.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [teacherId]);

  // Filter students
  const handleFilterStudents = async () => {
    try {
      const res = await api.getStudents(selectedDept || undefined, selectedSem || undefined);
      if (res.success) setStudents(res.data);
    } catch (err) {
      alert('Error filtering students');
    }
  };

  // Mark Attendance Submit
  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    setMarkingAtt(true);
    try {
      const res = await api.markAttendance({
        studentId: Number(attForm.studentId),
        subject: attForm.subject,
        date: attForm.date,
        status: attForm.status,
        remarks: attForm.remarks,
      });
      if (res.success) {
        showNotification('Attendance logged successfully!');
      }
    } catch (err) {
      alert(err.message || 'Failed to mark attendance');
    } finally {
      setMarkingAtt(false);
    }
  };

  // Add Exam Result Submit
  const handleAddResult = async (e) => {
    e.preventDefault();
    setPostingResult(true);
    try {
      const res = await api.addExamResult({
        studentId: Number(resultForm.studentId),
        subject: resultForm.subject,
        examType: resultForm.examType,
        semester: resultForm.semester,
        marksObtained: Number(resultForm.marksObtained),
        totalMarks: Number(resultForm.totalMarks),
        remarks: resultForm.remarks,
      });
      if (res.success) {
        showNotification('Exam score recorded successfully!');
      }
    } catch (err) {
      alert(err.message || 'Failed to publish result');
    } finally {
      setPostingResult(false);
    }
  };

  // Create Assignment Submit
  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    setCreatingAsg(true);
    try {
      const res = await api.createAssignment({
        title: asgForm.title,
        description: asgForm.description,
        subject: asgForm.subject,
        department: asgForm.department,
        semester: asgForm.semester,
        dueDate: asgForm.dueDate,
        totalMarks: Number(asgForm.totalMarks),
      });

      if (res.success) {
        showNotification(`Assignment "${asgForm.title}" created successfully!`);
        setShowCreateAsgModal(false);
        setAsgForm({
          title: '',
          subject: 'Software Engineering',
          department: 'Computer Science',
          semester: 'Semester 4',
          dueDate: '',
          totalMarks: 100,
          description: '',
        });
        const updated = await api.getTeacherAssignments(teacherId);
        if (updated?.success) setAssignments(updated.data);
        const updatedStats = await api.getTeacherDashboard(teacherId);
        if (updatedStats?.success) setStats(updatedStats.data);
      }
    } catch (err) {
      alert(err.message || 'Failed to create assignment');
    } finally {
      setCreatingAsg(false);
    }
  };

  // View Submissions for an assignment
  const handleViewSubmissions = async (asg) => {
    setActiveAsg(asg);
    setShowSubmissionsModal(true);
    setLoadingSubmissions(true);
    try {
      const res = await api.getAssignmentSubmissions(asg.id);
      if (res.success) {
        setAsgSubmissions(res.data);
      }
    } catch (err) {
      alert('Failed to load submissions');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // Open Grade Dialog
  const openGradeDialog = (sub) => {
    setSelectedSub(sub);
    setGradeForm({
      marksObtained: sub.marksObtained || 95,
      feedback: sub.feedback || 'Outstanding work! Thorough research and implementation.',
    });
    setShowGradeModal(true);
  };

  // Grade Submission Submit
  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSub) return;
    setGrading(true);
    try {
      const res = await api.gradeSubmission(selectedSub.id, {
        marksObtained: Number(gradeForm.marksObtained),
        feedback: gradeForm.feedback,
      });

      if (res.success) {
        showNotification('Submission evaluated and grade recorded!');
        setShowGradeModal(false);
        // Refresh submissions list
        if (activeAsg) {
          const updatedSubs = await api.getAssignmentSubmissions(activeAsg.id);
          if (updatedSubs?.success) setAsgSubmissions(updatedSubs.data);
        }
      }
    } catch (err) {
      alert(err.message || 'Grading failed');
    } finally {
      setGrading(false);
    }
  };

  // Review Leave
  const handleReviewLeave = async (leaveId, status) => {
    const msg = reviewLeaveMsg[leaveId] || (status === 'APPROVED' ? 'Approved as requested.' : 'Rejected.');
    try {
      const res = await api.reviewLeave(leaveId, status, msg);
      if (res.success) {
        showNotification(`Leave request marked as ${status}!`);
        const updated = await api.getPendingLeaves();
        if (updated?.success) setPendingLeaves(updated.data);
        const updatedStats = await api.getTeacherDashboard(teacherId);
        if (updatedStats?.success) setStats(updatedStats.data);
      }
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  return (
    <div className="teacher-portal-wrapper">
      {/* Toast */}
      {successToast && (
        <div className="toast-banner">
          <CheckCircle size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Banner */}
      <div className="portal-banner glass-panel">
        <div className="banner-text">
          <div className="faculty-badge">
            <Sparkles size={14} /> Faculty &amp; Academic Administration
          </div>
          <h1>{user?.fullName || 'Faculty Member'}</h1>
          <p className="faculty-info-line">
            Emp ID: <strong>{profile?.employeeId || 'FAC-2024-001'}</strong> &bull;{' '}
            Department: <strong>{profile?.department || 'Computer Science'}</strong> &bull;{' '}
            {profile?.designation || 'Professor & Head of Department'}
          </p>
        </div>
        <div className="banner-stats-pill">
          <div className="pill-item">
            <span className="pill-val">{stats.totalStudents}</span>
            <span className="pill-label">Students</span>
          </div>
          <div className="pill-divider"></div>
          <div className="pill-item">
            <span className="pill-val">{stats.totalAssignments}</span>
            <span className="pill-label">Assignments</span>
          </div>
          <div className="pill-divider"></div>
          <div className="pill-item">
            <span className="pill-val" style={{ color: stats.pendingLeaves > 0 ? '#f59e0b' : '#10b981' }}>
              {stats.pendingLeaves}
            </span>
            <span className="pill-label">Leaves</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="glass-panel stat-card stat-students">
          <div className="stat-card-icon">
            <Users size={24} />
          </div>
          <div className="stat-card-content">
            <div className="stat-value">{stats.totalStudents}</div>
            <div className="stat-label">Active Dept Students</div>
            <span className="stat-subtext">Registered across semesters</span>
          </div>
        </div>

        <div className="glass-panel stat-card stat-asgs">
          <div className="stat-card-icon">
            <FileText size={24} />
          </div>
          <div className="stat-card-content">
            <div className="stat-value">{stats.totalAssignments}</div>
            <div className="stat-label">Course Assignments</div>
            <span className="stat-subtext">Active curriculum tasks</span>
          </div>
        </div>

        <div className="glass-panel stat-card stat-leaves">
          <div className="stat-card-icon">
            <CalendarCheck size={24} />
          </div>
          <div className="stat-card-content">
            <div className="stat-value">{stats.pendingLeaves}</div>
            <div className="stat-label">Pending Leave Requests</div>
            <span className="stat-subtext">Requires faculty review</span>
          </div>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="dashboard-tabs-bar glass-panel">
        <button
          className={`tab-link ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <LayoutDashboard size={16} /> Overview
        </button>
        <button
          className={`tab-link ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          <Users size={16} /> Student Directory ({students.length})
        </button>
        <button
          className={`tab-link ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveTab('attendance')}
        >
          <CalendarCheck size={16} /> Mark Attendance
        </button>
        <button
          className={`tab-link ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          <Award size={16} /> Post Exam Scores
        </button>
        <button
          className={`tab-link ${activeTab === 'assignments' ? 'active' : ''}`}
          onClick={() => setActiveTab('assignments')}
        >
          <ClipboardList size={16} /> Coursework &amp; Grading ({assignments.length})
        </button>
        <button
          className={`tab-link ${activeTab === 'leaves' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaves')}
        >
          <Send size={16} /> Student Leaves ({pendingLeaves.length})
        </button>
        <button
          className={`tab-link ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={16} /> Faculty Profile
        </button>
      </div>

      {/* Tab Panels */}
      <div className="tab-content-area">
        {/* 1. OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="overview-layout">
            <div className="glass-panel overview-section">
              <div className="section-title-row">
                <h3><ClipboardList size={18} /> Active Coursework</h3>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowCreateAsgModal(true)}
                >
                  <PlusCircle size={14} /> New Assignment
                </button>
              </div>
              <div className="assignment-cards-stack">
                {assignments.slice(0, 3).map((asg) => (
                  <div key={asg.id} className="coursework-item">
                    <div>
                      <h4>{asg.title}</h4>
                      <div className="cw-meta">
                        <span className="badge badge-info">{asg.subject}</span>
                        <span>Due: {asg.dueDate}</span>
                        <span>{asg.totalMarks} pts</span>
                      </div>
                    </div>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleViewSubmissions(asg)}
                    >
                      Submissions
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel overview-section">
              <div className="section-title-row">
                <h3><CalendarCheck size={18} /> Pending Leave Applications</h3>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveTab('leaves')}
                >
                  Review All ({pendingLeaves.length})
                </button>
              </div>
              {pendingLeaves.length > 0 ? (
                <div className="leaves-stack">
                  {pendingLeaves.slice(0, 2).map((l) => (
                    <div key={l.id} className="leave-review-card">
                      <div className="leave-card-info">
                        <strong>{l.reason}</strong>
                        <p>{l.description}</p>
                        <span className="cw-meta">{l.startDate} &rarr; {l.endDate}</span>
                      </div>
                      <div className="leave-btns">
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => handleReviewLeave(l.id, 'APPROVED')}
                        >
                          Approve
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleReviewLeave(l.id, 'REJECTED')}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-text">No pending leaves requiring action.</p>
              )}
            </div>
          </div>
        )}

        {/* 2. STUDENT DIRECTORY */}
        {activeTab === 'students' && (
          <div className="glass-panel tab-panel">
            <div className="panel-header">
              <div>
                <h2>Department Students Directory</h2>
                <p className="panel-desc">Enrolled student profiles and academic statuses</p>
              </div>

              {/* Filter controls */}
              <div className="filter-bar">
                <select 
                  className="form-select select-compact"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                >
                  <option value="">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                </select>

                <select 
                  className="form-select select-compact"
                  value={selectedSem}
                  onChange={(e) => setSelectedSem(e.target.value)}
                >
                  <option value="">All Semesters</option>
                  <option value="Semester 4">Semester 4</option>
                  <option value="Semester 2">Semester 2</option>
                </select>

                <button className="btn btn-secondary btn-sm" onClick={handleFilterStudents}>
                  <Filter size={14} /> Filter
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Roll Number</th>
                    <th>Full Name</th>
                    <th>Department</th>
                    <th>Semester</th>
                    <th>Section</th>
                    <th>Guardian Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length > 0 ? (
                    students.map((st) => (
                      <tr key={st.id}>
                        <td><strong className="mono-text">{st.rollNumber}</strong></td>
                        <td>{st.user?.fullName || 'Alice Walker'}</td>
                        <td>{st.department}</td>
                        <td>{st.semester}</td>
                        <td><span className="badge badge-info">{st.section || 'A'}</span></td>
                        <td>{st.guardianName} ({st.guardianPhone})</td>
                        <td>
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              setAttForm((prev) => ({ ...prev, studentId: st.id }));
                              setActiveTab('attendance');
                            }}
                          >
                            Mark Attendance
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center empty-row">No students found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. MARK ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="glass-panel tab-panel form-standalone-panel">
            <div className="panel-header">
              <div>
                <h2>Record Daily Class Attendance</h2>
                <p className="panel-desc">Log individual student presence and lecture participation</p>
              </div>
            </div>

            <form onSubmit={handleMarkAttendance} className="custom-form-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Select Student</label>
                  <select
                    className="form-select"
                    required
                    value={attForm.studentId}
                    onChange={(e) => setAttForm({ ...attForm, studentId: e.target.value })}
                  >
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.rollNumber} - {st.user?.fullName || 'Student'} ({st.semester})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={attForm.subject}
                    onChange={(e) => setAttForm({ ...attForm, subject: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Attendance Date</label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={attForm.date}
                    onChange={(e) => setAttForm({ ...attForm, date: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={attForm.status}
                    onChange={(e) => setAttForm({ ...attForm, status: e.target.value })}
                  >
                    <option value="PRESENT">PRESENT</option>
                    <option value="ABSENT">ABSENT</option>
                    <option value="LATE">LATE</option>
                    <option value="EXCUSED">EXCUSED</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Session Remarks</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Lab experiment attendance"
                  value={attForm.remarks}
                  onChange={(e) => setAttForm({ ...attForm, remarks: e.target.value })}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={markingAtt}
              >
                <CalendarCheck size={16} />
                {markingAtt ? 'Recording...' : 'Save Attendance Record'}
              </button>
            </form>
          </div>
        )}

        {/* 4. POST EXAM SCORES */}
        {activeTab === 'results' && (
          <div className="glass-panel tab-panel form-standalone-panel">
            <div className="panel-header">
              <div>
                <h2>Publish Student Examination Score</h2>
                <p className="panel-desc">Record midterm, final, and quiz grades directly into PostgreSQL</p>
              </div>
            </div>

            <form onSubmit={handleAddResult} className="custom-form-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Select Student</label>
                  <select
                    className="form-select"
                    required
                    value={resultForm.studentId}
                    onChange={(e) => setResultForm({ ...resultForm, studentId: e.target.value })}
                  >
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.rollNumber} - {st.user?.fullName || 'Student'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={resultForm.subject}
                    onChange={(e) => setResultForm({ ...resultForm, subject: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Exam Type</label>
                  <select
                    className="form-select"
                    value={resultForm.examType}
                    onChange={(e) => setResultForm({ ...resultForm, examType: e.target.value })}
                  >
                    <option value="MIDTERM">MIDTERM</option>
                    <option value="FINAL">FINAL</option>
                    <option value="PRACTICAL_LAB">PRACTICAL LAB</option>
                    <option value="QUIZ">QUIZ</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Semester</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={resultForm.semester}
                    onChange={(e) => setResultForm({ ...resultForm, semester: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Marks Obtained</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    className="form-input"
                    value={resultForm.marksObtained}
                    onChange={(e) => setResultForm({ ...resultForm, marksObtained: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Total Marks</label>
                  <input
                    type="number"
                    step="1"
                    required
                    className="form-input"
                    value={resultForm.totalMarks}
                    onChange={(e) => setResultForm({ ...resultForm, totalMarks: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Faculty Feedback / Remarks</label>
                <input
                  type="text"
                  className="form-input"
                  value={resultForm.remarks}
                  onChange={(e) => setResultForm({ ...resultForm, remarks: e.target.value })}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={postingResult}
              >
                <Award size={16} />
                {postingResult ? 'Submitting...' : 'Publish Examination Result'}
              </button>
            </form>
          </div>
        )}

        {/* 5. ASSIGNMENTS & GRADING */}
        {activeTab === 'assignments' && (
          <div className="glass-panel tab-panel">
            <div className="panel-header">
              <div>
                <h2>Assignments &amp; Submissions Manager</h2>
                <p className="panel-desc">Manage course tasks and grade student project submissions</p>
              </div>

              <button 
                className="btn btn-primary btn-sm"
                onClick={() => setShowCreateAsgModal(true)}
              >
                <PlusCircle size={15} /> Create Assignment
              </button>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Subject</th>
                    <th>Department</th>
                    <th>Semester</th>
                    <th>Due Date</th>
                    <th>Max Marks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.length > 0 ? (
                    assignments.map((asg) => (
                      <tr key={asg.id}>
                        <td>
                          <strong>{asg.title}</strong>
                          <p className="table-subtext">{asg.description}</p>
                        </td>
                        <td><span className="badge badge-info">{asg.subject}</span></td>
                        <td>{asg.department}</td>
                        <td>{asg.semester}</td>
                        <td>{asg.dueDate}</td>
                        <td>{asg.totalMarks} pts</td>
                        <td>
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => handleViewSubmissions(asg)}
                          >
                            <FileText size={13} /> Submissions
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center empty-row">No assignments created yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. LEAVES */}
        {activeTab === 'leaves' && (
          <div className="glass-panel tab-panel">
            <div className="panel-header">
              <div>
                <h2>Pending Student Leave Applications</h2>
                <p className="panel-desc">Review and decide on student absence applications</p>
              </div>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Student Details</th>
                    <th>Category</th>
                    <th>Duration</th>
                    <th>Reason &amp; Explanation</th>
                    <th>Response Message</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingLeaves.length > 0 ? (
                    pendingLeaves.map((l) => (
                      <tr key={l.id}>
                        <td>
                          <strong>{l.student?.user?.fullName || 'Alice Walker'}</strong>
                          <p className="table-subtext">Roll: {l.student?.rollNumber || 'CS2024-001'}</p>
                        </td>
                        <td><span className="badge badge-warning">{l.reason}</span></td>
                        <td>{l.startDate} &rarr; {l.endDate}</td>
                        <td>{l.description}</td>
                        <td>
                          <input
                            type="text"
                            placeholder="Approval remarks..."
                            className="form-input form-input-sm"
                            value={reviewLeaveMsg[l.id] || ''}
                            onChange={(e) => setReviewLeaveMsg({ ...reviewLeaveMsg, [l.id]: e.target.value })}
                          />
                        </td>
                        <td>
                          <div className="table-btn-row">
                            <button 
                              className="btn btn-success btn-sm"
                              onClick={() => handleReviewLeave(l.id, 'APPROVED')}
                            >
                              Approve
                            </button>
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={() => handleReviewLeave(l.id, 'REJECTED')}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center empty-row">No pending student leaves found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. PROFILE */}
        {activeTab === 'profile' && (
          <div className="glass-panel tab-panel profile-panel">
            <div className="panel-header">
              <div>
                <h2>Faculty Credentials Profile</h2>
                <p className="panel-desc">Official departmental faculty identity</p>
              </div>
            </div>

            <div className="profile-grid">
              <div className="profile-item">
                <span className="p-label">Faculty Member</span>
                <span className="p-value">{user?.fullName || 'Dr. Alan Turing'}</span>
              </div>
              <div className="profile-item">
                <span className="p-label">Employee ID</span>
                <span className="p-value highlight">{profile?.employeeId || 'FAC-2024-001'}</span>
              </div>
              <div className="profile-item">
                <span className="p-label">Department</span>
                <span className="p-value">{profile?.department || 'Computer Science'}</span>
              </div>
              <div className="profile-item">
                <span className="p-label">Academic Designation</span>
                <span className="p-value">{profile?.designation || 'Professor & Head of Department'}</span>
              </div>
              <div className="profile-item">
                <span className="p-label">Qualification</span>
                <span className="p-value">{profile?.qualification || 'Ph.D. in Computer Science'}</span>
              </div>
              <div className="profile-item">
                <span className="p-label">Specialization</span>
                <span className="p-value">{profile?.specialization || 'Artificial Intelligence & Distributed Systems'}</span>
              </div>
              <div className="profile-item">
                <span className="p-label">Experience</span>
                <span className="p-value">{profile?.experienceYears || 15} Years</span>
              </div>
              <div className="profile-item">
                <span className="p-label">Institutional Email</span>
                <span className="p-value">{user?.email || 'teacher@cms.edu'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Create Assignment */}
      {showCreateAsgModal && (
        <div className="modal-overlay" onClick={() => setShowCreateAsgModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <FilePlus size={20} /> Create New Course Assignment
              </h3>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setShowCreateAsgModal(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateAssignment}>
              <div className="form-group">
                <label className="form-label">Assignment Title</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Distributed Database Systems Lab"
                  value={asgForm.title}
                  onChange={(e) => setAsgForm({ ...asgForm, title: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={asgForm.subject}
                    onChange={(e) => setAsgForm({ ...asgForm, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Semester</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={asgForm.semester}
                    onChange={(e) => setAsgForm({ ...asgForm, semester: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={asgForm.dueDate}
                    onChange={(e) => setAsgForm({ ...asgForm, dueDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Total Marks</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    value={asgForm.totalMarks}
                    onChange={(e) => setAsgForm({ ...asgForm, totalMarks: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Instructions / Task Description</label>
                <textarea
                  rows={3}
                  required
                  className="form-textarea"
                  placeholder="Describe requirements and criteria..."
                  value={asgForm.description}
                  onChange={(e) => setAsgForm({ ...asgForm, description: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowCreateAsgModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={creatingAsg}
                >
                  {creatingAsg ? 'Publishing...' : 'Publish Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Submissions */}
      {showSubmissionsModal && activeAsg && (
        <div className="modal-overlay" onClick={() => setShowSubmissionsModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <ClipboardList size={20} /> Submissions: {activeAsg.title}
              </h3>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setShowSubmissionsModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Submission Content</th>
                    <th>Score</th>
                    <th>Feedback</th>
                    <th>Link</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {asgSubmissions.length > 0 ? (
                    asgSubmissions.map((sub) => (
                      <tr key={sub.id}>
                        <td>
                          <strong>{sub.student?.user?.fullName || 'Alice Walker'}</strong>
                          <p className="table-subtext">Roll: {sub.student?.rollNumber}</p>
                        </td>
                        <td>
                          <p className="sub-text-clamp">{sub.content}</p>
                        </td>
                        <td>
                          <strong style={{ color: sub.marksObtained != null ? '#34d399' : '#fbbf24' }}>
                            {sub.marksObtained != null ? `${sub.marksObtained} pts` : 'Ungraded'}
                          </strong>
                        </td>
                        <td>{sub.feedback || '-'}</td>
                        <td>
                          {sub.fileUrl ? (
                            <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="external-link-btn">
                              Open Link <ExternalLink size={12} />
                            </a>
                          ) : '-'}
                        </td>
                        <td>
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => openGradeDialog(sub)}
                          >
                            Grade
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center empty-row">
                        {loadingSubmissions ? 'Loading submissions...' : 'No student submissions recorded for this assignment.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowSubmissionsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Grade Submission */}
      {showGradeModal && selectedSub && (
        <div className="modal-overlay" onClick={() => setShowGradeModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <Award size={20} /> Grade Student Submission
              </h3>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setShowGradeModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="modal-assignment-info">
              <h4>Student: {selectedSub.student?.user?.fullName || 'Alice'}</h4>
              <p>"{selectedSub.content}"</p>
            </div>

            <form onSubmit={handleGradeSubmit}>
              <div className="form-group">
                <label className="form-label">Marks Awarded (Max {activeAsg?.totalMarks || 100})</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  className="form-input"
                  value={gradeForm.marksObtained}
                  onChange={(e) => setGradeForm({ ...gradeForm, marksObtained: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Teacher Feedback / Notes</label>
                <textarea
                  rows={3}
                  required
                  className="form-textarea"
                  value={gradeForm.feedback}
                  onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowGradeModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={grading}
                >
                  {grading ? 'Recording...' : 'Submit Evaluation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .teacher-portal-wrapper {
          max-width: 1300px;
          margin: 0 auto;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .toast-banner {
          position: fixed;
          top: 75px;
          right: 24px;
          background: #064e3b;
          border: 1px solid #059669;
          color: #a7f3d0;
          padding: 12px 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: var(--shadow-lg);
          z-index: 1000;
          animation: fadeIn 0.2s ease-out;
          font-weight: 600;
          font-size: 0.875rem;
        }
        .portal-banner {
          padding: 28px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, rgba(20, 27, 45, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%);
        }
        .faculty-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #38bdf8;
          margin-bottom: 6px;
        }
        .portal-banner h1 {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.02em;
          margin-bottom: 6px;
        }
        .faculty-info-line {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        .banner-stats-pill {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(255, 255, 255, 0.05);
          padding: 12px 20px;
          border-radius: 16px;
          border: 1px solid var(--border-subtle);
        }
        .pill-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .pill-val {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-main);
        }
        .pill-label {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .pill-divider {
          width: 1px;
          height: 32px;
          background: var(--border-subtle);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: 1fr; }
          .portal-banner { flex-direction: column; align-items: flex-start; gap: 16px; }
        }
        .stat-card {
          padding: 20px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          text-align: left;
        }
        .stat-card-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .stat-students .stat-card-icon { background: rgba(56, 189, 248, 0.15); color: #38bdf8; }
        .stat-asgs .stat-card-icon { background: rgba(167, 139, 250, 0.15); color: #c084fc; }
        .stat-leaves .stat-card-icon { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
        .stat-card-content {
          display: flex;
          flex-direction: column;
        }
        .stat-value {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-main);
          line-height: 1.1;
        }
        .stat-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-top: 4px;
        }
        .stat-subtext {
          font-size: 0.725rem;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .dashboard-tabs-bar {
          display: flex;
          padding: 6px;
          gap: 6px;
          overflow-x: auto;
        }
        .tab-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all var(--transition-fast);
        }
        .tab-link:hover {
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.04);
        }
        .tab-link.active {
          background: var(--bg-surface);
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-subtle);
        }
        .tab-panel {
          padding: 24px;
          text-align: left;
        }
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .panel-header h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .panel-desc {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          margin-top: 2px;
        }
        .overview-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 900px) {
          .overview-layout { grid-template-columns: 1fr; }
        }
        .overview-section {
          padding: 24px;
          text-align: left;
        }
        .section-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .section-title-row h3 {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .coursework-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 14px;
          background: rgba(15, 21, 35, 0.6);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          margin-bottom: 10px;
        }
        .coursework-item h4 {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 4px;
        }
        .cw-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.775rem;
          color: var(--text-muted);
        }
        .leave-review-card {
          padding: 14px;
          background: rgba(15, 21, 35, 0.6);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .leave-card-info p {
          font-size: 0.825rem;
          color: var(--text-secondary);
          margin: 4px 0;
        }
        .leave-btns {
          display: flex;
          gap: 8px;
        }
        .filter-bar {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .select-compact {
          padding: 6px 12px;
          font-size: 0.8rem;
          width: auto;
        }
        .mono-text {
          font-family: var(--font-mono);
          color: var(--accent-secondary);
        }
        .form-standalone-panel {
          max-width: 700px;
          margin: 0 auto;
        }
        .custom-form-body {
          text-align: left;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .form-input-sm {
          padding: 6px 10px;
          font-size: 0.8rem;
        }
        .table-btn-row {
          display: flex;
          gap: 6px;
        }
        .sub-text-clamp {
          max-width: 250px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .modal-large {
          max-width: 850px;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }
        .empty-row {
          padding: 28px !important;
          color: var(--text-muted);
          font-style: italic;
        }
        .empty-text {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-style: italic;
          padding: 16px 0;
        }
        .external-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: var(--accent-secondary);
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .external-link-btn:hover {
          text-decoration: underline;
        }
        .profile-panel {
          padding: 28px;
        }
        .profile-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-top: 10px;
        }
        @media (max-width: 640px) {
          .profile-grid { grid-template-columns: 1fr; }
        }
        .profile-item {
          background: rgba(15, 21, 35, 0.6);
          border: 1px solid var(--border-subtle);
          padding: 14px 18px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .p-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .p-value {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-main);
        }
        .p-value.highlight {
          color: var(--accent-secondary);
          font-family: var(--font-mono);
        }
      `}</style>
    </div>
  );
}
