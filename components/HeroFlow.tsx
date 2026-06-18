"use client";

/**
 * HeroFlow — a code-driven, looping "sped-up screen recording" of Propel working
 * across the job boards people actually use (LinkedIn, Indeed, Glassdoor).
 *
 * The board/application surfaces are rendered LIGHT, like real sites, inside the
 * dark Propel browser chrome — so it reads like an actual recording. The brand
 * marks are our own CSS/SVG approximations (colors + glyphs), not copied assets.
 *
 * It is purely decorative (aria-hidden) and conveys nothing essential by motion:
 * the surrounding hero copy carries the real message. A static, calm fallback is
 * rendered for `prefers-reduced-motion` users that still shows a key frame.
 *
 * Pixel-perfect cursor: every clickable target registers a DOM ref; the simulated
 * cursor is driven to the element's MEASURED center (via getBoundingClientRect,
 * minus the cursor's tip offset) rather than hand-guessed percentages — so a
 * click always lands exactly on the element at any size. All timers are tracked
 * and cleared on unmount, and the loop bails the instant the component cancels.
 */

import { useEffect, useReducer, useRef, useState, type CSSProperties } from "react";

/* ──────────────────────────── data ──────────────────────────── */

type Job = {
  id: string;
  role: string;
  company: string;
  mark: string; // 1-2 letter monogram for the company logo tile
  hue: string; // company accent for the fake logo tile
  meta: string; // location · type
  salary?: string;
  rating?: string; // shown on Indeed/Glassdoor cards
};

type BoardKey = "linkedin" | "indeed" | "glassdoor";

type Board = {
  key: BoardKey;
  name: string;
  host: string; // address-bar URL
  accent: string; // brand color
  surface: string; // page background
  titleColor: string; // job title color (LinkedIn titles are blue links)
  applyLabel: string;
  query: string; // search term shown in the header
  jobs: Job[];
  targetId: string; // which job Propel applies to
};

const BOARDS: Board[] = [
  {
    key: "linkedin",
    name: "LinkedIn",
    host: "linkedin.com/jobs",
    accent: "#0A66C2",
    surface: "#f3f2ef",
    titleColor: "#0a66c2",
    applyLabel: "Easy Apply",
    query: "frontend engineer",
    targetId: "li-1",
    jobs: [
      { id: "li-1", role: "Senior Frontend Engineer", company: "Northwind Labs", mark: "N", hue: "#6366f1", meta: "Remote (US)", salary: "$180K–$210K" },
      { id: "li-2", role: "React Engineer", company: "Mapliner", mark: "M", hue: "#0ea5e9", meta: "San Francisco · Hybrid" },
      { id: "li-3", role: "UI Platform Engineer", company: "Quartz", mark: "Q", hue: "#f59e0b", meta: "New York, NY" },
    ],
  },
  {
    key: "indeed",
    name: "Indeed",
    host: "indeed.com",
    accent: "#2557A7",
    surface: "#ffffff",
    titleColor: "#1d2a4d",
    applyLabel: "Apply now",
    query: "product engineer",
    targetId: "in-1",
    jobs: [
      { id: "in-1", role: "Product Engineer", company: "Vellum", mark: "V", hue: "#fb7185", meta: "Remote", salary: "$160K–$190K", rating: "4.6" },
      { id: "in-2", role: "Software Engineer II", company: "Brightwheel", mark: "B", hue: "#22c55e", meta: "Austin, TX", rating: "4.1" },
      { id: "in-3", role: "Frontend Developer", company: "Harbor", mark: "H", hue: "#8b5cf6", meta: "Remote · Contract", rating: "4.4" },
    ],
  },
  {
    key: "glassdoor",
    name: "Glassdoor",
    host: "glassdoor.com/Job",
    accent: "#0caa41",
    surface: "#ffffff",
    titleColor: "#0f172a",
    applyLabel: "Apply",
    query: "full-stack engineer",
    targetId: "gd-1",
    jobs: [
      { id: "gd-1", role: "Full-Stack Engineer", company: "Cobalt", mark: "C", hue: "#34d399", meta: "Remote", salary: "$150K–$185K", rating: "4.7" },
      { id: "gd-2", role: "Web Engineer", company: "Aperture", mark: "A", hue: "#fbbf24", meta: "Denver, CO", rating: "3.9" },
      { id: "gd-3", role: "Senior Developer", company: "Lumen", mark: "L", hue: "#38bdf8", meta: "Remote (US)", rating: "4.3" },
    ],
  },
];

