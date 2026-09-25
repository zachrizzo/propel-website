import Aurora from "@/components/Aurora";
import Nav from "@/components/Nav";
import HeroFlow from "@/components/HeroFlow";
import Reveal from "@/components/Reveal";
import Footer from "@/components/Footer";
import Pricing from "@/components/Pricing";
import { PrimaryDownload, DownloadTrio } from "@/components/DownloadButtons";
import { formatPrice, getCatalog, pricingSummary, type Catalog } from "@/lib/plans";
import { site } from "@/lib/site";
import { jsonLd } from "@/lib/json-ld";

// Prices come from the live plan catalog; the page is rebuilt hourly.
export const revalidate = 3600;

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
  "Hands you the finished application to review",
  "Keeps a record of every application",
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
    t: "Works through every step",
    d: "It moves through each page of a supported multi-step application, not just the first screen.",
    i: "layers",
  },
  {
    t: "Keeps an application record",
    d: "See what you applied to, when, and where without rebuilding a separate tracking spreadsheet.",
    i: "chart",
  },
  {
    t: "Asks instead of guessing",
    d: "When a question needs you, or a page needs a login, 2FA or a CAPTCHA, Propel pauses and asks. Nothing is sent before you review it.",
    i: "check",
  },
];

const COVERAGE = [
  {
    label: "LinkedIn Easy Apply",
    title: "Every step, start to finish",
    body: "Easy Apply is where Propel works best: it fills each step, attaches your résumé and answers the screening questions it knows.",
  },
  {
    label: "Indeed",
    title: "Supported listings",
    body: "Propel fills supported Indeed applications. When a listing opens a flow it can't finish, it hands the page back to you.",
  },
  {
    label: "In your browser",
    title: "Never a black box",
    body: "Everything happens in your Chrome tab. You can watch Propel work, review what it filled and step in at any point.",
  },
];

// Summarizes the privacy policy (/privacy); keep the two in step.
const DATA_POINTS = [
  {
    title: "Where your data lives",
    body: "Your profile and saved answers live in your Propel account so every application can use them. Résumé files, screenshots and job-site logins stay on your Mac.",
  },
  {
    title: "What the AI sees",
    body: "The application page and the parts of your profile it needs, sent to OpenAI's API with storage turned off. We don't train AI models on your data.",
  },
  {
    title: "Your job-site accounts",
    body: "Propel works in the browser you're already signed into. It never asks for your LinkedIn or Indeed password.",
  },
  {
    title: "Nothing sent without you",
    body: "You review every application before it's submitted, and you can pause Propel at any point.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Install Propel and its Chrome extension",
    body: "The Mac app runs the agent and keeps your profile, résumé and answers. The Propel Bridge extension lets it work in the tab you already have open.",
  },
  {
    n: "02",
    title: "Save your profile once",
    body: "Add your contact details, work history, résumé, links and the screening answers you give most often.",
  },
  {
    n: "03",
    title: "Open a role you want",
    body: "Start from LinkedIn Easy Apply or a supported Indeed listing. Propel reads the live form, fills every step it can and attaches your résumé.",
  },
  {
    n: "04",
    title: "Answer anything new, then review",
    body: "If a question needs you, Propel asks and remembers the answer for next time. You check the finished application before it's submitted.",
  },
];

function homepageJsonLd(faq: readonly { q: string; a: string }[]) {
  return {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HowTo",
      "@id": `${site.url}/#howto`,
      name: "How to fill LinkedIn Easy Apply and supported Indeed applications with Propel",
      description:
        "Save an application profile once, let Propel fill LinkedIn Easy Apply and supported Indeed applications in your Chrome tab, and review before submission.",
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
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
  };
}

