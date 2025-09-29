import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'docker-image-production-5199.up.railway.app',
        pathname: '/wp-content/uploads/**',
      },
       {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
    ],
  },
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion'],
  },
  // Note: output: 'export' is commented out because this site uses WordPress API
  // and requires ISR for dynamic content updates. Uncomment only if you want
  // a completely static site without dynamic updates:
  // output: 'export',
  // trailingSlash: true,
  // distDir: 'dist',
};

export default nextConfig;
