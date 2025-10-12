/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
};

module.exports = nextConfig;
