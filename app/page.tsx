import Aurora from "@/components/Aurora";
import Nav from "@/components/Nav";
import HeroFlow from "@/components/HeroFlow";
import Reveal from "@/components/Reveal";
import Logo from "@/components/Logo";
import { PrimaryDownload, DownloadTrio } from "@/components/DownloadButtons";
import { site } from "@/lib/site";

const APPLICATION_SCOPE = [
  "LinkedIn Easy Apply",
  "Supported job sites",
  "Employer career pages",
  "Multi-page forms",
  "Résumé uploads",
  "Screening questions",
];

const STEPS = [
  {
    n: "01",
    title: "Add your profile once",
    body: "Install the desktop app and save your details, résumé, and preferred answers. Propel uses that profile as the starting point for later applications.",
  },
  {
    n: "02",
    title: "Add the Chrome bridge",
    body: "A lightweight extension links your browser to the desktop app. One click to install, and they pair automatically.",
  },
  {
    n: "03",
    title: "Choose an application",
    body: "Start a LinkedIn Easy Apply flow or a multi-step application on a supported site. Propel completes the repeat work, then you review before submission.",
  },
];

const FEATURES = [
  { t: "Two paths, one agent", d: "Use one Propel profile for LinkedIn Easy Apply and supported multi-step applications on other job sites.", i: "globe" },
  { t: "Reuse past answers", d: "Save a screening answer once and Propel can reuse it when the same question appears in a later application.", i: "memory" },
  { t: "Moves through longer forms", d: "Propel can continue through supported multi-page applications, fill mapped fields, and attach your résumé.", i: "scan" },
  { t: "Tailored answers", d: "Generates role-specific responses to “why are you a fit?” prompts from your background.", i: "spark" },
  { t: "Review before submission", d: "Check the role, résumé, fields, and answers in your browser, and step in when a page needs your judgment.", i: "check" },
  { t: "Keep an application record", d: "See what you applied to, when, and where without rebuilding a separate tracking spreadsheet.", i: "chart" },
];

const APPLICATION_PATHS = [
  {
    label: "Quick path",
    title: "LinkedIn Easy Apply",
    body: "Propel completes the Easy Apply flow using the profile, résumé, and answers you have saved, with a review point before submission.",
  },
  {
    label: "Longer path",
    title: "Multi-step job applications",
    body: "On supported job sites and employer career pages, Propel can move through multiple pages, fill repeat fields, attach your résumé, and use saved answers.",
  },
];

const homepageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HowTo",
      "@id": `${site.url}/#howto`,
      name: "How to complete LinkedIn Easy Apply and multi-step job applications with Propel",
      description:
        "Set up Propel once, then use the same saved profile for LinkedIn Easy Apply and supported multi-step applications while reviewing before submission.",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Add your profile",
          text: "Install Propel and save your details, résumé, and preferred application answers.",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Connect Chrome",
          text: "Install Propel Bridge to connect the application in your browser to the desktop app.",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Complete and review the application",
          text: "Start a LinkedIn Easy Apply flow or a supported multi-step application, let Propel fill the repeat fields, and review before submission.",
        },
      ],
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
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<string, JSX.Element> = {
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" /></>,
    memory: <><path d="M12 3a9 9 0 1 0 9 9" /><path d="M12 7v5l3 2" /></>,
    scan: <><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M7 12h10" /></>,
    spark: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" /></>,
    check: <><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
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
      <section className="relative px-5 pb-24 pt-32 sm:pt-36">
        <Aurora />
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal immediate>
              <span className="inline-flex items-center gap-2 rounded-full border border-iris-400/25 bg-iris-500/10 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-iris-300">
                <span className="h-1.5 w-1.5 rounded-full bg-ember-400" />
                Easy Apply + multi-step job applications
              </span>
            </Reveal>
            <Reveal delay={0.06} immediate>
              <h1 className="mt-6 font-display text-5xl font-extrabold leading-[0.98] tracking-tight text-cream sm:text-6xl balance">
                One agent for{" "}
                <br />
                <span className="text-gradient">LinkedIn Easy Apply</span>{" "}
                <span className="mt-2 block text-[0.72em] leading-[1.05]">and multi-step applications</span>
              </h1>
            </Reveal>
            <Reveal delay={0.12} immediate>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-iris-300/80">
                Some jobs use LinkedIn's quick flow. Others send you through longer forms on job sites
                and employer career pages. Propel handles both with one saved profile on supported
                applications, and keeps you in control before submission.
              </p>
            </Reveal>
            <Reveal delay={0.18} immediate>
              <div className="mt-9">
                <PrimaryDownload />
              </div>
            </Reveal>
            <Reveal delay={0.24} immediate>
              <p className="mt-5 font-mono text-[12px] text-iris-300/50">
                Free · Mac &amp; Windows · Review before submission
              </p>
            </Reveal>
          </div>

          {/* live, code-driven product demo */}
          <Reveal delay={0.2} className="flex justify-center lg:justify-end" id="demo" immediate>
            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-iris-500/10 blur-2xl" />
              <HeroFlow />
            </div>
          </Reveal>
        </div>

        {/* Application-scope marquee */}
        <div className="mx-auto mt-20 max-w-6xl">
          <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-widest text-iris-300/40">
            One saved profile across both application paths
          </p>
          <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
            <div className="flex w-max animate-marquee gap-3">
              {[...APPLICATION_SCOPE, ...APPLICATION_SCOPE].map((item, i) => (
                <span
                  key={i}
                  className="whitespace-nowrap rounded-full border border-iris-400/12 bg-ink-800/50 px-4 py-2 font-display text-sm font-medium text-iris-300/70"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── TWO APPLICATION PATHS ───────────────── */}
      <section id="coverage" className="relative px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-widest text-ember-500">The difference</span>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl balance">
              Easy Apply or multi-step. <span className="text-gradient">Keep one workflow.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-iris-300/75">
              A search rarely stays inside one kind of application. Propel is designed to carry the
              same profile, résumé, and saved answers from LinkedIn Easy Apply into longer applications
              on supported job sites and employer career pages.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {APPLICATION_PATHS.map((path, index) => (
              <Reveal key={path.title} delay={index * 0.08}>
                <div className="ring-grad glass h-full rounded-2xl p-7">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-ember-500">{path.label}</span>
                  <h3 className="mt-3 font-display text-2xl font-semibold text-cream">{path.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-iris-300/75">{path.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-7 max-w-3xl text-[14px] leading-relaxed text-iris-300/65">
              Site support can vary as application forms change. Propel does not claim to work on every
              site, and you can step in when a login check, unusual question, or unsupported page needs
              your input. Learn more in the{" "}
              <a href="/job-application-agent" className="font-medium text-iris-300 underline-offset-4 hover:underline">
                job application agent guide
              </a>
              .
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── HOW IT WORKS ───────────────── */}
      <section id="how" className="relative px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl balance">
              Set up once. <span className="text-gradient">Use it across both paths.</span>
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="ring-grad glass h-full rounded-2xl p-6">
                  <div className="font-mono text-sm font-medium text-ember-400">{s.n}</div>
                  <h3 className="mt-3 font-display text-xl font-semibold text-cream">{s.title}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-iris-300/70">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── FEATURES ───────────────── */}
      <section id="features" className="relative px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="max-w-2xl font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl balance">
              Everything you'd do by hand — <span className="text-gradient">automatic.</span>
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal key={f.t} delay={(i % 3) * 0.06}>
                <div className="group ring-grad glass h-full rounded-2xl p-6 transition-transform hover:-translate-y-1">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-iris-500/15 text-iris-300 transition-colors group-hover:bg-iris-500/25 group-hover:text-iris-200">
                    <FeatureIcon name={f.i} />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-cream">{f.t}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-iris-300/70">{f.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── VALUE BAND ───────────────── */}
      <section className="relative px-5 py-12">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="ring-grad glass overflow-hidden rounded-3xl px-8 py-12 text-center sm:px-14">
              <span className="font-mono text-[11px] uppercase tracking-widest text-ember-400">Get your time back</span>
              <p className="mx-auto mt-4 max-w-3xl font-display text-2xl font-semibold leading-snug text-cream sm:text-3xl balance">
                Spend application time deciding what to send, not copying the same profile into
                another form. Propel carries your saved details from Easy Apply into longer applications.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── COMING SOON ───────────────── */}
      <section id="roadmap" className="relative px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-widest text-ember-400">On the way</span>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl balance">
              Applications today. <span className="text-gradient">Your whole search next.</span>
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-iris-300/70">
              Applying is just the start. Propel is becoming the agent that runs the busywork of your
              entire job search — here's what's coming.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {site.roadmap.map((r, i) => (
              <Reveal key={r.title} delay={(i % 3) * 0.06}>
                <div className="ring-grad glass relative h-full overflow-hidden rounded-2xl p-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-ember-400/25 bg-ember-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ember-300">
                    Coming soon
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-cream">{r.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-iris-300/70">{r.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── DOWNLOAD ───────────────── */}
      <section id="download" className="relative px-5 py-24">
        <Aurora />
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <h2 className="font-display text-4xl font-bold tracking-tight text-cream sm:text-6xl balance">
              Get <span className="text-gradient">Propel</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-5 max-w-xl text-lg text-iris-300/80">
              Install the desktop app and Chrome bridge, save your profile, and start with LinkedIn
              Easy Apply or a supported multi-step application.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-10">
              <DownloadTrio />
            </div>
          </Reveal>
          <Reveal delay={0.22}>
            <p className="mx-auto mt-6 max-w-lg font-mono text-[12px] leading-relaxed text-iris-300/50">
              Mac is signed and notarized. Windows is available for Windows 10/11 and may show
              SmartScreen while the installer builds reputation.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── FAQ ───────────────── */}
      <section id="faq" className="relative px-5 py-24">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2 className="text-center font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl">
              Questions, answered.
            </h2>
          </Reveal>
          <div className="mt-12 space-y-3">
            {site.faq.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.04}>
                <details className="ring-grad glass group rounded-xl px-5 py-1 [&[open]]:bg-ink-700/40">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-display text-[17px] font-medium text-cream">
                    {f.q}
                    <span className="ml-4 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-iris-500/15 text-iris-300 transition-transform group-open:rotate-45">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </summary>
                  <p className="pb-5 pr-8 text-[15px] leading-relaxed text-iris-300/75">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── FOOTER ───────────────── */}
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
