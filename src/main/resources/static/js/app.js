const BASE_URL = '/api';

// Modal Functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
    // Clear forms
    if(modalId === 'loginModal') document.getElementById('loginForm').reset();
    if(modalId === 'registerModal') document.getElementById('registerForm').reset();
    document.getElementById('loginError').innerText = '';
    document.getElementById('regError').innerText = '';
    document.getElementById('regSuccess').innerText = '';
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
}

// Toggle dynamic fields in registration based on role
document.querySelectorAll('input[name="role"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const studentFields = document.querySelectorAll('.student-only');
        if (this.value === 'STUDENT') {
            studentFields.forEach(el => el.style.display = 'block');
            document.getElementById('regDepartment').required = true;
            document.getElementById('regSemester').required = true;
        } else {
            studentFields.forEach(el => el.style.display = 'none');
            document.getElementById('regDepartment').required = false;
            document.getElementById('regSemester').required = false;
        }
    });
});

// Auth API Calls
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const ogText = btn.innerText;
    btn.innerText = 'Logging in...';
    btn.disabled = true;

    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usernameOrEmail: document.getElementById('loginUsername').value,
                password: document.getElementById('loginPassword').value
            })
        });

        const data = await response.json();
        
        if (response.ok && data.success) {
            // Save token and user info
            localStorage.setItem('token', data.data.accessToken);
            localStorage.setItem('user', JSON.stringify(data.data));
            
            // Redirect based on role
            if (data.data.role === 'ROLE_STUDENT') {
                window.location.href = '/api/student-dashboard.html'; // In a real app we'd have these pages
                alert('Login successful as Student!');
            } else if (data.data.role === 'ROLE_TEACHER') {
                window.location.href = '/api/teacher-dashboard.html';
                alert('Login successful as Teacher!');
            }
        } else {
            document.getElementById('loginError').innerText = data.message || 'Login failed';
        }
    } catch (error) {
        document.getElementById('loginError').innerText = 'An error occurred. Please try again.';
    } finally {
        btn.innerText = ogText;
        btn.disabled = false;
    }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const ogText = btn.innerText;
    btn.innerText = 'Creating account...';
    btn.disabled = true;
    
    document.getElementById('regError').innerText = '';
    document.getElementById('regSuccess').innerText = '';

    const role = document.querySelector('input[name="role"]:checked').value;
    
    const payload = {
        fullName: document.getElementById('regFullName').value,
        username: document.getElementById('regUsername').value,
        email: document.getElementById('regEmail').value,
        password: document.getElementById('regPassword').value,
        role: role
    };
    
    if (role === 'STUDENT') {
        payload.department = document.getElementById('regDepartment').value;
        payload.semester = document.getElementById('regSemester').value;
    } else {
        payload.department = 'General'; // Placeholder
        payload.designation = 'Faculty';
    }

    try {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (response.ok && (data.success || !data.errors)) {
            document.getElementById('regSuccess').innerText = 'Registration successful! Please login.';
            setTimeout(() => {
                closeModal('registerModal');
                openModal('loginModal');
            }, 2000);
        } else {
            let errorMsg = data.message || 'Registration failed';
            if(data.errors) {
               errorMsg = Object.values(data.errors).join(', ');
            }
            document.getElementById('regError').innerText = errorMsg;
        }
    } catch (error) {
        document.getElementById('regError').innerText = 'An error occurred. Please try again.';
    } finally {
        btn.innerText = ogText;
        btn.disabled = false;
    }
});
