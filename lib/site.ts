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
  tagline: "Never start another job application from scratch",
  description:
    // Search results show about 155 characters.
    "Propel Extension for Chrome prepares job applications from your saved profile and answers. Get it from the Chrome Web Store. Turn off auto-submit to review and submit each application yourself.",
  // The public custom domain is the canonical SEO identity for the site.
  url: siteUrl,
  // Website-owned download routes. They never send users directly to GitHub
  // unless a public installer asset is confirmed to exist.
  downloads: {
    mac: `${siteUrl}/download/mac`,
    windows: `${siteUrl}/download/windows`,
    chrome: "https://chromewebstore.google.com/detail/propel-extension/imggbmnonbcnkfmdghfedfadijfjdfkj",
  },
  downloadAvailability: {
    mac: true,
    windows: false,
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
      q: "Which job sites does Propel work on?",
      a: "In beta, LinkedIn Easy Apply and supported Indeed applications, in your Chrome tab. Easy Apply works best. Some Indeed listings open a flow Propel can't finish, and it hands the page back to you. Company career sites and applicant tracking systems aren't covered yet.",
    },
    {
      q: "Do I stay in control of what gets submitted?",
      a: "Yes. Propel keeps the application visible in your browser so you can check the role, résumé, fields, and answers before submission. You can step in whenever a page needs your judgment.",
    },
    {
      q: "What happens when Propel cannot complete a step?",
      a: "It asks instead of guessing. A required question you haven't answered before, an email or login check, 2FA, a CAPTCHA or an unfamiliar form control pauses the run until you step in.",
    },
    {
      q: "Does Propel remember my answers?",
      a: "Yes. Propel can save an answer to a screening question and reuse it when the same question appears in a later application. You can review the answer before it is submitted.",
    },
    {
      q: "What does Propel do with my data?",
      a: "Your profile and saved answers are stored in your Propel account. In the extension, a sign-in session and local task records are stored in Chrome. For requested AI planning, relevant application-page context is sent through Propel's authenticated Supabase service to OpenAI and Jev. When visual help is needed, a screenshot of the visible application tab may be sent to OpenAI; it may contain personal information visible on that page. The details are in the privacy policy at propeljobagent.com/privacy.",
    },
    {
      q: "Where can I install Propel Extension?",
      a: "Propel Extension is available in the Chrome Web Store. Add it to Chrome, open its side panel on an application page and sign in to your Propel account. Auto-submit is on by default; turn it off in Settings to review and submit each application yourself. If you would rather wait, the waitlist on the homepage is still open.",
    },
    {
      q: "Is Propel free?",
      a: "The Free plan includes a monthly allowance of applications. Paid plans add more; current prices are at propeljobagent.com/pricing. Propel Extension is available in the Chrome Web Store.",
    },
    {
      q: "How much time does it save?",
      a: "It depends on the application. Propel removes the repeated typing, uploads, familiar questions, page-by-page clicking and record keeping that add up across a job search. Longer, multi-step forms save the most.",
    },
    {
      q: "Is Propel affiliated with LinkedIn?",
      a: "No. Propel is an independent product and is not affiliated with or endorsed by LinkedIn or any other job site.",
    },
  ],
} as const;
