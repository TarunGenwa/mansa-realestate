import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'docker-image-production-8469.up.railway.app',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;
