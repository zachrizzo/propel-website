import type { Metadata } from "next";
import Aurora from "@/components/Aurora";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import { DownloadTrio } from "@/components/DownloadButtons";
import { site } from "@/lib/site";

const PATH = "/job-application-agent";

export const metadata: Metadata = {
  title: "Browser Job Application Agent Across Job Sites",
  description:
    "See how Propel reuses your profile, résumé, and answers across supported job-board, ATS, and employer career-site applications while you stay in control.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "article",
    url: `${site.url}${PATH}`,
    title: "One Browser Agent for Job Applications Across the Web",
    description:
      "How Propel carries one saved application kit through supported job-board, ATS, and employer career-site forms, with review before submission.",
  },
};

const SECTIONS = [
  {
    title: "What is a job application agent?",
    body: "A job application agent completes repetitive work in your browser: entering contact details and work history, attaching a résumé and requested materials, reusing answers you have already provided, and moving through supported application steps. A useful agent should work across more than one application format while leaving role selection and final review with you.",
  },
  {
    title: "Why carrying your context forward matters",
    body: "The site and form may change, but your contact details, work history, résumé, links, and many screening answers do not. Propel turns those saved details into an application kit it can carry into the next supported flow, so each new role does not force you back to a blank form.",
  },
  {
    title: "Across job boards and employer career sites",
    body: "Propel works against the live application shown in Chrome rather than a single hardcoded apply button. On supported flows, the agent can read the form, map saved information into its fields, attach materials, advance through multiple pages, and bring the result back for review on job boards, ATS-hosted forms, and employer career sites.",
  },
  {
    title: "LinkedIn Easy Apply is one example",
    body: "Propel can complete supported LinkedIn Easy Apply flows with the same profile, résumé, and saved answers it uses elsewhere. Easy Apply is an example of the product's coverage, not its category or limit. Propel is an independent product and is not affiliated with or endorsed by LinkedIn.",
  },
  {
    title: "What about jobs found on Indeed?",
    body: "Indeed is available as a job source, but a listing may use an Indeed-hosted application or open a different employer or ATS form. Propel's completion coverage follows the application that opens, so it does not promise that every Indeed listing or flow will complete automatically.",
  },
  {
    title: "Where coverage has limits",
    body: "Application pages change. A required answer you have not provided, email or login verification, 2FA or CAPTCHA, or an unsupported form control may require you to step in. Propel keeps the page visible and hands control back instead of claiming universal coverage or guessing through a sensitive step.",
  },
  {
    title: "What to look for before using automation",
    body: "Use a tool that keeps the application visible, makes its data handling clear, maintains a useful record, and gives you a review point before submission. Automation should remove repeated work without replacing your judgment about the role, résumé, or answers you send.",
  },
];

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${site.url}${PATH}#article`,
  headline: "One Browser Agent for Job Applications Across the Web",
  description:
    "How Propel carries one saved application kit through supported job-board, ATS, and employer career-site forms, with review before submission.",
  mainEntityOfPage: `${site.url}${PATH}`,
  image: `${site.url}/opengraph-image`,
  datePublished: "2026-07-28",
  dateModified: "2026-07-28",
  author: { "@id": `${site.url}/#org` },
  publisher: { "@id": `${site.url}/#org` },
};

export default function JobApplicationAgent() {
  return (
    <main className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Nav />
      <article className="relative px-5 pb-24 pt-32 sm:pt-36">
        <Aurora />
        <div className="mx-auto max-w-3xl">
          <Reveal immediate>
            <p className="font-mono text-[11px] uppercase tracking-widest text-ember-500">Job search guide</p>
          </Reveal>
          <Reveal delay={0.06} immediate>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight text-cream sm:text-5xl balance">
              One browser agent for <span className="text-gradient">job applications across the web</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12} immediate>
            <p className="mt-5 text-lg leading-relaxed text-iris-300/80">
              Save your profile, résumé, and screening answers once. Propel carries them through supported
              job-board and employer-site applications—then keeps the result in front of you for review.
            </p>
          </Reveal>

          <div className="mt-12 space-y-10">
            {SECTIONS.map((section, index) => (
              <Reveal key={section.title} delay={index * 0.04}>
                <section>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-cream">{section.title}</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-iris-300/75">{section.body}</p>
                </section>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="ring-grad glass mt-14 rounded-2xl px-7 py-9 text-center">
              <h2 className="font-display text-2xl font-bold text-cream">Stop rebuilding the same application</h2>
              <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-iris-300/75">
                Propel is free to download for Mac and Windows. Save your application kit once, connect
                the Chrome bridge, and reuse that context across supported application flows.
              </p>
              <div className="mt-7">
                <DownloadTrio />
              </div>
              <p className="mt-6 text-[14px] text-iris-300/60">
                Want the setup walkthrough?{" "}
                <a href="/how-to-auto-apply-to-jobs" className="text-iris-300 underline-offset-4 hover:underline">
                  Read how to auto-apply to jobs
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
