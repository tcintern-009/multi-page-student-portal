# Student Course Portal - Full Stack (Next.js + Express + PostgreSQL)

A full-stack student course portal with a Next.js frontend, Express.js backend API, and PostgreSQL database hosted on [Neon](https://neon.tech).

Includes **JWT authentication** and **role-based + ownership-based authorization**.

# Live Link:
https://student-portal.digicert.digital

## Architecture

```
Next.js Frontend → Express API → PostgreSQL (Neon) → Express → Frontend
```

## Project Structure

```
├── backend/              # Express.js backend API
│   ├── config/           # Database connection (PostgreSQL pool)
│   ├── db/               # Schema, setup, and seed scripts
│   ├── middleware/       # Auth, error-handling middleware
│   ├── routes/           # API routes (auth, users, courses, instructors, students, enrollments)
│   ├── utils/            # Validation, pagination, formatters
│   ├── .env.example      # Environment variable template
│   ├── package.json
│   └── server.js
├── src/                  # Next.js frontend
│   ├── app/              # Next.js pages (login, register, profile, admin, etc.)
│   ├── components/       # React components
│   ├── context/          # AuthContext (global auth state)
│   └── lib/              # API helper functions
├── .env.local            # Frontend environment variables
└── package.json
```

## Authentication & Authorization

### Authentication vs Authorization

| Concept | Meaning | Example in this app |
| -------- | ------- | ------------------- |
| **Authentication** | Verifies *who* the user is | Login with email/password → JWT token |
| **Authorization** | Controls *what* they can do | Admin can delete courses; students cannot |

### User Roles

The `users` table stores two roles:

| Role | Description |
| ---- | ----------- |
| `student` | Default role on registration. Can enroll in courses, view/cancel own enrollments, edit own profile. |
| `admin` | Full CRUD on courses, instructors, students, enrollments. Can manage user roles. |

Each user is linked to a `students` record via `student_id` (created automatically on register).

### Default Admin Account (from seed)

After running `npm run db:seed`:

```
Email:    admin@studentportal.com
Password: admin123
```

New users who register through `/register` get the `student` role.

### How JWT Auth Works

1. User logs in or registers → backend returns a JWT token.
2. Frontend stores the token in `localStorage` and sends it on every API request:
   ```
   Authorization: Bearer <token>
   ```
3. The `authenticate` middleware verifies the token and attaches `req.user`:
   ```js
   { id, email, role, studentId }
   ```
4. Protected routes use `authenticate` and/or `authorize(...roles)`.

### Backend Middleware

**`authenticate`** — returns **401 Unauthorized** if:
- No token is sent
- Token is invalid or expired

**`authorize(...roles)`** — returns **403 Forbidden** if:
- User is authenticated but their role is not allowed

**Ownership checks** — returns **403 Forbidden** if:
- A student tries to view/cancel another student's enrollment

### API Access Matrix

| Resource | Public Read | Create | Update | Delete |
| -------- | ----------- | ------ | ------ | ------ |
| **Courses** | ✅ Anyone | Admin only | Admin only | Admin only |
| **Instructors** | ✅ Anyone | Admin only | Admin only | Admin only |
| **Students** | Admin only | Admin only | Admin only | Admin only |
| **Students `/me`** | Logged-in student | — | Own profile only | — |
| **Enrollments** | Own only (student) / all (admin) | Student (self) or Admin | Admin only | Own (student) or Admin |
| **Users** | Admin only | — | Admin (role change) | — |

### Frontend Authorization

The frontend mirrors backend rules so users don't see actions they can't perform:

| Component / Page | Behavior |
| ---------------- | -------- |
| `AuthContext` | Exposes `user`, `isAuthenticated`, `isAdmin`, `isStudent` |
| `ProtectedRoute` | Redirects unauthenticated users to `/login`; blocks non-admins from admin pages |
| `Navbar` | Hides admin links (`Students`, `Users`) from non-admins; shows `My Enrollments` only when logged in |
| `CourseManager` | Add/Edit/Delete buttons visible only to admins |
| `/students` | Wrapped in `ProtectedRoute requireAdmin` |
| `/admin/users` | Admin-only user management |
| `/profile` | Logged-in users can view/edit their own profile |
| `/my-enrollments` | Logged-in users see and cancel their own enrollments |
| `CourseDetail` | "Enroll" requires login; enrollment uses the logged-in student's ID |

## Database Setup (Neon PostgreSQL)

### 1. Create a Neon database

1. Go to [https://neon.tech](https://neon.tech) and sign up / log in
2. Create a new project (e.g. `student-portal`)
3. Copy the **connection string** from the dashboard (Connection Details → Connection string)

### 2. Configure backend environment

Create `backend/.env` from the example:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```
PORT=5000
CLIENT_URL=http://localhost:3000
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
```

Replace `DATABASE_URL` with your Neon connection string.

### 3. Install dependencies and seed the database

```bash
cd backend
npm install
npm run db:seed
```

This creates all tables and inserts sample instructors, courses, students, enrollments, and an admin user.

## Getting Started

### 1. Start the Backend (Express API)

```bash
cd backend
npm install
npm run dev
```

The API runs at `http://localhost:5000`.

### 2. Start the Frontend (Next.js)

```bash
npm install
npm run dev
```

The frontend runs at `http://localhost:3000`.

## API Endpoints

### Health

| Method | Endpoint      | Auth | Description                    |
| ------ | ------------- | ---- | ------------------------------ |
| GET    | `/api/health` | —    | Health check + DB connectivity |

### Auth

| Method | Endpoint            | Auth | Description              |
| ------ | ------------------- | ---- | ------------------------ |
| POST   | `/api/auth/register`| —    | Register (role: student) |
| POST   | `/api/auth/login`   | —    | Login, returns JWT       |
| GET    | `/api/auth/me`      | ✅   | Current user profile     |
| POST   | `/api/auth/logout`  | ✅   | Logout (client clears token) |

### Users (Admin only)

| Method | Endpoint               | Auth  | Description              |
| ------ | ---------------------- | ----- | ------------------------ |
| GET    | `/api/users`           | Admin | List users (search, filter by role, pagination) |
| PATCH  | `/api/users/:id/role`  | Admin | Promote/demote user role |

### Courses

| Method | Endpoint           | Auth  | Description                          |
| ------ | ------------------ | ----- | ------------------------------------ |
| GET    | `/api/courses`     | —     | List courses (search, filter, pagination) |
| GET    | `/api/courses/:id` | —     | Get course by slug                   |
| POST   | `/api/courses`     | Admin | Create course                        |
| PUT    | `/api/courses/:id` | Admin | Update course by slug                |
| DELETE | `/api/courses/:id` | Admin | Delete course by slug                |

**Query params (GET):** `search`, `category`, `level`, `page`, `limit`

### Instructors

| Method | Endpoint               | Auth  | Description              |
| ------ | ---------------------- | ----- | ------------------------ |
| GET    | `/api/instructors`     | —     | List instructors           |
| GET    | `/api/instructors/:id` | —     | Get instructor by ID       |
| POST   | `/api/instructors`     | Admin | Create instructor          |
| PUT    | `/api/instructors/:id` | Admin | Update instructor          |
| DELETE | `/api/instructors/:id` | Admin | Delete instructor          |

**Query params (GET):** `search`, `page`, `limit`

### Students

| Method | Endpoint            | Auth              | Description                    |
| ------ | ------------------- | ----------------- | ------------------------------ |
| GET    | `/api/students/me`  | ✅ Student        | Own profile + enrollments      |
| PUT    | `/api/students/me`  | ✅ Student        | Update own profile             |
| GET    | `/api/students`     | Admin             | List students                  |
| GET    | `/api/students/:id` | Admin             | Get student with enrollments   |
| POST   | `/api/students`     | Admin             | Create student                 |
| PUT    | `/api/students/:id` | Admin             | Update student                 |
| DELETE | `/api/students/:id` | Admin             | Delete student                 |

**Query params (GET):** `search`, `page`, `limit`

### Enrollments

| Method | Endpoint               | Auth                    | Description              |
| ------ | ---------------------- | ----------------------- | ------------------------ |
| GET    | `/api/enrollments`     | ✅ (scoped to own for students) | List enrollments   |
| GET    | `/api/enrollments/:id` | ✅ (own or admin)       | Get enrollment by ID     |
| POST   | `/api/enrollments`     | Student / Admin         | Create enrollment        |
| PUT    | `/api/enrollments/:id` | Admin                   | Update enrollment status |
| DELETE | `/api/enrollments/:id` | Own (student) / Admin   | Cancel enrollment        |

**Query params (GET):** `studentId`, `courseId`, `status`, `page`, `limit`

## Error Responses

All errors return a consistent JSON shape:

```json
{
  "error": {
    "status": 403,
    "message": "You do not have permission to perform this action."
  }
}
```

| Status | Meaning |
| ------ | ------- |
| **401** | Not logged in, or invalid/expired token |
| **403** | Logged in but not allowed (wrong role or not the resource owner) |
| **404** | Resource not found |
| **409** | Conflict (duplicate email, already enrolled, etc.) |
| **400** | Validation error |

## Database Schema

```
instructors (1) ──< courses (many)
students (many) >──< enrollments >── courses (many)
users ──> students (optional FK via student_id)
```

- **users** — name, email, password_hash, role (`student` | `admin`), student_id (FK)
- **instructors** — name, role, bio, expertise, rating, students
- **courses** — slug, title, category, description, instructor_id (FK)
- **students** — name, email (unique), phone
- **enrollments** — student_id + course_id (unique), status

## Environment Variables

### Backend (`backend/.env`)

```
PORT=5000
CLIENT_URL=http://localhost:3000
DATABASE_URL=postgresql://...
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=production   # when deploying
```

### Frontend (`.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Testing with Postman

### 1. Login and get a token

**POST** `http://localhost:5000/api/auth/login`

```json
{
  "email": "admin@studentportal.com",
  "password": "admin123"
}
```

Copy the `token` from the response.

### 2. Use the token on protected requests

Add header:

```
Authorization: Bearer <your-token>
```

### 3. Example requests

| Request | Auth | Expected |
| ------- | ---- | -------- |
| GET `/api/health` | None | 200 OK |
| GET `/api/courses` | None | 200 OK (public) |
| POST `/api/courses` | No token | **401** Unauthorized |
| POST `/api/courses` | Student token | **403** Forbidden |
| POST `/api/courses` | Admin token | **201** Created |
| GET `/api/students` | Student token | **403** Forbidden |
| GET `/api/students/me` | Student token | **200** Own profile |
| POST `/api/enrollments` | Student token + `{ "courseSlug": "web-development" }` | **201** Enrolled |
| DELETE `/api/enrollments/:id` | Student token (someone else's enrollment) | **403** Forbidden |
| DELETE `/api/enrollments/:id` | Student token (own enrollment) | **200** Cancelled |

## Deployment

### Backend (Render / Railway)

1. Push your code to GitHub
2. Create a new Web Service on [Render](https://render.com) or [Railway](https://railway.app)
3. Set root directory to `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables:
   - `DATABASE_URL` — your Neon connection string
   - `CLIENT_URL` — your deployed frontend URL
   - `JWT_SECRET` — a strong random secret
   - `JWT_EXPIRES_IN=7d`
   - `NODE_ENV=production`
7. Run seed once: `npm run db:seed` (via shell/one-off job)

### Frontend (Vercel / GitHub Pages)

Set `NEXT_PUBLIC_API_URL` to your deployed backend URL, e.g.:

```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

For GitHub Pages, set `GITHUB_PAGES=true` and configure the API URL in your workflow or `.env.local`.

## Features

- JWT authentication (register, login, logout, session persistence)
- Role-based access control (RBAC) with `admin` and `student` roles
- Ownership-based authorization (students manage only their own enrollments/profile)
- Proper **401** (unauthenticated) vs **403** (forbidden) error responses
- PostgreSQL database on Neon with relational schema
- Full CRUD for courses, instructors, students, and enrollments
- Admin user management (list users, promote/demote roles)
- Search, filtering, and pagination on list endpoints
- Request validation and centralized error handling
- Frontend hides/disables actions based on logged-in user's role
- Protected pages: `/students`, `/admin/users`, `/profile`, `/my-enrollments`
- Course enrollment from the course detail page (authenticated students)
