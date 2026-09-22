import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      // /gallery used to render the same page as /portfolio. Kept as a
      // permanent redirect so old links and any indexed URLs still land.
      {
        source: '/gallery',
        destination: '/portfolio',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
