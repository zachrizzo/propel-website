"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/browser";
import { Notice, inputClass, primaryButton, secondaryButton } from "./ui";

type Mode = "signin" | "signup";
type Message = { tone: "error" | "info" | "success"; text: string } | null;

const callbackUrl = (next: string) => `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

export default function LoginForm({ next, initialMode, callbackError }: { next: string; initialMode: Mode; callbackError: string | null }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState<"form" | "google" | "reset" | null>(null);
  const [message, setMessage] = useState<Message>(
    callbackError ? { tone: "error", text: "That sign-in link didn't work. It may have expired, so please try again." } : null,
  );

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy("form");
    setMessage(null);
    const supabase = createClient();
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // A full navigation, so the server renders the next page with the new session.
        window.location.assign(next);
        return;
      }
      const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: callbackUrl(next) } });
      if (error) throw error;
      if (data.session) {
        window.location.assign(next);
        return;
      }
      setMessage({ tone: "success", text: `Check ${email} for a link to confirm your account.` });
    } catch (error) {
      setMessage({ tone: "error", text: error instanceof Error ? error.message : "Something went wrong. Please try again." });
    }
    setBusy(null);
  }

  async function google() {
    setBusy("google");
    setMessage(null);
    const { error } = await createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: callbackUrl(next) } });
    if (error) {
      setMessage({ tone: "error", text: error.message });
      setBusy(null);
    }
  }

  async function resetPassword() {
    if (!email) {
      setMessage({ tone: "info", text: "Enter your email above, then choose Forgot password again." });
      return;
    }
    setBusy("reset");
    const { error } = await createClient().auth.resetPasswordForEmail(email, { redirectTo: callbackUrl("/account/password") });
    setMessage(error ? { tone: "error", text: error.message } : { tone: "success", text: `If ${email} has a Propel account, a reset link is on its way.` });
    setBusy(null);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-1 rounded-xl border border-iris-400/15 bg-ink/50 p-1" role="tablist">
        {(["signin", "signup"] as const).map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={mode === value}
            onClick={() => { setMode(value); setMessage(null); }}
            className={`h-9 rounded-lg text-[13.5px] font-semibold transition ${mode === value ? "bg-ink-700 text-cream shadow" : "text-iris-300/70 hover:text-cream"}`}
          >
            {value === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-3.5">
        <label className="block">
          <span className="mb-1.5 block text-[12.5px] font-semibold text-iris-300/80">Email</span>
          <input className={inputClass} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </label>
        <label className="block">
          <span className="mb-1.5 flex items-center justify-between text-[12.5px] font-semibold text-iris-300/80">
            Password
            {mode === "signin" ? (
              <button type="button" onClick={resetPassword} disabled={busy !== null} className="font-medium text-iris-400 hover:text-iris-300">
                {busy === "reset" ? "Sending…" : "Forgot password?"}
              </button>
            ) : null}
          </span>
          <input
            className={inputClass}
            type="password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            required
            minLength={mode === "signup" ? 8 : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
          />
        </label>
        {message ? <Notice tone={message.tone}>{message.text}</Notice> : null}
        <button type="submit" className={`${primaryButton} w-full`} disabled={busy !== null}>
          {busy === "form" ? "One moment…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <div className="flex items-center gap-3 text-[12px] text-iris-300/50">
        <span className="h-px flex-1 bg-iris-400/15" />or<span className="h-px flex-1 bg-iris-400/15" />
      </div>
      <button type="button" onClick={google} disabled={busy !== null} className={`${secondaryButton} w-full`}>
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]">
          <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.7z" />
          <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z" />
          <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1z" />
          <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.8 3.6-4.9 6.7-4.9z" />
        </svg>
        {busy === "google" ? "Opening Google…" : "Continue with Google"}
      </button>
    </div>
  );
}
