# HORIZON-School-Website

# HORIZON — Official School & Institutional Management Portal

> **"Where Learning Moves Forward."**

🌐 **Live Website:** [https://HORIZON--school.web.app](https://HORIZON--school.web.app)

HORIZON is a modern, portfolio-quality, full-stack school information and academic management platform built for a prestigious preparatory academy. Designed for prospective parents, enrolled scholars, faculty members, and institutional directors, this application integrates a Python Flask + SQLAlchemy + SQLite backend with a high-fidelity, responsive frontend.

---

## 🏛️ Architectural Overview

```
HORIZON/
├── app.py                   # Core Flask Application, REST APIs, Session Auth & Error Handlers
├── config.py                # Database and Security Configurations
├── models.py                # SQLAlchemy Models & Serialization
├── seed_data.py             # Realistic Educational Seed Data
├── requirements.txt         # Python Backend Dependencies
├── server.ts                # Full-Stack Integration Runner (Express + Flask Child Process + Vite)
├── README.md                # Documentation & Architecture
│
├── database/
│   └── HORIZON.db        # SQLite Persistent Storage
│
├── src/
│   ├── types/index.ts       # TypeScript Domain Interfaces
│   ├── services/api.ts      # REST API Client
│   ├── components/          # Navigation, Footers, Modals
│   ├── pages/               # Home, About, Academics, Admissions, Campus Life,
│   │                        # Events, News, Gallery, Contact, Student/Teacher/Admin Portals
│   └── assets/              # Institutional Photography & Assets
```

---

## ⚡ Core Technologies

### Backend
- **Python 3.10+ / 3.11**
- **Flask**: Microframework providing REST API endpoints, routing, and session authentication.
- **SQLAlchemy & Flask-SQLAlchemy**: Object-Relational Mapping (ORM) connecting to SQLite.
- **Werkzeug Security**: Cryptographic password hashing (`pbkdf2:sha256`) and verification.
- **Flask-CORS**: Cross-Origin Resource Sharing handling frontend-backend handshakes.

### Frontend
- **HTML5 & Modern CSS3** with **Tailwind CSS v4**
- **React 19 & TypeScript**: Component-driven architecture with strict type safety.
- **Lucide Icons**: Semantic and accessible iconography.
- **Cormorant Garamond & Plus Jakarta Sans**: Editorial institutional typographic hierarchy.

---

## 🔑 Demo & Testing Credentials

For instantaneous evaluation, the login screen includes **one-click autofill credentials**:

| Role | Email / Username | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@HORIZON.edu` | `Admin@2026` | Full administrative oversight, review/accept admission enquiries, view contact messages, publish announcements, manage calendar events, publish news. |
| **Teacher** | `teacher@HORIZON.edu` | `Teacher@2026` | Class rosters, mark daily student attendance (Present/Late/Absent with immediate SQLite update), create and post assignments with rubrics. |
| **Student** | `student@HORIZON.edu` | `Student@2026` | Academic profile (Alexander Hayes, Grade 11-A), weekly timetable (Monday–Friday), pending assignments, personal attendance logs, announcements. |

---

## 🚀 Installation & Local Execution

### 1. Prerequisites
- Python 3.10 or higher
- Node.js 18+ and npm

### 2. Standalone Python / Flask Backend Execution

```bash
# 1. Create a Python virtual environment
python -m venv venv

# 2. Activate virtual environment
# On Linux / macOS:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Initialize Database & Run Flask
python app.py --port 5001
```

The database (`database/HORIZON.db`) will automatically create all tables and populate realistic seed data on its initial startup.

### 3. Running the Integrated Full-Stack Application

The application includes an Express supervisor (`server.ts`) that automatically launches the Python Flask backend and serves the frontend on port 3000:

```bash
# Install frontend dependencies
npm install

# Run the complete application
npm run dev
```

Visit `http://localhost:3000` in your web browser.

---

## 📡 REST API Specifications

### Authentication
- `POST /api/login`: Validates user credentials, creates session, and returns user profile.
- `POST /api/logout`: Destroys active session.
- `GET /api/me`: Returns currently authenticated user context.

### Admissions & Forms
- `POST /api/admissions`: Submits an admission enquiry into SQLite.
- `GET /api/admissions`: Admin endpoint to retrieve all enquiries (filterable by status).
- `PATCH /api/admissions/<id>`: Admin endpoint to update enquiry status (`Pending`, `Reviewed`, `Accepted`, `Rejected`).
- `POST /api/contact`: Submits general correspondence to the school secretariat.
- `GET /api/contact`: Admin endpoint to view messages.
- `PATCH /api/contact/<id>`: Admin endpoint to mark message status (`Read`, `Replied`).

### Content Management
- `GET /api/announcements`: Retrieves school bulletins (with optional category/audience filtering).
- `POST /api/announcements`: Admin endpoint to publish official notices.
- `GET /api/events`: Retrieves upcoming academic and athletic events.
- `POST /api/events`: Admin endpoint to schedule events.
- `GET /api/news`: Retrieves school chronicle articles.
- `GET /api/news/<id>`: Detailed reading view for an individual article.
- `GET /api/gallery`: Retrieves photo gallery items with category filter.

### Portals
- `GET /api/student/dashboard`: Returns student profile, weekly timetable, active assignments, attendance records, and personalized notices.
- `GET /api/teacher/dashboard`: Returns teacher profile, assigned class sections, student roster, and assignments.
- `POST /api/teacher/assignments`: Allows faculty to assign coursework.
- `POST /api/teacher/attendance`: Records real-time attendance status for a student.
- `GET /api/admin/dashboard`: Returns aggregated metrics, enquiries queue, messages, and user lists.

---

## 🔒 Security Practices

1. **Password Hashing**: Passwords are never stored in plaintext; all credentials use salted Werkzeug hashes.
2. **SQL Injection Prevention**: SQLAlchemy parameterized queries protect against injection vectors.
3. **Role-Based Authorization**: Endpoints are gated with `@role_required(['admin'])` and `@role_required(['teacher'])` decorators.
4. **Server-Side Validation**: All forms enforce mandatory fields and formats before database persistence.

---

## 📄 License
Educational & Portfolio Showcase. Developed for **HORIZON School**.

