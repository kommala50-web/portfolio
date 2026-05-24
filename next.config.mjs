/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options",       value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy",        value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/fonts/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({ test: /\.(glsl|vert|frag)$/, use: "raw-loader" });
    return config;
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "three", "@react-three/fiber", "gsap"],
  },
};

export default config;
