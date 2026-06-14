# Propel — marketing site

The landing page for **Propel**, the auto-apply job-application tool (desktop app +
Chrome bridge). Built with Next.js 14 (App Router), Tailwind, and Framer Motion.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (all routes static)
```

## Deploy

Optimized for Vercel — import the repo at [vercel.com/new](https://vercel.com/new),
framework auto-detects as Next.js. No env vars required.

## Configure

Edit [`lib/site.ts`](lib/site.ts):
- `url` — the production domain (used for canonical URLs, OG tags, sitemap)
- `downloads.mac` / `downloads.windows` — GitHub Releases asset URLs for the desktop app
- `downloads.chrome` — the Chrome Web Store listing URL

The `/privacy` route doubles as the Chrome Web Store privacy-policy URL.
