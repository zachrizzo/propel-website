import type { Metadata } from "next";
import Logo from "@/components/Logo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Propel handles your data: it stays on your own machine. Nothing is sent to remote servers.",
  alternates: { canonical: "/privacy" },
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mt-9">
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
      <p className="mt-3 font-mono text-[12px] text-iris-300/50">Last updated: June 14, 2026</p>

      <p className="mt-8 text-[15px] leading-relaxed text-iris-300/80">
        Propel is a desktop application plus a browser extension (“Propel Bridge”) that automate job
        applications. This policy explains exactly what they access and where your data goes.
      </p>

      <Section title="What Propel accesses">
        <p>
          To fill and submit job applications on your behalf, Propel reads the content of the web page
          in your active tab — including application form fields, which may contain personal
          information you have entered (name, contact details, work history, and similar).
        </p>
      </Section>

      <Section title="How that data is used">
        <p>
          Page content is passed to the <strong className="text-cream">Propel desktop application running locally on your own computer</strong>,
          over Chrome's native-messaging channel, so the desktop app can complete the application form.
          That is the extension's only function.
        </p>
      </Section>

      <Section title="What we do not do">
        <ul className="list-disc space-y-2 pl-5 marker:text-ember-400">
          <li>We do <strong className="text-cream">not</strong> send your page content or personal data to any remote server operated by us or anyone else.</li>
          <li>We do <strong className="text-cream">not</strong> sell or share your data with third parties.</li>
          <li>We do <strong className="text-cream">not</strong> use your data for advertising, analytics, or any purpose unrelated to filling the application you are working on.</li>
        </ul>
      </Section>

      <Section title="Data storage">
        <p>
          The extension stores only local operational state (settings and connection status) via
          Chrome's storage API on your device. It is not transmitted off your machine by the extension.
        </p>
      </Section>

      <Section title="Your control">
        <p>
          You can remove Propel Bridge at any time from <span className="font-mono text-cream">chrome://extensions</span>.
          Removing it stops all access immediately. Uninstalling the Propel desktop app stops the bridge
          from receiving any commands.
        </p>
      </Section>

      <Section title="Contact">
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
