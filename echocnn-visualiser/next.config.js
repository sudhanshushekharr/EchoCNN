/** @type {import("next").NextConfig} */
const config = {
  // Ensure static files are properly served
  async headers() {
    return [
      {
        source: '/training_analysis.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/tensorboard_data/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Ensure static files are included in build
  experimental: {
    outputFileTracingRoot: undefined,
  },
};

export default config;
