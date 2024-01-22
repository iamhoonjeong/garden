/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [{ source: '/api/:path', destination: '/api/:path' }];
  },

  reactStrictMode: false,
};

module.exports = nextConfig;
