"use client";

/**
 * HeroFlow — a code-driven, looping "sped-up screen recording" of Propel working.
 *
 * It is purely decorative (aria-hidden) and conveys nothing essential by motion:
 * the surrounding hero copy carries the real message. A static, calm fallback is
 * rendered for `prefers-reduced-motion` users that still shows the key frames.
 *
 * Architecture: a single async director loop drives a `step` state machine. All
 * timers are tracked and cleared on unmount, and the loop bails the instant the
 * component is cancelled — so it cannot leak timers or get stuck mid-frame.
 * Everything animates via transform/opacity only (no layout thrash).
 */

import { useEffect, useReducer, useRef, useState } from "react";

/* ──────────────────────────── data ──────────────────────────── */

type Job = {
  id: string;
  role: string;
  company: string;
  mark: string; // 1-2 letter monogram
  hue: string; // brand-neutral accent for the fake logo tile
  meta: string;
};

const JOBS: Job[] = [
  { id: "a", role: "Senior Frontend Engineer", company: "Northwind Labs", mark: "N", hue: "#6366f1", meta: "Remote · $180k–$210k" },
  { id: "b", role: "Product Engineer", company: "Vellum", mark: "V", hue: "#fb7185", meta: "Hybrid · NYC" },
  { id: "c", role: "Full-Stack Developer", company: "Cobalt", mark: "C", hue: "#34d399", meta: "Remote · $160k+" },
  { id: "d", role: "Platform Engineer", company: "Aperture", mark: "A", hue: "#fbbf24", meta: "On-site · Austin" },
];

type FormField = { label: string; value: string; kind?: "select" };

// First job: fully detailed application. Second job: shortened cycle (handled by reuse).
const FORM_FIELDS: FormField[] = [
  { label: "Full name", value: "Zach Rizzo" },
  { label: "Email", value: "zach@email.com" },
  { label: "Years of experience", value: "6 years", kind: "select" },
];

/* ──────────────────────────── timing ──────────────────────────── */
// Tuned to feel like an energetic sped-up recording. Each stage is a few seconds.

const T = {
  boot: 360,
  cursorMove: 620, // glide duration for the simulated cursor
  hoverHold: 240,
  clickPulse: 260,
  pageSwap: 520,
  perChar: 26,
  fieldGap: 150,
  selectHold: 480,
  attach: 620,
  applySite: 760,
  memory: 1500,
  done: 1400,
  loopReset: 480,
};

/* ──────────────────────────── state ──────────────────────────── */

type Screen = "board" | "company";

type State = {
  screen: Screen;
  jobIndex: number; // which job we're applying to (0..)
  selectedJobId: string | null; // highlighted card on the board
  // cursor position in % of the stage box
  cx: number;
  cy: number;
  clicking: boolean;
  // form progress
  typed: Record<number, string>;
  activeField: number | null;
  selectOpen: boolean;
  attached: boolean;
  submitting: boolean;
  submitted: boolean;
  // learning toast
  memoryShown: boolean;
  // progress chip
  appliedCount: number;
  url: string;
};

const INITIAL: State = {
  screen: "board",
  jobIndex: 0,
  selectedJobId: null,
  cx: 50,
  cy: 16,
  clicking: false,
  typed: {},
  activeField: null,
  selectOpen: false,
  attached: false,
  submitting: false,
  submitted: false,
  memoryShown: false,
  appliedCount: 0,
  url: "jobs.openboard.io",
};

type Action = Partial<State> | ((s: State) => Partial<State>);

function reducer(state: State, action: Action): State {
  const patch = typeof action === "function" ? action(state) : action;
  return { ...state, ...patch };
}

/* ──────────────────────────── component ──────────────────────────── */

export default function HeroFlow() {
  const [reduced, setReduced] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // Static frame for SSR + reduced-motion: shows the company autofill key frame.
  if (!mounted || reduced) {
    return <StaticFrame />;
  }

  return <LiveFlow />;
}

/* ──────────────────────────── live, animated flow ──────────────────────────── */

