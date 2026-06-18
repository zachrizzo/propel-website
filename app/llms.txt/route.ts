import { site } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = `# ${site.productName}

${site.description}

## Product

Propel is the desktop app. Propel Job Agent is the public product name for search
and discovery. Propel Bridge is the Chrome extension that connects the browser to
the local desktop app. Together they fill job applications in the user's own
browser while the user stays in control.

## Key URLs

- Website: ${site.url}
- macOS download: ${site.downloads.mac}
- Windows download: ${site.downloads.windows}
- Chrome extension: ${site.downloads.chrome}
- Public releases: ${site.social.github}
- Privacy policy: ${site.url}/privacy

## Search Terms

Propel Job Agent, Propel, Propel Bridge, job application agent, auto apply jobs,
job application automation, Workday autofill, Greenhouse autofill, Lever autofill,
supervised AI job search assistant.
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