type FormField = { label: string; value: string; kind?: "select" };

const FORM_FIELDS: FormField[] = [
  { label: "Full name", value: "Zach Rizzo" },
  { label: "Email", value: "zach@email.com" },
  { label: "Years of experience", value: "6 years", kind: "select" },
];

const APPLICANT = { resume: "resume_zach-rizzo.pdf" };

/* ──────────────────────────── timing ──────────────────────────── */
// Tuned to feel like an energetic sped-up recording. Each stage is a few seconds.

const T = {
  boot: 380,
  settle: 560, // ≥ the 500ms screen-swap transition, so we measure settled layout
  cursorMove: 600, // glide duration for the simulated cursor
  hoverHold: 240,
  clickPulse: 260,
  perChar: 30,
  fieldGap: 150,
  selectHold: 460,
  attach: 560,
  submit: 740,
  memory: 1700,
  done: 1300,
  loopReset: 460,
};

/* the cursor svg's pointer tip, in px, measured from the cursor div's origin */
const TIP = { x: 5, y: 4 };

/* ──────────────────────────── state ──────────────────────────── */

type Screen = "board" | "apply";

type State = {
  screen: Screen;
  boardIndex: number;
  selectedJobId: string | null; // highlighted card on the board
  cx: number; // cursor x, % of the viewport box
  cy: number; // cursor y, % of the viewport box
  clicking: boolean;
  typed: Record<number, string>;
  activeField: number | null;
  selectOpen: boolean;
  attached: boolean;
  submitting: boolean;
  submitted: boolean;
  memoryShown: boolean;
  appliedCount: number;
  url: string;
};

const INITIAL: State = {
  screen: "board",
  boardIndex: 0,
  selectedJobId: null,
  cx: 18,
  cy: 12,
  clicking: false,
  typed: {},
  activeField: null,
  selectOpen: false,
  attached: false,
  submitting: false,
  submitted: false,
  memoryShown: false,
  appliedCount: 0,
  url: BOARDS[0].host,
};

type Action = Partial<State> | ((s: State) => Partial<State>);

function reducer(state: State, action: Action): State {
  const patch = typeof action === "function" ? action(state) : action;
  return { ...state, ...patch };
}

type Register = (key: string) => (el: HTMLElement | null) => void;
const NOOP_REGISTER: Register = () => () => {};

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

  if (!mounted || reduced) return <StaticFrame />;
  return <LiveFlow />;
}

/* ──────────────────────────── live, animated flow ──────────────────────────── */

