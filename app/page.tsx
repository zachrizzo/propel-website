import Aurora from "@/components/Aurora";
import Nav from "@/components/Nav";
import ApplyDemo from "@/components/ApplyDemo";
import Reveal from "@/components/Reveal";
import { PrimaryDownload, DownloadTrio } from "@/components/DownloadButtons";
import { site } from "@/lib/site";

const ATS = ["Workday", "Greenhouse", "Lever", "Ashby", "iCIMS", "Taleo", "BambooHR", "Company portals"];

const STEPS = [
  {
    n: "01",
    title: "Install the desktop app",
    body: "Propel's brain runs locally on your Mac or PC. It holds your profile, résumé, and the apply engine — nothing lives on our servers.",
  },
  {
    n: "02",
    title: "Add the Chrome bridge",
    body: "A lightweight extension links your browser to the desktop app. One click to install, and they pair automatically.",
  },
  {
    n: "03",
    title: "Apply, hands-free",
    body: "Open any job posting and let Propel read the form, fill every field from your profile, and submit — in seconds.",
  },
];

const FEATURES = [
  { t: "Works on any career site", d: "Workday, Greenhouse, Lever, custom portals — if you can apply there, Propel can fill it.", i: "globe" },
  { t: "Your data stays local", d: "Your profile and résumé live on your own machine. Nothing is sent to a remote server.", i: "lock" },
  { t: "Reads the real form", d: "Propel parses each application like a human would, mapping your profile to the right fields.", i: "scan" },
  { t: "Tailored answers", d: "Generates role-specific responses to “why are you a fit?” prompts from your background.", i: "spark" },
  { t: "You stay in control", d: "Review before submit, or let it run. Every application is yours to approve.", i: "check" },
  { t: "Tracks everything", d: "See what you applied to, when, and where — without a spreadsheet.", i: "chart" },
];

const FAQ = [
  {
    q: "Is Propel free?",
    a: "The desktop app and the Chrome bridge are free to download. Your data and résumé stay on your own computer.",
  },
  {
    q: "Why do I need both a desktop app and an extension?",
    a: "The extension can act inside your browser tab (the only place application forms live), while the desktop app runs the engine and keeps your data local. Together they automate applications without sending anything to a server.",
  },
  {
    q: "Is my personal data sent anywhere?",
    a: "No. Propel reads the application page and fills it using your locally-stored profile. The browser bridge talks only to the desktop app on your own machine over Chrome's native-messaging channel — never to a remote server.",
  },
  {
    q: "Is the desktop app signed?",
    a: "The Mac app is signed and notarized with Apple Developer ID. The Windows installer is published too; it may still show Microsoft SmartScreen while the new installer builds reputation.",
  },
  {
    q: "Will Propel update itself?",
    a: "Yes. The packaged desktop app checks the public release feed on launch, downloads newer builds in the background, and shows a Restart to update banner when the update is ready.",
  },
  {
    q: "Which sites does it work on?",
    a: "Propel works across the major applicant-tracking systems — Workday, Greenhouse, Lever, Ashby, iCIMS and more — plus most company career portals.",
  },
];

function FeatureIcon({ name }: { name: string }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<string, JSX.Element> = {
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" /></>,
    lock: <><rect x="4.5" y="10.5" width="15" height="10" rx="2" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" /></>,
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
      <Nav />

      {/* ───────────────── HERO ───────────────── */}
      <section className="relative px-5 pb-24 pt-32 sm:pt-36">
        <Aurora />
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal immediate>
              <span className="inline-flex items-center gap-2 rounded-full border border-iris-400/25 bg-iris-500/10 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-iris-300">
                <span className="h-1.5 w-1.5 rounded-full bg-ember-400" />
                Apply in seconds, not hours
              </span>
            </Reveal>
            <Reveal delay={0.06} immediate>
              <h1 className="mt-6 font-display text-5xl font-extrabold leading-[0.98] tracking-tight text-cream sm:text-6xl lg:text-7xl balance">
                Stop filling out
                <br />
                the <span className="text-gradient">same form</span>
                <br />
                a hundred times.
              </h1>
            </Reveal>
            <Reveal delay={0.12} immediate>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-iris-300/80">
                Propel reads and fills job-application forms on whatever site you're on — and submits
                them for you. One profile, every application, <span className="text-cream">hands-free</span>.
              </p>
            </Reveal>
            <Reveal delay={0.18} immediate>
              <div className="mt-9">
                <PrimaryDownload />
              </div>
            </Reveal>
            <Reveal delay={0.24} immediate>
              <p className="mt-5 font-mono text-[12px] text-iris-300/50">
                Free · Mac &amp; Windows · Your data never leaves your machine
              </p>
            </Reveal>
          </div>

          {/* live demo */}
          <Reveal delay={0.2} className="flex justify-center lg:justify-end" id="demo" immediate>
            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-iris-500/10 blur-2xl" />
              <ApplyDemo />
            </div>
          </Reveal>
        </div>

        {/* ATS marquee */}
        <div className="mx-auto mt-20 max-w-6xl">
          <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-widest text-iris-300/40">
            Fills applications on
          </p>
          <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
            <div className="flex w-max animate-marquee gap-3">
              {[...ATS, ...ATS].map((a, i) => (
                <span
                  key={i}
                  className="whitespace-nowrap rounded-full border border-iris-400/12 bg-ink-800/50 px-4 py-2 font-display text-sm font-medium text-iris-300/70"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── HOW IT WORKS ───────────────── */}
      <section id="how" className="relative px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl balance">
              Set up once. <span className="text-gradient">Apply forever.</span>
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

      {/* ───────────────── PRIVACY BAND ───────────────── */}
      <section className="relative px-5 py-12">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="ring-grad glass overflow-hidden rounded-3xl px-8 py-12 text-center sm:px-14">
              <span className="font-mono text-[11px] uppercase tracking-widest text-ember-400">Built private by design</span>
              <p className="mx-auto mt-4 max-w-3xl font-display text-2xl font-semibold leading-snug text-cream sm:text-3xl balance">
                Your résumé and personal details never touch our servers. The engine runs on your
                computer; the browser bridge talks only to it — locally.
              </p>
            </div>
          </Reveal>
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
              Install the desktop app and the Chrome bridge. Two minutes to your first hands-free application.
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
            {FAQ.map((f, i) => (
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
            <span
              className="grid h-7 w-7 place-items-center rounded-lg"
              style={{ background: "linear-gradient(160deg,#818cf8,#4338ca)" }}
            >
              <svg width="14" height="14" viewBox="0 0 100 100" aria-hidden>
                <path d="M50 16 L80 54 H62 V84 H38 V54 H20 Z" fill="#fff" />
              </svg>
            </span>
            <span className="font-display text-sm font-semibold text-cream">Propel</span>
            <span className="ml-2 font-mono text-[12px] text-iris-300/40">© 2026</span>
          </div>
          <nav className="flex items-center gap-6 text-[14px] text-iris-300/70">
            <a href="/privacy" className="transition-colors hover:text-cream">Privacy</a>
            <a href="#faq" className="transition-colors hover:text-cream">FAQ</a>
            <a href={`mailto:${site.email}`} className="transition-colors hover:text-cream">Contact</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
