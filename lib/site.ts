// Central config for the Propel marketing site. Update the download URLs once the
// desktop installers are published to GitHub Releases and the extension is live.
export const site = {
  name: "Propel",
  tagline: "Auto-apply to jobs, right inside your browser.",
  description:
    "Propel reads and fills job-application forms on whatever career site you're on — Workday, Greenhouse, Lever, company portals — so you apply in seconds, not hours. A desktop app plus a browser bridge that keeps your data on your own machine.",
  url: "https://propel.app",
  // TODO: replace with your real GitHub Releases asset URLs once published.
  downloads: {
    mac: "https://github.com/PROPEL_OWNER/propel/releases/latest",
    windows: "https://github.com/PROPEL_OWNER/propel/releases/latest",
    // TODO: replace with the Chrome Web Store listing URL once the item is approved.
    chrome: "https://chrome.google.com/webstore/detail/imggbmnonbcnkfmdghfedfadijfjdfkj",
  },
  social: {
    github: "https://github.com/PROPEL_OWNER/propel",
  },
  email: "zachcilwa@gmail.com",
} as const;
