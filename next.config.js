/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "online-women-store.s3.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
