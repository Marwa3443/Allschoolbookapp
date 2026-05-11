/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['ar', 'en'],
    defaultLocale: 'ar',
  },
  images: {
    domains: ['localhost', 'api.example.com'],
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
