const BASE_URL = '/api';

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
 * Generic request helper with error handling.
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, options);
    const data = await res.json().catch(() => ({ success: false, message: 'Invalid response from server' }));

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        // Token might be expired or invalid
        // If not logging in, let caller handle or logout
      }
      const err = new Error(data.message || (data.errors ? Object.values(data.errors).join(', ') : 'Request failed'));
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  } catch (error) {
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
};
