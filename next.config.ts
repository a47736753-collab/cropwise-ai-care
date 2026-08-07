import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the project root (multiple lockfiles exist up the tree).
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
