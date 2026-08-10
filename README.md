# Student Course Portal - Full Stack (Next.js + Express)

A full-stack student course portal with a Next.js frontend and an Express.js backend API.

## Project Structure

```
├── backend/              # Express.js backend API
│   ├── data/             # In-memory course data
│   ├── middleware/       # Error-handling middleware
│   ├── routes/           # API route definitions
│   ├── .env              # Backend environment variables
│   ├── package.json      # Backend dependencies
│   └── server.js         # Express server entry point
├── src/                  # Next.js frontend
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   ├── data/             # Static data (fallback)
│   └── lib/              # API helper functions
├── .env.local            # Frontend environment variables
└── package.json          # Frontend dependencies
```

## Getting Started

### 1. Start the Backend (Express API)

```bash
cd backend
npm install
npm run dev
```

The API will run at `http://localhost:5000`.

### 2. Start the Frontend (Next.js)

```bash
npm install
npm run dev
```

The frontend will run at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint           | Description                 |
| ------ | ------------------ | --------------------------- |
| GET    | `/api/health`      | Health check                |
| GET    | `/api/courses`     | Get all courses             |
| GET    | `/api/courses/:id` | Get a single course by slug |
| POST   | `/api/courses`     | Create a new course         |
| PUT    | `/api/courses/:id` | Update a course by slug     |
| DELETE | `/api/courses/:id` | Delete a course by slug     |

## Environment Variables

### Backend (`backend/.env`)

```
PORT=5000
CLIENT_URL=http://localhost:3000
```

### Frontend (`.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Features

- ✅ Courses fetched from Express API instead of static files
- ✅ Loading states displayed while requests are running
- ✅ API errors handled gracefully
- ✅ Users can add a course through a form
- ✅ Changes appear in the UI after the API request completes
- ✅ Edit/Delete functionality from the frontend
- ✅ Reusable API helper functions
- ✅ Centralized Express error-handling middleware
- ✅ CORS enabled
- ✅ Request validation
- ✅ HTTP status codes
- ✅ Environment variables for frontend/backend URLs

## Testing with Postman

1. **GET /api/courses** - Returns all courses
2. **GET /api/courses/web-development** - Returns a single course
3. **POST /api/courses** - Create a course (send JSON body)
4. **PUT /api/courses/:slug** - Update a course
5. **DELETE /api/courses/:slug** - Delete a course

## Deployment

The backend can be deployed separately to platforms like Render, Railway, or Heroku. The frontend can be deployed to Vercel or GitHub Pages.

For GitHub Pages deployment, set `GITHUB_PAGES=true` and update `NEXT_PUBLIC_API_URL` to point to your deployed backend URL.
