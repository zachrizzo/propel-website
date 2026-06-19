import type { Metadata } from "next";
import Aurora from "@/components/Aurora";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import { DownloadTrio } from "@/components/DownloadButtons";
import { site } from "@/lib/site";

const PATH = "/how-to-auto-apply-to-jobs";

export const metadata: Metadata = {
  title: "How to Auto-Apply to Jobs (Without Cutting Corners)",
  description:
    "A practical guide to automatically filling and submitting job applications on Workday, Greenhouse, Lever and company career sites — while you still review and approve every one.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "article",
    url: `${site.url}${PATH}`,
    title: "How to Auto-Apply to Jobs (Without Cutting Corners)",
    description:
      "Automatically fill and submit job applications on real career sites while staying in control. Here's how it works and how to set it up.",
  },
};

const SECTIONS = [
  {
    h: "What “auto-apply” actually means",
    p: [
      "Auto-applying to jobs means a tool completes the repetitive parts of an application for you — your name, contact details, work history, links, and the screener questions you answer the same way every time — instead of you retyping them into every form. The goal isn't to spray résumés blindly; it's to delete the data-entry tax so your energy goes to the parts that actually move a search forward: targeting the right roles, tailoring your story, and preparing for interviews.",
      "A single online application is typically 10–20 minutes of the same information. Across a real search that's hours per week of pure transcription. Auto-applying gives that time back.",
    ],
  },
  {
    h: "How Propel auto-applies — on the real site",
    p: [
      "Propel runs as a desktop app paired with a lightweight Chrome extension (Propel Bridge). When you open a job posting, Propel reads the live application form the way a person would, maps each field to your saved profile, and fills it in — then submits, with your approval. Because it works inside your own browser on the company's real career site, it handles applications that simple “one-click” tools can't.",
      "It also learns. The first time you answer a screener question, Propel remembers it and reuses the answer on every application after — so it never asks you the same thing twice, and it gets faster the more you use it.",
    ],
  },
  {
    h: "Which job sites does it work on?",
    p: [
      "Propel works across the major applicant-tracking systems — Workday, Greenhouse, Lever, Ashby, iCIMS, BambooHR and Taleo — plus most company career portals. If you can apply there in a browser, Propel can fill it.",
    ],
  },
  {
    h: "Staying in control",
    p: [
      "Automation only helps if you trust it. Propel keeps you in the loop: you can review every application before it's submitted, or let trusted ones run. Every application is yours to approve, and you decide what Propel is allowed to do in your browser.",
    ],
  },
  {
    h: "What's coming next",
    p: [
      "Applying is just the start. On the roadmap: automatic résumé tailoring for each role, keeping your LinkedIn profile current and publishing posts, and auto-drafting follow-up emails on the jobs you've applied to — so more of the busywork of a job search runs itself.",
    ],
  },
];

export default function Guide() {
  return (
    <main className="relative">
      <Nav />
      <article className="relative px-5 pb-24 pt-32 sm:pt-36">
        <Aurora />
        <div className="mx-auto max-w-3xl">
          <Reveal immediate>
            <p className="font-mono text-[11px] uppercase tracking-widest text-ember-400">Guide</p>
          </Reveal>
          <Reveal delay={0.06} immediate>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight text-cream sm:text-5xl balance">
              How to auto-apply to jobs <span className="text-gradient">without cutting corners</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12} immediate>
            <p className="mt-5 text-lg leading-relaxed text-iris-300/80">
              Automatically fill and submit job applications on the real company site — while you still review
              and approve every one. Here's how it works, and how to set it up in a couple of minutes.
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
              <h2 className="font-display text-2xl font-bold text-cream">Get your time back</h2>
              <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-iris-300/75">
                Install the desktop app and the Chrome bridge — free for Mac &amp; Windows. Two minutes to your
                first hands-free application.
              </p>
              <div className="mt-7">
                <DownloadTrio />
              </div>
              <p className="mt-6 text-[14px] text-iris-300/60">
                Or learn more on the{" "}
                <a href="/" className="text-iris-300 underline-offset-4 hover:underline">
                  Propel home page
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
