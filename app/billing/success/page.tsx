import type { Metadata } from "next";
import Logo from "@/components/Logo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Subscription confirmed",
  description: "Your Propel subscription is active. Head back to the desktop app to start applying.",
  alternates: { canonical: "/billing/success" },
  // A post-checkout landing page has no business in search results.
  robots: { index: false, follow: false },
};

export default function BillingSuccess() {
  return (
    <main className="relative mx-auto max-w-3xl px-5 py-16">
      <a href="/" className="inline-block">
        <Logo />
      </a>

      <p className="mt-12 font-mono text-[12px] uppercase tracking-[0.18em] text-ember-400">
        Payment confirmed
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl">
        You&rsquo;re subscribed
      </h1>

      <p className="mt-8 text-[15px] leading-relaxed text-iris-300/80">
        Your plan is active and your application attempts have been added to your account.
        Everything happens back in the desktop app — you can close this tab.
      </p>

      <section className="mt-9">
        <h2 className="font-display text-xl font-semibold text-cream">If the app still shows your old plan</h2>
        <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-iris-300/80">
          <p>
            Open <strong className="text-cream">Billing</strong> in Propel and choose{" "}
            <strong className="text-cream">Refresh</strong>. Plans usually activate within a few
            seconds of payment, and refreshing pulls the change through immediately.
          </p>
        </div>
      </section>

      <section className="mt-9">
        <h2 className="font-display text-xl font-semibold text-cream">Managing your plan</h2>
        <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-iris-300/80">
          <p>
            Change or cancel your plan anytime from <strong className="text-cream">Billing</strong> in
            the app. Your receipt is on its way by email.
          </p>
        </div>
      </section>

      <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3">
        <a
          href={site.downloads.mac}
          className="rounded-lg bg-iris-500 px-5 py-2.5 text-[15px] font-medium text-cream transition-colors hover:bg-iris-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris-300"
        >
          Get the desktop app
        </a>
        <a
          href={`mailto:${site.email}`}
          className="text-[15px] text-iris-300/80 underline-offset-4 transition-colors hover:text-cream hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris-300"
        >
          Something look wrong? Email us
        </a>
      </div>
    </main>
  );
}
