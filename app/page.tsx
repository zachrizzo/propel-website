import Aurora from "@/components/Aurora";
import Nav from "@/components/Nav";
import HeroFlow from "@/components/HeroFlow";
import Reveal from "@/components/Reveal";
import Logo from "@/components/Logo";
import { PrimaryDownload, DownloadTrio } from "@/components/DownloadButtons";
import { site } from "@/lib/site";

const COVERAGE_EXAMPLES = [
  "Job boards",
  "Employer career sites",
  "ATS-hosted forms",
  "LinkedIn Easy Apply",
];

const REPEAT_WORK = [
  { label: "Saved once", value: "Profile & work history" },
  { label: "Attached for you", value: "Résumé & materials" },
  { label: "Reused when relevant", value: "Screening answers" },
  { label: "Kept organized", value: "Application records" },
];

const MANUAL_WORK = [
  "Retype your contact details and work history",
  "Find and upload the same résumé again",
  "Re-answer familiar screening questions",
  "Click through every page of a longer form",
  "Rebuild the application in your own tracker",
];

const PROPEL_WORK = [
  "Starts from your saved application profile",
  "Attaches your résumé and requested materials",
  "Reuses saved answers when the question matches",
  "Keeps moving through supported application steps",
  "Brings the completed flow back for your review",
  "Maintains a record of the application",
];

const FEATURES = [
  {
    t: "Fills your saved profile",
    d: "Propel maps your contact details, work history, links, and other saved information into the application in front of you.",
    i: "memory",
  },
  {
    t: "Attaches your materials",
    d: "It uploads your saved résumé and can handle requested application materials instead of making you browse for the same files again.",
    i: "file",
  },
  {
    t: "Reuses screening answers",
    d: "When a familiar question returns, Propel can use the answer you already saved rather than asking you to rewrite it.",
    i: "spark",
  },
  {
    t: "Works through longer forms",
    d: "The agent can move through supported multi-page flows, not just stop after filling the first screen.",
    i: "layers",
  },
  {
    t: "Keeps an application record",
    d: "See what you applied to, when, and where without rebuilding a separate tracking spreadsheet.",
    i: "chart",
  },
  {
    t: "Stops when you need control",
    d: "Review before submission, answer a question Propel cannot know, or take over for a verification step or unfamiliar control.",
    i: "check",
  },
];

const COVERAGE = [
  {
    label: "Job-board applications",
    title: "More than an Easy Apply tool",
    body: "Propel can work through supported application flows on job boards. LinkedIn Easy Apply is one example—not the limit of the product.",
  },
  {
    label: "Employer & ATS forms",
    title: "Follows the application off the listing",
    body: "When a role opens an ATS-hosted or employer career-site form, Propel can read the live application, fill mapped fields, attach materials, and move through supported steps.",
  },
  {
    label: "Visible in Chrome",
    title: "Never a black box",
    body: "The application stays in your browser. You can watch the agent work, review what it filled, and step in before anything is submitted.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Install Propel and its Chrome bridge",
    body: "The desktop app runs the agent and stores your application kit. The lightweight extension lets it work in the application tab you already have open.",
  },
  {
    n: "02",
    title: "Save your application kit once",
    body: "Add your profile, work history, résumé, links, and preferred screening answers so the next form starts with useful context.",
  },
  {
    n: "03",
    title: "Open a role you want",
    body: "Start from a job board or employer career site. Propel reads the live form, fills what it can support, attaches materials, and works through longer flows.",
  },
  {
    n: "04",
    title: "Review, step in if needed, and submit",
    body: "Check the completed application in your browser. Propel pauses when a required answer, verification check, or unfamiliar control needs you.",
  },
];

const homepageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HowTo",
      "@id": `${site.url}/#howto`,
      name: "How to complete job applications across job boards and employer career sites with Propel",
      description:
        "Save an application profile once, let Propel complete repeat work in supported browser-based job applications, and review before submission.",
      step: STEPS.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.title,
        text: step.body,
      })),
    },
    {
      "@type": "FAQPage",
      "@id": `${site.url}/#faq`,
      mainEntity: site.faq.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ],
};

