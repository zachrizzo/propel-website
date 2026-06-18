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
  productName: "Propel Job Agent",
  tagline: "Auto-apply to jobs in your browser",
  description:
    "Propel auto-fills and submits job applications on real career sites — Workday, Greenhouse, Lever and company portals — so you stop retyping the same details. You review and approve every application.",
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
  // What's next — surfaced on the site and in structured data / llms.txt so the
  // roadmap is part of how the product is discovered and understood.
  roadmap: [
    {
      title: "Résumé tailoring",
      body: "Propel rewrites and tailors your résumé to each role automatically, so every application leads with what that job is looking for.",
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
      a: "Propel automatically fills out and submits job applications for you on real career sites. Instead of retyping your name, contact details, work history and screener answers into every form, Propel reads each application and completes it from your profile in seconds — and you review and approve before anything is submitted.",
    },
    {
      q: "How much time does it save?",
      a: "A single online application is usually 10–20 minutes of entering the same information. Propel does that part in seconds, on the real company site, so the hours you'd spend on forms go back into interviews, networking, and the work that actually lands the offer.",
    },
    {
      q: "Do I stay in control of what gets submitted?",
      a: "Always. You can review every application before it's submitted, or let trusted ones run automatically. Every application is yours to approve.",
    },
    {
      q: "Does Propel remember my answers?",
      a: "Yes. When you answer a screener question, Propel saves it and reuses it on future applications — so it never asks you the same thing twice and gets faster the more you use it.",
    },
    {
      q: "Which job sites does it work on?",
      a: "Propel works across the major applicant-tracking systems — Workday, Greenhouse, Lever, Ashby, iCIMS, BambooHR and Taleo — plus most company career portals.",
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
      q: "What's coming next?",
      a: "Automatic résumé tailoring for each role, LinkedIn profile updates and posts, and auto-generated follow-up emails on the jobs you've applied to. These are on the roadmap — download Propel today to start auto-applying now.",
    },
    {
      q: "Is the desktop app signed?",
      a: "The Mac app is signed and notarized with an Apple Developer ID. The Windows installer is published too; it may still show Microsoft SmartScreen while the new installer builds reputation.",
    },
    {
      q: "Will Propel update itself?",
      a: "Yes. The packaged desktop app checks the public release feed on launch, downloads newer builds in the background, and shows a Restart to update banner when the update is ready.",
    },
  ],
} as const;
