# 🎓 EduCore - Next-Gen College Management System

EduCore is a full-stack College Management System featuring a modern reactive web dashboard, enterprise-grade Java backend, and role-based access control for Students, Teachers, and Administrators.

---

## 🌟 Key Features

### 👨‍🎓 Student Portal
- **Real-Time Attendance**: Interactive subject-wise attendance tracking with status summaries and visual percentages.
- **Academic Results**: Semester examination results with grade breakdowns, CGPA calculation, and remarks.
- **Assignments**: View active assignments, track deadlines, submit coursework, and view grades/feedback.
- **Fee Management**: Review tuition and laboratory fees, transaction records, and simulate real-time payments.
- **Leave Applications**: Submit leave requests with reason and date range, with real-time status updates.

### 👩‍🏫 Teacher Portal
- **Classroom Roster**: View students segmented by department and academic semester.
- **Daily Attendance Marking**: Quick one-click attendance recording with automated date logging.
- **Assessment Management**: Post assignments with deadlines, review student submissions, and assign grades with feedback.
- **Result Publishing**: Upload semester examination marks and performance metrics.
- **Leave Review**: Review pending student leave applications with approval/rejection workflows.

### 🛡️ Administration & Security
- **Role-Based Access Control (RBAC)**: Fine-grained security for Students, Teachers, and Admins.
- **JWT Authentication**: Secure stateless token authentication with automated session refresh.
- **Data Initialization**: Comprehensive mock university dataset automatically seeded for demonstration.

---

## 🛠️ Architecture & Tech Stack

- **Backend**: Java 17, Spring Boot 3.2.5
- **Security**: Spring Security 6 with Stateless JWT (HS512)
- **Database**: PostgreSQL (Production) / H2 (Development & Testing)
- **ORM / Persistence**: Spring Data JPA & Hibernate
- **Frontend**: Modern SPA Architecture with Vite, Glassmorphic UI & Lucide Icons
- **Deployment**: Vercel (Frontend Web Portal) & Spring Boot Cloud Deployment

---

## 🚀 Getting Started

### Prerequisites
- **Java**: JDK 17 or higher
- **Node.js**: v18 or higher & npm
- **Maven**: 3.9+ (or use included Maven)

### Running the Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend portal will start at `http://localhost:5173`.

### Running the Backend
```bash
mvn spring-boot:run
```
The REST API will start at `http://localhost:8080`.

---

## 🔑 Demo Credentials

| Role | Username | Password |
| :--- | :--- | :--- |
| **Student** | `student1` | `student123` |
| **Teacher** | `teacher1` | `teacher123` |
| **Admin** | `admin` | `admin123` |

---

## 🌐 API Overview

| Route | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/login` | POST | Public | Authenticate user and receive JWT bearer token |
| `/api/auth/register` | POST | Public | Register new user account |
| `/api/auth/me` | GET | Authenticated | Retrieve current session user profile |
| `/api/student/dashboard/{id}` | GET | Student | Student statistics, metrics, and summary |
| `/api/student/{id}/attendance` | GET | Student | Student attendance history and percentage |
| `/api/student/{id}/results` | GET | Student | Examination results and GPA |
| `/api/student/{id}/fees` | GET | Student | Fee structure and payment status |
| `/api/teacher/dashboard/{id}` | GET | Teacher | Teacher overview and pending reviews |
| `/api/teacher/students` | GET | Teacher | Filter students by department and semester |
| `/api/teacher/attendance/mark` | POST | Teacher | Record student attendance |
| `/api/teacher/assignments/create` | POST | Teacher | Create new assignment |

---

## 📄 License

This project is licensed under the MIT License.