function LiveFlow() {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const cancelled = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reg = useRef<Record<string, HTMLElement | null>>({});
  const register: Register = (key) => (el) => {
    reg.current[key] = el;
  };

  useEffect(() => {
    cancelled.current = false;
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = setTimeout(resolve, ms);
        timers.current.push(id);
      });

    // Measure a registered element's center relative to the viewport box and
    // return cursor coords in % (offset so the cursor TIP lands on the center).
    const aim = (key: string, fallback: { cx: number; cy: number }) => {
      const el = reg.current[key];
      const cont = containerRef.current;
      if (!el || !cont) return fallback;
      const c = cont.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      if (c.width === 0 || c.height === 0) return fallback;
      const px = r.left - c.left + r.width / 2 - TIP.x;
      const py = r.top - c.top + r.height / 2 - TIP.y;
      return { cx: (px / c.width) * 100, cy: (py / c.height) * 100 };
    };

    const moveTo = async (key: string, fallback: { cx: number; cy: number }) => {
      dispatch(aim(key, fallback));
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
      let applied = 0;
      let learned = false; // memory toast only fires the first time
      while (!cancelled.current) {
        dispatch({ ...INITIAL, appliedCount: applied });

        for (let b = 0; b < BOARDS.length && !cancelled.current; b++) {
          const board = BOARDS[b];
          const reuse = learned; // once Propel has learned, fields snap in instantly
          const target = board.jobs.find((j) => j.id === board.targetId) ?? board.jobs[0];

          /* 1 ── the job board */
          dispatch({
            screen: "board",
            url: board.host,
            boardIndex: b,
            selectedJobId: null,
            typed: {},
            attached: false,
            submitted: false,
            submitting: false,
            activeField: null,
            cx: 16,
            cy: 12,
          });
          await wait(T.settle);

          // glide to the target's Apply button and click
          await moveTo("boardApply", { cx: 78, cy: 36 });
          await wait(T.hoverHold);
          dispatch({ selectedJobId: target.id });
          await click();
          await wait(T.hoverHold);

          /* 2 ── the application opens */
          dispatch({ screen: "apply" });
          await wait(T.settle);

          /* 3 ── auto-fill */
          if (!reuse) {
            await moveTo("field-0", { cx: 50, cy: 40 });
            await type(0, FORM_FIELDS[0].value);
            await type(1, FORM_FIELDS[1].value);

            // dropdown select
            await moveTo("field-2", { cx: 50, cy: 64 });
            dispatch({ activeField: 2, selectOpen: true });
            await wait(T.selectHold);
            dispatch((s) => ({ typed: { ...s.typed, 2: FORM_FIELDS[2].value }, selectOpen: false }));
            await wait(T.fieldGap);

            // resume attach
            await moveTo("resume", { cx: 50, cy: 78 });
            dispatch({ attached: true, activeField: null });
            await wait(T.attach);
          } else {
            // memory reuse: everything snaps in at once — the autonomy payoff
            dispatch({
              typed: { 0: FORM_FIELDS[0].value, 1: FORM_FIELDS[1].value, 2: FORM_FIELDS[2].value },
              attached: true,
              activeField: null,
            });
            await wait(T.submit);
          }

          /* 4 ── submit */
          await moveTo("submit", { cx: 50, cy: 90 });
          await click();
          dispatch({ submitting: true });
          await wait(T.submit);
          applied += 1;
          dispatch({ submitting: false, submitted: true, appliedCount: applied });
          await wait(T.done);

          /* 5 ── learning moment (first application only) */
          if (!reuse) {
            learned = true;
            dispatch({ memoryShown: true });
            await wait(T.memory);
            dispatch({ memoryShown: false });
          }

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
    // Run exactly once — the director owns its tally and dispatches into the reducer.
  }, []);

  return <Stage state={state} register={register} containerRef={containerRef} />;
}

/* ──────────────────────────── the rendered "screen" ──────────────────────────── */

function Stage({
  state,
  register = NOOP_REGISTER,
  containerRef,
}: {
  state: State;
  register?: Register;
  containerRef?: React.RefObject<HTMLDivElement>;
}) {
  const board = BOARDS[state.boardIndex] ?? BOARDS[0];
  const target = board.jobs.find((j) => j.id === board.targetId) ?? board.jobs[0];

  return (
    <div
      aria-hidden
      className="ring-grad glass relative w-full max-w-[480px] select-none overflow-hidden rounded-2xl shadow-2xl shadow-iris-700/30"
    >
      {/* ── browser chrome (dark, Propel-themed) ── */}
      <div className="flex items-center gap-2 border-b border-iris-400/12 bg-ink-800/80 px-4 py-3">
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

      {/* ── viewport (light, like a real site) ── */}
      <div ref={containerRef} className="relative h-[360px] overflow-hidden bg-white">
        {/* board screen */}
        <div
          className="absolute inset-0 transition-[transform,opacity] duration-500 ease-out"
          style={{
            transform: state.screen === "board" ? "translateX(0)" : "translateX(-7%)",
            opacity: state.screen === "board" ? 1 : 0,
            pointerEvents: "none",
          }}
        >
          <BoardScreen board={board} selectedId={state.selectedJobId} register={register} />
        </div>

        {/* application screen */}
        <div
          className="absolute inset-0 transition-[transform,opacity] duration-500 ease-out"
          style={{
            transform: state.screen === "apply" ? "translateX(0)" : "translateX(7%)",
            opacity: state.screen === "apply" ? 1 : 0,
            pointerEvents: "none",
          }}
        >
          <ApplyScreen state={state} board={board} job={target} register={register} />
        </div>

        {/* simulated cursor — positioned by % via left/top, animated as a transform */}
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

      {/* ── status footer (dark, Propel-themed) ── */}
      <div className="flex items-center justify-between border-t border-iris-400/12 bg-ink-800/80 px-4 py-2.5">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-iris-300/60">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {state.submitting
            ? "Submitting…"
            : state.screen === "board"
              ? `Scanning ${board.name}`
              : state.submitted
                ? "Application sent"
                : "Auto-filling form"}
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-iris-300/70">
          <span className="text-emerald-400">{state.appliedCount}</span>
          <span className="text-iris-300/40">applied today</span>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────── brand marks ──────────────────────────── */

function BoardLogo({ board, size = 22 }: { board: Board; size?: number }) {
  if (board.key === "linkedin") {
    return (
      <span className="flex items-center gap-1.5">
        <span
          className="grid place-items-center rounded-[5px] font-bold text-white"
          style={{ background: board.accent, width: size, height: size, fontSize: size * 0.5 }}
        >
          in
        </span>
        <span className="font-semibold tracking-tight" style={{ color: board.accent, fontSize: size * 0.62 }}>
          LinkedIn
        </span>
      </span>
    );
  }
  if (board.key === "indeed") {
    return (
      <span className="flex items-baseline font-bold tracking-tight" style={{ color: board.accent, fontSize: size * 0.78 }}>
        indeed
        <span className="ml-[1px] inline-block rounded-full" style={{ width: size * 0.16, height: size * 0.16, background: board.accent }} />
      </span>
    );
  }
  // glassdoor
  return (
    <span className="flex items-center gap-1.5">
      <span className="relative grid place-items-center rounded-[6px]" style={{ background: board.accent, width: size, height: size }}>
        <span className="block rounded-full bg-white" style={{ width: size * 0.32, height: size * 0.32 }} />
      </span>
      <span className="font-semibold tracking-tight" style={{ color: board.accent, fontSize: size * 0.6 }}>
        glassdoor
      </span>
    </span>
  );
}

function Stars({ rating, color }: { rating: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold" style={{ color }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill={color}>
        <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.8 6.1 20.8l1.2-6.6L2.5 9l6.6-.9z" />
      </svg>
      {rating}
    </span>
  );
}

/* ──────────────────────────── job-board screen ──────────────────────────── */

function BoardScreen({ board, selectedId, register }: { board: Board; selectedId: string | null; register: Register }) {
  return (
    <div className="flex h-full flex-col" style={{ background: board.surface }}>
      {/* header */}
      <div className="flex items-center gap-2.5 border-b border-black/10 bg-white/90 px-4 py-2.5">
        <BoardLogo board={board} />
        <div className="ml-auto flex h-7 items-center gap-1.5 rounded-full border border-black/10 bg-black/[0.03] px-2.5">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ color: "#94a3b8" }}>
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="font-sans text-[10.5px] text-slate-500">{board.query}</span>
        </div>
      </div>

      {/* result count strip */}
      <div className="border-b border-black/[0.06] bg-white px-4 py-1.5 font-sans text-[10px] text-slate-400">
        <span className="font-semibold text-slate-600">{board.jobs.length * 47}</span> results · sorted by relevance
      </div>

      {/* cards */}
      <div className="flex flex-1 flex-col gap-2 overflow-hidden px-3 py-3">
        {board.jobs.map((j) => {
          const isTarget = j.id === board.targetId;
          const isSelected = selectedId === j.id;
          const cardStyle: CSSProperties = {
            borderColor: isSelected ? board.accent : "rgba(15,23,42,0.10)",
            background: "#fff",
            transform: isSelected ? "translateY(-1px)" : "none",
            opacity: selectedId && !isSelected ? 0.5 : 1,
            boxShadow: isSelected ? `0 10px 26px -14px ${board.accent}` : "0 1px 2px rgba(15,23,42,0.04)",
          };
          return (
            <div
              key={j.id}
              className="flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all duration-300"
              style={cardStyle}
            >
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg font-display text-sm font-bold text-white"
                style={{ background: j.hue }}
              >
                {j.mark}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-sans text-[12.5px] font-semibold" style={{ color: board.titleColor }}>
                  {j.role}
                </div>
                <div className="truncate font-sans text-[10.5px] text-slate-500">
                  {j.company} · {j.meta}
                </div>
                <div className="mt-0.5 flex items-center gap-2">
                  {j.salary && <span className="font-sans text-[10px] font-medium text-emerald-600">{j.salary}</span>}
                  {j.rating && <Stars rating={j.rating} color={board.key === "glassdoor" ? board.accent : "#f59e0b"} />}
                </div>
              </div>
              {/* apply control — the target card's button is what the cursor aims at */}
              <button
                type="button"
                ref={isTarget ? register("boardApply") : undefined}
                className="shrink-0 rounded-full px-3 py-1.5 font-sans text-[10.5px] font-semibold transition-colors duration-300"
                style={
                  isSelected
                    ? { background: board.accent, color: "#fff", filter: "brightness(0.92)" }
                    : { background: board.accent, color: "#fff" }
                }
              >
                <span className="flex items-center gap-1">
                  {board.key === "linkedin" && (
                    <span className="grid h-3 w-3 place-items-center rounded-[2px] bg-white/25 text-[7px] font-bold leading-none">
                      in
                    </span>
                  )}
                  {isSelected ? "Opening…" : board.applyLabel}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <div className="border-t border-black/[0.06] bg-white px-4 py-1.5 text-center font-sans text-[9px] text-slate-400">
        Propel scans {board.name} and applies for you — autonomously
      </div>
    </div>
  );
}

/* ──────────────────────────── application screen ──────────────────────────── */

function ApplyScreen({ state, board, job, register }: { state: State; board: Board; job: Job; register: Register }) {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* header — themed as the board's apply flow */}
      <div className="flex items-center gap-2.5 border-b border-black/10 px-4 py-2.5">
        <span
          className="grid h-7 w-7 place-items-center rounded-lg font-display text-[12px] font-bold text-white"
          style={{ background: job.hue }}
        >
          {job.mark}
        </span>
        <div className="min-w-0">
          <div className="truncate font-sans text-[12.5px] font-semibold text-slate-800">{job.role}</div>
          <div className="truncate font-sans text-[10px] text-slate-500">{job.company}</div>
        </div>
        <span
          className="ml-auto flex items-center gap-1 rounded-full px-2.5 py-1 font-sans text-[9.5px] font-semibold text-white"
          style={{ background: board.accent }}
        >
          {board.key === "linkedin" && (
            <span className="grid h-3 w-3 place-items-center rounded-[2px] bg-white/25 text-[7px] font-bold leading-none">in</span>
          )}
          {board.applyLabel}
        </span>
      </div>

      {/* form */}
      <div className="flex flex-1 flex-col gap-2 px-4 py-3">
        {FORM_FIELDS.map((f, i) => {
          const active = state.activeField === i;
          const isSelect = f.kind === "select";
          return (
            <div key={f.label} ref={register(`field-${i}`)}>
              <div className="mb-1 font-sans text-[9.5px] font-medium uppercase tracking-wide text-slate-400">{f.label}</div>
              <div
                className="relative flex h-[34px] items-center rounded-lg border px-2.5 font-sans text-[12px] transition-all duration-200"
                style={{
                  borderColor: active ? board.accent : "rgba(15,23,42,0.14)",
                  background: "#fff",
                  boxShadow: active ? `0 0 0 3px ${board.accent}22` : "none",
                }}
              >
                <span className="truncate text-slate-800">{state.typed[i] ?? ""}</span>
                {active && !isSelect && (
                  <span
                    className="ml-px inline-block h-[14px] w-[2px] animate-caret-blink align-middle"
                    style={{ background: board.accent }}
                  />
                )}
                {!active && !state.typed[i] && (
                  <span className="font-sans text-[11.5px] text-slate-300">{isSelect ? "Select…" : f.label}</span>
                )}
                {isSelect && (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="ml-auto text-slate-400 transition-transform duration-200"
                    style={{ transform: state.selectOpen ? "rotate(180deg)" : "none" }}
                  >
                    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {isSelect && state.selectOpen && (
                  <div className="dropfade absolute left-0 right-0 top-[38px] z-20 overflow-hidden rounded-lg border border-black/10 bg-white py-1 shadow-xl">
                    {["2 years", "4 years", "6 years", "8+ years"].map((opt) => {
                      const on = opt === f.value;
                      return (
                        <div
                          key={opt}
                          className="px-2.5 py-1.5 font-sans text-[11px] transition-colors"
                          style={{ background: on ? `${board.accent}1f` : "transparent", color: on ? board.accent : "#475569" }}
                        >
                          {opt}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* resume attach */}
        <div
          ref={register("resume")}
          className="flex items-center gap-2 rounded-lg border px-2.5 py-2 transition-all duration-300"
          style={{
            borderColor: state.attached ? "rgba(16,185,129,0.5)" : "rgba(15,23,42,0.14)",
            background: state.attached ? "rgba(16,185,129,0.07)" : "#fff",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-slate-500">
            <path d="M14 3v4a1 1 0 0 0 1 1h4" stroke="currentColor" strokeWidth="1.7" />
            <path d="M5 21V5a2 2 0 0 1 2-2h7l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z" stroke="currentColor" strokeWidth="1.7" />
          </svg>
          <span className="font-sans text-[11px] text-slate-600">{APPLICANT.resume}</span>
          <span
            className="ml-auto flex items-center gap-1 font-sans text-[10px] font-semibold text-emerald-600 transition-opacity duration-300"
            style={{ opacity: state.attached ? 1 : 0 }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            attached
          </span>
        </div>

        {/* submit */}
        <button
          type="button"
          ref={register("submit")}
          className="relative mt-auto flex h-10 w-full items-center justify-center overflow-hidden rounded-lg font-sans text-[13px] font-semibold text-white transition-transform duration-200"
          style={{
            background: state.submitted ? "#10b981" : board.accent,
            transform: state.submitting ? "scale(0.97)" : "scale(1)",
          }}
        >
          {state.submitted ? (
            <span className="flex items-center gap-1.5">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Application submitted
            </span>
          ) : state.submitting ? (
            "Submitting…"
          ) : (
            `Submit · ${board.applyLabel}`
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
            <path d="M12 3a9 9 0 1 0 9 9M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div className="min-w-0">
          <div className="font-display text-[12px] font-semibold text-cream">Answer remembered</div>
          <div className="font-mono text-[10px] leading-snug text-iris-300/70">
            Saved “6 years experience” — reused on every next board.
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
      <span
        className="absolute block h-6 w-6 rounded-full"
        style={{
          left: TIP.x,
          top: TIP.y,
          marginLeft: -12,
          marginTop: -12,
          background: "radial-gradient(circle, rgba(99,102,241,0.6), transparent 70%)",
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
        className="drop-shadow-[0_2px_5px_rgba(15,23,42,0.45)]"
        style={{ transform: clicking ? "scale(0.84)" : "scale(1)", transition: "transform 120ms ease-out" }}
      >
        <path
          d="M5 3.5 18.5 11l-6 1.4 3.2 6.2-2.6 1.3-3.2-6.3L5 18.6Z"
          fill="#fff"
          stroke="#1d1948"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* ──────────────────────────── static / reduced-motion fallback ──────────────────────────── */

function StaticFrame() {
  const board = BOARDS[0];
  const filled: State = {
    ...INITIAL,
    screen: "apply",
    url: board.host,
    typed: { 0: FORM_FIELDS[0].value, 1: FORM_FIELDS[1].value, 2: FORM_FIELDS[2].value },
    attached: true,
    submitted: true,
    appliedCount: 12,
    cx: 50,
    cy: 90,
  };
  return (
    <div className="relative">
      <Stage state={filled} />
      <span className="sr-only">
        Propel automatically fills and submits job applications across LinkedIn, Indeed, and Glassdoor.
      </span>
    </div>
  );
}
