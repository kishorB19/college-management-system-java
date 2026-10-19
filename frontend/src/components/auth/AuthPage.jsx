import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  GraduationCap, 
  Lock, 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  Briefcase, 
  Building, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AuthPage() {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  
  // Login form state
  const [loginForm, setLoginForm] = useState({ usernameOrEmail: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Register form state
  const [regForm, setRegForm] = useState({
    role: 'STUDENT',
    fullName: '',
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    department: 'Computer Science',
    semester: 'Semester 4',
    rollNumber: '',
    section: 'A',
    designation: 'Assistant Professor',
    qualification: 'M.Tech / Ph.D',
    specialization: 'Cloud Computing',
    experienceYears: 5,
  });
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  // Quick Login helper
  const handleQuickLogin = async (username, password) => {
    setLoginError('');
    setLoginLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      await login(loginForm.usernameOrEmail, loginForm.password);
    } catch (err) {
      setLoginError(err.message || 'Invalid credentials');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');
    setRegLoading(true);
    try {
      const payload = {
        role: regForm.role,
        fullName: regForm.fullName,
        username: regForm.username,
        email: regForm.email,
        password: regForm.password,
        phoneNumber: regForm.phoneNumber,
        department: regForm.department,
      };

      if (regForm.role === 'STUDENT') {
        payload.semester = regForm.semester;
        payload.rollNumber = regForm.rollNumber || `CS-${Math.floor(1000 + Math.random() * 9000)}`;
        payload.section = regForm.section;
      } else {
        payload.designation = regForm.designation;
        payload.qualification = regForm.qualification;
        payload.specialization = regForm.specialization;
        payload.experienceYears = Number(regForm.experienceYears);
      }

      const res = await register(payload);
      setRegSuccess(res.message || 'Registration successful! You can now log in.');
      setTimeout(() => {
        setActiveTab('login');
        setLoginForm({ usernameOrEmail: regForm.username, password: regForm.password });
      }, 1500);
    } catch (err) {
      setRegError(err.message || 'Registration failed');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-glow-circle left"></div>
      <div className="auth-glow-circle right"></div>

      <div className="auth-card glass-panel">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo-badge">
            <GraduationCap size={32} />
          </div>
          <h1>College Management Portal</h1>
          <p className="auth-tagline">
            Powered by Spring Boot 3 REST APIs &amp; Native PostgreSQL
          </p>

          {/* Quick Login Showcase */}
          <div className="demo-accounts-box">
            <div className="demo-title">
              <Sparkles size={14} /> Quick Demo Access (1-Click Login):
            </div>
            <div className="demo-buttons">
              <button 
                type="button" 
                onClick={() => handleQuickLogin('student', 'password123')}
                disabled={loginLoading}
                className="demo-btn demo-student"
              >
                <GraduationCap size={14} />
                <span>Student: Kishor Birajdar</span>
              </button>
              <button 
                type="button" 
                onClick={() => handleQuickLogin('teacher', 'password123')}
                disabled={loginLoading}
                className="demo-btn demo-teacher"
              >
                <BookOpen size={14} />
                <span>Faculty: Dr. Rajesh Sharma</span>
              </button>
              <button 
                type="button" 
                onClick={() => handleQuickLogin('teacher2', 'password123')}
                disabled={loginLoading}
                className="demo-btn demo-teacher"
              >
                <BookOpen size={14} />
                <span>Faculty: Prof. Sunita Deshmukh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button 
            type="button" 
            className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Sign In
          </button>
          <button 
            type="button" 
            className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="auth-form">
            {loginError && (
              <div className="alert-box alert-error">
                <AlertCircle size={16} />
                <span>{loginError}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                <User size={14} /> Username or Email
              </label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. teacher or student@cms.edu"
                value={loginForm.usernameOrEmail}
                onChange={(e) => setLoginForm({ ...loginForm, usernameOrEmail: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Lock size={14} /> Password
              </label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="Enter password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={loginLoading}
            >
              {loginLoading ? 'Authenticating...' : 'Sign In to Portal'}
              <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            {regError && (
              <div className="alert-box alert-error">
                <AlertCircle size={16} />
                <span>{regError}</span>
              </div>
            )}
            {regSuccess && (
              <div className="alert-box alert-success">
                <CheckCircle2 size={16} />
                <span>{regSuccess}</span>
              </div>
            )}

            {/* Role Selection */}
            <div className="form-group">
              <label className="form-label">Select Your Role</label>
              <div className="role-selector">
                <label className={`role-pill ${regForm.role === 'STUDENT' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="STUDENT"
                    checked={regForm.role === 'STUDENT'}
                    onChange={() => setRegForm({ ...regForm, role: 'STUDENT' })}
                  />
                  <GraduationCap size={16} /> Student
                </label>
                <label className={`role-pill ${regForm.role === 'TEACHER' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="TEACHER"
                    checked={regForm.role === 'TEACHER'}
                    onChange={() => setRegForm({ ...regForm, role: 'TEACHER' })}
                  />
                  <BookOpen size={16} /> Faculty / Teacher
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Kishor Birajdar"
                  value={regForm.fullName}
                  onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. kishor_b"
                  value={regForm.username}
                  onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="name@cms.edu"
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="form-input"
                  placeholder="Min 6 characters"
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Department</label>
                <select
                  className="form-select"
                  value={regForm.department}
                  onChange={(e) => setRegForm({ ...regForm, department: e.target.value })}
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                </select>
              </div>

              {regForm.role === 'STUDENT' ? (
                <div className="form-group">
                  <label className="form-label">Semester</label>
                  <select
                    className="form-select"
                    value={regForm.semester}
                    onChange={(e) => setRegForm({ ...regForm, semester: e.target.value })}
                  >
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Semester 3">Semester 3</option>
                    <option value="Semester 4">Semester 4</option>
                    <option value="Semester 5">Semester 5</option>
                    <option value="Semester 6">Semester 6</option>
                  </select>
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Designation</label>
                  <input
                    type="text"
                    className="form-input"
                    value={regForm.designation}
                    onChange={(e) => setRegForm({ ...regForm, designation: e.target.value })}
                  />
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={regLoading}
            >
              {regLoading ? 'Registering...' : 'Register Account'}
              <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>

      <style>{`
        .auth-container {
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px 16px;
          position: relative;
        }
        .auth-glow-circle {
          position: absolute;
          width: 450px;
          height: 450px;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          opacity: 0.15;
        }
        .auth-glow-circle.left {
          background: #6366f1;
          top: 10%;
          left: 15%;
        }
        .auth-glow-circle.right {
          background: #06b6d4;
          bottom: 10%;
          right: 15%;
        }
        .auth-card {
          width: 100%;
          max-width: 520px;
          padding: 36px 32px;
          position: relative;
          z-index: 10;
        }
        .auth-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .auth-logo-badge {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          background: var(--accent-gradient);
          color: white;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          box-shadow: var(--shadow-glow);
        }
        .auth-header h1 {
          font-size: 1.6rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--text-main);
          margin-bottom: 6px;
        }
        .auth-tagline {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .demo-accounts-box {
          margin-top: 18px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 12px;
          text-align: left;
        }
        .demo-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--accent-secondary);
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .demo-buttons {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        .demo-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 6px;
          border-radius: 8px;
          border: 1px solid var(--border-subtle);
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-main);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .demo-btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }
        .demo-teacher:hover {
          border-color: #38bdf8;
          background: rgba(56, 189, 248, 0.15);
        }
        .demo-student:hover {
          border-color: #a78bfa;
          background: rgba(167, 139, 250, 0.15);
        }
        .demo-admin:hover {
          border-color: #f87171;
          background: rgba(248, 113, 113, 0.15);
        }
        .auth-tabs {
          display: flex;
          background: rgba(15, 21, 35, 0.7);
          padding: 4px;
          border-radius: 12px;
          border: 1px solid var(--border-subtle);
          margin-bottom: 22px;
        }
        .auth-tab-btn {
          flex: 1;
          padding: 10px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.875rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .auth-tab-btn.active {
          background: var(--bg-surface);
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        .auth-form {
          text-align: left;
        }
        .btn-block {
          width: 100%;
          margin-top: 10px;
          padding: 12px;
        }
        .role-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .role-pill {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          background: rgba(15, 21, 35, 0.7);
          border: 1px solid var(--border-subtle);
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }
        .role-pill input {
          display: none;
        }
        .role-pill.active {
          background: rgba(99, 102, 241, 0.2);
          border-color: var(--accent-primary);
          color: #ffffff;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .alert-box {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 0.825rem;
          margin-bottom: 16px;
        }
        .alert-error {
          background: var(--status-danger-bg);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }
        .alert-success {
          background: var(--status-success-bg);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #6ee7b7;
        }
      `}</style>
    </div>
  );
}
