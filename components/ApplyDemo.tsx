"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Field = { id: string; label: string; value: string; type?: "text" | "area" };

const FIELDS: Field[] = [
  { id: "name", label: "Full name", value: "Zach Rizzo" },
  { id: "email", label: "Email", value: "zach@email.com" },
  { id: "phone", label: "Phone", value: "(480) 555-0142" },
  { id: "url", label: "LinkedIn / Portfolio", value: "linkedin.com/in/zachrizzo" },
  {
    id: "why",
    label: "Why are you a fit for this role?",
    value:
      "I ship production systems end-to-end and love turning fuzzy problems into reliable products. Your team's pace is exactly where I do my best work.",
    type: "area",
  },
];

const TYPE_MS = 18; // per character
const HOLD_AFTER_FILL = 900;
const SUBMIT_MS = 1100;
const SHOW_DONE = 2200;

export default function ApplyDemo() {
  const [typed, setTyped] = useState<Record<string, string>>({});
  const [active, setActive] = useState<string | null>(null);
  const [phase, setPhase] = useState<"fill" | "submit" | "done">("fill");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    let cancelled = false;
    const wait = (ms: number) => new Promise<void>((r) => timers.current.push(setTimeout(r, ms)));

    async function run() {
      while (!cancelled) {
        setPhase("fill");
        setTyped({});
        await wait(500);
        for (const f of FIELDS) {
          if (cancelled) return;
          setActive(f.id);
          for (let i = 1; i <= f.value.length; i++) {
            if (cancelled) return;
            setTyped((t) => ({ ...t, [f.id]: f.value.slice(0, i) }));
            await wait(TYPE_MS);
          }
          await wait(180);
        }
        setActive(null);
        await wait(HOLD_AFTER_FILL);
        if (cancelled) return;
        setPhase("submit");
        await wait(SUBMIT_MS);
        if (cancelled) return;
        setPhase("done");
        await wait(SHOW_DONE);
      }
    }
    run();
    return () => {
      cancelled = true;
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  return (
    <div className="ring-grad glass relative w-full max-w-[440px] rounded-2xl p-5 shadow-2xl shadow-iris-700/20">
      {/* window chrome */}
      <div className="mb-4 flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-ember-400/80" />
        <span className="h-3 w-3 rounded-full bg-amber-300/80" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
        <div className="ml-2 truncate font-mono text-[11px] text-iris-300/70">
          careers.acme.com — Senior Engineer
        </div>
        <div className="ml-auto flex items-center gap-1.5 rounded-full bg-iris-500/15 px-2.5 py-1 text-[10px] font-semibold text-iris-300 ring-1 ring-iris-400/30">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-iris-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-iris-400" />
          </span>
          Propel
        </div>
      </div>

      <div className="space-y-3">
        {FIELDS.map((f) => (
          <div key={f.id}>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-iris-300/60">
              {f.label}
            </label>
            <div
              className={`relative rounded-lg border bg-ink-800/60 px-3 py-2 font-mono text-[13px] leading-relaxed transition-colors ${
                active === f.id ? "border-iris-400/70 ring-2 ring-iris-500/20" : "border-iris-400/12"
              } ${f.type === "area" ? "min-h-[64px]" : "h-[38px]"}`}
            >
              <span className="text-cream/90">{typed[f.id] ?? ""}</span>
              {active === f.id && (
                <span className="ml-px inline-block h-[14px] w-[2px] -translate-y-px animate-caret-blink bg-iris-300 align-middle" />
              )}
            </div>
          </div>
        ))}

        {/* resume chip */}
        <div className="flex items-center gap-2 rounded-lg border border-iris-400/12 bg-ink-800/60 px-3 py-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-iris-300">
            <path d="M14 3v4a1 1 0 0 0 1 1h4" stroke="currentColor" strokeWidth="1.6" />
            <path d="M5 21V5a2 2 0 0 1 2-2h7l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z" stroke="currentColor" strokeWidth="1.6" />
          </svg>
          <span className="font-mono text-[12px] text-cream/70">resume_zach-rizzo.pdf</span>
          <span className="ml-auto text-[11px] font-semibold text-emerald-400">attached</span>
        </div>

        <button
          className={`relative mt-1 h-11 w-full overflow-hidden rounded-lg font-display text-[15px] font-semibold transition-transform ${
            phase === "submit" ? "scale-[0.97]" : "scale-100"
          } ${phase === "done" ? "bg-emerald-500 text-emerald-950" : "bg-gradient-to-r from-iris-500 to-iris-600 text-white"}`}
        >
          {phase === "done" ? "Submitted ✓" : phase === "submit" ? "Submitting…" : "Submit application"}
        </button>
      </div>

      {/* success flash */}
      <AnimatePresence>
        {phase === "done" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 grid place-items-center rounded-2xl bg-ink/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 16 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald-500 text-emerald-950">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="font-display text-lg font-semibold text-cream">Application sent</div>
              <div className="font-mono text-[11px] text-iris-300/70">in 3.2 seconds · hands-free</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
