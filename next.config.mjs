/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
    // Static export is only for GitHub Pages; Vercel uses default Next.js output
    ...(isGithubPages ? { output: "export" } : {}),
    images: {
        unoptimized: true,
    },
    ...(isGithubPages ? { basePath: "/multi-page-student-portal" } : {}),
};

export default nextConfig;