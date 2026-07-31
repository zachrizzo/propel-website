import type { Metadata } from "next";
import BillingAppRedirect from "@/components/BillingAppRedirect";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "Open Billing in Propel",
  description: "Return to the Propel desktop app to manage your plan and billing.",
  alternates: { canonical: "/billing" },
  robots: { index: false, follow: false },
};

export default function BillingAppHandoff() {
  return (
    <main className="relative mx-auto max-w-3xl px-5 py-16">
      <a href="/" className="inline-block">
        <Logo />
      </a>

      <p className="mt-12 font-mono text-[12px] uppercase tracking-[0.18em] text-ember-400">
        Returning to Propel
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl">
        Opening Billing in the desktop app
      </h1>

      <p className="mt-8 text-[15px] leading-relaxed text-iris-300/80">
        Propel keeps plan selection and billing management in the desktop app. If Propel does not
        open automatically, use the button below. If the app is not installed, download it first.
      </p>

      <BillingAppRedirect />

      <p className="mt-8 text-[13px] leading-relaxed text-iris-300/55">
        You can close this tab after Propel opens.
      </p>
    </main>
  );
}
