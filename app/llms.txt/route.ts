import { site } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = `# ${site.productName}

${site.description}

## What it does

Propel automatically fills out and submits job applications on real career sites.
Instead of retyping the same name, contact details, work history, and screener
answers into every application, Propel reads each form and completes it from your
profile in seconds. You review and approve every application before it is
submitted. Propel remembers each answer you give and reuses it on future
applications, so it never asks the same question twice. A single application is
typically 10–20 minutes of repetitive data entry; Propel does that part in seconds
so your time goes to interviews, networking, and the work that lands the offer.

## Why people use it

- Stop retyping the same details into every job application form.
- Apply to far more roles in the same amount of time.
- Stay in control — review before submit, or let trusted applications run.
- Get faster over time — Propel learns your answers and reuses them.

## Product

Propel is the desktop app. Propel Job Agent is the public product name for search
and discovery. Propel Bridge is the Chrome extension that connects the browser to
the desktop app. Together they fill job applications in the user's own browser
while the user stays in control. Free to download for macOS and Windows.

## Supported sites

Workday, Greenhouse, Lever, Ashby, iCIMS, BambooHR, Taleo, and most company career
portals.

## Roadmap (coming soon)

${site.roadmap.map((r) => `- ${r.title}: ${r.body}`).join("\n")}

## Key URLs

- Website: ${site.url}
- macOS download: ${site.downloads.mac}
- Windows download: ${site.downloads.windows}
- Chrome extension: ${site.downloads.chrome}
- Public releases: ${site.social.github}
- Privacy policy: ${site.url}/privacy

## FAQ

${site.faq.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}

## Search Terms

Propel Job Agent, Propel, Propel Bridge, job application agent, auto apply jobs,
job application automation, autofill job applications, save time on job
applications, Workday autofill, Greenhouse autofill, Lever autofill, AI job search
assistant.
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
