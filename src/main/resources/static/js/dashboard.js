const BASE_URL = '/api';
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

if (!token || !user) {
    window.location.href = '/api/index.html';
}

document.getElementById('userNameDisplay').innerText = `Welcome, ${user.fullName}`;

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/api/index.html';
}

function switchTab(tabId) {
    document.querySelectorAll('.content-panel').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
    
    // Fetch data based on tab
    if (user.role === 'ROLE_STUDENT') {
        if (tabId === 'attendance') fetchStudentAttendance();
        else if (tabId === 'results') fetchStudentResults();
        else if (tabId === 'fees') fetchStudentFees();
        else if (tabId === 'assignments') fetchStudentAssignments();
    } else if (user.role === 'ROLE_TEACHER') {
        if (tabId === 'manage-assignments') fetchTeacherAssignments();
        else if (tabId === 'manage-leaves') fetchPendingLeaves();
    }
}

async function fetchWithAuth(url) {
    const res = await fetch(BASE_URL + url, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.status === 401 || res.status === 403) logout();
    return res.json();
}

// Initial Data Load
async function loadDashboard() {
    try {
        if (user.role === 'ROLE_STUDENT') {
            const data = await fetchWithAuth(`/student/dashboard/${user.userId}`);
            if (data.success) {
                const stats = data.data;
                document.getElementById('statsContainer').innerHTML = `
                    <div class="stat-card glass-card"><h3>${stats.attendancePercentage}%</h3><p>Attendance</p></div>
                    <div class="stat-card glass-card"><h3>${stats.pendingAssignments}</h3><p>Pending Assignments</p></div>
                    <div class="stat-card glass-card"><h3>$${stats.totalFeesDue}</h3><p>Fees Due</p></div>
                    <div class="stat-card glass-card"><h3>${stats.averageMarks}%</h3><p>Avg Marks</p></div>
                `;
            }
        } else if (user.role === 'ROLE_TEACHER') {
            const data = await fetchWithAuth(`/teacher/dashboard/${user.userId}`);
            if (data.success) {
                const stats = data.data;
                document.getElementById('statsContainer').innerHTML = `
                    <div class="stat-card glass-card"><h3>${stats.totalStudents}</h3><p>Dept Students</p></div>
                    <div class="stat-card glass-card"><h3>${stats.totalAssignments}</h3><p>Assignments Created</p></div>
                    <div class="stat-card glass-card"><h3>${stats.pendingLeaves}</h3><p>Pending Leaves</p></div>
                `;
            }
        }
    } catch (e) {
        document.getElementById('statsContainer').innerHTML = `<p>Error loading stats.</p>`;
    }
}

// Student Data Fetchers
async function fetchStudentAttendance() {
    const data = await fetchWithAuth(`/student/${user.userId}/attendance`);
    const tbody = document.querySelector('#attendanceTable tbody');
    tbody.innerHTML = data.data.length ? data.data.map(a => `
        <tr><td>${a.subject}</td><td>${a.date}</td><td>${a.status}</td><td>${a.remarks || '-'}</td></tr>
    `).join('') : '<tr><td colspan="4">No records found</td></tr>';
}

async function fetchStudentResults() {
    const data = await fetchWithAuth(`/student/${user.userId}/results`);
    const tbody = document.querySelector('#resultsTable tbody');
    tbody.innerHTML = data.data.length ? data.data.map(r => `
        <tr><td>${r.subject}</td><td>${r.examType}</td><td>${r.semester}</td><td>${r.marksObtained}/${r.totalMarks}</td><td>${r.grade}</td></tr>
    `).join('') : '<tr><td colspan="5">No records found</td></tr>';
}

async function fetchStudentFees() {
    const data = await fetchWithAuth(`/student/${user.userId}/fees`);
    const tbody = document.querySelector('#feesTable tbody');
    tbody.innerHTML = data.data.length ? data.data.map(f => `
        <tr><td>${f.feeType}</td><td>$${f.amount}</td><td>$${f.amountPaid}</td><td>$${f.balanceDue}</td><td>${f.status}</td></tr>
    `).join('') : '<tr><td colspan="5">No records found</td></tr>';
}

async function fetchStudentAssignments() {
    const data = await fetchWithAuth(`/student/${user.userId}/assignments`);
    const tbody = document.querySelector('#assignmentsTable tbody');
    tbody.innerHTML = data.data.length ? data.data.map(a => `
        <tr><td>${a.id}</td><td>${a.status}</td><td>${a.marksObtained || '-'}</td><td>${a.feedback || '-'}</td></tr>
    `).join('') : '<tr><td colspan="4">No submissions yet</td></tr>';
}

// Teacher Data Fetchers
async function fetchTeacherAssignments() {
    const data = await fetchWithAuth(`/teacher/${user.userId}/assignments`);
    const tbody = document.querySelector('#teacherAssignmentsTable tbody');
    tbody.innerHTML = data.data.length ? data.data.map(a => `
        <tr><td>${a.id}</td><td>${a.title}</td><td>${a.subject}</td><td>${a.dueDate}</td></tr>
    `).join('') : '<tr><td colspan="4">No assignments created</td></tr>';
}

async function fetchPendingLeaves() {
    const data = await fetchWithAuth(`/teacher/leaves/pending`);
    const tbody = document.querySelector('#pendingLeavesTable tbody');
    tbody.innerHTML = data.data.length ? data.data.map(l => `
        <tr><td>Student ID: ${l.student.id}</td><td>${l.reason}</td><td>${l.startDate}</td><td>${l.endDate}</td></tr>
    `).join('') : '<tr><td colspan="4">No pending requests</td></tr>';
}

// Initialize
loadDashboard();
