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
- `downloads.mac` / `downloads.windows` — GitHub Releases asset URLs for the desktop app
- `downloads.chrome` — the Chrome Web Store listing URL

The desktop download URLs must stay on GitHub's stable `releases/latest/download`
endpoints:

- `https://github.com/zachrizzo/propel-releases/releases/latest/download/Pilot.dmg`
- `https://github.com/zachrizzo/propel-releases/releases/latest/download/Pilot-Setup.exe`

Those URLs redirect to whatever release is currently marked latest in the public
`zachrizzo/propel-releases` repo, so publishing a new desktop release updates the
website buttons without redeploying this site. Run `npm run verify:downloads`
after release work to confirm the latest release has both assets and no site code
was accidentally changed to a version-pinned `/releases/download/vX.Y.Z/...` URL.

The `/privacy` route doubles as the Chrome Web Store privacy-policy URL.