function LiveFlow() {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = setTimeout(resolve, ms);
        timers.current.push(id);
      });

    // helper: move the fake cursor to a target, then optionally click
    const moveTo = async (cx: number, cy: number) => {
      dispatch({ cx, cy });
      await wait(T.cursorMove);
    };
    const click = async () => {
      dispatch({ clicking: true });
      await wait(T.clickPulse);
      dispatch({ clicking: false });
    };
    const type = async (fieldIndex: number, value: string) => {
      dispatch({ activeField: fieldIndex });
      for (let i = 1; i <= value.length; i++) {
        if (cancelled.current) return;
        dispatch((s) => ({ typed: { ...s.typed, [fieldIndex]: value.slice(0, i) } }));
        await wait(T.perChar);
      }
      await wait(T.fieldGap);
    };

    async function director() {
      let applied = 0; // local running tally; the closure-captured state never updates
      while (!cancelled.current) {
        /* ── reset for a fresh loop ── */
        dispatch({ ...INITIAL, appliedCount: applied });

        for (let j = 0; j < 2 && !cancelled.current; j++) {
          const job = JOBS[j];
          const shortened = j === 1; // second job runs a tighter cycle

          /* 1 ── job board */
          dispatch({ screen: "board", url: "jobs.openboard.io", jobIndex: j, selectedJobId: null, cx: 22, cy: 12 });
          await wait(T.boot);

          // cursor glides to the target card and clicks
          const cardY = 30 + j * 16; // approximate vertical center of card j
          await moveTo(64, cardY);
          await wait(T.hoverHold);
          dispatch({ selectedJobId: job.id });
          await click();
          await wait(T.hoverHold);

          /* 2 ── navigate to the real company site */
          dispatch({ screen: "company", url: `careers.${job.company.toLowerCase().replace(/\s+/g, "")}.com` });
          await wait(T.pageSwap);

          /* 3 ── auto-fill the form with a typing effect */
          if (!shortened) {
            await moveTo(50, 44);
            await type(0, FORM_FIELDS[0].value);
            await type(1, FORM_FIELDS[1].value);

            // dropdown select
            dispatch({ activeField: 2, selectOpen: true });
            await wait(T.selectHold);
            dispatch((s) => ({ typed: { ...s.typed, 2: FORM_FIELDS[2].value }, selectOpen: false }));
            await wait(T.fieldGap);

            // resume attach
            await moveTo(50, 70);
            dispatch({ attached: true });
            await wait(T.attach);
          } else {
            // shortened cycle: fields snap in, showing autonomy + reuse of memory
            dispatch({
              typed: { 0: FORM_FIELDS[0].value, 1: FORM_FIELDS[1].value, 2: FORM_FIELDS[2].value },
              attached: true,
              activeField: null,
            });
            await wait(T.applySite);
          }

          /* 4 ── submit on the real company site */
          await moveTo(50, 86);
          await click();
          dispatch({ submitting: true });
          await wait(T.applySite);
          applied += 1;
          dispatch({ submitting: false, submitted: true, appliedCount: applied });
          await wait(T.done);

          /* 5 ── learning moment: Propel remembered an answer (only first time) */
          if (!shortened) {
            dispatch({ memoryShown: true });
            await wait(T.memory);
            dispatch({ memoryShown: false });
          }

          // tidy up before next job
          dispatch({ submitted: false, typed: {}, attached: false });
          await wait(T.loopReset);
        }
      }
    }

    director();

    return () => {
      cancelled.current = true;
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    // Run exactly once. The director owns its own running tally and dispatches
    // patches into the reducer, so it has no reactive dependencies.
  }, []);

  return <Stage state={state} />;
}

/* ──────────────────────────── the rendered "screen" ──────────────────────────── */

