import type { Metadata } from "next";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "Account deleted",
  robots: { index: false, follow: false },
};

export default function AccountDeleted() {
  return (
    <main className="relative mx-auto max-w-3xl px-5 py-16">
      <a href="/" className="inline-block" aria-label="Propel home">
        <Logo />
      </a>
      <p className="mt-12 font-mono text-[12px] uppercase tracking-[0.18em] text-iris-400">Account deleted</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl">Your account is gone</h1>
      <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-mist">
        Your subscription is cancelled and the data in your Propel account has been deleted. To remove what&rsquo;s on
        your Mac, uninstall the Propel app and remove the Propel Bridge extension from Chrome.
      </p>
      <a
        href="/"
        className="mt-10 inline-flex rounded-lg bg-iris-500 px-5 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-iris-400"
      >
        Back to Propel
      </a>
    </main>
  );
}
