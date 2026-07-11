# 📖 HalqaHub — Circle Management System

<div align="center">

![HalqaHub](https://img.shields.io/badge/HalqaHub-Circle%20Management%20System-d4af37?style=for-the-badge)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens)

> خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ
>
> *"The best of you are those who learn the Qur'an and teach it."*
> — Sahih Al-Bukhari, 5027

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Roles & Permissions](#roles--permissions)
- [Releases](#releases)

---

## 🕌 About

**HalqaHub** is a full-stack web application for managing Quran memorization centers. It streamlines the management of students, sheikhs, halqas (study circles), attendance, homework, and tasmee (recitation) sessions.

Built as a learning project to master **Spring Boot** and **React** while solving a real-world problem.

---

## ✨ Features

### 👑 Admin
- Manage Sheikhs, Halqas, and Students (full CRUD)
- Assign students to halqas
- View center-wide dashboard (totals, attendance rate, schedule)
- Record and view tasmee reports for any student
- Assign and track homework
- Take attendance for any halqa

### 🧑‍🏫 Sheikh
- View and manage his own halqas and students
- Record tasmee sessions for his students
- Assign homework to students
- Take attendance for his halqa sessions
- View his personal teaching dashboard

### 👤 Student
- View personal profile and enrollment info
- View tasmee history and grades
- View pending and completed homework
- View attendance history and rate

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Java | 17 | Programming language |
| Spring Boot | 3.2 | Backend framework |
| Spring Security | 6 | Authentication & authorization |
| JWT (jjwt) | 0.12.3 | Token-based auth |
| Spring Data JPA | 3.2 | Database ORM |
| MySQL | 8.0 | Relational database |
| Lombok | Latest | Boilerplate reduction |
| SpringDoc OpenAPI | 2.8.6 | API documentation (Swagger) |
| Maven | 3.x | Build tool |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| Vite | 5 | Build tool & dev server |
| Ant Design | 5 | UI component library |
| React Router | 6 | Client-side routing |
| Axios | Latest | HTTP client |
| Day.js | Latest | Date handling |

---

## 📁 Project Structure

```
quran-center/
├── quran-center-be/                    ← Spring Boot Backend
│   └── src/main/java/com/qurancenter/
│       ├── config/                     ← Security config, CORS
│       ├── controller/                 ← REST API controllers
│       ├── dto/
│       │   ├── request/                ← Request bodies
│       │   └── response/               ← Response bodies
│       ├── entity/                     ← JPA entities
│       ├── enums/                      ← Enums (Role, Status, etc.)
│       ├── exception/                  ← Global exception handler
│       ├── repository/                 ← Spring Data JPA repos
│       ├── security/
│       │   ├── jwt/                    ← JWT utils & filter
│       │   └── service/                ← UserDetailsService
│       └── service/                    ← Business logic
│           └── impl/
│
└── quran-center-fe/                    ← React Frontend
    └── src/
        ├── api/                        ← Axios API calls
        ├── components/
        │   └── layout/                 ← AppLayout, ProtectedRoute
        ├── pages/
        │   ├── auth/                   ← LoginPage
        │   ├── dashboard/              ← Admin, Sheikh, Student dashboards
        │   ├── sheikhs/                ← Sheikhs CRUD
        │   ├── halqas/                 ← Halqas CRUD + detail
        │   ├── students/               ← Students CRUD + profile
        │   │   └── tabs/               ← Tasmee, Homework, Attendance tabs
        │   ├── attendance/             ← Attendance page
        │   └── portal/                 ← Student portal
        └── store/                      ← Auth context (global state)
```

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.x

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/Ibrahim-Shorbaji/quran-center.git
cd quran-center/quran-center-be

# 2. Create MySQL database
mysql -u root -p
CREATE DATABASE quran_center;
exit;

# 3. Configure application.properties
# Edit: src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/quran_center
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

# 4. Run the application
mvn spring-boot:run
```

Backend runs at: `http://localhost:8080`
Swagger UI: `http://localhost:8080/swagger-ui.html`

### Frontend Setup

```bash
# 1. Go to frontend folder
cd quran-center/quran-center-fe

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

### Default Admin Account

```sql
-- Insert admin user (password: 123456)
INSERT INTO users (username, password, full_name, role, active, created_at, updated_at)
VALUES (
    'admin',
    '$2a$10$YOUR_BCRYPT_HASH',
    'Admin User',
    'ADMIN',
    true,
    NOW(),
    NOW()
);
```

> 💡 Use `GET /api/auth/hash` temporarily to generate a BCrypt hash, then remove the endpoint.

---

## 🔌 API Endpoints

### Auth
```
POST   /api/auth/login           → Login and get JWT token
GET    /api/auth/me              → Get current logged in user
GET    /api/auth/my-profile      → Get current student's profile
```

### Sheikhs
```
GET    /api/sheikhs              → Get all sheikhs
GET    /api/sheikhs/{id}         → Get sheikh by ID
POST   /api/sheikhs              → Create sheikh (ADMIN)
PUT    /api/sheikhs/{id}         → Update sheikh (ADMIN)
DELETE /api/sheikhs/{id}         → Delete sheikh (ADMIN)
```

### Halqas
```
GET    /api/halqas               → Get all halqas
GET    /api/halqas/{id}          → Get halqa by ID
POST   /api/halqas               → Create halqa (ADMIN)
PUT    /api/halqas/{id}          → Update halqa (ADMIN)
DELETE /api/halqas/{id}          → Delete halqa (ADMIN)
```

### Students
```
GET    /api/students             → Get all students
GET    /api/students/{id}        → Get student by ID
GET    /api/students/halqa/{id}  → Get students by halqa
POST   /api/students             → Create student (ADMIN)
PUT    /api/students/{id}        → Update student (ADMIN)
DELETE /api/students/{id}        → Delete student (ADMIN)
```

### Tasmee Reports
```
GET    /api/tasmee               → Get all reports
GET    /api/tasmee/student/{id}  → Get reports by student
GET    /api/tasmee/sheikh/{id}   → Get reports by sheikh
POST   /api/tasmee               → Record session
DELETE /api/tasmee/{id}          → Delete report
```

### Homework
```
GET    /api/homework/student/{id}  → Get homework by student
POST   /api/homework               → Assign homework
PATCH  /api/homework/{id}/review   → Mark as reviewed
DELETE /api/homework/{id}          → Delete homework
```

### Attendance
```
POST   /api/attendance             → Record attendance for halqa
GET    /api/attendance/student/{id} → Get student attendance
```

### Dashboard
```
GET    /api/dashboard/admin        → Admin dashboard stats
GET    /api/dashboard/sheikh       → Sheikh dashboard stats
GET    /api/dashboard/student      → Student dashboard stats
```

---

## 🔐 Roles & Permissions

| Feature | ADMIN | SHEIKH | STUDENT |
|---|---|---|---|
| Manage Sheikhs | ✅ | ❌ | ❌ |
| Manage Halqas | ✅ | ❌ | ❌ |
| Manage Students | ✅ | ❌ | ❌ |
| View All Students | ✅ | ❌ | ❌ |
| View Own Halqa Students | ✅ | ✅ | ❌ |
| Record Tasmee | ✅ | ✅ | ❌ |
| Assign Homework | ✅ | ✅ | ❌ |
| Take Attendance | ✅ | ✅ | ❌ |
| View Own Profile | ✅ | ✅ | ✅ |
| View Own Tasmee | ✅ | ✅ | ✅ |
| View Own Homework | ✅ | ✅ | ✅ |
| View Own Attendance | ✅ | ✅ | ✅ |

---

## 📦 Releases

### ✅ Release 1 — Foundation
Project setup, JWT auth, Sheikh/Halqa/Student CRUD, global error handling.

### ✅ Release 2 — Core Academic Features
Role-based access, Halqa detail page, Student profile with Tasmee/Homework/Attendance tabs, Student portal.

### ✅ Release 3 — Dashboard (In Progress)
Role-based dashboards, announcements.

### ⬜ Release 4 — Polish & Deploy
Quran plan, pagination, search/filter, Arabic i18n, deploy to Railway + Vercel, UI redesign.

### ⬜ Release 5 — Advanced
Monitor role, notifications, PDF reports, mobile responsive.

---

## 👨‍💻 Developer

Built by **Ibrahim Shorbaji** as a full-stack learning project.

- Backend: Spring Boot (learning deeply)
- Frontend: React (learning from scratch)
- Started: March 2026

---

<div align="center">
Made with ❤️ for the Quran community
</div>
