import type { Metadata } from "next";
import Logo from "@/components/Logo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Propel Job Agent and the Propel marketing website handle data.",
  alternates: { canonical: "/privacy" },
};

const Section = ({ analyticsKey, title, children }: { analyticsKey: string; title: string; children: React.ReactNode }) => (
  <section data-analytics-section={analyticsKey} className="mt-9">
    <h2 className="font-display text-xl font-semibold text-cream">{title}</h2>
    <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-iris-300/80">{children}</div>
  </section>
);

export default function Privacy() {
  return (
    <main className="relative mx-auto max-w-3xl px-5 py-16">
      <a href="/" className="inline-block">
        <Logo />
      </a>

      <h1 className="mt-12 font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl">
        Privacy Policy
      </h1>
      <p className="mt-3 font-mono text-[12px] text-iris-300/50">Last updated: July 30, 2026</p>

      <p className="mt-8 text-[15px] leading-relaxed text-iris-300/80">
        Propel Job Agent is a desktop application plus a browser extension (“Propel Bridge”) that
        automate job applications. This policy also covers the Propel marketing website and explains
        what each part of Propel accesses and where that data goes.
      </p>

      <Section analyticsKey="what-propel-accesses" title="What Propel accesses">
        <p>
          To fill and submit job applications on your behalf, Propel reads the content of the web page
          in your active tab — including application form fields, which may contain personal
          information you have entered (name, contact details, work history, and similar).
        </p>
      </Section>

      <Section analyticsKey="how-data-is-used" title="How that data is used">
        <p>
          Page content is passed to the <strong className="text-cream">Propel desktop application running locally on your own computer</strong>,
          over Chrome&apos;s native-messaging channel, so the desktop app can complete the application form.
          That is the extension&apos;s only function.
        </p>
      </Section>

      <Section analyticsKey="website-analytics" title="Marketing website analytics">
        <p>
          The Propel marketing website records limited first-party product analytics so we can understand
          which pages and sections are useful and whether visitors use the download links. An event may
          contain the page path, a named section, a 25%, 50%, 75%, or 90% scroll milestone, or the selected
          download platform.
        </p>
        <p>
          The website assigns a random visitor identifier in local storage and a separate random tab-session
          identifier in session storage. These identifiers are pseudonymous, are not connected to a Propel
          account, and are stored with events in Propel&apos;s existing Supabase project. We do not put IP
          addresses, user-agent strings, referrers, query strings, form values, or free-form page content in
          the analytics database.
        </p>
      </Section>

      <Section analyticsKey="what-we-do-not-do" title="What we do not do">
        <ul className="list-disc space-y-2 pl-5 marker:text-ember-400">
          <li>We do <strong className="text-cream">not</strong> use marketing-site analytics for advertising or cross-site tracking.</li>
          <li>We do <strong className="text-cream">not</strong> sell marketing-site analytics or use them to build an identified profile about you.</li>
          <li>We do <strong className="text-cream">not</strong> include job-application page content or form values in marketing-site analytics.</li>
        </ul>
      </Section>

      <Section analyticsKey="data-storage" title="Data storage">
        <p>
          The extension stores only local operational state (settings and connection status) via
          Chrome&apos;s storage API on your device. It is not transmitted off your machine by the extension.
        </p>
        <p>
          The marketing website stores its random visitor identifier in your browser until you clear site
          data. Its random session identifier and any temporarily queued events remain only for the life of
          the browser tab. Successfully delivered events are durable database records used for aggregate
          reporting.
        </p>
      </Section>

      <Section analyticsKey="your-control" title="Your control">
        <p>
          You can remove Propel Bridge at any time from <span className="font-mono text-cream">chrome://extensions</span>.
          Removing it stops all access immediately. Uninstalling the Propel desktop app stops the bridge
          from receiving any commands.
        </p>
        <p>
          The marketing website honors Global Privacy Control and Do Not Track browser signals by disabling
          analytics. You can also reset its random identifier by clearing site data for propeljobagent.com.
        </p>
      </Section>

      <Section analyticsKey="contact" title="Contact">
        <p>
          Questions about this policy:{" "}
          <a href={`mailto:${site.email}`} className="text-iris-300 underline underline-offset-4 hover:text-cream">
            {site.email}
          </a>
        </p>
      </Section>

      <div className="mt-14 border-t border-iris-400/10 pt-6">
        <a href="/" className="font-mono text-[13px] text-iris-300/60 transition-colors hover:text-cream">
          ← Back to propel
        </a>
      </div>
    </main>
  );
}
