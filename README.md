# Propel — marketing site

The landing page for **Propel**, the auto-apply job-application tool (desktop app +
Chrome bridge). Built with Next.js 14 (App Router), Tailwind, and Framer Motion.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (all routes static)
npm run verify:downloads
```

## Deploy

Optimized for Vercel — import the repo at [vercel.com/new](https://vercel.com/new),
framework auto-detects as Next.js. No env vars required.

## Configure

Edit [`lib/site.ts`](lib/site.ts):
- `url` — the production domain (used for canonical URLs, OG tags, sitemap)
- `downloads.mac` / `downloads.windows` — website-owned download routes for the desktop app
- `downloads.chrome` — the Chrome Web Store listing URL

The website download routes must stay stable:

- `https://propel-website-pi.vercel.app/download/mac`
- `https://propel-website-pi.vercel.app/download/windows`

Those routes prefer the current Propel-named GitHub release assets and fall back
to the pre-rename Pilot assets still present on older releases. Run
`npm run verify:downloads` after release work to confirm the latest public release
has Mac and Windows assets and no site code was accidentally changed to a
version-pinned `/releases/download/vX.Y.Z/...` URL.

The `/privacy` route doubles as the Chrome Web Store privacy-policy URL.
