import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthPage from './components/auth/AuthPage';
import StudentDashboard from './components/student/StudentDashboard';
import TeacherDashboard from './components/teacher/TeacherDashboard';

function AppContent() {
  const { isAuthenticated, isStudent } = useAuth();

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        {!isAuthenticated ? (
          <AuthPage />
        ) : isStudent ? (
          <StudentDashboard />
        ) : (
          <TeacherDashboard />
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-left">
            <span>&copy; {new Date().getFullYear()} EduCore College Management System</span>
          </div>
          <div className="footer-right">
            <span>Native Architecture: <strong>React 19</strong> + <strong>Spring Boot 3</strong> + <strong>PostgreSQL 18</strong></span>
          </div>
        </div>
      </footer>

      <style>{`
        .app-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .main-content {
          flex: 1;
        }
        .app-footer {
          margin-top: auto;
          background: rgba(10, 13, 20, 0.95);
          border-top: 1px solid var(--border-subtle);
          padding: 16px 24px;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .footer-content {
          max-width: 1300px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }
        .footer-right strong {
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
