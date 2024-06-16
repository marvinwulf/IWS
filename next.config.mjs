/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    //FIXME: Dirty Fix
    ignoreBuildErrors: true,
  },

  experimental: {
    instrumentationHook: true,
  },
};

export default nextConfig;
