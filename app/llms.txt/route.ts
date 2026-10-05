import { formatPrice, getCatalog } from "@/lib/plans";
import { site } from "@/lib/site";

export const revalidate = 3600;

export async function GET() {
  const catalog = await getCatalog();
  const plans = catalog.tiers
    .map((plan) => `- ${plan.name}: ${plan.kind === "free" ? "free" : `${formatPrice(plan)}/mo`}, ${plan.monthlyApplications} applications a month`)
    .join("\n");
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
your Chrome tab. Easy Apply works best; some Indeed listings open a flow Propel
can't finish, and it hands the page back to the user. Company career
sites and applicant tracking systems aren't covered yet.

Application pages change, and required unknown answers, email or login verification,
2FA, CAPTCHAs, or unsupported controls may require user input. Propel does not
promise that every form will complete automatically. Propel is independent and is
not affiliated with or endorsed by LinkedIn or any other job site.

## Why people use it

- Save a profile, résumé and answers once and reuse them on every application.
- Reduce repeated typing and résumé uploads.
- Reuse saved answers when the same screening question appears later.
- Move through supported multi-step application flows.
- Keep an application record without maintaining a separate tracker.
- Keep the application visible for review before submission.

## Product

Propel Extension is a Chrome extension, available in the Chrome Web Store:
${site.downloads.chrome}
The user reviews before final submission. A waitlist remains open on the homepage for people who are not ready to install.

## Pricing

An application counts only when Propel reaches the final submit step.

${plans}${catalog.extra ? `\n- Extra applications: ${formatPrice(catalog.extra)} each` : ""}

Details: ${site.url}/pricing

## Roadmap (coming soon)

${site.roadmap.map((r) => `- ${r.title}: ${r.body}`).join("\n")}

## Key URLs

- Website: ${site.url}
- Install Propel Extension: ${site.downloads.chrome}
- Propel Extension on the website (with the waitlist): ${site.url}/#extension-only
- Pricing: ${site.url}/pricing
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
