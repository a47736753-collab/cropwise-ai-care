import type { NextConfig } from "next";

/**
 * The hosting platform injects the backend credentials as VITE_* variables.
 * Next.js only exposes NEXT_PUBLIC_* to the browser, so we alias them here.
 * Explicit NEXT_PUBLIC_* values (e.g. local .env.local) always win.
 */
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "";

const nextConfig: NextConfig = {
  // Pin the project root (multiple lockfiles exist up the tree).
  outputFileTracingRoot: process.cwd(),
  env: {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.lovable.app" },
    ],
  },
};

export default nextConfig;
