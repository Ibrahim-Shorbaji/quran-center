# HalqaHub — Full Project Status & Remaining Plan

---

## 🏗️ Tech Stack

### Backend
- Java 17
- Spring Boot 3.2
- Spring Security + JWT (jjwt 0.12.3)
- Spring Data JPA + Hibernate
- MySQL 8.0
- Lombok
- SpringDoc OpenAPI 2.8.6 (Swagger)
- Maven

### Frontend
- React 18 + Vite
- Ant Design 5
- React Router 6
- Axios
- Day.js
- Context API (auth store)

---

## 📁 Project Structure

```
quran-center/
├── quran-center-be/
│   └── src/main/java/com/qurancenter/quran_center/
│       ├── config/
│       │   └── SecurityConfig (WebSecurityConfig.java)
│       ├── controller/
│       │   ├── AuthController.java
│       │   ├── SheikhController.java
│       │   ├── HalqaController.java
│       │   ├── StudentController.java
│       │   ├── TasmeeReportController.java
│       │   ├── HomeworkController.java
│       │   ├── AttendanceController.java
│       │   └── DashboardController.java
│       ├── dto/
│       │   ├── request/
│       │   │   ├── LoginRequest.java
│       │   │   ├── CreateSheikhRequest.java
│       │   │   ├── UpdateSheikhRequest.java
│       │   │   ├── CreateHalqaRequest.java
│       │   │   ├── UpdateHalqaRequest.java
│       │   │   ├── CreateStudentRequest.java
│       │   │   ├── UpdateStudentRequest.java
│       │   │   ├── CreateTasmeeReportRequest.java
│       │   │   ├── CreateHomeworkRequest.java
│       │   │   └── RecordAttendanceRequest.java
│       │   └── response/
│       │       ├── JwtResponse.java
│       │       ├── SheikhResponse.java
│       │       ├── HalqaResponse.java
│       │       ├── StudentResponse.java
│       │       ├── TasmeeReportResponse.java
│       │       ├── HomeworkResponse.java
│       │       ├── AttendanceResponse.java
│       │       ├── AdminDashboardResponse.java
│       │       ├── SheikhDashboardResponse.java
│       │       └── StudentDashboardResponse.java
│       ├── entity/
│       │   ├── User.java
│       │   ├── Sheikh.java
│       │   ├── Halqa.java
│       │   ├── Student.java
│       │   ├── TasmeeReport.java
│       │   ├── Homework.java
│       │   └── Attendance.java
│       ├── enums/
│       │   ├── Role.java              (ADMIN, SHEIKH, STUDENT)
│       │   ├── EnrollmentStatus.java  (ACTIVE, INACTIVE, SUSPENDED)
│       │   ├── HomeworkStatus.java    (PENDING, REVIEWED)
│       │   └── AttendanceStatus.java  (PRESENT, ABSENT, EXCUSED, LATE)
│       ├── exception/
│       │   ├── GlobalExceptionHandler.java
│       │   ├── ResourceNotFoundException.java
│       │   └── BusinessException.java
│       ├── repository/
│       │   ├── UserRepository.java
│       │   ├── SheikhRepository.java
│       │   ├── HalqaRepository.java
│       │   ├── StudentRepository.java
│       │   ├── TasmeeReportRepository.java
│       │   ├── HomeworkRepository.java
│       │   └── AttendanceRepository.java
│       ├── security/
│       │   ├── jwt/
│       │   │   ├── JwtUtils.java
│       │   │   ├── AuthTokenFilter.java
│       │   │   └── AuthEntryPointJwt.java
│       │   └── service/
│       │       ├── UserDetailsServiceImpl.java
│       │       └── UserDetailsImpl.java
│       └── service/
│           ├── AuthService.java + AuthServiceImpl.java
│           ├── SheikhService.java + SheikhServiceImpl.java
│           ├── HalqaService.java + HalqaServiceImpl.java
│           ├── StudentService.java + StudentServiceImpl.java
│           ├── TasmeeReportService.java + TasmeeReportServiceImpl.java
│           ├── HomeworkService.java + HomeworkServiceImpl.java
│           ├── AttendanceService.java + AttendanceServiceImpl.java
│           └── DashboardService.java + DashboardServiceImpl.java
│
└── quran-center-fe/
    └── src/
        ├── api/
        │   ├── axiosInstance.js
        │   ├── authApi.js
        │   ├── sheikhApi.js
        │   ├── halqaApi.js
        │   ├── studentApi.js
        │   ├── tasmeeApi.js
        │   ├── homeworkApi.js
        │   ├── attendanceApi.js
        │   └── dashboardApi.js
        ├── components/
        │   └── layout/
        │       ├── AppLayout.jsx
        │       ├── ProtectedRoute.jsx
        │       └── RoleProtectedRoute.jsx
        ├── pages/
        │   ├── auth/
        │   │   └── LoginPage.jsx
        │   ├── dashboard/
        │   │   ├── DashboardPage.jsx
        │   │   ├── AdminDashboard.jsx
        │   │   ├── SheikhDashboard.jsx
        │   │   └── StudentDashboard.jsx
        │   ├── sheikhs/
        │   │   ├── SheikhsPage.jsx
        │   │   └── SheikhForm.jsx
        │   ├── halqas/
        │   │   ├── HalqasPage.jsx
        │   │   ├── HalqaForm.jsx
        │   │   └── HalqaDetailPage.jsx
        │   ├── students/
        │   │   ├── StudentsPage.jsx
        │   │   ├── StudentForm.jsx
        │   │   ├── StudentProfilePage.jsx
        │   │   └── tabs/
        │   │       ├── TasmeeTab.jsx
        │   │       ├── HomeworkTab.jsx
        │   │       └── AttendanceTab.jsx
        │   ├── attendance/
        │   │   └── AttendancePage.jsx
        │   └── portal/
        │       └── StudentPortalPage.jsx
        ├── store/
        │   └── authStore.jsx
        ├── App.jsx
        └── main.jsx
```

