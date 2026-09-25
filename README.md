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

Those routes prefer the current Propel-named GitHub release assets and only
redirect after confirming a public installer exists. If a platform asset is not
published yet, the route renders a Propel-owned status page instead of sending
users to GitHub. Run `npm run verify:downloads` after release work to confirm
the latest public release has both required one-click installers (`Propel.dmg`
and `Propel-Setup.exe`) and to make sure no site code was accidentally changed
to a version-pinned `/releases/download/vX.Y.Z/...` URL.

The `/privacy` route doubles as the Chrome Web Store privacy-policy URL.

## Accounts and billing

People sign in on the site (`/login`: email and password, or Google) with the
same Supabase accounts the Propel apps use, and manage their plan at
`/account`: usage this period, upgrading through Stripe Checkout, extra
applications, and the Stripe billing portal. The Stripe work happens in the
Propel Supabase functions (`create-checkout-session`, `create-portal-session`);
the site only calls them with the signed-in session.

- `/auth/callback` turns a Google sign-in, an email confirmation or a password
  reset link into a session cookie. Supabase must allow
  `https://propeljobagent.com/auth/callback` (and the local and preview URLs
  you use) as redirect URLs.
- `/billing` is the Stripe portal's return URL and forwards to `/account`;
  `/billing/success` and `/billing/cancel` are Checkout's return pages.
- The Supabase URL and publishable key default to the production project
  (`lib/supabase/config.ts`); `NEXT_PUBLIC_SUPABASE_URL` and
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` override them. Neither is a secret.
