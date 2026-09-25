import type { Metadata } from "next";
import Aurora from "@/components/Aurora";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import { DownloadTrio } from "@/components/DownloadButtons";
import { site } from "@/lib/site";

const PATH = "/how-to-auto-apply-to-jobs";

export const metadata: Metadata = {
  title: "How to Auto-Apply to LinkedIn Easy Apply and Indeed",
  description:
    "Save your profile once for LinkedIn Easy Apply and supported Indeed applications, with your review before submission.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "article",
    url: `${site.url}${PATH}`,
    title: "How to Auto-Apply to LinkedIn Easy Apply and Indeed",
    description:
      "A practical setup guide for using Propel with LinkedIn Easy Apply and supported Indeed applications.",
  },
};

const SECTIONS = [
  {
    h: "What “auto-apply” actually means",
    p: [
      "Auto-applying means letting a tool complete the repetitive parts of an application—contact details, work history, links, résumé uploads, and familiar screening questions—from information you have already provided. The goal is to remove repeated typing while you still choose the role and review what will be submitted.",
    ],
  },
  {
    h: "1. Save your application profile",
    p: [
      "Add your contact details, work history, résumé, links, and preferred answers in the Propel desktop app. This becomes the saved profile Propel can reuse.",
    ],
  },
  {
    h: "2. Connect the application in Chrome",
    p: [
      "Install the Propel Bridge extension and pair it with the desktop app. The extension works with the application shown in your browser, while the desktop app provides your saved profile and runs the application workflow.",
    ],
  },
  {
    h: "3. Open a role you want to apply for",
    p: [
      "Start from LinkedIn or Indeed and open the actual application. In beta, Propel fills LinkedIn Easy Apply and supported Indeed applications in your Chrome tab. Easy Apply works best; some Indeed listings open a flow Propel can't finish, and it hands the page back to you. Company career sites and applicant tracking systems aren't covered yet.",
    ],
  },
  {
    h: "4. Let Propel handle the repeat work",
    p: [
      "Propel reads the live form, fills your saved details, attaches requested materials, reuses saved answers when they match, and moves through supported steps. It also keeps a record of the application so you do not have to rebuild your own tracker.",
    ],
  },
  {
    h: "5. Review before submission",
    p: [
      "Check the employer, role, selected résumé, contact details, and screening answers before anything is sent. If a required answer is unknown, or email or login verification, 2FA or CAPTCHA, or an unsupported control appears, take over in the browser and continue when the page is ready.",
    ],
  },
];

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": `${site.url}${PATH}#howto`,
  name: "How to auto-apply to LinkedIn Easy Apply and Indeed with Propel",
  description:
    "Save your profile once for LinkedIn Easy Apply and supported Indeed applications, then review before submission.",
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
              How to auto-apply to <span className="text-gradient">LinkedIn Easy Apply and Indeed</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12} immediate>
            <p className="mt-5 text-lg leading-relaxed text-mist">
              Save your profile once, fill LinkedIn Easy Apply and supported Indeed applications in your Chrome tab, and keep the final review in your hands.
            </p>
          </Reveal>

          <div className="mt-12 space-y-10">
            {SECTIONS.map((s, i) => (
              <Reveal key={s.h} delay={i * 0.04}>
                <section>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-cream">{s.h}</h2>
                  {s.p.map((para, j) => (
                    <p key={j} className="mt-3 text-[15px] leading-relaxed text-mist">
                      {para}
                    </p>
                  ))}
                </section>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="ring-grad glass mt-14 rounded-2xl px-7 py-9 text-center">
              <h2 className="font-display text-2xl font-bold text-cream">Make the next application easier</h2>
              <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-mist">
                Install the desktop app and Chrome extension, save your profile once, and let Propel fill LinkedIn Easy Apply and supported Indeed applications in your Chrome tab while the page stays visible for review.
              </p>
              <div className="mt-7">
                <DownloadTrio />
              </div>
              <p className="mt-6 text-[14px] text-fog">
                Or read what to expect from a{" "}
                <a href="/job-application-agent" className="text-iris-300 underline-offset-4 hover:underline">
                  job application agent
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
