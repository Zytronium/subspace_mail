import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  // Disable server-side features for Electron
  typescript: {
    ignoreBuildErrors: false,
  },
  reactCompiler: true
};

export default nextConfig;
