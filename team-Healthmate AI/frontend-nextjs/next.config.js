/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // Remove rewrites - use direct API calls instead for clarity
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: process.env.NODE_ENV === 'production' 
  //         ? 'https://healthmate-ai-vxcl.onrender.com/api/:path*'
  //         : 'http://127.0.0.1:5000/api/:path*',
  //     },
  //   ];
  // },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;