# Student Course Portal

A modern, multi-page **Student Course Portal** built with **Next.js (App Router)** and **Tailwind CSS**. This project demonstrates file-based routing, shared layouts, dynamic routes, and responsive design in a real-world application.

## Features

- **Home** – Landing page with hero section, stats, and featured courses
- **Courses** – Browse all available courses with detailed cards
- **Course Details** – Dynamic route for each course (`/courses/web-development`, `/courses/ai-engineering`, etc.)
- **Instructors** – Meet the expert instructors
- **Contact** – Contact form with validation and success feedback
- **Custom 404 Page** – Friendly error page for unmatched routes
- **Fully Responsive** – Mobile-first design using Tailwind CSS
- **Reusable Components** – Navbar, Footer, CourseCard, InstructorCard

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm (or yarn/pnpm/bun)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. (If port 3000 is in use, Next.js will automatically use the next available port.)

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
Student-portal-nextjs/
├── jsconfig.json              # Path alias config (@/* → ./src/*)
├── next.config.mjs            # Next.js configuration
├── package.json               # Dependencies & scripts
├── postcss.config.mjs         # PostCSS configuration
└── src/
    ├── app/                   # App Router (file-based routing)
    │   ├── layout.jsx         # Root layout (Navbar + Footer wrapper)
    │   ├── page.jsx           # Home page  →  /
    │   ├── globals.css        # Global Tailwind CSS
    │   ├── not-found.jsx      # Custom 404 page
    │   ├── courses/
    │   │   ├── page.jsx       # Courses page  →  /courses
    │   │   └── [slug]/
    │   │       └── page.jsx   # Course Detail  →  /courses/:slug
    │   ├── instructors/
    │   │   └── page.jsx       # Instructors  →  /instructors
    │   └── contact/
    │       └── page.jsx       # Contact  →  /contact
    ├── components/            # Reusable components
    │   ├── Navbar.jsx         # Responsive navbar with mobile menu
    │   ├── Footer.jsx         # Footer with links & social icons
    │   ├── CourseCard.jsx     # Reusable course card
    │   └── InstructorCard.jsx # Reusable instructor card
    └── data/                  # Static data
        ├── courses.js         # 6 course records
        └── instructors.js     # 5 instructor records
```

## Route Map

| URL                        | File                              | Description             |
| -------------------------- | --------------------------------- | ----------------------- |
| `/`                        | `src/app/page.jsx`                | Home page               |
| `/courses`                 | `src/app/courses/page.jsx`        | All courses             |
| `/courses/web-development` | `src/app/courses/[slug]/page.jsx` | Web Development details |
| `/courses/ai-engineering`  | `src/app/courses/[slug]/page.jsx` | AI Engineering details  |
| `/courses/data-science`    | `src/app/courses/[slug]/page.jsx` | Data Science details    |
| `/instructors`             | `src/app/instructors/page.jsx`    | All instructors         |
| `/contact`                 | `src/app/contact/page.jsx`        | Contact form            |
| `/anything-else`           | `src/app/not-found.jsx`           | Custom 404 page         |

## What We Learned

**Goal:** Learn how modern React applications are structured using Next.js App Router and file-based routing.

### 1. Next.js App Router vs Traditional React Router

In **React**, routing is defined separately in a central file using `react-router-dom`:

```jsx
// React Router approach
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/courses" element={<Courses />} />
  <Route path="/courses/:slug" element={<CourseDetail />} />
</Routes>
```

In **Next.js App Router**, there is **no route configuration file**. The file system structure inside the `app/` directory **is** the routing system. Each `page.jsx` file automatically becomes a route based on its folder location.

### 2. File-Based Routing

- **Folder + `page.jsx` = Route.** Creating `src/app/courses/page.jsx` automatically creates the `/courses` route — no configuration needed.
- **Dynamic routes use `[brackets]`.** The folder `[slug]` matches any value, and you access it via `params.slug`.
- **Nested routes** are created by nesting folders (e.g., `courses/[slug]/page.jsx`).

### 3. Shared Layouts

- `layout.jsx` wraps all pages in its folder automatically.
- The root `layout.jsx` includes the shared **Navbar** and **Footer**, so every page gets them without repeating code.
- Layouts can be nested — each folder can have its own layout.

### 4. Navigation with `next/link`

- Use `<Link href="/courses">` instead of `<a href="/courses">` for client-side navigation.
- Dynamic links use template literals: `<Link href={`/courses/${slug}`}>`.

### 5. Dynamic Route Parameters

```jsx
// src/app/courses/[slug]/page.jsx
export default async function CourseDetailPage({ params }) {
  const { slug } = await params; // "web-development", "ai-engineering", etc.
  const course = courses.find((c) => c.slug === slug);
}
```

### 6. Custom 404 Page

- Create `not-found.jsx` in the `app/` directory to handle all unmatched routes.
- Use `notFound()` from `next/navigation` to trigger the 404 page for missing data.

### 7. Client vs Server Components

- **Server Components** (default) render on the server — good for data fetching and SEO.
- **Client Components** (add `"use client"` at the top) can use hooks like `useState` — needed for interactive features like the Navbar mobile menu and Contact form.

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS 4**
- **JavaScript** (ES6+)

## License

This project is for educational purposes as part of the Web Development Track.
