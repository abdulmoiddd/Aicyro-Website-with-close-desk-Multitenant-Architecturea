/** @type {import('next').NextConfig} */
// Merged config: Aicyro website (images, redirects, security headers) +
// Closedesk engine (CORS for the multi-tenant API and the embeddable widget).
const nextConfig = {
  reactStrictMode: true,

  // Allow external images used by the public website
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "dummyimages.netlify.app" },
    ],
  },

  async headers() {
    return [
      // Website security headers. Not applied to /embed (the chatbot is iframed on
      // tenant sites), /api (CORS below) or /widget.js.
      {
        source: "/((?!embed|api|widget\\.js).*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=(self)" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-tenant-id, x-correlation-id, x-session-id",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      {
        source: "/widget.js",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      { source: "/termofuse", destination: "/terms", permanent: true },
      { source: "/audit", destination: "/free-website-audit", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/blog", destination: "/blogs", permanent: true },
      { source: "/blog/:slug*", destination: "/blogs/:slug*", permanent: true },
      { source: "/portfolio/portfolio/:slug*", destination: "/portfolio/:slug*", permanent: true },
      { source: "/portfolio/autoscholar", destination: "/portfolio/autoscholor", permanent: true },
      { source: "/portfolio/healthanalyzer", destination: "/portfolio/healthanalyser", permanent: true },
      { source: "/login", destination: "/mes", permanent: false },
      { source: "/og-image.jpg", destination: "/og-image.png", permanent: true },
    ];
  },
};

module.exports = nextConfig;
