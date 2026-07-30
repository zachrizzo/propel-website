// Central config for the Propel marketing site.
// Primary/canonical domain. The legacy propel-website-pi.vercel.app alias stays
// live (it's the privacy URL published in the Chrome Web Store listing).
export const siteUrl = "https://propeljobagent.com";

// Permanent public destination assigned to Propel Job Agent in Partner Center.
export const windowsStoreUrl = "https://apps.microsoft.com/detail/9NTPPP7RFTC5";

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
  tagline: "Never start another job application from scratch",
  description:
    "Stop retyping job applications. Propel reuses your profile, résumé, and saved answers across job boards and employer career sites, with review before submission.",
  // The public custom domain is the canonical SEO identity for the site.
  url: siteUrl,
  // Primary acquisition destinations. The Windows Store URL is intentionally
  // stable across releases; the legacy installer route remains available for
  // existing direct-install users and support.
  downloads: {
    mac: `${siteUrl}/download/mac`,
    windows: windowsStoreUrl,
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
  // What's next — kept in llms.txt so the roadmap remains documented without
  // interrupting the homepage's current-product conversion path.
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
      q: "What does Propel take off my plate?",
      a: "Propel handles the repeat application work: filling from your saved profile and work history, attaching your résumé and requested materials, reusing saved screening answers when they match, moving through supported multi-step forms, and keeping an application record. You choose the role and review before anything is submitted.",
    },
    {
      q: "Which job sites and forms can Propel handle?",
      a: "Propel is built for browser-based applications across job boards, ATS-hosted forms, and employer career sites. Coverage follows the live application rather than only the listing's site name. Forms change, so Propel does not promise every form on every website will complete automatically.",
    },
    {
      q: "Does Propel work with jobs found on Indeed?",
      a: "Indeed is available as a job source, but Propel does not currently promise completion of every Indeed application. Some listings use an Indeed-hosted flow; others open an employer or ATS form. Propel follows the application that opens when it supports the form, and hands control back if it reaches a flow or verification step it cannot complete reliably.",
    },
    {
      q: "Does Propel only work with LinkedIn Easy Apply?",
      a: "No. LinkedIn Easy Apply is one application flow Propel can handle, not the product's boundary. The same browser agent is built to work through supported multi-step applications on other job boards, ATS-hosted forms, and employer career sites.",
    },
    {
      q: "Do I stay in control of what gets submitted?",
      a: "Yes. Propel keeps the application visible in your browser so you can check the role, résumé, fields, and answers before submission. You can step in whenever a page needs your judgment.",
    },
    {
      q: "What happens when Propel cannot complete a step?",
      a: "Propel pauses or hands the page back to you instead of guessing. A required answer you have not provided, email or login verification, 2FA or CAPTCHA, or an unsupported form control may need your input before the application can continue.",
    },
    {
      q: "Does Propel remember my answers?",
      a: "Yes. Propel can save an answer to a screening question and reuse it when the same question appears in a later application. You can review the answer before it is submitted.",
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
      q: "How much time does it save?",
      a: "Time saved depends on the application. Propel removes the repeated typing, uploads, familiar questions, page navigation, and record keeping that add up across a job search, with the biggest benefit on longer, multi-step forms.",
    },
    {
      q: "Is Propel affiliated with LinkedIn?",
      a: "No. Propel is an independent product and is not affiliated with or endorsed by LinkedIn or any other job site.",
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
