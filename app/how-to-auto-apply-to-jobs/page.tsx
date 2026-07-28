import type { Metadata } from "next";
import Aurora from "@/components/Aurora";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import { DownloadTrio } from "@/components/DownloadButtons";
import { site } from "@/lib/site";

const PATH = "/how-to-auto-apply-to-jobs";

export const metadata: Metadata = {
  title: "How to Auto-Apply on LinkedIn and Multi-Step Job Sites",
  description:
    "Set up one workflow for LinkedIn Easy Apply and supported multi-step applications on other job sites, with a saved profile and review before submission.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "article",
    url: `${site.url}${PATH}`,
    title: "How to Auto-Apply on LinkedIn and Multi-Step Job Sites",
    description:
      "A practical setup guide for using Propel across LinkedIn Easy Apply and supported multi-step job applications.",
  },
};

const SECTIONS = [
  {
    h: "What “auto-apply” actually means",
    p: [
      "Auto-applying means letting a tool complete the repetitive parts of an application—contact details, work history, links, résumé uploads, and familiar screening questions—from information you have already provided. The goal is to remove repeated typing while you still choose the role and review what will be submitted.",
      "A useful workflow should also account for the two paths job seekers commonly encounter: a compact Easy Apply flow and a longer application that moves through several pages on another site.",
    ],
  },
  {
    h: "1. Save your application profile",
    p: [
      "Add your contact details, work history, résumé, links, and preferred answers in the Propel desktop app. This becomes the shared source for both LinkedIn Easy Apply and supported multi-step applications, so you do not need to create a separate profile for each path.",
    ],
  },
  {
    h: "2. Connect the application in Chrome",
    p: [
      "Install the Propel Bridge extension and pair it with the desktop app. The extension works with the application shown in your browser, while the desktop app provides your saved profile and runs the application workflow.",
    ],
  },
  {
    h: "3. Start with LinkedIn Easy Apply",
    p: [
      "Open a role that uses LinkedIn Easy Apply. Propel reads the flow, fills fields it can map to your profile, attaches the requested résumé, and uses saved answers when familiar questions appear. Review the role and completed fields before submitting. Propel is not affiliated with or endorsed by LinkedIn.",
    ],
  },
  {
    h: "4. Continue through a supported multi-step application",
    p: [
      "When a role opens a longer form on another supported job site or employer career page, use the same Propel profile. The agent can move through multiple pages, fill repeat fields, attach your résumé, and carry saved answers forward until the application is ready for review.",
      "Support is not universal. Form designs change, and login checks, CAPTCHAs, uncommon controls, or role-specific questions may require your input. If Propel cannot confidently complete a step, take over in the browser and check the remaining fields.",
    ],
  },
  {
    h: "5. Review before submission",
    p: [
      "Check the employer, role, selected résumé, contact details, and screening answers before anything is sent. The strongest use of application automation is deliberate: choose relevant roles, let the agent remove repetitive work, and keep your judgment at the final step.",
    ],
  },
];

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": `${site.url}${PATH}#howto`,
  name: "How to auto-apply on LinkedIn and multi-step job sites with Propel",
  description:
    "Set up one saved profile for LinkedIn Easy Apply and supported multi-step applications on other job sites, then review before submission.",
  url: `${site.url}${PATH}`,
  step: SECTIONS.slice(1).map((section, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: section.h.replace(/^\d+\.\s*/, ""),
    text: section.p.join(" "),
  })),
};

export default function Guide() {
  return (
    <main className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <Nav />
      <article className="relative px-5 pb-24 pt-32 sm:pt-36">
        <Aurora />
        <div className="mx-auto max-w-3xl">
          <Reveal immediate>
            <p className="font-mono text-[11px] uppercase tracking-widest text-ember-400">Guide</p>
          </Reveal>
          <Reveal delay={0.06} immediate>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight text-cream sm:text-5xl balance">
              How to auto-apply on <span className="text-gradient">LinkedIn and multi-step job sites</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12} immediate>
            <p className="mt-5 text-lg leading-relaxed text-iris-300/80">
              Set up one saved profile, use it for LinkedIn Easy Apply and supported multi-step
              applications on other job sites, and review before submission.
            </p>
          </Reveal>

          <div className="mt-12 space-y-10">
            {SECTIONS.map((s, i) => (
              <Reveal key={s.h} delay={i * 0.04}>
                <section>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-cream">{s.h}</h2>
                  {s.p.map((para, j) => (
                    <p key={j} className="mt-3 text-[15px] leading-relaxed text-iris-300/75">
                      {para}
                    </p>
                  ))}
                </section>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="ring-grad glass mt-14 rounded-2xl px-7 py-9 text-center">
              <h2 className="font-display text-2xl font-bold text-cream">Use one profile across both paths</h2>
              <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-iris-300/75">
                Install the desktop app and Chrome bridge for Mac or Windows, save your information,
                and keep the application visible for final review.
              </p>
              <div className="mt-7">
                <DownloadTrio />
              </div>
              <p className="mt-6 text-[14px] text-iris-300/60">
                Or read what to expect from a{" "}
                <a href="/job-application-agent" className="text-iris-300 underline-offset-4 hover:underline">
                  cross-site job application agent
                </a>
                .
              </p>
            </div>
          </Reveal>
        </div>
      </article>
    </main>
  );
}
