# RecisCam
A web-based piket attendance application developed as a Senior High School Informatics project. RecisCam uses camera photo capture to let students submit proof of piket (cleaning duty) attendance, while teachers review, approve, or reject submissions from a single dashboard.

> **Portfolio Version:** This repository contains a frontend-only demonstration that runs entirely in the browser using LocalStorage. The original project was built with Supabase for authentication, database, and photo storage.

---

## Overview
Piket attendance at my school was tracked manually — students reported their duty completion verbally or through messaging groups, and teachers had no centralized way to verify who had actually completed their piket schedule or follow up on missed days.

RecisCam was designed to solve this by letting students take or upload a photo as proof of attendance directly from their device, while teachers review submissions, approve or reject them with a note, and export the results. Students can track their own schedule, history, and warning count from a single dashboard.

For portfolio purposes, the original Supabase backend has been replaced with a LocalStorage-powered demo that preserves the original application workflow without requiring any external services.

---

## Features
- Demo login with two roles
  - Student
  - Teacher
- One-tap demo account switching
- Camera-based (or file-based) attendance photo submission
- Piket schedule and attendance history per student
- Automatic warning count for missed or rejected reports
- Teacher review dashboard with approve/reject and notes
- Filter reports by piket day
- Export attendance reports to Excel
- In-app notifications for approval/rejection
- Persistent demo database using LocalStorage
- Resettable demo environment

---

## Demo Roles
| Role | Capabilities |
|------|--------------|
| **Student** | Submit piket photo proof, view schedule, history, and warnings |
| **Teacher** | Review, approve/reject reports, filter by day, export to Excel |

---

## Tech Stack
### Frontend
- HTML5
- CSS3
- Vanilla JavaScript

### Demo Data Layer
- Browser LocalStorage
- Custom JavaScript data abstraction (`DemoStore`)

### Original Backend (Archived)
- Supabase Authentication
- PostgreSQL
- Supabase Storage (attendance photos)

---

## Demo Architecture
```text
Browser
│
├── LocalStorage
│   ├── profiles
│   ├── attendance
│   └── notifications
│
└── RecisCam
    ├── Student
    └── Teacher
```

---

## Original Architecture
```text
Users
│
├── Students
└── Teachers
        │
        ▼
RecisCam
        │
        ▼
Supabase
├── Authentication
├── PostgreSQL
└── Storage
        │
        ▼
Database
├── profiles
├── attendance
└── notifications
```

---

## Project Structure
```text
.
├── assets/
│   ├── css/
│   ├── js/
│   └── icons/
├── demo/
│   └── demo-data.js
├── docs/
│   ├── README.md
│   ├── CHANGELOG.md
│   └── LICENSE
├── pages/
│   ├── register.html
│   ├── student.html
│   └── teacher.html
├── index.html
├── manifest.json
```

---

## Running the Project
1. Clone the repository.
```bash
git clone https://github.com/YOUR_USERNAME/reciscam.git
```
2. Open the project folder.
3. Launch `index.html` using **Live Server** (recommended).
No installation, backend, or environment variables are required.

---

## Demo Workflow
1. Open the application.
2. Select one of the demo roles (or register as a new student).
3. Explore the application.
4. Changes persist locally in your browser.
5. Reset the demo database at any time to restore the initial dataset.

---

## Original Database
The original implementation used three primary tables.

| Table | Purpose |
|--------|---------|
| `profiles` | User profiles and roles |
| `attendance` | Piket attendance submissions and status |
| `notifications` | Approval/rejection alerts for students |

---

## Learning Outcomes
This project provided experience with:

- Designing a complete web application
- Working with device camera input for file capture
- Building responsive user interfaces
- Structuring JavaScript applications
- Designing relational database schemas
- Implementing role-based authorization
- Working with Supabase
- Creating a frontend-only portfolio demo from a backend application

---

## Project Status
This project is archived as a completed Senior High School project.

The original backend has been retired. This repository now serves as a self-contained portfolio demonstration that reproduces the application's core functionality without requiring external infrastructure.

---

## License
This project is available for educational and portfolio purposes.