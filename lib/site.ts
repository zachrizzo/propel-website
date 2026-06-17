// Central config for the Propel marketing site. Update the download URLs once the
// desktop installers are published to GitHub Releases and the extension is live.
export const site = {
  name: "Propel",
  tagline: "Auto-apply to jobs, right inside your browser.",
  description:
    "Propel reads and fills job-application forms on whatever career site you're on — Workday, Greenhouse, Lever, company portals — so you apply in seconds, not hours. A desktop app plus a browser bridge that keeps your data on your own machine.",
  // Production domain — update to a custom domain here once you add one in Vercel.
  url: "https://propel-website-pi.vercel.app",
  // Stable "latest release" asset URLs on the PUBLIC releases repo. electron-builder
  // publishes Pilot.dmg (universal: Apple Silicon + Intel) and Pilot-Setup.exe under
  // each release with these fixed names, so these links always serve the newest build.
  // (They 404 until the first release is published to zachrizzo/propel-releases.)
  downloads: {
    mac: "https://github.com/zachrizzo/propel-releases/releases/latest/download/Pilot.dmg",
    windows: "https://github.com/zachrizzo/propel-releases/releases/latest/download/Pilot-Setup.exe",
    chrome: "https://chromewebstore.google.com/detail/propel-bridge/imggbmnonbcnkfmdghfedfadijfjdfkj",
  },
  social: {
    // Public releases repo (source is private).
    github: "https://github.com/zachrizzo/propel-releases",
  },
  email: "zachcilwa@gmail.com",
} as const;
