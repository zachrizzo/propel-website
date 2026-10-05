import Aurora from "@/components/Aurora";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";
import { jsonLd } from "@/lib/json-ld";
import { publicPageMetadata } from "@/lib/seo";

const PATH = "/job-application-agent";

export const metadata = publicPageMetadata({
  title: "Job Application Agent for LinkedIn Easy Apply and Indeed",
  description: "Explore Propel’s Chrome extension for supported job applications, saved answers and an optional review before submission. Available in the Chrome Web Store.",
  path: PATH,
  article: true,
});

const SECTIONS = [
  {
    title: "What is a job application agent?",
    body: "A job application agent completes repetitive work in your browser: entering contact details and work history, attaching a résumé and requested materials, reusing answers you have already provided, and moving through supported application steps. A useful agent should leave role selection with you, and let you choose whether to review each application before it is submitted.",
  },
  {
    title: "Why carrying your context forward matters",
    body: "Your contact details, work history, résumé, links, and many screening answers do not change. Propel keeps those saved details as a profile it can carry into the next supported flow, so each new role does not force you back to a blank form.",
  },
  {
    title: "Beta coverage: LinkedIn Easy Apply and supported Indeed",
    body: "In beta, Propel fills LinkedIn Easy Apply and supported Indeed applications in your Chrome tab. Easy Apply works best; some Indeed listings open a flow Propel can't finish, and it hands the page back to you. Company career sites and applicant tracking systems aren't covered yet.",
  },
  {
    title: "Where coverage has limits",
    body: "A required answer you have not provided, email or login verification, 2FA or CAPTCHA, or an unsupported control may require you to step in. Propel keeps the page visible and hands control back instead of guessing.",
  },
  {
    title: "What to look for before using automation",
    body: "Use a tool that keeps the application visible, makes its data handling clear, maintains a useful record, and lets you choose whether to review before submission. Automation should remove repeated work without replacing your judgment about the role, résumé, or answers you send.",
  },
];

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${site.url}${PATH}#article`,
  headline: "Job Application Agent for LinkedIn Easy Apply and Indeed",
  description:
    "How Propel fills LinkedIn Easy Apply and supported Indeed applications in your Chrome tab, with an auto-submit setting you can turn off to review each application first.",
  mainEntityOfPage: `${site.url}${PATH}`,
  image: `${site.url}/opengraph-image`,
  datePublished: "2026-07-28",
  dateModified: "2026-10-02",
  author: { "@id": `${site.url}/#org` },
  publisher: { "@id": `${site.url}/#org` },
};

export default function JobApplicationAgent() {
  return (
    <main className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(articleJsonLd) }}
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
              Job application agent for <span className="text-gradient">LinkedIn Easy Apply and Indeed</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12} immediate>
            <p className="mt-5 text-lg leading-relaxed text-mist">
              Save your profile, résumé, and screening answers once. Propel fills LinkedIn Easy Apply and supported Indeed applications in your Chrome tab—and, with auto-submit off, keeps the result in front of you to review and submit.
            </p>
          </Reveal>

          <div className="mt-12 space-y-10">
            {SECTIONS.map((section, index) => (
              <Reveal key={section.title} delay={index * 0.04}>
                <section>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-cream">{section.title}</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-mist">{section.body}</p>
                </section>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="ring-grad glass mt-14 rounded-2xl px-7 py-9 text-center">
              <h2 className="font-display text-2xl font-bold text-cream">Stop rebuilding the same application</h2>
              <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-mist">
                Propel Extension is available in the Chrome Web Store for supported job applications in Chrome.
              </p>
              <p className="mt-6 text-[14px] text-fog">
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
      <Footer />
    </main>
  );
}
