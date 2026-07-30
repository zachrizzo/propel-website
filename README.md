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
- `downloads.mac` — the website-owned macOS download route
- `downloads.windows` — the assigned Microsoft Store listing for Propel Job Agent
- `downloads.chrome` — the Chrome Web Store listing URL

The website-owned installer routes must stay stable:

- `https://propel-website-pi.vercel.app/download/mac`
- `https://propel-website-pi.vercel.app/download/windows`

The macOS route is the public acquisition path. The Windows route remains a
legacy/support path while the primary Windows call-to-action points to the
Microsoft Store. Both routes prefer the current Propel-named GitHub release assets and only
redirect after confirming a public installer exists. If a platform asset is not
published yet, the route renders a Propel-owned status page instead of sending
users to GitHub. Run `npm run verify:downloads` after release work to confirm
the latest public release has both required one-click installers (`Propel.dmg`
and `Propel-Setup.exe`) and to make sure no site code was accidentally changed
to a version-pinned `/releases/download/vX.Y.Z/...` URL.

The `/privacy` route doubles as the Chrome Web Store privacy-policy URL.
