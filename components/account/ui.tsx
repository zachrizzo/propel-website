import type { ReactNode } from "react";
import Logo from "@/components/Logo";

// Shared pieces for the sign-in and account pages, in the site's own look.

export const inputClass =
  "h-11 w-full rounded-xl border border-iris-400/20 bg-ink/60 px-3.5 text-[15px] text-cream placeholder:text-fog outline-none transition focus:border-iris-400 focus:ring-4 focus:ring-iris-500/15";
export const primaryButton =
  "inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-br from-iris-600 to-iris-400 px-5 font-display text-[15px] font-semibold text-white shadow-[0_7px_18px_rgba(35,134,231,0.25)] transition hover:-translate-y-px disabled:translate-y-0 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris-300";
export const secondaryButton =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-iris-400/20 bg-ink-700/60 px-5 text-[14px] font-semibold text-cream transition hover:border-iris-400/45 hover:bg-iris-500/10 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris-300";

export function Notice({ tone, children }: { tone: "error" | "info" | "success"; children: ReactNode }) {
  const tones = {
    error: "border-rose-400/30 bg-rose-500/10 text-rose-200",
    info: "border-iris-400/25 bg-iris-500/10 text-iris-300",
    success: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
  };
  return (
    <p role={tone === "error" ? "alert" : "status"} className={`rounded-xl border px-3.5 py-2.5 text-[13.5px] leading-snug ${tones[tone]}`}>
      {children}
    </p>
  );
}

/** A centered card for the sign-in and password pages. */
export function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-5 py-16">
      <div className="ring-grad glass w-full max-w-[420px] rounded-3xl px-7 py-9 sm:px-9">
        <a href="/" className="flex justify-center" aria-label="Propel home">
          <Logo size={40} />
        </a>
        <h1 className="mt-7 text-center font-display text-[22px] font-bold tracking-tight text-cream">{title}</h1>
        <p className="mt-1.5 text-center text-[14px] leading-relaxed text-mist">{subtitle}</p>
        <div className="mt-7">{children}</div>
      </div>
    </main>
  );
}
