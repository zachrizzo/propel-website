import type { Metadata } from "next";
import Aurora from "@/components/Aurora";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import { DownloadTrio } from "@/components/DownloadButtons";
import { site } from "@/lib/site";

const PATH = "/job-application-agent";

export const metadata: Metadata = {
  title: "AI Job Application Agent to Auto-Apply Faster",
  description:
    "Learn what an AI job application agent does, how Propel helps you auto-fill job applications in your own browser, and how to stay in control while applying faster.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "article",
    url: `${site.url}${PATH}`,
    title: "AI Job Application Agent to Auto-Apply Faster",
    description:
      "A practical guide to using an AI job application agent to reduce repetitive application work while keeping every submission under your control.",
  },
};

const SECTIONS = [
  {
    title: "What is a job application agent?",
    body: "A job application agent helps with the repetitive work of applying: entering contact details, reusing work history, attaching a résumé, and answering questions you have already answered before. It should free up time for choosing the right roles, tailoring your story, networking, and preparing for interviews—not replace your judgment.",
  },
  {
    title: "How Propel helps you apply faster",
    body: "Propel runs as a desktop app paired with a Chrome extension. When you open an application in your own browser, it reads the live form, maps your saved profile to the right fields, and helps complete it. It remembers answers you give to screening questions so you do not have to retype them on the next application.",
  },
  {
    title: "LinkedIn, Indeed, and career-site applications",
    body: "Job seekers often look for a LinkedIn agent, an Indeed auto-apply tool, or help with company career pages. Propel is designed to work where you are already applying in your browser, including job boards and applicant-tracking-system forms. It is not affiliated with LinkedIn, Indeed, or any employer; you choose the jobs and retain control over what is submitted.",
  },
  {
    title: "What to look for before using automation",
    body: "Use a tool that lets you review information before it goes out, makes its data handling clear, and helps you maintain quality rather than encouraging blind mass applications. The best application workflow is still deliberate: target relevant roles, check each résumé and answer, then submit with confidence.",
  },
];

export default function JobApplicationAgent() {
  return (
    <main className="relative">
      <Nav />
      <article className="relative px-5 pb-24 pt-32 sm:pt-36">
        <Aurora />
        <div className="mx-auto max-w-3xl">
          <Reveal immediate>
            <p className="font-mono text-[11px] uppercase tracking-widest text-ember-500">Job search guide</p>
          </Reveal>
          <Reveal delay={0.06} immediate>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight text-cream sm:text-5xl balance">
              What an <span className="text-gradient">AI job application agent</span> should do for you
            </h1>
          </Reveal>
          <Reveal delay={0.12} immediate>
            <p className="mt-5 text-lg leading-relaxed text-iris-300/80">
              Applying for a job should not mean re-entering the same information all day. Here is how
              application automation can save time while leaving the important decisions with you.
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
              <h2 className="font-display text-2xl font-bold text-cream">Spend less time on forms</h2>
              <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-iris-300/75">
                Propel is free to download for Mac and Windows. Set up your profile once, then use it
                in your own browser while you review and approve every application.
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