function FeatureIcon({ name }: { name: string }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const paths: Record<string, JSX.Element> = {
    memory: <><path d="M12 3a9 9 0 1 0 9 9" /><path d="M12 7v5l3 2" /></>,
    file: <><path d="M14 3v5h5" /><path d="M6 3h8l5 5v13H6z" /><path d="M9 14h6M9 17h4" /></>,
    spark: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" /></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></>,
    check: <><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function ListIcon({ positive }: { positive: boolean }) {
  return (
    <span
      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
        positive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-600"
      }`}
      aria-hidden
    >
      {positive ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 12 4 4L19 6" />
        </svg>
      ) : (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="m7 7 10 10M17 7 7 17" />
        </svg>
      )}
    </span>
  );
}

export default function Home() {
  return (
    <main id="top" className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
      />
      <Nav />

      {/* ───────────────── HERO ───────────────── */}
      <section data-analytics-section="hero" className="relative px-5 pb-20 pt-32 sm:pt-36">
        <Aurora />
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal immediate>
              <span className="inline-flex items-center gap-2 rounded-full border border-iris-400/25 bg-iris-500/10 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-iris-300">
                <span className="h-1.5 w-1.5 rounded-full bg-ember-400" />
                Browser agent for job applications across the web
              </span>
            </Reveal>
            <Reveal delay={0.06} immediate>
              <h1 className="mt-6 max-w-2xl font-display text-5xl font-extrabold leading-[0.98] tracking-tight text-cream sm:text-6xl balance">
                Stop starting every job application from <span className="text-gradient">scratch.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.12} immediate>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-iris-300/80">
                Save your profile, résumé, and screening answers once. Propel uses them to fill
                applications, attach materials, and work through longer flows across job boards and
                employer career sites—then brings you in before anything is submitted.
              </p>
            </Reveal>
            <Reveal delay={0.18} immediate>
              <div className="mt-9">
                <PrimaryDownload />
              </div>
            </Reveal>
            <Reveal delay={0.24} immediate>
              <p className="mt-5 font-mono text-[12px] text-iris-300/55">
                Free · Mac &amp; Windows · Chrome · Review before submission
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="flex justify-center lg:justify-end" id="demo" immediate>
            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-iris-500/10 blur-2xl" />
              <HeroFlow />
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.26} immediate>
          <div className="mx-auto mt-16 max-w-6xl border-y border-iris-400/10 py-5">
            <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-iris-300/45">
              One agent beyond a single apply button
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
              {COVERAGE_EXAMPLES.map((item) => (
                <span key={item} className="inline-flex items-center gap-2 font-display text-sm font-semibold text-iris-300/75">
                  <span className="h-1.5 w-1.5 rounded-full bg-ember-400" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ───────────────── PRODUCT PROOF ───────────────── */}
      <section data-analytics-section="product-proof" className="relative px-5 pb-16">
        <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {REPEAT_WORK.map((item, index) => (
            <Reveal key={item.value} delay={index * 0.05}>
              <div className="ring-grad glass h-full rounded-2xl px-5 py-5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-ember-500">{item.label}</span>
                <p className="mt-2 font-display text-[16px] font-semibold text-cream">{item.value}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────────── WHY PROPEL ───────────────── */}
      <section id="why" data-analytics-section="why" className="relative px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-widest text-ember-500">Why download it</span>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl balance">
              The application changes. <span className="text-gradient">Your information doesn&apos;t.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-iris-300/75">
              Without an agent, every new form turns the same facts into fresh busywork. Propel carries
              your application context forward so you can spend time deciding where to apply—not rebuilding
              the same application.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-rose-200 bg-rose-50/70 p-7">
                <span className="font-mono text-[11px] uppercase tracking-widest text-rose-500">Every time, by hand</span>
                <h3 className="mt-3 font-display text-2xl font-semibold text-cream">Start over on another form</h3>
                <ul className="mt-6 space-y-3">
                  {MANUAL_WORK.map((item) => (
                    <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-iris-300/75">
                      <ListIcon positive={false} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="ring-grad glass h-full rounded-2xl p-7">
                <span className="font-mono text-[11px] uppercase tracking-widest text-emerald-700">With Propel</span>
                <h3 className="mt-3 font-display text-2xl font-semibold text-cream">Pick up with your context ready</h3>
                <ul className="mt-6 space-y-3">
                  {PROPEL_WORK.map((item) => (
                    <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-iris-300/75">
                      <ListIcon positive />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────────── FEATURES ───────────────── */}
      <section id="features" data-analytics-section="features" className="relative px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-widest text-ember-500">What it handles</span>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl balance">
              Take the repeat work <span className="text-gradient">off your plate.</span>
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, index) => (
              <Reveal key={feature.t} delay={(index % 3) * 0.06}>
                <div className="group ring-grad glass h-full rounded-2xl p-6 transition-transform hover:-translate-y-1">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-iris-500/15 text-iris-300 transition-colors group-hover:bg-iris-500/25 group-hover:text-iris-200">
                    <FeatureIcon name={feature.i} />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-cream">{feature.t}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-iris-300/70">{feature.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── VALUE BAND ───────────────── */}
      <section data-analytics-section="application-kit" className="relative px-5 py-12">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="ring-grad glass overflow-hidden rounded-3xl px-8 py-12 text-center sm:px-14">
              <span className="font-mono text-[11px] uppercase tracking-widest text-ember-500">Your application kit, carried forward</span>
              <p className="mx-auto mt-4 max-w-3xl font-display text-2xl font-semibold leading-snug text-cream sm:text-3xl balance">
                One profile. One résumé. Saved answers. Propel carries them into the next application
                so you don&apos;t rebuild everything from zero.
              </p>
              <a
                href="#download"
                data-analytics-download="download_section"
                className="mt-6 inline-flex font-display text-sm font-semibold text-iris-300 underline-offset-4 hover:underline"
              >
                Download Propel free →
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── COVERAGE ───────────────── */}
      <section id="coverage" data-analytics-section="coverage" className="relative px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-widest text-ember-500">Where it works</span>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl balance">
              Across job boards and <span className="text-gradient">employer career sites.</span>
            </h2>
            <p className="mt-5 max-w-3xl text-[16px] leading-relaxed text-iris-300/75">
              Propel works against the live application in Chrome instead of being locked to one fixed
              apply flow. That gives one agent room to handle supported board applications, ATS-hosted
              forms, and employer career pages.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {COVERAGE.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.07}>
                <div className="ring-grad glass h-full rounded-2xl p-7">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ember-500">{item.label}</span>
                  <h3 className="mt-3 font-display text-xl font-semibold text-cream">{item.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-iris-300/75">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-7 max-w-4xl rounded-2xl border border-amber-300/60 bg-amber-50 px-5 py-4 text-[14px] leading-relaxed text-amber-950/80">
              <strong className="font-semibold text-amber-950">Coverage follows the application, not just the listing.</strong>{" "}
              Forms vary. A required answer you have not provided, email or login verification, 2FA or
              CAPTCHA, or an unsupported control can pause the run and hand the page back to you. Propel
              does not promise that every form on every site will complete automatically.
            </div>
            <p className="mt-5 text-[14px] leading-relaxed text-iris-300/65">
              Read the{" "}
              <a href="/job-application-agent" className="font-medium text-iris-300 underline-offset-4 hover:underline">
                cross-site job application agent guide
              </a>{" "}
              for a deeper explanation of how coverage and handoffs work.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── HOW IT WORKS ───────────────── */}
      <section id="how" data-analytics-section="how-it-works" className="relative px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-widest text-ember-500">How it works</span>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl balance">
              From blank form to <span className="text-gradient">ready for review.</span>
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <Reveal key={step.n} delay={index * 0.06}>
                <div className="ring-grad glass h-full rounded-2xl p-6">
                  <div className="font-mono text-sm font-medium text-ember-500">{step.n}</div>
                  <h3 className="mt-3 font-display text-xl font-semibold text-cream">{step.title}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-iris-300/70">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-7 text-[14px] text-iris-300/65">
              Want the setup details?{" "}
              <a href="/how-to-auto-apply-to-jobs" className="font-medium text-iris-300 underline-offset-4 hover:underline">
                Follow the auto-apply setup guide
              </a>
              .
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── FAQ ───────────────── */}
      <section id="faq" data-analytics-section="faq" className="relative px-5 py-24">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2 className="text-center font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl">
              Questions before you download.
            </h2>
          </Reveal>
          <div className="mt-12 space-y-3">
            {site.faq.map((item, index) => (
              <Reveal key={item.q} delay={index * 0.035}>
                <details className="ring-grad glass group rounded-xl px-5 py-1 [&[open]]:bg-ink-700/40">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-display text-[17px] font-medium text-cream">
                    {item.q}
                    <span className="ml-4 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-iris-500/15 text-iris-300 transition-transform group-open:rotate-45">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </summary>
                  <p className="pb-5 pr-8 text-[15px] leading-relaxed text-iris-300/75">{item.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── DOWNLOAD ───────────────── */}
      <section id="download" data-analytics-section="download" className="relative px-5 py-24">
        <Aurora />
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-widest text-ember-500">Start once. Reuse from here.</span>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-cream sm:text-6xl balance">
              Your next application shouldn&apos;t start from <span className="text-gradient">scratch.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-iris-300/80">
              Download Propel free, save your application kit once, and let one browser agent take the
              repetitive work through supported job-board and employer-site forms.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-10">
              <DownloadTrio />
            </div>
          </Reveal>
          <Reveal delay={0.22}>
            <p className="mx-auto mt-6 max-w-2xl font-mono text-[12px] leading-relaxed text-iris-300/55">
              Start with the desktop app, then add Propel Bridge for Chrome. Mac is signed and notarized.
              Windows 10/11 may show SmartScreen while the installer builds reputation.
            </p>
          </Reveal>
        </div>
      </section>

      <footer className="relative border-t border-iris-400/10 px-5 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <Logo size={28} />
            <span className="ml-2 font-mono text-[12px] text-iris-300/40">© 2026</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[14px] text-iris-300/70">
            <a href="/privacy" className="transition-colors hover:text-cream">Privacy</a>
            <a href="/job-application-agent" className="transition-colors hover:text-cream">Job agent guide</a>
            <a href="/how-to-auto-apply-to-jobs" className="transition-colors hover:text-cream">Auto-apply guide</a>
            <a href="#faq" className="transition-colors hover:text-cream">FAQ</a>
            <a href={`mailto:${site.email}`} className="transition-colors hover:text-cream">Contact</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
