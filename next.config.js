/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
      appDir: true, // ✅ tells Next.js to use /src/app/
    },
  };
  
  module.exports = nextConfig;
  