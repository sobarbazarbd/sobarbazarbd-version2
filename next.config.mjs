/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.hetdcl.com", pathname: "/**" },
      { protocol: "https", hostname: "backend.droploo.com", pathname: "/**" },
      { protocol: "https", hostname: "www.sobarbazarbd.com", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
