import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/getsongbpm',
        destination: 'https://getsongbpm.com',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

module.exports = {
  images: {
    domains: ["mosaic.scdn.co", "image-cdn-ak.spotifycdn.com"],
  },
};

export default nextConfig;