---

## 🔌 All API Endpoints (Built & Working)

### Auth
```
POST   /api/auth/login              → Login → returns JWT token
GET    /api/auth/me                 → Get current logged in user info
GET    /api/auth/my-profile         → Get current student's full profile
```

### Sheikhs
```
GET    /api/sheikhs                 → Get all sheikhs
GET    /api/sheikhs/{id}            → Get sheikh by ID
POST   /api/sheikhs                 → Create sheikh (creates User + Sheikh)
PUT    /api/sheikhs/{id}            → Update sheikh info
DELETE /api/sheikhs/{id}            → Delete sheikh
```

### Halqas
```
GET    /api/halqas                  → Get all halqas
GET    /api/halqas/{id}             → Get halqa by ID
POST   /api/halqas                  → Create halqa (name, schedule, maxStudents, sheikhId)
PUT    /api/halqas/{id}             → Update halqa
DELETE /api/halqas/{id}             → Delete halqa
```

### Students
```
GET    /api/students                → Get all students
GET    /api/students/{id}           → Get student by ID
GET    /api/students/halqa/{id}     → Get all students in a halqa
POST   /api/students                → Create student (creates User + Student)
PUT    /api/students/{id}           → Update student
DELETE /api/students/{id}           → Delete student
```

### Tasmee Reports
```
GET    /api/tasmee                  → Get all reports
GET    /api/tasmee/student/{id}     → Get reports for a student
GET    /api/tasmee/sheikh/{id}      → Get reports recorded by a sheikh
POST   /api/tasmee                  → Record new tasmee session
DELETE /api/tasmee/{id}             → Delete report
```

### Homework
```
GET    /api/homework/student/{id}   → Get homework for a student
POST   /api/homework                → Assign homework
PATCH  /api/homework/{id}/review    → Mark homework as reviewed
DELETE /api/homework/{id}           → Delete homework
```

### Attendance
```
POST   /api/attendance              → Record attendance for entire halqa session
GET    /api/attendance/student/{id} → Get attendance history for a student
```

### Dashboard
```
GET    /api/dashboard/admin         → Admin stats (totals, attendance rate, schedule)
GET    /api/dashboard/sheikh        → Sheikh stats (his students, halqas, pending homework, recent tasmee)
GET    /api/dashboard/student       → Student stats (halqa name, attendance rate, pending homework, last tasmee)
```

---

## 🗄️ Database Entities & Fields

