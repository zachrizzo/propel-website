import type { Metadata } from "next";
import Logo from "@/components/Logo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Checkout canceled",
  description: "Your Propel checkout was canceled and nothing was charged.",
  alternates: { canonical: "/billing/cancel" },
  // A post-checkout landing page has no business in search results.
  robots: { index: false, follow: false },
};

export default function BillingCancel() {
  return (
    <main className="relative mx-auto max-w-3xl px-5 py-16">
      <a href="/" className="inline-block">
        <Logo />
      </a>

      <p className="mt-12 font-mono text-[12px] uppercase tracking-[0.18em] text-fog">
        No charge was made
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl">
        Checkout canceled
      </h1>

      <p className="mt-8 text-[15px] leading-relaxed text-mist">
        You left checkout before it finished, so nothing was charged and your plan is unchanged.
        Pick a plan whenever you&rsquo;re ready.
      </p>

      <section className="mt-9">
        <h2 className="font-display text-xl font-semibold text-cream">Start again</h2>
        <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-mist">
          <p>
            Choose a plan from <strong className="text-cream">your account</strong>. Your free
            monthly applications keep working in the meantime.
          </p>
        </div>
      </section>

      <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3">
        <a
          href="/account"
          className="rounded-lg bg-iris-500 px-5 py-2.5 text-[15px] font-medium text-cream transition-colors hover:bg-iris-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris-300"
        >
          Back to your account
        </a>
        <a
          href={`mailto:${site.email}`}
          className="text-[15px] text-mist underline-offset-4 transition-colors hover:text-cream hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris-300"
        >
          Ran into a problem? Email us
        </a>
      </div>
    </main>
  );
}
