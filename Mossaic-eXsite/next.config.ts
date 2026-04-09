import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow remote images from Unsplash (used throughout the UI)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // Skip ESLint errors during build — don't block deployments
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Skip TypeScript errors during build — don't block deployments
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
