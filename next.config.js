/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/onboard/pdfupload',
        destination: '/api/onboard/pdfupload', // The actual path to your API route
      },
    ];
  },
};

module.exports = nextConfig;
