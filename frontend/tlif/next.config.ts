import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Proxy frontend /api requests to local backend during development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5050/api/:path*',
      },
    ];
  },
};

export default nextConfig;