function Stage({ state }: { state: State }) {
  const job = JOBS[state.jobIndex] ?? JOBS[0];

  return (
    <div
      aria-hidden
      className="ring-grad glass relative w-full max-w-[480px] select-none overflow-hidden rounded-2xl shadow-2xl shadow-iris-700/30"
    >
      {/* ── browser chrome ── */}
      <div className="flex items-center gap-2 border-b border-iris-400/12 bg-ink-800/70 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-ember-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        <div className="ml-3 flex h-6 flex-1 items-center gap-2 rounded-md bg-ink-700/70 px-2.5">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="text-iris-300/60">
            <rect x="4.5" y="10.5" width="15" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          <span key={state.url} className="urlfade truncate font-mono text-[11px] text-iris-300/80">
            {state.url}
          </span>
        </div>
        <div className="ml-1 flex items-center gap-1.5 rounded-full bg-iris-500/15 px-2.5 py-1 text-[10px] font-semibold text-iris-200 ring-1 ring-iris-400/30">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-iris-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-iris-400" />
          </span>
          Propel
        </div>
      </div>

      {/* ── viewport ── */}
      <div className="relative h-[340px] overflow-hidden bg-ink/40">
        {/* job-board screen */}
        <div
          className="absolute inset-0 transition-[transform,opacity] duration-500 ease-out"
          style={{
            transform: state.screen === "board" ? "translateX(0)" : "translateX(-8%)",
            opacity: state.screen === "board" ? 1 : 0,
            pointerEvents: "none",
          }}
        >
          <BoardScreen selectedId={state.selectedJobId} jobIndex={state.jobIndex} />
        </div>

        {/* company application screen */}
        <div
          className="absolute inset-0 transition-[transform,opacity] duration-500 ease-out"
          style={{
            transform: state.screen === "company" ? "translateX(0)" : "translateX(8%)",
            opacity: state.screen === "company" ? 1 : 0,
            pointerEvents: "none",
          }}
        >
          <CompanyScreen state={state} job={job} />
        </div>

        {/* simulated cursor — positioned by % via left/top so it tracks the viewport box,
            but animated with translate so the browser only composites transforms. */}
        <div
          className="pointer-events-none absolute z-30"
          style={{
            left: `${state.cx}%`,
            top: `${state.cy}%`,
            transition: `left ${T.cursorMove}ms cubic-bezier(0.55, 0, 0.1, 1), top ${T.cursorMove}ms cubic-bezier(0.55, 0, 0.1, 1)`,
          }}
        >
          <Cursor clicking={state.clicking} />
        </div>

        {/* learning / memory toast */}
        <MemoryToast show={state.memoryShown} />
      </div>

      {/* ── status footer ── */}
      <div className="flex items-center justify-between border-t border-iris-400/12 bg-ink-800/70 px-4 py-2.5">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-iris-300/60">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {state.submitting ? "Submitting…" : state.screen === "board" ? "Scanning openings" : "Auto-filling form"}
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-iris-300/70">
          <span className="text-emerald-400">{state.appliedCount}</span>
          <span className="text-iris-300/40">applied today</span>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────── job-board screen ──────────────────────────── */

function BoardScreen({ selectedId, jobIndex }: { selectedId: string | null; jobIndex: number }) {
  return (
    <div className="flex h-full flex-col px-4 py-3.5">
      {/* faux board header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-5 w-5 place-items-center rounded-md bg-iris-500/25 font-display text-[11px] font-bold text-iris-200">
            ob
          </span>
          <span className="font-display text-[13px] font-semibold text-cream/90">OpenBoard</span>
        </div>
        <div className="flex h-6 w-40 items-center gap-1.5 rounded-full bg-ink-700/60 px-2.5">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="text-iris-300/50">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="font-mono text-[10px] text-iris-300/50">frontend engineer</span>
        </div>
      </div>

      {/* job cards */}
      <div className="flex flex-col gap-2">
        {JOBS.map((j, i) => {
          const isTarget = i === jobIndex;
          const isSelected = selectedId === j.id;
          return (
            <div
              key={j.id}
              className="flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all duration-300"
              style={{
                borderColor: isSelected ? "rgba(129,140,248,0.7)" : "rgba(129,140,248,0.12)",
                background: isSelected ? "rgba(99,102,241,0.16)" : "rgba(13,11,31,0.55)",
                transform: isSelected ? "translateY(-1px) scale(1.012)" : "none",
                opacity: !isTarget && selectedId ? 0.42 : 1,
                boxShadow: isSelected ? "0 8px 24px -12px rgba(99,102,241,0.6)" : "none",
              }}
            >
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg font-display text-sm font-bold text-white"
                style={{ background: j.hue }}
              >
                {j.mark}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-display text-[12.5px] font-semibold text-cream/95">{j.role}</div>
                <div className="truncate font-mono text-[10px] text-iris-300/60">
                  {j.company} · {j.meta}
                </div>
              </div>
              <div
                className="shrink-0 rounded-full px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-wide transition-colors duration-300"
                style={{
                  background: isSelected ? "rgba(99,102,241,0.3)" : "rgba(129,140,248,0.1)",
                  color: isSelected ? "#c7d2fe" : "rgba(165,180,252,0.6)",
                }}
              >
                {isSelected ? "Opening…" : "Apply"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-auto pt-2 text-center font-mono text-[9px] text-iris-300/30">
        Propel watches the board and applies autonomously
      </div>
    </div>
  );
}

/* ──────────────────────────── company application screen ──────────────────────────── */

function CompanyScreen({ state, job }: { state: State; job: Job }) {
  return (
    <div className="flex h-full flex-col px-4 py-3.5">
      {/* faux company header */}
      <div className="mb-3 flex items-center gap-2.5 border-b border-iris-400/10 pb-3">
        <span
          className="grid h-7 w-7 place-items-center rounded-lg font-display text-[12px] font-bold text-white"
          style={{ background: job.hue }}
        >
          {job.mark}
        </span>
        <div className="min-w-0">
          <div className="truncate font-display text-[12.5px] font-semibold text-cream/95">{job.company} Careers</div>
          <div className="truncate font-mono text-[9.5px] text-iris-300/55">{job.role}</div>
        </div>
        <span className="ml-auto rounded-full bg-emerald-500/15 px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-wide text-emerald-300 ring-1 ring-emerald-400/25">
          Live site
        </span>
      </div>

      {/* the form */}
      <div className="flex flex-col gap-2.5">
        {FORM_FIELDS.map((f, i) => {
          const active = state.activeField === i;
          const isSelect = f.kind === "select";
          return (
            <div key={f.label}>
              <div className="mb-1 font-mono text-[9.5px] uppercase tracking-wide text-iris-300/55">{f.label}</div>
              <div
                className="relative flex h-[34px] items-center rounded-lg border px-2.5 font-mono text-[12px] transition-colors duration-200"
                style={{
                  borderColor: active ? "rgba(129,140,248,0.75)" : "rgba(129,140,248,0.12)",
                  background: "rgba(13,11,31,0.6)",
                  boxShadow: active ? "0 0 0 3px rgba(99,102,241,0.18)" : "none",
                }}
              >
                <span className="truncate text-cream/90">{state.typed[i] ?? ""}</span>
                {active && !isSelect && (
                  <span className="ml-px inline-block h-[13px] w-[2px] animate-caret-blink bg-iris-300 align-middle" />
                )}
                {isSelect && (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="ml-auto text-iris-300/60 transition-transform duration-200"
                    style={{ transform: state.selectOpen ? "rotate(180deg)" : "none" }}
                  >
                    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {/* dropdown options popover */}
                {isSelect && state.selectOpen && (
                  <div className="dropfade absolute left-0 right-0 top-[38px] z-20 overflow-hidden rounded-lg border border-iris-400/25 bg-ink-700/95 py-1 shadow-xl backdrop-blur">
                    {["2 years", "4 years", "6 years", "8+ years"].map((opt) => (
                      <div
                        key={opt}
                        className="px-2.5 py-1.5 font-mono text-[11px] transition-colors"
                        style={{
                          background: opt === f.value ? "rgba(99,102,241,0.28)" : "transparent",
                          color: opt === f.value ? "#e0e7ff" : "rgba(165,180,252,0.7)",
                        }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* resume attach */}
        <div
          className="flex items-center gap-2 rounded-lg border px-2.5 py-2 transition-all duration-300"
          style={{
            borderColor: state.attached ? "rgba(52,211,153,0.4)" : "rgba(129,140,248,0.12)",
            background: state.attached ? "rgba(16,185,129,0.08)" : "rgba(13,11,31,0.6)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-iris-300/80">
            <path d="M14 3v4a1 1 0 0 0 1 1h4" stroke="currentColor" strokeWidth="1.7" />
            <path d="M5 21V5a2 2 0 0 1 2-2h7l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z" stroke="currentColor" strokeWidth="1.7" />
          </svg>
          <span className="font-mono text-[11px] text-cream/75">resume_zach-rizzo.pdf</span>
          <span
            className="ml-auto font-mono text-[10px] font-semibold transition-opacity duration-300"
            style={{ color: "#34d399", opacity: state.attached ? 1 : 0 }}
          >
            attached
          </span>
        </div>

        {/* submit */}
        <button
          type="button"
          className="relative mt-0.5 flex h-10 w-full items-center justify-center overflow-hidden rounded-lg font-display text-[13px] font-semibold transition-transform duration-200"
          style={{
            background: state.submitted ? "#10b981" : "linear-gradient(100deg,#6366f1,#4f46e5)",
            color: state.submitted ? "#022c22" : "#fff",
            transform: state.submitting ? "scale(0.97)" : "scale(1)",
          }}
        >
          {state.submitted ? (
            <span className="flex items-center gap-1.5">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Submitted on {job.company}
            </span>
          ) : state.submitting ? (
            "Submitting…"
          ) : (
            "Submit application"
          )}
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────── memory / learning toast ──────────────────────────── */

function MemoryToast({ show }: { show: boolean }) {
  return (
    <div
      className="pointer-events-none absolute bottom-3 left-1/2 z-40 w-[88%] max-w-[330px] -translate-x-1/2"
      style={{
        opacity: show ? 1 : 0,
        transform: `translate(-50%, ${show ? "0" : "12px"})`,
        transition: "opacity 360ms ease, transform 360ms cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div className="ring-grad flex items-start gap-2.5 rounded-xl border border-iris-400/25 bg-ink-700/95 px-3 py-2.5 shadow-2xl backdrop-blur">
        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-iris-500/25 text-iris-200">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3a9 9 0 1 0 9 9M12 7v5l3 2"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div className="min-w-0">
          <div className="font-display text-[12px] font-semibold text-cream">Answer remembered</div>
          <div className="font-mono text-[10px] leading-snug text-iris-300/70">
            Saved “6 years experience” — Propel won&apos;t ask again.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────── simulated cursor ──────────────────────────── */

function Cursor({ clicking }: { clicking: boolean }) {
  return (
    <div className="relative">
      {/* click ripple — expands + fades on click */}
      <span
        className="absolute block h-6 w-6 rounded-full"
        style={{
          left: 6,
          top: 6,
          marginLeft: -12,
          marginTop: -12,
          background: "radial-gradient(circle, rgba(129,140,248,0.55), transparent 70%)",
          transform: clicking ? "scale(2)" : "scale(0)",
          opacity: clicking ? 0 : 1,
          transition: "transform 300ms ease-out, opacity 300ms ease-out",
        }}
      />
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
        style={{
          transform: clicking ? "scale(0.84)" : "scale(1)",
          transition: "transform 120ms ease-out",
        }}
      >
        <path
          d="M5 3.5 18.5 11l-6 1.4 3.2 6.2-2.6 1.3-3.2-6.3L5 18.6Z"
          fill="#f4f2ff"
          stroke="#1d1948"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* ──────────────────────────── static / reduced-motion fallback ──────────────────────────── */

function StaticFrame() {
  const filled: State = {
    ...INITIAL,
    screen: "company",
    url: `careers.${JOBS[0].company.toLowerCase().replace(/\s+/g, "")}.com`,
    typed: { 0: FORM_FIELDS[0].value, 1: FORM_FIELDS[1].value, 2: FORM_FIELDS[2].value },
    attached: true,
    submitted: true,
    appliedCount: 12,
  };
  return (
    <div className="relative">
      <Stage state={filled} />
      <span className="sr-only">
        Propel automatically fills and submits job applications on company career sites.
      </span>
    </div>
  );
}
