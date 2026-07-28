import { site } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = `# ${site.productName}

${site.description}

## What it does

Propel is one AI job application agent for LinkedIn Easy Apply and supported
multi-step applications on other job sites and employer career pages. It uses a
saved profile to fill repeat fields, attach a résumé, and use saved answers in the
application shown in the user's browser. The user can review the role, fields,
résumé, and answers before submission.

## Application types

- LinkedIn Easy Apply: Propel completes the compact application flow using the
  user's saved profile and answers.
- Supported multi-step applications: Propel can continue through multiple pages
  on other job sites and employer career pages using the same profile.

Propel does not claim to work on every site or form. Application pages change,
and login checks, CAPTCHAs, uncommon controls, or role-specific questions may
require user input. Propel is independent and is not affiliated with or endorsed
by LinkedIn or any other job site.

## Why people use it

- Use one saved profile across Easy Apply and longer application forms.
- Reduce repeated typing and résumé uploads.
- Reuse saved answers when the same screening question appears later.
- Keep the application visible for review before submission.

## Product

Propel is the desktop app. Propel Job Agent is the public product name for search
and discovery. Propel Bridge is the Chrome extension that connects the browser to
the desktop app. Together they fill job applications in the user's own browser
while the user stays in control. The desktop app is free to download for macOS
and Windows.

## Roadmap (coming soon)

${site.roadmap.map((r) => `- ${r.title}: ${r.body}`).join("\n")}

## Key URLs

- Website: ${site.url}
- macOS download: ${site.downloads.mac}
- Windows download: ${site.downloads.windows}
- Chrome extension: ${site.downloads.chrome}
- Public releases: ${site.social.github}
- Privacy policy: ${site.url}/privacy
- Job application agent guide: ${site.url}/job-application-agent
- Auto-apply setup guide: ${site.url}/how-to-auto-apply-to-jobs

## FAQ

${site.faq.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}

## Topics

Propel Job Agent, Propel, Propel Bridge, job application agent, auto apply jobs,
LinkedIn Easy Apply automation, multi-step job application automation, browser job
application agent, job application autofill.
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
