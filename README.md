# Student Course Portal

A Student Course Portal built with Next.js (App Router) and Tailwind CSS.

## What We Built Today

Today we focused on **Data Fetching in Next.js**. We made our app more data-driven and added better user experience states.

### What We Implemented

- **Course & Instructor Data** – Moved all course and instructor info into separate data files (`src/data/courses.js` and `src/data/instructors.js`). The pages just import and render from these files now.
- **Dynamic Pages** – Courses and Instructors pages render their cards directly from the data files. No hardcoded content in the pages.
- **Search Feature** – Added a client-side search bar on the Courses page. You can search by title, description, or instructor, and also filter by category.
- **Related Courses** – Each course details page shows 3 related courses at the bottom (same category first).
- **Featured Courses on Home** – The homepage shows the first 3 courses as featured cards.
- **Loading States** – Added loading spinners for every route using Next.js `loading.jsx` files. When a page is fetching data, users see a nice spinner instead of a blank screen.
- **Empty States** – Added friendly messages (with a "Clear Filters" button in search) when there's no data to show. This happens on the courses page, instructors page, related courses, and featured courses.

### What We Learned

- How Next.js separates **server components** (default, good for data) from **client components** (with `"use client"`, needed for things like search).
- How `loading.jsx` works in the App Router – each route folder can have its own loading state.
- How to make reusable components (`LoadingSpinner`, `EmptyState`) and reuse them across multiple pages.
- How component composition keeps pages clean – pages just import and compose smaller building blocks.

## Pages

| Route             | Description                                           |
| ----------------- | ----------------------------------------------------- |
| `/`               | Home page with featured courses                       |
| `/courses`        | All courses with search and category filters          |
| `/courses/[slug]` | Course details page (e.g. `/courses/web-development`) |
| `/instructors`    | All instructors                                       |
| `/contact`        | Contact form                                          |
| Anything else     | Custom 404 page                                       |

## Run It Locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Deploy

The repo has a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and deploys to GitHub Pages on every push to `main`. In GitHub repo settings, set Pages source to "GitHub Actions".

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- JavaScript (ES6+)
