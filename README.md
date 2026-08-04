# Student Course Portal

A modern, multi-page **Student Course Portal** built with **Next.js (App Router)** and **Tailwind CSS**. This project demonstrates file-based routing, shared layouts, dynamic routes, reusable components, and responsive design in a real-world application.

## Features

- **Home** – Landing page with hero section, stats, and featured courses
- **Courses** – Browse all available courses with detailed cards
- **Course Search** – Client-side search bar to filter courses by title, description, or instructor, plus category filters
- **Course Details** – Dynamic route for each course (`/courses/web-development`, `/courses/ai-engineering`, etc.)
- **Related Courses** – Same-category courses displayed at the bottom of each details page
- **Instructors** – Meet the expert instructors
- **Contact** – Contact form with validation and success feedback
- **Custom 404 Page** – Friendly error page for unmatched routes
- **Fully Responsive** – Mobile-first design using Tailwind CSS
- **Reusable Components** – Navbar, Footer, CourseCard, InstructorCard, Button, SectionTitle, CourseSearch

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

This project uses `output: "export"` in `next.config.mjs`, so `npm run build` generates a fully static site in the `out/` directory.

```bash
npm run build
```

To preview the static build locally, serve the `out/` directory:

```bash
npx serve out
```

### Deploy to GitHub Pages

This project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys the site to GitHub Pages on every push to `main`. The workflow:

1. Installs dependencies with `npm ci`
2. Builds a static export with `next build` (using `output: "export"`)
3. Uploads the `out/` directory as a Pages artifact
4. Deploys to GitHub Pages

To enable this:

1. Go to your repository **Settings → Pages**
2. Under **Build and deployment**, set **Source** to **GitHub Actions**
3. Push to `main` — the workflow will run automatically

The site will be available at `https://<username>.github.io/multi-page-student-portal/`.

> **Note:** The `next.config.mjs` sets `basePath` to `/multi-page-student-portal` only when the `GITHUB_PAGES` environment variable is `"true"` (set by the workflow). Running locally or building normally does not use the basePath.

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
    │   ├── CourseCard.jsx     # Reusable course card (links to details)
    │   ├── InstructorCard.jsx # Reusable instructor card
    │   ├── Button.jsx         # Reusable button (link or button element)
    │   ├── SectionTitle.jsx   # Reusable section heading with subtitle
    │   └── CourseSearch.jsx   # Client-side search + category filter
    └── data/                  # Static data
        ├── courses.js         # 6 course records + getCourseBySlug helper
        └── instructors.js     # 5 instructor records
```

## Route Map

| URL                        | File                              | Description             |
| -------------------------- | --------------------------------- | ----------------------- |
| `/`                        | `src/app/page.jsx`                | Home page               |
| `/courses`                 | `src/app/courses/page.jsx`        | All courses + search    |
| `/courses/web-development` | `src/app/courses/[slug]/page.jsx` | Web Development details |
| `/courses/ai-engineering`  | `src/app/courses/[slug]/page.jsx` | AI Engineering details  |
| `/courses/data-science`    | `src/app/courses/[slug]/page.jsx` | Data Science details    |
| `/instructors`             | `src/app/instructors/page.jsx`    | All instructors         |
| `/contact`                 | `src/app/contact/page.jsx`        | Contact form            |
| `/anything-else`           | `src/app/not-found.jsx`           | Custom 404 page         |

## What We Learned

**Goal:** Learn how modern React applications are structured using Next.js App Router, dynamic routes, and reusable components.

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

### 3. Dynamic Routes with Static Params

```jsx
// src/app/courses/[slug]/page.jsx
export function generateStaticParams() {
  return courses.map((course) => ({
    slug: course.slug,
  }));
}

export default async function CourseDetailPage({ params }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  // ...
}
```

- `generateStaticParams` pre-renders all course detail pages at build time.
- `generateMetadata` dynamically sets the page title and description for SEO.

### 4. Shared Layouts

- `layout.jsx` wraps all pages in its folder automatically.
- The root `layout.jsx` includes the shared **Navbar** and **Footer**, so every page gets them without repeating code.
- Layouts can be nested — each folder can have its own layout.

### 5. Navigation with `next/link`

- Use `<Link href="/courses">` instead of `<a href="/courses">` for client-side navigation.
- Dynamic links use template literals: `<Link href={`/courses/${slug}`}>`.

### 6. Reusable Components & Composition

- **Button** – A single component that renders either a `<Link>` (when `href` is passed) or a `<button>` element, with configurable variants and sizes.
- **SectionTitle** – Standardizes section headings with title, subtitle, and alignment.
- **CourseCard** – Used on the home page, courses page, and related courses section — demonstrating component composition.
- **CourseSearch** – A client component that filters courses by search term and category, composing `CourseCard` inside.

### 7. Client vs Server Components

- **Server Components** (default) render on the server — good for data fetching and SEO.
- **Client Components** (add `"use client"` at the top) can use hooks like `useState` — needed for interactive features like the Navbar mobile menu, Contact form, and CourseSearch.

### 8. Custom 404 Page

- Create `not-found.jsx` in the `app/` directory to handle all unmatched routes.
- Use `notFound()` from `next/navigation` to trigger the 404 page for missing data.

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS 4**
- **JavaScript** (ES6+)

## License

This project is for educational purposes as part of the Web Development Track.