### User
```
id, username, password, fullName, phone, email, role, active, createdAt, updatedAt
role: ADMIN | SHEIKH | STUDENT
```

### Sheikh
```
id, user (→ User), halqas (→ List<Halqa>), createdAt, updatedAt
```

### Halqa
```
id, name, schedule, maxStudents, sheikh (→ Sheikh), students (→ List<Student>), active, createdAt, updatedAt
```

### Student
```
id, user (→ User), age, dateOfBirth, address, guardianName, guardianPhone,
enrollmentStatus (ACTIVE|INACTIVE|SUSPENDED), halqa (→ Halqa), createdAt, updatedAt
```

### TasmeeReport
```
id, student (→ Student), sheikh (→ Sheikh), sessionDate,
fromSurah, fromAyah, toSurah, toAyah,
grade (0-10), mistakes (TEXT), sheikhNotes (TEXT), createdAt
```

### Homework
```
id, student (→ Student), sheikh (→ Sheikh),
fromSurah, fromAyah, toSurah, toAyah,
assignedDate, dueDate, instructions (TEXT),
status (PENDING|REVIEWED), createdAt
```

### Attendance
```
id, student (→ Student), sheikh (→ Sheikh), sessionDate,
status (PRESENT|ABSENT|EXCUSED|LATE), notes (TEXT), recordedAt
UNIQUE CONSTRAINT: (student_id, session_date)
```

---

## 🔐 Roles & Permissions

| Feature | ADMIN | SHEIKH | STUDENT |
|---|---|---|---|
| Manage Sheikhs (CRUD) | ✅ | ❌ | ❌ |
| Manage Halqas (CRUD) | ✅ | ❌ | ❌ |
| Manage Students (CRUD) | ✅ | ❌ | ❌ |
| View All Students | ✅ | ❌ | ❌ |
| View Halqa Detail | ✅ | ✅ (his only) | ❌ |
| View Student Profile | ✅ | ✅ (his only) | ❌ |
| Record Tasmee | ✅ | ✅ | ❌ |
| Assign Homework | ✅ | ✅ | ❌ |
| Take Attendance | ✅ | ✅ | ❌ |
| View Own Profile | ✅ | ✅ | ✅ |
| View Own Tasmee | ✅ | ✅ | ✅ |
| View Own Homework | ✅ | ✅ | ✅ |
| View Own Attendance | ✅ | ✅ | ✅ |
| Admin Dashboard | ✅ | ❌ | ❌ |
| Sheikh Dashboard | ❌ | ✅ | ❌ |
| Student Dashboard | ❌ | ❌ | ✅ |

---

## ✅ What's Done

### Release 1 — Foundation ✅
- Project setup (Spring Boot + MySQL + React + Vite)
- JWT Authentication (login, protected routes, token refresh)
- Sheikh CRUD (BE + FE)
- Halqa CRUD (BE + FE)
- Student CRUD (BE + FE)
- Assign student to halqa
- Global exception handler + validation errors

### Release 2 — Core Academic Features ✅
- Role-based sidebar (Admin/Sheikh/Student see different menus)
- Role-based route guards (RoleProtectedRoute)
- Halqa Detail Page (click halqa → see students)
- Student Profile Page with tabs:
  - Info tab
  - Tasmee tab (record + history)
  - Homework tab (assign + mark reviewed)
  - Attendance tab (history + rate %)
- Attendance Page (select halqa + date → mark all students)
- Student Portal (view-only: profile, tasmee, homework, attendance)

### Release 3 — Dashboard ✅ (partially)
- Admin Dashboard (total students/sheikhs/halqas, attendance rate, halqa schedule)
- Sheikh Dashboard (his students, halqas, attendance rate, pending homework, recent tasmee)
- Student Dashboard (halqa name, attendance rate, pending homework, last tasmee grade)

### UI Design
- Login page redesigned (split layout, dark left panel with Arabic ayah, clean right panel)

---

## ⬜ What's Remaining

