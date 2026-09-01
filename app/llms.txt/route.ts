import { site } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = `# ${site.productName}

${site.description}

## What it does

Propel is a browser agent for completing supported job applications. In beta, it
fills LinkedIn Easy Apply and supported Indeed applications in your Chrome tab.
It uses a saved profile to fill repeat fields, attach a résumé and requested
materials, reuse saved screening answers, move through supported steps, and maintain
an application record. The application stays visible in the user's browser for
review before submission.

## Beta coverage

In beta, Propel fills LinkedIn Easy Apply and supported Indeed applications in
your Chrome tab. Easy Apply is the main working path. Indeed is a job source;
some listings open a flow Propel cannot finish, and it hands the page back. Not
ATS-wide or employer career-site yet.

Application pages change, and required unknown answers, email or login verification,
2FA, CAPTCHAs, or unsupported controls may require user input. Propel does not
promise that every form will complete automatically. Propel is independent and is
not affiliated with or endorsed by LinkedIn or any other job site.

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
while the user stays in control. The desktop app is free to install for macOS.
Application attempts are included in Starter, which is $19/mo for 20 application
attempts. The Windows installer is not currently available.

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
