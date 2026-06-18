// Central config for the Propel marketing site.
export const siteUrl = "https://propel-website-pi.vercel.app";

const releaseBase = "https://github.com/zachrizzo/propel-releases/releases/latest/download";

export const releaseDownloads = {
  mac: {
    preferred: `${releaseBase}/Propel.dmg`,
    legacy: `${releaseBase}/Pilot.dmg`,
  },
  windows: {
    preferred: `${releaseBase}/Propel-Setup.exe`,
    legacy: `${releaseBase}/Pilot-Setup.exe`,
  },
} as const;

export const site = {
  name: "Propel",
  tagline: "Auto-apply to jobs, right inside your browser.",
  description:
    "Propel reads and fills job-application forms on whatever career site you're on — Workday, Greenhouse, Lever, company portals — so you apply in seconds, not hours. A desktop app plus a browser bridge that keeps your data on your own machine.",
  // Production domain — update to a custom domain here once you add one in Vercel.
  url: siteUrl,
  // Website-owned download routes. They prefer Propel-named release assets and
  // fall back to the pre-rename Pilot assets still present on v0.1.6.
  downloads: {
    mac: `${siteUrl}/download/mac`,
    windows: `${siteUrl}/download/windows`,
    chrome: "https://chromewebstore.google.com/detail/propel-bridge/imggbmnonbcnkfmdghfedfadijfjdfkj",
  },
  social: {
    // Public releases repo (source is private).
    github: "https://github.com/zachrizzo/propel-releases",
  },
  email: "zachcilwa@gmail.com",
} as const;
