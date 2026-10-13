import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, 
  Database, 
  Cpu, 
  Server, 
  Users, 
  Layers, 
  CheckCircle2, 
  Activity, 
  Lock,
  ArrowRight
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="admin-portal-wrapper">
      <div className="portal-banner glass-panel">
        <div className="banner-text">
          <div className="admin-badge">
            <ShieldCheck size={14} /> System Administrator
          </div>
          <h1>Platform Operations Console</h1>
          <p className="admin-info-line">
            Signed in as <strong>{user?.fullName || 'System Administrator'}</strong> ({user?.email || 'admin@cms.edu'})
          </p>
        </div>
        <div className="db-health-pill">
          <span className="pulse-dot"></span>
          PostgreSQL 18: Healthy
        </div>
      </div>

      <div className="system-grid">
        <div className="glass-panel sys-card">
          <div className="sys-icon db">
            <Database size={24} />
          </div>
          <h3>PostgreSQL Database</h3>
          <p className="sys-desc">Native PostgreSQL 18 Service</p>
          <div className="sys-meta">
            <span>Database: <strong>collegedb</strong></span>
            <span>Port: <strong>5432</strong></span>
            <span>Status: <strong className="green">ONLINE</strong></span>
          </div>
        </div>

        <div className="glass-panel sys-card">
          <div className="sys-icon backend">
            <Cpu size={24} />
          </div>
          <h3>Spring Boot 3 Backend</h3>
          <p className="sys-desc">REST API Engine &amp; Security Layer</p>
          <div className="sys-meta">
            <span>Version: <strong>3.2.5 (Java 17/22)</strong></span>
            <span>Port: <strong>8080</strong></span>
            <span>Auth: <strong>JJWT 0.12.5 HS512</strong></span>
          </div>
        </div>

        <div className="glass-panel sys-card">
          <div className="sys-icon frontend">
            <Layers size={24} />
          </div>
          <h3>React 19 Frontend</h3>
          <p className="sys-desc">Vite Single Page Application</p>
          <div className="sys-meta">
            <span>Framework: <strong>React 19</strong></span>
            <span>State: <strong>AuthContext + REST</strong></span>
            <span>Aesthetics: <strong>Dark Glassmorphism</strong></span>
          </div>
        </div>
      </div>

      <div className="glass-panel ops-section">
        <h2>Institutional Database Entities</h2>
        <p className="ops-desc">All models mapped with Hibernate 6 to PostgreSQL tables</p>

        <div className="tables-badges-grid">
          <div className="table-badge">
            <CheckCircle2 size={16} className="green" /> users (id, username, password, role)
          </div>
          <div className="table-badge">
            <CheckCircle2 size={16} className="green" /> students (roll_number, dept, sem, guardian)
          </div>
          <div className="table-badge">
            <CheckCircle2 size={16} className="green" /> teachers (employee_id, designation, exp)
          </div>
          <div className="table-badge">
            <CheckCircle2 size={16} className="green" /> assignments (title, subject, due_date)
          </div>
          <div className="table-badge">
            <CheckCircle2 size={16} className="green" /> assignment_submissions (content, marks)
          </div>
          <div className="table-badge">
            <CheckCircle2 size={16} className="green" /> attendance (date, subject, status)
          </div>
          <div className="table-badge">
            <CheckCircle2 size={16} className="green" /> exam_results (subject, exam_type, score)
          </div>
          <div className="table-badge">
            <CheckCircle2 size={16} className="green" /> fee_records (fee_type, amount, balance)
          </div>
          <div className="table-badge">
            <CheckCircle2 size={16} className="green" /> leave_requests (reason, start, end, status)
          </div>
        </div>
      </div>

      <style>{`
        .admin-portal-wrapper {
          max-width: 1300px;
          margin: 0 auto;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          text-align: left;
        }
        .portal-banner {
          padding: 28px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, rgba(20, 27, 45, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%);
        }
        .admin-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #f87171;
          margin-bottom: 6px;
        }
        .portal-banner h1 {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.02em;
          margin-bottom: 6px;
        }
        .admin-info-line {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        .db-health-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--status-success);
          background: var(--status-success-bg);
          padding: 8px 18px;
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
        .system-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 900px) {
          .system-grid { grid-template-columns: 1fr; }
        }
        .sys-card {
          padding: 24px;
        }
        .sys-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }
        .sys-icon.db { background: rgba(56, 189, 248, 0.15); color: #38bdf8; }
        .sys-icon.backend { background: rgba(16, 185, 129, 0.15); color: #34d399; }
        .sys-icon.frontend { background: rgba(167, 139, 250, 0.15); color: #c084fc; }
        .sys-card h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 4px;
        }
        .sys-desc {
          font-size: 0.825rem;
          color: var(--text-muted);
          margin-bottom: 16px;
        }
        .sys-meta {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.825rem;
          color: var(--text-secondary);
          border-top: 1px solid var(--border-subtle);
          padding-top: 12px;
        }
        .green {
          color: var(--status-success);
        }
        .ops-section {
          padding: 28px;
        }
        .ops-section h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .ops-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin: 4px 0 20px;
        }
        .tables-badges-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        @media (max-width: 900px) {
          .tables-badges-grid { grid-template-columns: 1fr; }
        }
        .table-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          background: rgba(15, 21, 35, 0.6);
          border: 1px solid var(--border-subtle);
          border-radius: 10px;
          font-size: 0.825rem;
          font-family: var(--font-mono);
          color: var(--text-main);
        }
      `}</style>
    </div>
  );
}
