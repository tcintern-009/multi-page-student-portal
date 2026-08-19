# Student Course Portal - Full Stack (Next.js + Express + PostgreSQL)

A full-stack student course portal with a Next.js frontend, Express.js backend API, and PostgreSQL database hosted on [Neon](https://neon.tech).

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
│   ├── middleware/       # Error-handling middleware
│   ├── routes/           # API routes (courses, instructors, students, enrollments)
│   ├── utils/            # Validation, pagination, formatters
│   ├── .env.example      # Environment variable template
│   ├── package.json
│   └── server.js
├── src/                  # Next.js frontend
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   └── lib/              # API helper functions
├── .env.local            # Frontend environment variables
└── package.json
```

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
```

Replace `DATABASE_URL` with your Neon connection string.

### 3. Install dependencies and seed the database

```bash
cd backend
npm install
npm run db:seed
```

This creates all tables and inserts sample instructors, courses, students, and enrollments.

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

| Method | Endpoint      | Description                    |
| ------ | ------------- | ------------------------------ |
| GET    | `/api/health` | Health check + DB connectivity |

### Courses

| Method | Endpoint           | Description                          |
| ------ | ------------------ | ------------------------------------ |
| GET    | `/api/courses`     | List courses (search, filter, pagination) |
| GET    | `/api/courses/:id` | Get course by slug                   |
| POST   | `/api/courses`     | Create course                        |
| PUT    | `/api/courses/:id` | Update course by slug                |
| DELETE | `/api/courses/:id` | Delete course by slug                |

**Query params (GET):** `search`, `category`, `level`, `page`, `limit`

### Instructors

| Method | Endpoint               | Description              |
| ------ | ---------------------- | ------------------------ |
| GET    | `/api/instructors`     | List instructors           |
| GET    | `/api/instructors/:id` | Get instructor by ID       |
| POST   | `/api/instructors`     | Create instructor          |
| PUT    | `/api/instructors/:id` | Update instructor          |
| DELETE | `/api/instructors/:id` | Delete instructor          |

**Query params (GET):** `search`, `page`, `limit`

### Students

| Method | Endpoint            | Description                    |
| ------ | ------------------- | ------------------------------ |
| GET    | `/api/students`     | List students                  |
| GET    | `/api/students/:id` | Get student with enrollments   |
| POST   | `/api/students`     | Create student                 |
| PUT    | `/api/students/:id` | Update student                 |
| DELETE | `/api/students/:id` | Delete student                 |

**Query params (GET):** `search`, `page`, `limit`

### Enrollments

| Method | Endpoint               | Description              |
| ------ | ---------------------- | ------------------------ |
| GET    | `/api/enrollments`     | List enrollments         |
| GET    | `/api/enrollments/:id` | Get enrollment by ID     |
| POST   | `/api/enrollments`     | Create enrollment        |
| PUT    | `/api/enrollments/:id` | Update enrollment status |
| DELETE | `/api/enrollments/:id` | Delete enrollment        |

**Query params (GET):** `studentId`, `courseId`, `status`, `page`, `limit`

## Database Schema

```
instructors (1) ──< courses (many)
students (many) >──< enrollments >── courses (many)
```

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
NODE_ENV=production   # when deploying
```

### Frontend (`.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Testing with Postman

1. **GET** `http://localhost:5000/api/health` — verify DB connection
2. **GET** `http://localhost:5000/api/courses` — list all courses
3. **GET** `http://localhost:5000/api/courses/web-development` — single course
4. **GET** `http://localhost:5000/api/instructors` — list instructors
5. **GET** `http://localhost:5000/api/students` — list students
6. **GET** `http://localhost:5000/api/enrollments` — list enrollments
7. **POST** `http://localhost:5000/api/courses` — create course (JSON body)
8. **POST** `http://localhost:5000/api/enrollments` — enroll a student

Example enrollment body:

```json
{
  "studentId": 1,
  "courseSlug": "web-development"
}
```

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
   - `NODE_ENV=production`
7. Run seed once: `npm run db:seed` (via shell/one-off job)

### Frontend (Vercel / GitHub Pages)

Set `NEXT_PUBLIC_API_URL` to your deployed backend URL, e.g.:

```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

For GitHub Pages, set `GITHUB_PAGES=true` and configure the API URL in your workflow or `.env.local`.

## Features

- PostgreSQL database on Neon with relational schema
- Full CRUD for courses, instructors, students, and enrollments
- Search, filtering, and pagination on list endpoints
- Validation and PostgreSQL error handling
- Frontend connected to database-backed API
- Course enrollment from the course detail page
- Students management page
- Instructors fetched from the database
