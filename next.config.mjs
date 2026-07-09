import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Fixes the "Next.js inferred your workspace root" warning caused by the
  // stray package-lock.json at the repo root (outside this app).
  outputFileTracingRoot: __dirname,

  // Enable gzip/brotli compression for smaller bundles (matches frontend/next.config.js).
  compress: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.hetdcl.com", pathname: "/**" },
      { protocol: "https", hostname: "backend.droploo.com", pathname: "/**" },
      { protocol: "https", hostname: "www.sobarbazarbd.com", pathname: "/**" },
      { protocol: "https", hostname: "sobarbazarbd.com", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
  },

  // Cache headers for static assets (matches frontend/next.config.js).
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/_next/image/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },

  // Proxy /media/* to the backend (matches frontend/next.config.js).
  async rewrites() {
    return [
      {
        source: "/media/:path*",
        destination: "https://api.hetdcl.com/media/:path*",
      },
    ];
  },

  // SEO: 301 redirect from non-www → www (canonical host), matches frontend/next.config.js.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "sobarbazarbd.com" }],
        destination: "https://www.sobarbazarbd.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
