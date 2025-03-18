import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['static.vecteezy.com', 'citinewsroom.com', 'images.squarespace-cdn.com',  'st5.depositphotos.com', 'media.istockphoto.com', 'www.earlyyearsnc.org', 'www.shutterstock.com', 'thumbs.dreamstime.com'], // Add the external domain here
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUBABSE_PROJECT_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

};

export default nextConfig;
