import { site } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = `# ${site.productName}

${site.description}

## What it does

Propel is a browser agent for completing supported job applications across job
boards, ATS-hosted forms, and employer career sites. It uses a saved profile to
fill repeat fields, attach a résumé and requested materials, reuse saved screening
answers, move through longer flows, and maintain an application record. The
application stays visible in the user's browser for review before submission.

## Application types

- Job-board applications: Propel can work through supported application flows on
  job boards. LinkedIn Easy Apply is one example, not the product boundary.
- Employer and ATS applications: Propel can continue through supported multi-page
  forms on employer career sites and ATS-hosted pages using the same profile.
- Jobs found on Indeed: Indeed is available as a job source, but completion
  coverage varies because listings can use different Indeed-hosted flows or open
  an external employer or ATS form. Propel does not promise every Indeed
  application will complete automatically.

Propel does not claim to work on every site or form. Application pages change,
and required unknown answers, email or login verification, 2FA, CAPTCHAs, or
unsupported controls may require user input. Propel is independent and is not
affiliated with or endorsed by LinkedIn or any other job site.

## Why people use it

- Use one saved application kit across job-board and employer-site forms.
- Reduce repeated typing and résumé uploads.
- Reuse saved answers when the same screening question appears later.
- Move through supported multi-step application flows.
- Keep an application record without maintaining a separate tracker.
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
cross-site job application agent, employer career site autofill, ATS form agent,
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
