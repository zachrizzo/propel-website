"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/browser";
import { Notice, inputClass, primaryButton } from "./ui";

export default function PasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (password !== confirm) {
      setError("The two passwords don't match.");
      return;
    }
    setBusy(true);
    setError(null);
    const { error } = await createClient().auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    window.location.assign("/account?password=updated");
  }

  return (
    <form onSubmit={submit} className="space-y-3.5">
      <input className={inputClass} type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password (8+ characters)" aria-label="New password" />
      <input className={inputClass} type="password" autoComplete="new-password" required minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat new password" aria-label="Repeat new password" />
      {error ? <Notice tone="error">{error}</Notice> : null}
      <button type="submit" className={`${primaryButton} w-full`} disabled={busy}>
        {busy ? "Saving…" : "Save password"}
      </button>
    </form>
  );
}
