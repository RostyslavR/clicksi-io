import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Experimental features for better SSR/hydration
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js']
  },
  // Ensure proper client-side hydration
  reactStrictMode: true,
  // Handle environment variables properly on Vercel
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }
};

export default nextConfig;
