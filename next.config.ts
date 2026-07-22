import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output for Docker / minimal deployments
  output: 'standalone',

  // Images: allow external CDN domains
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: "https", hostname: "**.tradingview.com" },
      { protocol: "https", hostname: "s3.tradingview.com" },
      { protocol: "https", hostname: "**.coinglass.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },

  compress:        true,
  reactStrictMode: false, // Disabled: StrictMode double-invokes effects, breaks TV widget

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  async headers() {
    return [
      // Static asset caching
      {
        source: '/icon-:size.png',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/og-image.jpg',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
      },
      // Security + SEO headers on all routes
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",  value: "nosniff" },
          { key: "Referrer-Policy",         value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection",        value: "1; mode=block" },
          { key: "Permissions-Policy",      value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // NOTE: X-Frame-Options removed — it conflicts with TradingView iframe embed
          // TradingView widget creates iframes from *.tradingview.com
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // TradingView requires: s3.tradingview.com AND all *.tradingview.com subdomains
              // for their charting library, WebSocket connections, and data feeds
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://s3.tradingview.com https://s.tradingview.com https://*.tradingview.com https://www.googletagmanager.com",
              // TradingView widget creates iframes from multiple subdomains
              "frame-src 'self' https://www.tradingview.com https://widget.tradingview.com https://*.tradingview.com",
              "img-src 'self' data: blob: https:",
              "style-src 'self' 'unsafe-inline' https://*.tradingview.com",
              // WebSocket for live price feeds + all HTTPS for API calls
              "connect-src 'self' https: wss: https://*.tradingview.com wss://*.tradingview.com",
              "font-src 'self' data: https://*.tradingview.com",
              "media-src 'self' blob:",
              "worker-src 'self' blob:",
            ].join("; "),
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // www → non-www canonical redirect
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.bull-run-apex-deploy.vercel.app' }],
        destination: 'https://bull-run-apex-deploy.vercel.app/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