/** The FAQ, with the pricing answer written from the live catalog. */
function faqWithPricing(catalog: Catalog) {
  const free = catalog.tiers.find((plan) => plan.kind === "free");
  const paid = catalog.tiers.filter((plan) => plan.kind === "subscription");
  const answer = [
    free?.monthlyApplications ? `Yes. Propel is free to install, and the Free plan includes ${free.monthlyApplications} applications a month.` : "Propel is free to install.",
    paid.length ? `Paid plans add more: ${paid.map((plan) => `${plan.name} is ${formatPrice(plan)}/mo for ${plan.monthlyApplications} applications`).join(", ")}.` : "",
    "An application counts only when Propel reaches the final submit step.",
  ].filter(Boolean).join(" ");
  return site.faq
    .filter((item) => !("homepage" in item && item.homepage === false))
    .map((item) => (item.q === "Is Propel free?" ? { q: item.q, a: answer } : item));
}

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
  const paths: Record<string, React.JSX.Element> = {
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
        positive ? "bg-emerald-400/15 text-emerald-300" : "bg-rose-400/10 text-rose-300/80"
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

export default async function Home() {
  const catalog = await getCatalog();
  const faq = faqWithPricing(catalog);
  const summary = pricingSummary(catalog);
  return (
    <main id="top" className="relative overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(homepageJsonLd(faq)) }}
      />
      <Nav />

      {/* ───────────────── HERO ───────────────── */}
      <section className="relative px-5 pb-16 pt-32 sm:pt-40">
        <Aurora />
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="text-center sm:text-left">
            <Reveal immediate>
              <span className="inline-flex items-center gap-2 rounded-full border border-iris-400/25 bg-iris-500/10 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-iris-300">
                <span className="h-1.5 w-1.5 rounded-full bg-iris-400" />
                AI job application agent · Beta
              </span>
            </Reveal>
            <Reveal delay={0.06} immediate>
              <h1 className="mt-6 font-display text-[44px] font-extrabold leading-[1.02] tracking-tight text-cream sm:text-6xl lg:text-[58px]">
                Your job applications, <span className="text-gradient sm:whitespace-nowrap">filled out for you.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.12} immediate>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-mist sm:mx-0">
                Propel works through every step of LinkedIn Easy Apply and supported Indeed applications
                in your Chrome tab. It uses your saved résumé and answers, asks only what it can&apos;t know,
                and stops for your review before anything is sent.
              </p>
            </Reveal>
            <Reveal delay={0.18} immediate>
              <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                <PrimaryDownload />
                <a href="#how" className="inline-flex items-center gap-2 rounded-full border border-iris-400/25 px-6 py-3.5 font-display text-[15px] font-semibold text-cream transition-colors hover:border-iris-400/50 hover:bg-iris-500/10">
                  See how it works
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.24} immediate>
              {summary ? <p className="mt-6 text-[14px] text-fog">{summary}</p> : null}
            </Reveal>
          </div>

          <Reveal delay={0.2} className="flex min-w-0 justify-center lg:justify-end" id="demo" immediate>
            <div className="relative w-full max-w-[540px]">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-iris-500/10 blur-2xl" />
              <HeroFlow />
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.26} immediate>
          <div className="mx-auto mt-16 flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 border-y border-iris-400/10 py-5 text-[14px] text-mist">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-fog">Works in your Chrome tab on</span>
            <span className="font-display font-semibold text-cream">LinkedIn Easy Apply</span>
            <span className="font-display font-semibold text-cream">Indeed <span className="font-sans font-normal text-fog">(supported listings)</span></span>
            <span className="hidden h-4 w-px bg-iris-400/20 sm:block" />
            <span>You review before submit</span>
          </div>
        </Reveal>
      </section>

      {/* ───────────────── WHY PROPEL ───────────────── */}
      <section id="why" className="relative px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-widest text-iris-400">Why Propel</span>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl balance">
              The application changes. <span className="text-gradient">Your information doesn&apos;t.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-mist">
              Applying to dozens of roles means typing the same facts into form after form. Propel carries
              your profile, résumé and answers forward, so your time goes into choosing where to apply.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-iris-400/10 bg-ink-800/40 p-7">
                <span className="font-mono text-[11px] uppercase tracking-widest text-rose-300/80">Every time, by hand</span>
                <h3 className="mt-3 font-display text-2xl font-semibold text-cream">Start over on another form</h3>
                <ul className="mt-6 space-y-3">
                  {MANUAL_WORK.map((item) => (
                    <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-fog">
                      <ListIcon positive={false} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal>
              <div className="ring-grad glass h-full rounded-2xl p-7">
                <span className="font-mono text-[11px] uppercase tracking-widest text-emerald-300">With Propel</span>
                <h3 className="mt-3 font-display text-2xl font-semibold text-cream">Pick up with your context ready</h3>
                <ul className="mt-6 space-y-3">
                  {PROPEL_WORK.map((item) => (
                    <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-mist">
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

      {/* ───────────────── HOW IT WORKS ───────────────── */}
      <section id="how" className="relative scroll-mt-20 px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-widest text-iris-400">How it works</span>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl balance">
              From blank form to <span className="text-gradient">ready for review.</span>
            </h2>
          </Reveal>
          <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <li key={step.n}>
                <Reveal className="h-full">
                  <div className="relative h-full rounded-2xl border border-iris-400/10 bg-ink-800/50 p-6">
                    <span className="relative grid h-9 w-9 place-items-center rounded-full border border-iris-400/30 bg-ink font-mono text-[13px] font-medium text-iris-300">
                      {step.n}
                    </span>
                    <h3 className="mt-4 font-display text-xl font-semibold text-cream">{step.title}</h3>
                    <p className="mt-2.5 text-[15px] leading-relaxed text-mist">{step.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
          <Reveal>
            <p className="mt-7 text-[14px] text-fog">
              Want the setup details?{" "}
              <a href="/how-to-auto-apply-to-jobs" className="font-medium text-iris-300 underline-offset-4 hover:underline">
                Read the auto-apply setup guide
              </a>
              .
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── FEATURES ───────────────── */}
      <section id="features" className="relative scroll-mt-20 px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-widest text-iris-400">Features</span>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl balance">
              Take the repeat work <span className="text-gradient">off your plate.</span>
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <Reveal key={feature.t}>
                <div className="group ring-grad glass h-full rounded-2xl p-6 transition-transform hover:-translate-y-1">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-iris-500/15 text-iris-300 transition-colors group-hover:bg-iris-500/25">
                    <FeatureIcon name={feature.i} />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-cream">{feature.t}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-mist">{feature.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── COVERAGE ───────────────── */}
      <section id="coverage" className="relative scroll-mt-20 px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-widest text-iris-400">Where it works</span>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl balance">
              Beta coverage: <span className="text-gradient">Easy Apply and Indeed.</span>
            </h2>
            <p className="mt-5 max-w-3xl text-[16px] leading-relaxed text-mist">
              In beta, Propel works on LinkedIn Easy Apply and supported Indeed applications. It doesn&apos;t
              cover company career sites or applicant tracking systems yet.{" "}
              <a href="/job-application-agent" className="font-medium text-iris-300 underline-offset-4 hover:underline">
                See exactly what&apos;s covered
              </a>
              .
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {COVERAGE.map((item) => (
              <Reveal key={item.title}>
                <div className="ring-grad glass h-full rounded-2xl p-7">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-iris-400">{item.label}</span>
                  <h3 className="mt-3 font-display text-xl font-semibold text-cream">{item.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-mist">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── YOUR DATA ───────────────── */}
      <section id="data" className="relative scroll-mt-20 px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-widest text-iris-400">Your data</span>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl balance">
              Your data, <span className="text-gradient">your accounts.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-mist">
              An agent that works in your browser should be clear about what it touches. Here&apos;s the short version;{" "}
              <a href="/privacy" className="font-medium text-iris-300 underline-offset-4 hover:underline">
                the privacy policy
              </a>{" "}
              has the details.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {DATA_POINTS.map((point) => (
              <Reveal key={point.title}>
                <div className="h-full rounded-2xl border border-iris-400/10 bg-ink-800/50 p-6">
                  <h3 className="font-display text-lg font-semibold text-cream">{point.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-mist">{point.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── PRICING ───────────────── */}
      <section id="pricing" className="relative scroll-mt-20 px-5 py-24">
        <Pricing catalog={catalog} />
      </section>

      {/* ───────────────── FAQ ───────────────── */}
      <section id="faq" className="relative scroll-mt-20 px-5 py-24">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <span className="block text-center font-mono text-[11px] uppercase tracking-widest text-iris-400">FAQ</span>
            <h2 className="mt-4 text-center font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl">
              Questions, answered.
            </h2>
          </Reveal>
          <div className="mt-12 space-y-3">
            {faq.map((item) => (
              <details key={item.q} className="ring-grad glass group rounded-xl px-5 py-1 [&[open]]:bg-ink-700/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-[17px] font-medium text-cream">
                  <h3>{item.q}</h3>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-iris-500/15 text-iris-300 transition-transform group-open:rotate-45">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <p className="pb-5 pr-8 text-[15px] leading-relaxed text-mist">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── DOWNLOAD ───────────────── */}
      <section id="download" className="relative scroll-mt-20 overflow-hidden px-5 py-24">
        <Aurora />
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-widest text-iris-400">Get started</span>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-cream sm:text-6xl balance">
              Your next application shouldn&apos;t start from <span className="text-gradient">scratch.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-mist">
              Install Propel free on your Mac, add the Chrome extension, save your profile once, and let the agent
              fill your next LinkedIn Easy Apply or supported Indeed application.
            </p>
            <div className="mt-10">
              <DownloadTrio />
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-[13px] leading-relaxed text-fog">
              Start with the Mac app, then add Propel Bridge for Chrome. The Mac app is signed and notarized; a
              Windows installer isn&apos;t available yet.
            </p>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
