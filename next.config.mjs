/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Lint is run explicitly via `npm run lint`; do not fail the build on it.
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
