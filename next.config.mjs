/** @type {import('next').NextConfig} */
const nextConfig = {
  // Handbuch-PDF beim Deployment mit der API-Route bündeln
  outputFileTracingIncludes: {
    "/api/admin/handbook": ["./docs/Admin-Handbuch.pdf"],
  },
}

export default nextConfig
