import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/**',
      },
    ],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Enable experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node']
  },
  
  // Webpack configuration with better defaults
  webpack: (config, { isServer, dev }) => {
    // Add support for native modules if needed
    config.experiments = {
      ...config.experiments,
      layers: true,
    };

    // Fixes npm packages that depend on `node:` protocol
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // Only run SWC minification in production
    if (!dev && !isServer) {
      config.optimization.minimizer = [];
    }

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;

// This is needed to bypass Next.js's default security restrictions for localhost
export const config = {
  api: {
    bodyParser: false,
  },
};

export default nextConfig;
