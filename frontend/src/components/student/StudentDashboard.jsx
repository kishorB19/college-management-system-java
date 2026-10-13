import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Award, 
  CreditCard, 
  FileText, 
  Send, 
  User, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  PlusCircle,
  ExternalLink,
  DollarSign,
  BookOpen,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const studentId = user?.studentId || user?.profileId || user?.userId;

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Dashboard Data State
  const [stats, setStats] = useState({
    attendancePercentage: 0,
    pendingAssignments: 0,
    totalFeesDue: 0,
    averageMarks: 0,
  });
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [results, setResults] = useState([]);
  const [fees, setFees] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [availableAssignments, setAvailableAssignments] = useState([]);
  const [leaves, setLeaves] = useState([]);

  // Modals & Forms
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionForm, setSubmissionForm] = useState({ content: '', fileUrl: '' });
  const [submittingAssignment, setSubmittingAssignment] = useState(false);

  // Leave Form
  const [leaveForm, setLeaveForm] = useState({
    reason: 'Medical Leave',
    description: '',
    startDate: '',
    endDate: '',
  });
  const [applyingLeave, setApplyingLeave] = useState(false);

  // Show toast helper
  const showNotification = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const loadData = async () => {
    if (!studentId) return;
    setLoading(true);
    setError('');

    try {
      const [
        statsRes,
        profRes,
        attRes,
        resRes,
        feeRes,
        subRes,
        availRes,
        leaveRes,
      ] = await Promise.allSettled([
        api.getStudentDashboard(studentId),
        api.getStudentProfile(studentId),
        api.getStudentAttendance(studentId),
        api.getStudentResults(studentId),
        api.getStudentFees(studentId),
        api.getStudentAssignments(studentId),
        api.getAvailableAssignments(studentId),
        api.getStudentLeaves(studentId),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.success && statsRes.value.data) {
        setStats(statsRes.value.data);
      }
      if (profRes.status === 'fulfilled' && profRes.value?.success && profRes.value.data) {
        setProfile(profRes.value.data);
      }
      if (attRes.status === 'fulfilled' && attRes.value?.success) {
        setAttendance(Array.isArray(attRes.value.data) ? attRes.value.data : []);
      }
      if (resRes.status === 'fulfilled' && resRes.value?.success) {
        setResults(Array.isArray(resRes.value.data) ? resRes.value.data : []);
      }
      if (feeRes.status === 'fulfilled' && feeRes.value?.success) {
        setFees(Array.isArray(feeRes.value.data) ? feeRes.value.data : []);
      }
      if (subRes.status === 'fulfilled' && subRes.value?.success) {
        setSubmissions(Array.isArray(subRes.value.data) ? subRes.value.data : []);
      }
      if (availRes.status === 'fulfilled' && availRes.value?.success) {
        setAvailableAssignments(Array.isArray(availRes.value.data) ? availRes.value.data : []);
      }
      if (leaveRes.status === 'fulfilled' && leaveRes.value?.success) {
        setLeaves(Array.isArray(leaveRes.value.data) ? leaveRes.value.data : []);
      }
    } catch (err) {
      setError('Failed to fetch some dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [studentId]);

  // Handle Pay Fee
  const handlePayFee = async (feeId) => {
    try {
      const res = await api.payFee(feeId);
      if (res.success) {
        showNotification('Payment processed successfully! Fee record updated.');
        // Refresh fee and dashboard stats
        const [updatedFees, updatedStats] = await Promise.all([
          api.getStudentFees(studentId),
          api.getStudentDashboard(studentId),
        ]);
        if (updatedFees?.success) setFees(updatedFees.data);
        if (updatedStats?.success) setStats(updatedStats.data);
      }
    } catch (err) {
      alert(err.message || 'Payment failed');
    }
  };

  // Open Submit Homework Modal
  const openSubmitModal = (assignment) => {
    setSelectedAssignment(assignment);
    setSubmissionForm({ content: '', fileUrl: '' });
    setShowSubmitModal(true);
  };

  // Submit Homework
  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    setSubmittingAssignment(true);

    try {
      const res = await api.submitAssignment({
        assignmentId: selectedAssignment.id,
        content: submissionForm.content,
        fileUrl: submissionForm.fileUrl,
      });

      if (res.success) {
        showNotification(`Assignment "${selectedAssignment.title}" submitted successfully!`);
        setShowSubmitModal(false);
        // Refresh submissions and stats
        const [updatedSubs, updatedStats] = await Promise.all([
          api.getStudentAssignments(studentId),
          api.getStudentDashboard(studentId),
        ]);
        if (updatedSubs?.success) setSubmissions(updatedSubs.data);
        if (updatedStats?.success) setStats(updatedStats.data);
      }
    } catch (err) {
      alert(err.message || 'Submission failed');
    } finally {
      setSubmittingAssignment(false);
    }
  };

  // Submit Leave Request
  const handleApplyLeave = async (e) => {
    e.preventDefault();
    setApplyingLeave(true);

    try {
      const res = await api.applyLeave(leaveForm);
      if (res.success) {
        showNotification('Leave request submitted to faculty for review!');
        setLeaveForm({
          reason: 'Medical Leave',
          description: '',
          startDate: '',
          endDate: '',
        });
        const updatedLeaves = await api.getStudentLeaves(studentId);
        if (updatedLeaves?.success) setLeaves(updatedLeaves.data);
      }
    } catch (err) {
      alert(err.message || 'Leave application failed');
    } finally {
      setApplyingLeave(false);
    }
  };

  return (
    <div className="student-portal-wrapper">
      {/* Toast */}
      {successToast && (
        <div className="toast-banner">
          <CheckCircle size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="portal-banner glass-panel">
        <div className="banner-text">
          <div className="student-badge">
            <Sparkles size={14} /> Student Portal
          </div>
          <h1>Welcome, {user?.fullName || 'Student'}</h1>
          <p className="student-info-line">
            Roll No: <strong>{profile?.rollNumber || 'CS2024-001'}</strong> &bull;{' '}
            Department: <strong>{profile?.department || user?.department || 'Computer Science'}</strong> &bull;{' '}
            {profile?.semester || user?.semester || 'Semester 4'} ({profile?.section || 'Section A'})
          </p>
        </div>
        <div className="banner-stats-pill">
          <div className="pill-item">
            <span className="pill-val">{stats.attendancePercentage}%</span>
            <span className="pill-label">Attendance</span>
          </div>
          <div className="pill-divider"></div>
          <div className="pill-item">
            <span className="pill-val">${stats.totalFeesDue}</span>
            <span className="pill-label">Fees Due</span>
          </div>
        </div>
      </div>

      {/* Quick Overview Cards */}
      <div className="stats-grid">
        <div className="glass-panel stat-card stat-attendance">
          <div className="stat-card-icon">
            <CalendarCheck size={24} />
          </div>
          <div className="stat-card-content">
            <div className="stat-value">{stats.attendancePercentage}%</div>
            <div className="stat-label">Overall Attendance</div>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${Math.min(stats.attendancePercentage, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="glass-panel stat-card stat-assignments">
          <div className="stat-card-icon">
            <FileText size={24} />
          </div>
          <div className="stat-card-content">
            <div className="stat-value">{stats.pendingAssignments}</div>
            <div className="stat-label">Pending Assignments</div>
            <span className="stat-subtext">Action required</span>
          </div>
        </div>

        <div className="glass-panel stat-card stat-fees">
          <div className="stat-card-icon">
            <CreditCard size={24} />
          </div>
          <div className="stat-card-content">
            <div className="stat-value">${stats.totalFeesDue}</div>
            <div className="stat-label">Balance Fees Due</div>
            <span className="stat-subtext">
              {stats.totalFeesDue === 0 ? 'All cleared!' : 'Payable online'}
            </span>
          </div>
        </div>

        <div className="glass-panel stat-card stat-marks">
          <div className="stat-card-icon">
            <Award size={24} />
          </div>
          <div className="stat-card-content">
            <div className="stat-value">{stats.averageMarks}%</div>
            <div className="stat-label">Average Academic Score</div>
            <span className="stat-subtext">Cumulative GPA: 3.8</span>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="dashboard-tabs-bar glass-panel">
        <button
          className={`tab-link ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <LayoutDashboard size={16} /> Overview
        </button>
        <button
          className={`tab-link ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveTab('attendance')}
        >
          <CalendarCheck size={16} /> Attendance ({attendance.length})
        </button>
        <button
          className={`tab-link ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          <Award size={16} /> Results &amp; Grades ({results.length})
        </button>
        <button
          className={`tab-link ${activeTab === 'fees' ? 'active' : ''}`}
          onClick={() => setActiveTab('fees')}
        >
          <CreditCard size={16} /> Fee Records ({fees.length})
        </button>
        <button
          className={`tab-link ${activeTab === 'assignments' ? 'active' : ''}`}
          onClick={() => setActiveTab('assignments')}
        >
          <FileText size={16} /> Coursework &amp; Submissions ({submissions.length})
        </button>
        <button
          className={`tab-link ${activeTab === 'leaves' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaves')}
        >
          <Send size={16} /> Leave Requests ({leaves.length})
        </button>
        <button
          className={`tab-link ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={16} /> Student Profile
        </button>
      </div>

      {/* Tab Panels */}
      <div className="tab-content-area">
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="overview-layout">
            <div className="glass-panel overview-section">
              <div className="section-title-row">
                <h3><FileText size={18} /> Active Coursework</h3>
                <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('assignments')}>
                  View All
                </button>
              </div>
              {availableAssignments.length > 0 ? (
                <div className="assignment-cards-stack">
                  {availableAssignments.slice(0, 3).map((item) => (
                    <div key={item.id} className="coursework-item">
                      <div className="cw-details">
                        <h4>{item.title}</h4>
                        <div className="cw-meta">
                          <span className="badge badge-info">{item.subject}</span>
                          <span>Due: {item.dueDate}</span>
                          <span>Marks: {item.totalMarks}</span>
                        </div>
                      </div>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => openSubmitModal(item)}
                      >
                        Submit
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-text">No active assignments pending right now.</p>
              )}
            </div>

            <div className="glass-panel overview-section">
              <div className="section-title-row">
                <h3><CreditCard size={18} /> Fee Summary</h3>
                <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('fees')}>
                  View Invoices
                </button>
              </div>
              {fees.length > 0 ? (
                <div className="fee-cards-stack">
                  {fees.slice(0, 3).map((fee) => (
                    <div key={fee.id} className="fee-quick-item">
                      <div>
                        <strong>{fee.feeType}</strong>
                        <div className="cw-meta">
                          <span>Amount: ${fee.amount}</span>
                          <span>Paid: ${fee.amountPaid}</span>
                        </div>
                      </div>
                      <div className="fee-action-col">
                        <span className={`badge ${fee.status === 'PAID' ? 'badge-success' : 'badge-warning'}`}>
                          {fee.status}
                        </span>
                        {fee.status !== 'PAID' && (
                          <button 
                            className="btn btn-success btn-sm"
                            onClick={() => handlePayFee(fee.id)}
                          >
                            Pay ${fee.balanceDue}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-text">No fee records found.</p>
              )}
            </div>
          </div>
        )}

        {/* 2. ATTENDANCE TAB */}
        {activeTab === 'attendance' && (
          <div className="glass-panel tab-panel">
            <div className="panel-header">
              <div>
                <h2>Academic Attendance History</h2>
                <p className="panel-desc">Subject-wise daily attendance records and presence log</p>
              </div>
              <div className="stat-pill-highlight">
                Overall: <strong>{stats.attendancePercentage}%</strong>
              </div>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.length > 0 ? (
                    attendance.map((att) => (
                      <tr key={att.id}>
                        <td>{att.date}</td>
                        <td><strong>{att.subject}</strong></td>
                        <td>
                          <span className={`badge ${
                            att.status === 'PRESENT' ? 'badge-success' :
                            att.status === 'LATE' ? 'badge-warning' : 'badge-danger'
                          }`}>
                            {att.status}
                          </span>
                        </td>
                        <td>{att.remarks || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center empty-row">No attendance records logged yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. EXAM RESULTS TAB */}
        {activeTab === 'results' && (
          <div className="glass-panel tab-panel">
            <div className="panel-header">
              <div>
                <h2>Examinations &amp; Academic Grades</h2>
                <p className="panel-desc">Verified scorecards for midterm, final, and lab exams</p>
              </div>
              <div className="stat-pill-highlight">
                Average: <strong>{stats.averageMarks}%</strong>
              </div>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Exam Type</th>
                    <th>Semester</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Grade</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {results.length > 0 ? (
                    results.map((r) => {
                      const pct = Math.round((r.marksObtained / r.totalMarks) * 100);
                      return (
                        <tr key={r.id}>
                          <td><strong>{r.subject}</strong></td>
                          <td><span className="badge badge-info">{r.examType}</span></td>
                          <td>{r.semester}</td>
                          <td>{r.marksObtained} / {r.totalMarks}</td>
                          <td>
                            <strong>{pct}%</strong>
                          </td>
                          <td>
                            <span className="badge badge-primary">{r.grade || 'A'}</span>
                          </td>
                          <td>{r.remarks || 'Satisfactory'}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center empty-row">No published exam results available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. FEE RECORDS TAB */}
        {activeTab === 'fees' && (
          <div className="glass-panel tab-panel">
            <div className="panel-header">
              <div>
                <h2>Fee Invoices &amp; Online Settlement</h2>
                <p className="panel-desc">Manage semester tuition, library, and laboratory charges</p>
              </div>
              <div className="stat-pill-highlight">
                Total Due: <strong>${stats.totalFeesDue}</strong>
              </div>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Fee Category</th>
                    <th>Semester</th>
                    <th>Total Amount</th>
                    <th>Amount Paid</th>
                    <th>Balance Due</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Payment Action</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.length > 0 ? (
                    fees.map((fee) => (
                      <tr key={fee.id}>
                        <td><strong>{fee.feeType}</strong></td>
                        <td>{fee.semester || 'Semester 4'}</td>
                        <td>${fee.amount}</td>
                        <td>${fee.amountPaid}</td>
                        <td><strong style={{ color: fee.balanceDue > 0 ? '#f87171' : '#34d399' }}>${fee.balanceDue}</strong></td>
                        <td>{fee.dueDate || 'N/A'}</td>
                        <td>
                          <span className={`badge ${
                            fee.status === 'PAID' ? 'badge-success' :
                            fee.status === 'PARTIAL' ? 'badge-warning' : 'badge-danger'
                          }`}>
                            {fee.status}
                          </span>
                        </td>
                        <td>
                          {fee.status === 'PAID' ? (
                            <span className="badge badge-success">Paid in Full</span>
                          ) : (
                            <button 
                              className="btn btn-success btn-sm"
                              onClick={() => handlePayFee(fee.id)}
                            >
                              <DollarSign size={13} /> Pay ${fee.balanceDue}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center empty-row">No fee records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. ASSIGNMENTS TAB */}
        {activeTab === 'assignments' && (
          <div className="assignments-tab-layout">
            {/* Available to Submit */}
            <div className="glass-panel tab-panel">
              <div className="panel-header">
                <div>
                  <h2>Available Coursework</h2>
                  <p className="panel-desc">Assignments published by faculty for your semester</p>
                </div>
              </div>

              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Subject</th>
                      <th>Due Date</th>
                      <th>Total Marks</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableAssignments.length > 0 ? (
                      availableAssignments.map((asg) => (
                        <tr key={asg.id}>
                          <td>
                            <strong>{asg.title}</strong>
                            <p className="table-subtext">{asg.description}</p>
                          </td>
                          <td><span className="badge badge-info">{asg.subject}</span></td>
                          <td>{asg.dueDate}</td>
                          <td>{asg.totalMarks} pts</td>
                          <td>
                            <button 
                              className="btn btn-primary btn-sm"
                              onClick={() => openSubmitModal(asg)}
                            >
                              <Send size={13} /> Submit Work
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center empty-row">No pending coursework found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* My Submissions */}
            <div className="glass-panel tab-panel">
              <div className="panel-header">
                <div>
                  <h2>Submitted Work &amp; Grades</h2>
                  <p className="panel-desc">Submissions evaluated with faculty score &amp; remarks</p>
                </div>
              </div>

              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Submission ID</th>
                      <th>Status</th>
                      <th>Score</th>
                      <th>Faculty Feedback</th>
                      <th>Link / Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.length > 0 ? (
                      submissions.map((sub) => (
                        <tr key={sub.id}>
                          <td>#{sub.id}</td>
                          <td>
                            <span className={`badge ${sub.status === 'GRADED' ? 'badge-success' : 'badge-warning'}`}>
                              {sub.status}
                            </span>
                          </td>
                          <td>
                            <strong>{sub.marksObtained != null ? `${sub.marksObtained} pts` : 'Pending'}</strong>
                          </td>
                          <td>{sub.feedback || 'Awaiting teacher review'}</td>
                          <td>
                            {sub.fileUrl ? (
                              <a 
                                href={sub.fileUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="external-link-btn"
                              >
                                View Link <ExternalLink size={12} />
                              </a>
                            ) : '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center empty-row">No submissions recorded.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 6. LEAVES TAB */}
        {activeTab === 'leaves' && (
          <div className="leaves-tab-layout">
            {/* Apply Leave Form */}
            <div className="glass-panel leave-form-panel">
              <div className="panel-header">
                <div>
                  <h2>Apply for Academic Leave</h2>
                  <p className="panel-desc">Request excused absence from faculty</p>
                </div>
              </div>

              <form onSubmit={handleApplyLeave} className="leave-form">
                <div className="form-group">
                  <label className="form-label">Reason / Category</label>
                  <select
                    className="form-select"
                    value={leaveForm.reason}
                    onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  >
                    <option value="Medical Leave">Medical Leave</option>
                    <option value="Academic Conference">Academic Conference / Tech Event</option>
                    <option value="Personal / Family Emergency">Personal / Family Emergency</option>
                    <option value="Sports / University Representation">Sports / University Representation</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      required
                      className="form-input"
                      value={leaveForm.startDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      required
                      className="form-input"
                      value={leaveForm.endDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Detailed Explanation</label>
                  <textarea
                    rows={3}
                    required
                    className="form-textarea"
                    placeholder="Provide details about the absence..."
                    value={leaveForm.description}
                    onChange={(e) => setLeaveForm({ ...leaveForm, description: e.target.value })}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={applyingLeave}
                >
                  <Send size={15} />
                  {applyingLeave ? 'Submitting...' : 'Submit Leave Request'}
                </button>
              </form>
            </div>

            {/* Leave History */}
            <div className="glass-panel tab-panel">
              <div className="panel-header">
                <div>
                  <h2>Leave Request History</h2>
                  <p className="panel-desc">Live status of your leave submissions</p>
                </div>
              </div>

              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Reason</th>
                      <th>Dates</th>
                      <th>Status</th>
                      <th>Faculty Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.length > 0 ? (
                      leaves.map((l) => (
                        <tr key={l.id}>
                          <td>
                            <strong>{l.reason}</strong>
                            <p className="table-subtext">{l.description}</p>
                          </td>
                          <td>{l.startDate} to {l.endDate}</td>
                          <td>
                            <span className={`badge ${
                              l.status === 'APPROVED' ? 'badge-success' :
                              l.status === 'REJECTED' ? 'badge-danger' : 'badge-warning'
                            }`}>
                              {l.status}
                            </span>
                          </td>
                          <td>{l.responseMessage || 'Pending faculty review'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center empty-row">No leave requests submitted.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 7. PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="glass-panel tab-panel profile-panel">
            <div className="panel-header">
              <div>
                <h2>Student Academic Profile</h2>
                <p className="panel-desc">Verified institutional identity records</p>
              </div>
            </div>

            <div className="profile-grid">
              <div className="profile-item">
                <span className="p-label">Full Name</span>
                <span className="p-value">{user?.fullName || 'Alice Walker'}</span>
              </div>
              <div className="profile-item">
                <span className="p-label">Roll Number</span>
                <span className="p-value highlight">{profile?.rollNumber || 'CS2024-001'}</span>
              </div>
              <div className="profile-item">
                <span className="p-label">Department</span>
                <span className="p-value">{profile?.department || 'Computer Science'}</span>
              </div>
              <div className="profile-item">
                <span className="p-label">Semester / Section</span>
                <span className="p-value">{profile?.semester || 'Semester 4'} - {profile?.section || 'A'}</span>
              </div>
              <div className="profile-item">
                <span className="p-label">Email Address</span>
                <span className="p-value">{user?.email || 'student@cms.edu'}</span>
              </div>
              <div className="profile-item">
                <span className="p-label">Institutional Contact</span>
                <span className="p-value">{user?.phoneNumber || '+1-555-0102'}</span>
              </div>
              <div className="profile-item">
                <span className="p-label">Guardian Name</span>
                <span className="p-value">{profile?.guardianName || 'Robert Walker'}</span>
              </div>
              <div className="profile-item">
                <span className="p-label">Guardian Phone</span>
                <span className="p-value">{profile?.guardianPhone || '+1-555-0199'}</span>
              </div>
              <div className="profile-item full-width">
                <span className="p-label">Residential Address</span>
                <span className="p-value">{profile?.address || '42 Campus Avenue, Silicon Valley'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submission Modal */}
      {showSubmitModal && selectedAssignment && (
        <div className="modal-overlay" onClick={() => setShowSubmitModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <FileText size={20} /> Submit Coursework
              </h3>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setShowSubmitModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="modal-assignment-info">
              <h4>{selectedAssignment.title}</h4>
              <p>{selectedAssignment.description}</p>
              <div className="cw-meta">
                <span>Subject: {selectedAssignment.subject}</span>
                <span>Due: {selectedAssignment.dueDate}</span>
                <span>Max Marks: {selectedAssignment.totalMarks}</span>
              </div>
            </div>

            <form onSubmit={handleSubmitAssignment}>
              <div className="form-group">
                <label className="form-label">Submission Content / Solution Notes</label>
                <textarea
                  rows={4}
                  required
                  className="form-textarea"
                  placeholder="Explain your solution, methodology, or design approach..."
                  value={submissionForm.content}
                  onChange={(e) => setSubmissionForm({ ...submissionForm, content: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Project URL or GitHub Link (Optional)</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://github.com/username/project"
                  value={submissionForm.fileUrl}
                  onChange={(e) => setSubmissionForm({ ...submissionForm, fileUrl: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowSubmitModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={submittingAssignment}
                >
                  {submittingAssignment ? 'Submitting...' : 'Upload Submission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .student-portal-wrapper {
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
        .student-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--accent-secondary);
          margin-bottom: 6px;
        }
        .portal-banner h1 {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.02em;
          margin-bottom: 6px;
        }
        .student-info-line {
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
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .portal-banner { flex-direction: column; align-items: flex-start; gap: 16px; }
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr; }
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
        .stat-attendance .stat-card-icon { background: rgba(16, 185, 129, 0.15); color: #34d399; }
        .stat-assignments .stat-card-icon { background: rgba(99, 102, 241, 0.15); color: #818cf8; }
        .stat-fees .stat-card-icon { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
        .stat-marks .stat-card-icon { background: rgba(6, 182, 212, 0.15); color: #22d3ee; }
        .stat-card-content {
          display: flex;
          flex-direction: column;
          width: 100%;
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
        .progress-bar-bg {
          width: 100%;
          height: 5px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          margin-top: 8px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: var(--status-success);
          border-radius: 4px;
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
        .stat-pill-highlight {
          background: rgba(99, 102, 241, 0.15);
          border: 1px solid rgba(99, 102, 241, 0.3);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.85rem;
          color: #c7d2fe;
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
        .coursework-item, .fee-quick-item {
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
        .fee-action-col {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .table-subtext {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 2px;
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
        .assignments-tab-layout, .leaves-tab-layout {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .leave-form-panel {
          padding: 24px;
          text-align: left;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
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
        .profile-item.full-width {
          grid-column: 1 / -1;
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
        .modal-assignment-info {
          background: rgba(15, 21, 35, 0.8);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 14px;
          margin-bottom: 18px;
          text-align: left;
        }
        .modal-assignment-info h4 {
          font-size: 0.95rem;
          color: var(--text-main);
          margin-bottom: 4px;
        }
        .modal-assignment-info p {
          font-size: 0.825rem;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
}
