import type { Metadata } from "next";
import Aurora from "@/components/Aurora";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import { DownloadTrio } from "@/components/DownloadButtons";
import { site } from "@/lib/site";

const PATH = "/job-application-agent";

export const metadata: Metadata = {
  title: "Easy Apply & Multi-Step Job Application Agent",
  description:
    "See how one AI job application agent can complete LinkedIn Easy Apply and supported multi-step applications on other job sites while keeping you in control.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "article",
    url: `${site.url}${PATH}`,
    title: "One Job Application Agent for Easy Apply and Multi-Step Forms",
    description:
      "How Propel uses one saved profile for LinkedIn Easy Apply and supported multi-step job applications, with review before submission.",
  },
};

const SECTIONS = [
  {
    title: "What is a job application agent?",
    body: "A job application agent completes repetitive application work in your browser: entering contact details, reusing work history, attaching a résumé, and answering from information you have already provided. A useful agent should work across more than one application format while leaving role selection and final review with you.",
  },
  {
    title: "Why one workflow matters",
    body: "A job search rarely stays inside one application type. Some roles use LinkedIn Easy Apply; others open a longer form on a job site or employer career page. Propel is designed to use the same saved profile, résumé, and answers for both paths, so you do not have to rebuild your application context when the form changes.",
  },
  {
    title: "LinkedIn Easy Apply",
    body: "For an Easy Apply role, Propel reads the application shown in LinkedIn, fills mapped fields from your profile, attaches your résumé where requested, and uses saved answers for familiar screening questions. You can review the completed flow before submission. Propel is an independent product and is not affiliated with or endorsed by LinkedIn.",
  },
  {
    title: "Multi-step applications on other job sites",
    body: "On supported job sites and employer career pages, Propel can continue through multiple application pages, map your saved information to the fields it finds, attach your résumé, and carry answers forward until the application is ready for review. This is the same agent and profile used for Easy Apply, not a separate workflow.",
  },
  {
    title: "Where support has limits",
    body: "Propel does not claim to work on every job site or every form. Application pages change, and login checks, CAPTCHAs, unusual widgets, or role-specific questions may require you to step in. Support should be evaluated on the application in front of you, and you should always review the information before it is sent.",
  },
  {
    title: "What to look for before using automation",
    body: "Use a tool that keeps the application visible, makes its data handling clear, and gives you a review point before submission. Automation should remove repeated typing without replacing your judgment about the role, résumé, or answers you send.",
  },
];

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${site.url}${PATH}#article`,
  headline: "One Job Application Agent for Easy Apply and Multi-Step Forms",
  description:
    "How Propel uses one saved profile for LinkedIn Easy Apply and supported multi-step job applications, with review before submission.",
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
              One AI agent for <span className="text-gradient">Easy Apply and multi-step applications</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12} immediate>
            <p className="mt-5 text-lg leading-relaxed text-iris-300/80">
              Propel handles LinkedIn Easy Apply and supported multi-step forms on other job sites with
              the same saved profile—then keeps the application in front of you for review.
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
              <h2 className="font-display text-2xl font-bold text-cream">Keep one application workflow</h2>
              <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-iris-300/75">
                Propel is free to download for Mac and Windows. Set up your profile once, connect the
                Chrome bridge, and use it for Easy Apply and supported multi-step forms.
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
