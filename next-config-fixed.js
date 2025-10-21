// 🔧 Next.js Configuration for API Proxy (Fixed)
// Copy this file to your frontend project as next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/api/:path*",
      },
    ];
  },
  // Optional: Add environment variables
  env: {
    NEXT_PUBLIC_API_URL: "http://localhost:3001",
  },
};

module.exports = nextConfig;
