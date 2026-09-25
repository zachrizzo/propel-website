const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://jhezakjoyxzfcamwqmqz.supabase.co";
const dev = process.env.NODE_ENV !== "production";

// A Content Security Policy for every page. Next.js renders inline scripts for
// hydration and the JSON-LD blocks, so scripts allow 'unsafe-inline' (and eval in
// development only, for Fast Refresh). The rest is strict: the only other origin
// the browser talks to is the Propel Supabase project (sign-in, plans, Stripe
// session creation); Checkout and Google sign-in are page navigations, which CSP
// does not restrict. No page may be framed, which protects sign-in and the account
// page from clickjacking.
const csp = [
  "default-src 'self'",
  // In development Vercel Analytics loads its debug script from its own CDN.
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self' ${supabaseUrl}${dev ? " ws: wss:" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
