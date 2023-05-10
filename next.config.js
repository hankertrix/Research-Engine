/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignorePatterns: ["migrate/*"]
  }
};

module.exports = nextConfig;