### Release 3 — Remaining
```
⬜ Announcements
     BE: Announcement entity + CRUD API
         - POST   /api/announcements     → admin creates announcement
         - GET    /api/announcements      → everyone sees all
         - DELETE /api/announcements/{id} → admin deletes
         - PATCH  /api/announcements/{id}/pin → admin pins
     FE: Announcements page (list + create form for admin + pin button)
         - Show in sidebar for all roles
         - Pinned announcements shown at top

⬜ Student Progress Report
     BE: GET /api/students/{id}/report
         Returns: memorized juz, attendance %, avg tasmee grade, pending homework
     FE: Printable report inside Student Profile page
```

### Release 4 — Polish & Deploy
```
⬜ Quran Plan
     BE: QuranPlan entity (already created, needs service/controller)
         - GET    /api/students/{id}/plan   → get student's plan
         - POST   /api/students/{id}/plan   → create plan
         - PUT    /api/students/{id}/plan   → update plan
     Fields: currentSurah, currentAyah, memorizedJuz, memorizedPages,
             dailyTargetAyahs, planNotes
     FE: New tab in Student Profile → "Quran Plan"

⬜ Pagination
     BE: Add Pageable to all list endpoints
     FE: Update tables to use server-side pagination

⬜ Search & Filter
     BE: Add search by name, filter by halqa, filter by status
     FE: Search input + filter dropdowns on Students/Sheikhs pages

⬜ Change Password
     BE: POST /api/auth/change-password
     FE: Change password form in user settings/profile

⬜ Arabic Language Support (i18n)
     FE: Add i18n with react-i18next
         Support: Arabic + English toggle

⬜ Deploy Backend → Railway
     - Set up Railway project
     - Connect MySQL on Railway
     - Set environment variables
     - Deploy Spring Boot jar

⬜ Deploy Frontend → Vercel
     - Connect GitHub repo to Vercel
     - Set VITE_API_URL env variable
     - Deploy React app

⬜ Full UI Redesign
     - Redesign all pages to match login page aesthetic
       (dark/gold theme, clean typography, professional look)
     - Consistent color palette across all pages
     - Better mobile responsiveness
```

### Release 5 — Advanced (Future)
```
⬜ Monitor Role
     - New role: MONITOR
     - Can oversee multiple sheikhs
     - Can view reports across halqas

⬜ Notifications
     - Session reminders
     - Homework due date alerts
     - Attendance warnings

⬜ Export Reports to PDF
     - Student progress report as PDF
     - Attendance sheet as PDF

⬜ Quran Surah/Ayah Reference Data
     - Seed all 114 surahs into DB
     - Dropdown for surah selection instead of free text
     - Validate ayah numbers per surah

⬜ Mobile Responsive
     - Full mobile support for all pages
     - Collapsible sidebar on mobile

⬜ Student Self-Registration
     - Student can register with center ID
     - Admin approves registration
```

---

## 🐛 Known Issues / Technical Debt
- Sheikh role-based filtering is done on FE only (sidebar) — BE endpoints don't yet enforce that sheikh can only access his own students (@PreAuthorize not implemented yet)
- No pagination on any list endpoint yet — could be slow with large data
- Surah names are free text input — no validation against actual Quran surahs
- No refresh token mechanism — JWT expires after 24hrs and user must login again
- No input sanitization beyond basic @NotBlank/@NotNull validation

---

## 🔑 Important Notes for Development

### Package name
```
com.qurancenter.quran_center
```

### application.properties key configs
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/quran_center?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.jpa.hibernate.ddl-auto=update
app.jwtSecret=quranCenterSecretKeyThatIsLongEnoughForHS256AlgorithmAtLeast256Bits
app.jwtExpirationMs=86400000
```

### Frontend base URL
```javascript
baseURL: 'http://localhost:8080/api'
```

### Git Branching Strategy
```
main          ← clean releases only
development   ← working branch
feature/xxx   ← one branch per story
```

### How to create a new story
```bash
git checkout development
git checkout -b feature/STORY-NAME
# work...
git add .
git commit -m "feat: description"
git push origin feature/STORY-NAME
# PR → merge into development
# When release done → merge development into main
```

---

## 📊 Project Stats
- Total API Endpoints: 27
- Total Entities: 7
- Total FE Pages: 12
- Total FE Components: 15+
- Roles: 3 (ADMIN, SHEIKH, STUDENT)
- Started: March 2026
- Developer: Ibrahim Shorbaji

