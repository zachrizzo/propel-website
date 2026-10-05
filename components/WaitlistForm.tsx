"use client";

import { useState, type FormEvent } from "react";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/config";

type Outcome = { kind: "success" | "duplicate" | "error"; text: string } | null;

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState<Outcome>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setOutcome(null);
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/extension-waitlist`, {
        method: "POST",
        headers: { apikey: supabasePublishableKey, "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), website }),
      });
      const data: unknown = await response.json();
      const code = data && typeof data === "object" && "code" in data ? (data as { code?: unknown }).code : null;
      if (response.ok && code === "joined") {
        setOutcome({ kind: "success", text: "You’re on the Propel Extension waitlist. The extension is available now in the Chrome Web Store." });
      } else if (response.ok && code === "already_joined") {
        setOutcome({ kind: "duplicate", text: "This email is already on the waitlist." });
      } else if (code === "rate_limited") {
        setOutcome({ kind: "error", text: "Too many requests today. Please try again tomorrow." });
      } else if (code === "invalid_email") {
        setOutcome({ kind: "error", text: "Enter a valid email address." });
      } else {
        setOutcome({ kind: "error", text: "We couldn’t save your email. Please try again later." });
      }
    } catch {
      setOutcome({ kind: "error", text: "We couldn’t reach the waitlist. Please try again later." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 max-w-xl" aria-label="Propel Extension waitlist">
      <label htmlFor="waitlist-email" className="mb-2 block text-[14px] font-medium text-cream">Email address</label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input id="waitlist-email" type="email" required maxLength={254} autoComplete="email" inputMode="email"
          value={email} onChange={(event) => { setEmail(event.target.value); setOutcome(null); }}
          placeholder="you@example.com"
          className="min-w-0 flex-1 rounded-full border border-iris-400/30 bg-ink px-5 py-3.5 text-cream placeholder:text-fog focus:border-iris-300 focus:outline-none focus:ring-2 focus:ring-iris-400/25" />
        <button type="submit" disabled={busy}
          className="rounded-full bg-cream px-7 py-3.5 font-display text-[15px] font-semibold text-ink transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60">
          {busy ? "Joining…" : "Join waitlist"}
        </button>
      </div>
      <div className="absolute -left-[10000px]" aria-hidden="true">
        <label htmlFor="waitlist-website">Website</label>
        <input id="waitlist-website" value={website} onChange={(event) => setWebsite(event.target.value)}
          autoComplete="off" tabIndex={-1} />
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-fog">
        Propel Extension is available now. We’ll use your email to manage interest in the extension. This does not create an account or subscribe you to marketing emails.
        See our <a href="/privacy" className="text-iris-300 underline underline-offset-4">privacy policy</a>.
      </p>
      {outcome ? <p role={outcome.kind === "error" ? "alert" : "status"} className={`mt-3 text-[14px] ${outcome.kind === "error" ? "text-rose-300" : "text-emerald-300"}`}>
        {outcome.text}
      </p> : null}
    </form>
  );
}
