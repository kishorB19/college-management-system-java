import { handleMockRequest } from './mockEngine';

const BASE_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.port === '5173'
  ? 'http://localhost:8080/api'
  : '/api');

/**
 * Helper to get the auth headers with JWT token.
 */
function getHeaders(isJson = true) {
  const token = localStorage.getItem('token');
  const headers = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Generic request helper with error handling and automatic in-browser demo engine fallback.
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';

    // If server returned HTML (Vercel SPA rewrite when no Java backend is on the domain)
    if (!contentType.includes('application/json')) {
      return handleMockRequest(endpoint, options);
    }

    const data = await res.json().catch(() => null);
    if (!data) {
      return handleMockRequest(endpoint, options);
    }

    if (!res.ok) {
      const err = new Error(data.message || (data.errors ? Object.values(data.errors).join(', ') : 'Request failed'));
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  } catch (error) {
    // If it's a network error, 404, or backend is offline, run seamlessly via local store
    if (error.name === 'TypeError' || error.message?.includes('fetch') || error.status === 404 || error.status === 502) {
      return handleMockRequest(endpoint, options);
    }
    console.error(`API Error on [${options.method || 'GET'} ${url}]:`, error);
    throw error;
  }
}

export const api = {
  // Auth
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }),

  getCurrentUser: () =>
    request('/auth/me', {
      headers: getHeaders(),
    }),

  // Student Endpoints
  getStudentDashboard: (studentId) =>
    request(`/student/dashboard/${studentId}`, {
      headers: getHeaders(),
    }),

  getStudentProfile: (studentId) =>
    request(`/student/${studentId}/profile`, {
      headers: getHeaders(),
    }),

  getStudentAttendance: (studentId) =>
    request(`/student/${studentId}/attendance`, {
      headers: getHeaders(),
    }),

  getStudentResults: (studentId) =>
    request(`/student/${studentId}/results`, {
      headers: getHeaders(),
    }),

  getStudentFees: (studentId) =>
    request(`/student/${studentId}/fees`, {
      headers: getHeaders(),
    }),

  payFee: (feeId) =>
    request(`/student/fees/pay/${feeId}`, {
      method: 'POST',
      headers: getHeaders(),
    }),

  getStudentAssignments: (studentId) =>
    request(`/student/${studentId}/assignments`, {
      headers: getHeaders(),
    }),

  getAvailableAssignments: (studentId) =>
    request(`/student/${studentId}/available-assignments`, {
      headers: getHeaders(),
    }),

  submitAssignment: (submissionData) =>
    request('/student/assignments/submit', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(submissionData),
    }),

  getStudentLeaves: (studentId) =>
    request(`/student/${studentId}/leaves`, {
      headers: getHeaders(),
    }),

  applyLeave: (leaveData) =>
    request('/student/leaves/apply', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(leaveData),
    }),

  // Teacher Endpoints
  getTeacherDashboard: (teacherId) =>
    request(`/teacher/dashboard/${teacherId}`, {
      headers: getHeaders(),
    }),

  getTeacherProfile: (teacherId) =>
    request(`/teacher/${teacherId}/profile`, {
      headers: getHeaders(),
    }),

  getStudents: (department, semester) => {
    const params = new URLSearchParams();
    if (department) params.append('department', department);
    if (semester) params.append('semester', semester);
    const query = params.toString() ? `?${params.toString()}` : '';
    return request(`/teacher/students${query}`, {
      headers: getHeaders(),
    });
  },

  markAttendance: (attendanceData) =>
    request('/teacher/attendance/mark', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(attendanceData),
    }),

  addExamResult: (resultData) =>
    request('/teacher/results/add', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(resultData),
    }),

  createAssignment: (assignmentData) =>
    request('/teacher/assignments/create', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(assignmentData),
    }),

  getTeacherAssignments: (teacherId) =>
    request(`/teacher/${teacherId}/assignments`, {
      headers: getHeaders(),
    }),

  getAssignmentSubmissions: (assignmentId) =>
    request(`/teacher/assignments/${assignmentId}/submissions`, {
      headers: getHeaders(),
    }),

  gradeSubmission: (submissionId, gradeData) =>
    request(`/teacher/assignments/grade/${submissionId}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(gradeData),
    }),

  getPendingLeaves: () =>
    request('/teacher/leaves/pending', {
      headers: getHeaders(),
    }),

  reviewLeave: (leaveId, status, responseMessage) => {
    const params = new URLSearchParams({ status });
    if (responseMessage) params.append('responseMessage', responseMessage);
    return request(`/teacher/leaves/review/${leaveId}?${params.toString()}`, {
      method: 'POST',
      headers: getHeaders(),
    });
  },

  // Batch Attendance
  markAttendanceBatch: (attendanceData) =>
    request('/teacher/attendance/mark-batch', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(attendanceData),
    }),

  // Notices
  getNotices: () =>
    request('/notices', {
      headers: getHeaders(),
    }),

  createNotice: (noticeData) =>
    request('/notices/create', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(noticeData),
    }),
};
