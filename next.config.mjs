/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
    ...(isGithubPages ? { output: "export" } : {}),
    images: {
        unoptimized: true,
    },
    ...(isGithubPages ? { basePath: "/multi-page-student-portal" } : {}),
};

export default nextConfig;