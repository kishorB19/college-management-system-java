# 🎓 EduTrack - College Management System (Java Spring Boot)

A full-stack College Management System built with **Java 17**, **Spring Boot 3.2.5**, **Spring Security 6 (JWT)**, **Spring Data JPA**, and a modern glassmorphic web dashboard for Students, Teachers, and Administrators.

---

## 🚀 Live Deployment on Render

This project is configured and ready for 1-click or manual deployment on [Render](https://render.com).

### Option A: Deploy via Render Blueprint (Recommended)
1. Go to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** > **Blueprint**.
3. Select the repository: `kishorB19/college-management-system-java`.
4. Render will read [`render.yaml`](render.yaml) automatically and set up the Web Service.
5. Click **Apply**.

---

### Option B: Deploy as a Web Service
1. In the [Render Dashboard](https://dashboard.render.com/), click **New +** > **Web Service**.
2. Connect your GitHub repository: `kishorB19/college-management-system-java`.
3. Configure settings:
   - **Name**: `college-management-system-java` (or your chosen name)
   - **Region**: Singapore / Oregon / Frankfurt (choose closest)
   - **Branch**: `main`
   - **Runtime**: **Docker** (Render will automatically detect the multi-stage `Dockerfile`)
   - **Instance Type**: **Free**
4. Under **Environment Variables**, add:
   - `PORT`: `8080` (Render binds this port automatically)
   - `SPRING_PROFILES_ACTIVE`: `dev` (uses H2 in-memory DB out of the box with zero database configuration needed)
5. Click **Create Web Service**.

---

## 🗄️ Database Options on Render

### 1. In-Memory H2 (Default & Zero Setup)
- Works immediately upon deploy without setting up any external database.
- Perfect for quick demonstrations and testing.

### 2. Render Managed PostgreSQL
1. On Render, click **New +** > **PostgreSQL**.
2. Give it a name (e.g., `cms-db`).
3. Copy the **Internal Database URL** or connection credentials.
4. In your Web Service **Environment Variables**, add:
   - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://<host>:5432/<dbname>`
   - `SPRING_DATASOURCE_USERNAME`: `<db_user>`
   - `SPRING_DATASOURCE_PASSWORD`: `<db_password>`
   - `SPRING_PROFILES_ACTIVE`: `prod`

---

## 🛠️ Tech Stack & Architecture

- **Backend Framework**: Spring Boot 3.2.5
- **Language**: Java 17
- **Authentication**: Stateless JWT (HS512) with Spring Security 6
- **Persistence**: Spring Data JPA / Hibernate (H2, MySQL, PostgreSQL supported)
- **Frontend**: HTML5, Vanilla JavaScript, Modern Glassmorphism CSS
- **Containerization**: Multi-stage Dockerfile (Maven 3.9 + Alpine Temurin JRE)

---

## 🌐 Endpoints Overview

| Route | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/` or `/index.html` | GET | Public | Landing Page with Login & Registration Modals |
| `/student-dashboard.html` | GET | Public (Client Auth) | Student Portal Dashboard |
| `/teacher-dashboard.html` | GET | Public (Client Auth) | Teacher Portal Dashboard |
| `/api/auth/register` | POST | Public | User Registration (Student / Teacher) |
| `/api/auth/login` | POST | Public | User Login (Returns JWT Bearer Token) |
| `/api/student/dashboard/{id}` | GET | Student | Student Statistics & Metrics |
| `/api/student/attendance` | GET | Student | Attendance Records |
| `/api/student/exam-results` | GET | Student | Examination Results |
| `/api/student/fees` | GET | Student | Fee Payment Status |
| `/api/student/assignments` | GET | Student | Homework & Assignments |
| `/api/teacher/dashboard/{id}` | GET | Teacher | Teacher Overview |
| `/api/teacher/attendance` | POST | Teacher | Mark Student Attendance |
| `/api/teacher/assignments` | POST | Teacher | Post New Assignment |
