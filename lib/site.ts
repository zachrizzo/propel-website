// Central config for the Propel marketing site.
// Primary/canonical domain. The legacy propel-website-pi.vercel.app alias stays
// live (it's the privacy URL published in the Chrome Web Store listing).
export const siteUrl = "https://propeljobagent.com";

const releaseBase = "https://github.com/zachrizzo/propel-releases/releases/latest/download";

export const releaseDownloads = {
  mac: {
    label: "Mac",
    candidates: [`${releaseBase}/Propel.dmg`, `${releaseBase}/Pilot.dmg`],
    unavailableTitle: "Mac download is temporarily unavailable",
    unavailableMessage:
      "The Mac installer is being refreshed. Please try again shortly or contact us and we will send the latest link.",
  },
  windows: {
    label: "Windows",
    candidates: [`${releaseBase}/Propel-Setup.exe`, `${releaseBase}/Pilot-Setup.exe`],
    unavailableTitle: "Windows download is temporarily unavailable",
    unavailableMessage:
      "The Windows installer is being refreshed. Please try again shortly or contact us and we will send the latest link.",
  },
} as const;

export const site = {
  name: "Propel",
  productName: "Propel Job Agent",
  tagline: "Easy Apply and multi-step applications, handled by one agent",
  description:
    "One AI job application agent for LinkedIn Easy Apply and supported multi-step forms on other job sites. Reuse your profile and review before submitting.",
  // The public custom domain is the canonical SEO identity for the site.
  url: siteUrl,
  // Website-owned download routes. They never send users directly to GitHub
  // unless a public installer asset is confirmed to exist.
  downloads: {
    mac: `${siteUrl}/download/mac`,
    windows: `${siteUrl}/download/windows`,
    chrome: "https://chromewebstore.google.com/detail/propel-bridge/imggbmnonbcnkfmdghfedfadijfjdfkj",
  },
  downloadAvailability: {
    mac: true,
    windows: true,
  },
  social: {
    // Public releases repo (source is private).
    github: "https://github.com/zachrizzo/propel-releases",
  },
  email: "zachcilwa@gmail.com",
  // What's next — surfaced on the site and in structured data / llms.txt so the
  // roadmap is part of how the product is discovered and understood.
  roadmap: [
    {
      title: "Résumé tailoring",
      body: "Propel rewrites and tailors your résumé to each role automatically, so an application can lead with the experience that role is looking for.",
    },
    {
      title: "LinkedIn on autopilot",
      body: "Keep your profile current and publish posts that build your presence — without the busywork of doing it by hand.",
    },
    {
      title: "Follow-ups, handled",
      body: "Auto-draft and send polished follow-up emails on the jobs you've applied to, so the right message goes out at the right time.",
    },
  ],
  // Shared FAQ — rendered on the page AND emitted as FAQPage structured data so
  // search engines and AI assistants can answer questions about Propel directly.
  faq: [
    {
      q: "What does Propel do?",
      a: "Propel uses one saved profile to complete LinkedIn Easy Apply applications and supported multi-step applications on other job sites and employer career pages. It fills repeat fields, attaches your résumé, uses your saved answers, and lets you review before submission.",
    },
    {
      q: "How much time does it save?",
      a: "Time saved depends on the length and complexity of the application. Propel reduces repetitive data entry by reusing your profile and saved answers, with the biggest benefit on longer, multi-step forms.",
    },
    {
      q: "Do I stay in control of what gets submitted?",
      a: "Yes. Propel keeps the application in your browser so you can check the role, résumé, fields, and answers before submission. You can step in whenever a page needs your judgment.",
    },
    {
      q: "Does Propel remember my answers?",
      a: "Yes. Propel can save an answer to a screening question and reuse it when the same question appears in a later application. You can review the answer before it is submitted.",
    },
    {
      q: "Which job sites does it work on?",
      a: "Propel supports LinkedIn Easy Apply and is built to complete multi-step applications on supported job sites and employer career pages. Support is not universal: forms change, and some sites, login checks, or unusual questions may still need your input.",
    },
    {
      q: "Why do I need both a desktop app and a Chrome extension?",
      a: "The extension acts inside the browser tab where the application form actually lives, while the desktop app runs the apply engine and holds your profile and résumé. Together they complete applications for you in your own browser.",
    },
    {
      q: "Is Propel free?",
      a: "Yes — the desktop app and the Propel Bridge Chrome extension are free to download and use.",
    },
    {
      q: "Is Propel affiliated with LinkedIn?",
      a: "No. Propel is an independent product and is not affiliated with or endorsed by LinkedIn or any other job site.",
    },
    {
      q: "What's coming next?",
      a: "Automatic résumé tailoring for each role, LinkedIn profile updates and posts, and auto-generated follow-up emails on the jobs you've applied to. These are on the roadmap — download Propel today to start auto-applying now.",
    },
    {
      q: "Is the desktop app signed?",
      a: "Yes. The Mac app is signed and notarized with an Apple Developer ID. The Windows installer is published too; it may still show Microsoft SmartScreen while the new installer builds reputation.",
    },
    {
      q: "Will Propel update itself?",
      a: "Yes. The packaged desktop app checks the public release feed on launch, downloads newer builds in the background, and shows a Restart to update banner when the update is ready.",
    },
  ],
} as const;
