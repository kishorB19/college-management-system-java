import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  LogOut, 
  User, 
  ShieldCheck, 
  BookOpen, 
  Database,
  Cpu
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, isTeacher, isStudent } = useAuth();

  const getRoleBadge = () => {
    if (isTeacher) {
      return (
        <span className="badge badge-info">
          <BookOpen size={12} /> Faculty
        </span>
      );
    }
    if (isStudent) {
      return (
        <span className="badge badge-primary">
          <GraduationCap size={12} /> Student
        </span>
      );
    }
    return null;
  };

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="navbar-brand">
          <div className="brand-logo-glow">
            <GraduationCap size={24} className="brand-icon" />
          </div>
          <div>
            <div className="brand-title">
              EduCore <span className="brand-subtitle">CMS</span>
            </div>
            <div className="tech-badge">
              <Cpu size={10} /> Spring Boot 3 &bull; <Database size={10} /> PostgreSQL
            </div>
          </div>
        </div>

        {/* User Info / Actions */}
        <div className="navbar-actions">
          {isAuthenticated && user ? (
            <div className="user-profile-bar">
              <div className="user-avatar-badge">
                <User size={16} />
              </div>
              <div className="user-meta">
                <span className="user-name">{user.fullName || user.username}</span>
                <div className="user-submeta">
                  {getRoleBadge()}
                  {user.department && (
                    <span className="dept-tag">{user.department}</span>
                  )}
                </div>
              </div>
              <button 
                onClick={logout} 
                className="btn btn-secondary btn-sm logout-btn"
                title="Sign out"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="db-connected-pill">
              <span className="pulse-dot"></span>
              PostgreSQL Connected
            </div>
          )}
        </div>
      </div>

      <style>{`
        .navbar-container {
          background: rgba(10, 13, 20, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-subtle);
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 12px 24px;
        }
        .navbar-inner {
          max-width: 1300px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .brand-logo-glow {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: var(--accent-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-glow);
          color: white;
        }
        .brand-title {
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--text-main);
        }
        .brand-subtitle {
          color: var(--accent-secondary);
          font-weight: 600;
        }
        .tech-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.7rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .user-profile-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.04);
          padding: 6px 14px 6px 10px;
          border-radius: 12px;
          border: 1px solid var(--border-subtle);
        }
        .user-avatar-badge {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: rgba(99, 102, 241, 0.2);
          color: #a5b4fc;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .user-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-align: left;
        }
        .user-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.2;
        }
        .user-submeta {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .dept-tag {
          font-size: 0.7rem;
          color: var(--text-muted);
        }
        .logout-btn {
          margin-left: 6px;
        }
        .db-connected-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.775rem;
          font-weight: 600;
          color: var(--status-success);
          background: var(--status-success-bg);
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid rgba(16, 185, 129, 0.25);
        }
        .pulse-dot {
          width: 8px;
          height: 8px;
          background: var(--status-success);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--status-success);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
      `}</style>
    </header>
  );
}
