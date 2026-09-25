"use client";

/**
 * HeroFlow — a looping, code-driven "screen recording" of Propel preparing two
 * applications: LinkedIn Easy Apply first, then a job-board application.
 *
 * It shows what sets Propel apart from autofill: it works through every step of a
 * multi-step form, answers screening questions from what you saved, asks you in the
 * Propel side panel when it can't know an answer, remembers that answer, and reuses
 * it on the next application. It stops at "Ready for your review" and never submits.
 *
 * The job sites are light, like real sites; the browser chrome and the Propel side
 * panel are dark. Brand marks are our own approximations, and the applicant is
 * fictional.
 *
 * Purely decorative (aria-hidden): the hero copy carries the message. Reduced-motion
 * users get a static key frame. The scene is designed at a fixed size and scaled to
 * its column, so a phone sees the same picture, smaller.
 *
 * Pixel-perfect cursor: every clickable target registers a DOM ref, and the cursor is
 * driven to the element's measured center. All timers are cleared on unmount.
 */

import { useEffect, useReducer, useRef, useState, type CSSProperties, type ReactNode } from "react";

/* ──────────────────────────── data ──────────────────────────── */

type Job = {
  id: string;
  role: string;
  company: string;
  mark: string; // monogram for the company logo tile
  hue: string; // accent for the logo tile
  meta: string; // location · type
  salary?: string;
  rating?: string;
};

type BoardKey = "linkedin" | "jobsite";

type Board = {
  key: BoardKey;
  name: string;
  host: string; // address bar on the job list
  applyHost: string; // address bar on the application
  accent: string;
  surface: string;
  titleColor: string;
  applyLabel: string;
  query: string;
  jobs: Job[];
  targetId: string;
};

const BOARDS: Board[] = [
  {
    key: "linkedin",
    name: "LinkedIn",
    host: "linkedin.com/jobs",
    applyHost: "linkedin.com/jobs/view/easy-apply",
    accent: "#0A66C2",
    surface: "#f3f2ef",
    titleColor: "#0a66c2",
    applyLabel: "Easy Apply",
    query: "frontend engineer",
    targetId: "li-1",
    jobs: [
      { id: "li-1", role: "Senior Frontend Engineer", company: "Northwind Labs", mark: "N", hue: "#6366f1", meta: "Austin, TX · Hybrid", salary: "$180K–$210K" },
      { id: "li-2", role: "React Engineer", company: "Mapliner", mark: "M", hue: "#0ea5e9", meta: "San Francisco · Hybrid" },
      { id: "li-3", role: "UI Platform Engineer", company: "Quartz", mark: "Q", hue: "#f59e0b", meta: "New York, NY" },
    ],
  },
  {
    key: "jobsite",
    name: "Job board",
    host: "jobs.example.com/search",
    applyHost: "jobs.example.com/apply",
    accent: "#2557A7",
    surface: "#ffffff",
    titleColor: "#1d2a4d",
    applyLabel: "Apply",
    query: "product engineer",
    targetId: "js-1",
    jobs: [
      { id: "js-1", role: "Product Engineer", company: "Vellum", mark: "V", hue: "#fb7185", meta: "Austin, TX · Hybrid", salary: "$160K–$190K", rating: "4.6" },
      { id: "js-2", role: "Software Engineer II", company: "Brightwheel", mark: "B", hue: "#22c55e", meta: "Remote", rating: "4.1" },
      { id: "js-3", role: "Frontend Developer", company: "Harbor", mark: "H", hue: "#8b5cf6", meta: "Remote · Contract", rating: "4.4" },
    ],
  },
];

// A fictional applicant.
const APPLICANT = { first: "Jordan", resume: "jordan-lee-resume.pdf" };

const CONTACT = [
  { key: "name", label: "Full name", value: "Jordan Lee" },
  { key: "email", label: "Email", value: "jordan.lee@email.com" },
  { key: "phone", label: "Phone", value: "(555) 014-2290" },
] as const;

const YEARS = { label: "Years of experience with React", options: ["1–2 years", "3–4 years", "5+ years"], value: "5+ years" };
const SPONSORSHIP = { label: "Will you require visa sponsorship?", value: "No" };
// The one question Propel can't answer from what it knows: it asks, then remembers.
const RELOCATE = { label: "Willing to relocate to Austin, TX?", value: "No", short: "Relocate to Austin — No" };

/* ──────────────────────────── timing ──────────────────────────── */
// An energetic, sped-up recording: a few seconds per stage.

const T = {
  settle: 560, // ≥ the 500ms screen swap, so targets are measured after layout settles
  cursorMove: 560,
  hoverHold: 220,
  clickPulse: 240,
  perChar: 26,
  fieldGap: 160,
  stepSwap: 420,
  selectHold: 520,
  attach: 520,
  askHold: 1150,
  remembered: 1500,
  snap: 520,
  done: 1700,
  loopReset: 500,
};

const TIP = { x: 5, y: 4 }; // the cursor svg's pointer tip

/** The scene's design size; it is scaled down to fit narrower columns. */
const DESIGN = { width: 540, height: 452 };
const PANEL_WIDTH = 188;

/* ──────────────────────────── state ──────────────────────────── */

type Status = "working" | "asking" | "ready";

type State = {
  screen: "board" | "apply";
  boardIndex: number;
  selectedJobId: string | null;
  step: 1 | 2 | 3;
  cx: number; // cursor, % of the scene body
  cy: number;
  clicking: boolean;
  typed: Record<string, string>;
  activeField: string | null;
  attached: boolean;
  selectOpen: boolean;
  years: string | null;
  sponsorship: string | null;
  relocate: string | null;
  status: Status;
  log: string[];
  asking: boolean;
  memory: "saved" | "reused" | null;
  ready: boolean;
  prepared: number;
  url: string;
};

const INITIAL: State = {
  screen: "board",
  boardIndex: 0,
  selectedJobId: null,
  step: 1,
  cx: 20,
  cy: 16,
  clicking: false,
  typed: {},
  activeField: null,
  attached: false,
  selectOpen: false,
  years: null,
  sponsorship: null,
  relocate: null,
  status: "working",
  log: [],
  asking: false,
  memory: null,
  ready: false,
  prepared: 0,
  url: BOARDS[0].host,
};

type Action = Partial<State> | ((s: State) => Partial<State>);
const reducer = (state: State, action: Action): State => ({ ...state, ...(typeof action === "function" ? action(state) : action) });
const logged = (line: string) => (s: State) => ({ log: [...s.log, line].slice(-5) });

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

  return <Fit>{!mounted || reduced ? <StaticFrame /> : <LiveFlow />}</Fit>;
}

/** Scales the fixed-size scene to its column; the box keeps its aspect ratio in CSS, so nothing shifts. */
function Fit({ children }: { children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = outer.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / DESIGN.width));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={outer}
      className="relative w-[540px] max-w-full overflow-hidden rounded-2xl"
      style={{ aspectRatio: `${DESIGN.width} / ${DESIGN.height}` }}
    >
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: DESIGN.width, height: DESIGN.height, transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}

/* ──────────────────────────── the animated director ──────────────────────────── */

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
        timers.current.push(setTimeout(resolve, ms));
      });

    // A registered element's center, in % of the scene body, offset so the cursor tip lands on it.
    const aim = (key: string) => {
      const el = reg.current[key];
      const box = containerRef.current;
      if (!el || !box) return {};
      const c = box.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      if (!c.width || !c.height) return {};
      // The scene is scaled to fit; the tip offset is in design pixels.
      const scale = c.width / (box.offsetWidth || c.width);
      return {
        cx: ((r.left - c.left + r.width / 2 - TIP.x * scale) / c.width) * 100,
        cy: ((r.top - c.top + r.height / 2 - TIP.y * scale) / c.height) * 100,
      };
    };
    const moveTo = async (key: string) => {
      dispatch(aim(key));
      await wait(T.cursorMove);
    };
    const click = async () => {
      dispatch({ clicking: true });
      await wait(T.clickPulse);
      dispatch({ clicking: false });
    };
    const type = async (key: string, value: string) => {
      dispatch({ activeField: key });
      for (let i = 1; i <= value.length; i++) {
        if (cancelled.current) return;
        dispatch((s) => ({ typed: { ...s.typed, [key]: value.slice(0, i) } }));
        await wait(T.perChar);
      }
      await wait(T.fieldGap);
    };
    const next = async (step: 2 | 3) => {
      await moveTo("next");
      await click();
      dispatch({ step, activeField: null });
      await wait(T.stepSwap);
    };

    async function director() {
      while (!cancelled.current) {
        let prepared = 0;
        for (let b = 0; b < BOARDS.length && !cancelled.current; b++) {
          const board = BOARDS[b];
          // The second application reuses everything the first one taught Propel.
          const reuse = b > 0;
          const target = board.jobs.find((j) => j.id === board.targetId) ?? board.jobs[0];

          /* 1 ── the job list */
          dispatch({
            ...INITIAL,
            boardIndex: b,
            url: board.host,
            prepared,
            cx: 20,
            cy: 16,
            log: [`Found ${board.jobs.length} matching roles`],
          });
          await wait(T.settle);
          await moveTo("boardApply");
          await wait(T.hoverHold);
          dispatch({ selectedJobId: target.id });
          await click();
          await wait(T.hoverHold);

          /* 2 ── the application: step 1, contact details */
          dispatch({ screen: "apply", url: board.applyHost });
          dispatch(logged(`Opened ${board.key === "linkedin" ? "Easy Apply" : "the application"} · 3 steps`));
          await wait(T.settle);
          if (reuse) {
            dispatch({ typed: Object.fromEntries(CONTACT.map((f) => [f.key, f.value])) });
            await wait(T.snap);
          } else {
            await moveTo("field-name");
            for (const field of CONTACT) await type(field.key, field.value);
          }
          dispatch(logged("Filled contact details"));
          await next(2);

          /* 3 ── step 2, résumé */
          if (!reuse) {
            await moveTo("resume");
            await click();
          }
          dispatch({ attached: true });
          dispatch(logged(`Attached ${APPLICANT.resume}`));
          await wait(reuse ? T.snap : T.attach);
          await next(3);

          /* 4 ── step 3, screening questions */
          if (reuse) {
            dispatch({ years: YEARS.value, sponsorship: SPONSORSHIP.value, relocate: RELOCATE.value, memory: "reused" });
            dispatch(logged("Reused 3 saved answers"));
            await wait(T.remembered);
          } else {
            await moveTo("q-years");
            dispatch({ selectOpen: true, activeField: "years" });
            await wait(T.selectHold);
            dispatch({ years: YEARS.value, selectOpen: false, activeField: null });
            await wait(T.fieldGap);
            await moveTo("q-sponsorship");
            await click();
            dispatch({ sponsorship: SPONSORSHIP.value });
            dispatch(logged("Answered 2 screening questions"));
            await wait(T.fieldGap);

            // Nothing saved says whether Jordan would move to Austin: Propel asks.
            dispatch({ status: "asking", asking: true, activeField: "relocate" });
            dispatch(logged("1 question for you"));
            await wait(T.askHold);
            await moveTo("panel-answer");
            await click();
            dispatch({ asking: false, relocate: RELOCATE.value, memory: "saved", status: "working", activeField: null });
            dispatch(logged(`You answered: ${RELOCATE.short}`));
            await wait(T.remembered);
          }

          /* 5 ── ready for the person to review; Propel never submits here */
          await moveTo("finish");
          await wait(T.hoverHold);
          prepared += 1;
          dispatch({ ready: true, status: "ready", prepared });
          dispatch(logged("Ready for your review"));
          await wait(T.done);
        }
        await wait(T.loopReset);
      }
    }

    director();
    return () => {
      cancelled.current = true;
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    // The director runs once and owns the loop.
  }, []);

  return <Scene state={state} register={register} containerRef={containerRef} />;
}

/* ──────────────────────────── the scene ──────────────────────────── */

function Scene({
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
    <div aria-hidden className="ring-grad glass relative flex h-full w-full select-none flex-col overflow-hidden rounded-2xl shadow-2xl shadow-iris-700/30">
      {/* browser chrome */}
      <div className="flex h-11 shrink-0 items-center gap-2 border-b border-iris-400/12 bg-ink-800/90 px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        <div className="ml-3 flex h-6 flex-1 items-center gap-2 rounded-md bg-ink-700/70 px-2.5">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="text-fog">
            <rect x="4.5" y="10.5" width="15" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          <span key={state.url} className="urlfade truncate font-mono text-[11px] text-mist">
            {state.url}
          </span>
        </div>
        {/* the extension's toolbar icon, lit while the side panel is open */}
        <span className="grid h-6 w-6 place-items-center rounded-md bg-iris-500/20 ring-1 ring-iris-400/40">
          <img src="/icon-128.png" alt="" className="h-4 w-4" />
        </span>
      </div>

      {/* body: the job site and the Propel side panel */}
      <div ref={containerRef} className="relative flex min-h-0 flex-1">
        <div className="relative min-w-0 flex-1 overflow-hidden bg-white">
          <div
            className="absolute inset-0 transition-[transform,opacity] duration-500 ease-out"
            style={{ transform: state.screen === "board" ? "translateX(0)" : "translateX(-7%)", opacity: state.screen === "board" ? 1 : 0 }}
          >
            <BoardScreen board={board} selectedId={state.selectedJobId} register={register} />
          </div>
          <div
            className="absolute inset-0 transition-[transform,opacity] duration-500 ease-out"
            style={{ transform: state.screen === "apply" ? "translateX(0)" : "translateX(7%)", opacity: state.screen === "apply" ? 1 : 0 }}
          >
            <ApplyScreen state={state} board={board} job={target} register={register} />
          </div>
        </div>

        <SidePanel state={state} job={target} board={board} register={register} />

        {/* the simulated cursor, over both */}
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
      </div>
    </div>
  );
}

/* ──────────────────────────── the Propel side panel ──────────────────────────── */

const STATUS: Record<Status, { label: string; className: string; dot: string }> = {
  working: { label: "Working", className: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30", dot: "bg-emerald-400 animate-pulse" },
  asking: { label: "Needs you", className: "bg-amber-400/10 text-amber-300 ring-amber-400/35", dot: "bg-amber-400 animate-pulse" },
  ready: { label: "Ready", className: "bg-iris-500/15 text-iris-300 ring-iris-400/35", dot: "bg-iris-400" },
};

function SidePanel({ state, job, board, register }: { state: State; job: Job; board: Board; register: Register }) {
  const status = STATUS[state.status];
  const onApply = state.screen === "apply";
  return (
    <aside className="flex shrink-0 flex-col border-l border-iris-400/15 bg-ink-800 text-cream" style={{ width: PANEL_WIDTH }}>
      <div className="flex items-center gap-2 border-b border-iris-400/10 px-3 py-2.5">
        <img src="/icon-128.png" alt="" className="h-[18px] w-[18px]" />
        <span className="font-display text-[12.5px] font-bold">Propel</span>
        <span className={`ml-auto flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9.5px] font-semibold ring-1 transition-colors duration-300 ${status.className}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      <div className="border-b border-iris-400/10 px-3 py-2.5">
        <div className="font-mono text-[8.5px] uppercase tracking-wider text-fog">{onApply ? "Applying" : `Searching ${board.name}`}</div>
        <div className="mt-1 truncate text-[11.5px] font-semibold leading-tight">{onApply ? job.role : board.query}</div>
        {onApply ? (
          <>
            <div className="truncate text-[10px] text-mist">{job.company}</div>
            <div className="mt-2 flex gap-1">
              {[1, 2, 3].map((n) => (
                <span
                  key={n}
                  className="h-1 flex-1 rounded-full transition-colors duration-300"
                  style={{ background: state.ready || n < state.step ? "#34d399" : n === state.step ? "#3193e9" : "rgba(161,175,189,0.18)" }}
                />
              ))}
            </div>
            <div className="mt-1 text-[9px] text-fog">{state.ready ? "All 3 steps done" : `Step ${state.step} of 3`}</div>
          </>
        ) : null}
      </div>

      {/* what Propel did, newest last */}
      <ol className="flex-1 space-y-1.5 overflow-hidden px-3 py-2.5">
        {state.log.map((line, index) => {
          const latest = index === state.log.length - 1;
          return (
            <li key={`${state.boardIndex}-${line}`} className="urlfade flex items-start gap-1.5 text-[10px] leading-snug">
              <span className={`mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full ${latest ? "bg-iris-400" : "bg-mist/40"}`} />
              <span className={latest ? "text-cream" : "text-fog"}>{line}</span>
            </li>
          );
        })}
      </ol>

      {/* the question Propel can't answer itself */}
      <div
        className="mx-2.5 overflow-hidden rounded-lg border border-amber-400/35 bg-amber-400/10 transition-all duration-300"
        style={{ maxHeight: state.asking ? 120 : 0, opacity: state.asking ? 1 : 0, marginBottom: state.asking ? 8 : 0 }}
      >
        <div className="px-2.5 py-2">
          <div className="text-[9px] font-semibold uppercase tracking-wide text-amber-300">Question for you</div>
          <div className="mt-1 text-[10.5px] font-medium leading-snug text-cream">{RELOCATE.label}</div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <span className="rounded-md border border-iris-400/20 py-1 text-center text-[10px] text-mist">Yes</span>
            <span ref={register("panel-answer")} className="rounded-md bg-iris-500 py-1 text-center text-[10px] font-semibold text-white">
              No
            </span>
          </div>
        </div>
      </div>

      {/* memory: saved the first time, reused the next */}
      <div
        className="mx-2.5 overflow-hidden rounded-lg border border-iris-400/25 bg-iris-500/10 transition-all duration-300"
        style={{ maxHeight: state.memory ? 80 : 0, opacity: state.memory ? 1 : 0, marginBottom: state.memory ? 8 : 0 }}
      >
        <div className="flex items-start gap-2 px-2.5 py-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="mt-px shrink-0 text-iris-300">
            <path d="M12 3a9 9 0 1 0 9 9M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="text-[9.5px] leading-snug text-mist">
            <span className="font-semibold text-cream">{state.memory === "reused" ? "Reused your saved answers" : "Answer saved"}</span>
            <br />
            {state.memory === "reused" ? "No questions this time." : "Used next time it's asked."}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-iris-400/10 px-3 py-2 text-[9.5px]">
        <span className="text-fog">{APPLICANT.first}&apos;s applications</span>
        <span className="font-semibold text-emerald-300">{state.prepared} ready</span>
      </div>
    </aside>
  );
}

/* ──────────────────────────── job list ──────────────────────────── */

function BoardLogo({ board }: { board: Board }) {
  const size = 20;
  return (
    <span className="flex items-center gap-1.5">
      <span className="grid place-items-center rounded-[5px] font-bold text-white" style={{ background: board.accent, width: size, height: size, fontSize: size * 0.5 }}>
        {board.key === "linkedin" ? "in" : "J"}
      </span>
      <span className="font-semibold tracking-tight" style={{ color: board.accent, fontSize: 12 }}>
        {board.name}
      </span>
    </span>
  );
}

function BoardScreen({ board, selectedId, register }: { board: Board; selectedId: string | null; register: Register }) {
  return (
    <div className="flex h-full flex-col" style={{ background: board.surface }}>
      <div className="flex items-center gap-2 border-b border-black/10 bg-white px-3 py-2">
        <BoardLogo board={board} />
        <div className="ml-auto flex h-6 items-center gap-1 rounded-full border border-black/10 bg-black/[0.03] px-2">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style={{ color: "#94a3b8" }}>
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="font-sans text-[9.5px] text-slate-500">{board.query}</span>
        </div>
      </div>
      <div className="border-b border-black/[0.06] bg-white px-3 py-1.5 font-sans text-[9.5px] text-slate-400">
        <span className="font-semibold text-slate-600">{board.jobs.length * 47}</span> results · sorted by relevance
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-hidden px-2.5 py-2.5">
        {board.jobs.map((j) => {
          const isTarget = j.id === board.targetId;
          const isSelected = selectedId === j.id;
          const cardStyle: CSSProperties = {
            borderColor: isSelected ? board.accent : "rgba(15,23,42,0.10)",
            transform: isSelected ? "translateY(-1px)" : "none",
            opacity: selectedId && !isSelected ? 0.5 : 1,
            boxShadow: isSelected ? `0 10px 26px -14px ${board.accent}` : "0 1px 2px rgba(15,23,42,0.04)",
          };
          return (
            <div key={j.id} className="flex items-center gap-2.5 rounded-xl border bg-white px-2.5 py-2 transition-all duration-300" style={cardStyle}>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg font-display text-[13px] font-bold text-white" style={{ background: j.hue }}>
                {j.mark}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-sans text-[11.5px] font-semibold" style={{ color: board.titleColor }}>
                  {j.role}
                </div>
                <div className="truncate font-sans text-[9.5px] text-slate-500">
                  {j.company} · {j.meta}
                </div>
                {j.salary ? <div className="font-sans text-[9.5px] font-medium text-emerald-600">{j.salary}</div> : null}
              </div>
              <span
                ref={isTarget ? register("boardApply") : undefined}
                className="shrink-0 rounded-full px-2.5 py-1 font-sans text-[9.5px] font-semibold text-white"
                style={{ background: board.accent, filter: isSelected ? "brightness(0.92)" : "none" }}
              >
                {isSelected ? "Opening…" : board.applyLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ──────────────────────────── the application ──────────────────────────── */

function Field({ label, active, accent, children, fieldRef, tone = "normal" }: {
  label: string; active: boolean; accent: string; children: ReactNode; fieldRef?: (el: HTMLElement | null) => void; tone?: "normal" | "asking";
}) {
  const border = tone === "asking" ? "#f59e0b" : active ? accent : "rgba(15,23,42,0.14)";
  const ring = tone === "asking" ? "0 0 0 3px rgba(245,158,11,0.18)" : active ? `0 0 0 3px ${accent}22` : "none";
  return (
    <div ref={fieldRef}>
      <div className="mb-1 font-sans text-[9px] font-medium uppercase tracking-wide text-slate-400">{label}</div>
      <div className="relative flex h-[30px] items-center rounded-lg border bg-white px-2.5 font-sans text-[11.5px] transition-all duration-200" style={{ borderColor: border, boxShadow: ring }}>
        {children}
      </div>
    </div>
  );
}

function Choice({ options, value, accent, choiceRef }: { options: string[]; value: string | null; accent: string; choiceRef?: (el: HTMLElement | null) => void }) {
  return (
    <div className="flex gap-3">
      {options.map((option) => {
        const on = value === option;
        return (
          <span key={option} ref={option === "No" ? choiceRef : undefined} className="flex items-center gap-1.5 font-sans text-[11px] text-slate-700">
            <span className="grid h-3.5 w-3.5 place-items-center rounded-full border transition-colors" style={{ borderColor: on ? accent : "#cbd5e1" }}>
              <span className="h-1.5 w-1.5 rounded-full transition-transform duration-200" style={{ background: accent, transform: on ? "scale(1)" : "scale(0)" }} />
            </span>
            {option}
          </span>
        );
      })}
    </div>
  );
}

function ApplyScreen({ state, board, job, register }: { state: State; board: Board; job: Job; register: Register }) {
  const stepTitle = state.step === 1 ? "Contact info" : state.step === 2 ? "Résumé" : "Additional questions";
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-black/10 px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-md font-display text-[11px] font-bold text-white" style={{ background: job.hue }}>
            {job.mark}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate font-sans text-[11.5px] font-semibold text-slate-800">{job.role}</div>
            <div className="truncate font-sans text-[9.5px] text-slate-500">
              {job.company} · {board.key === "linkedin" ? "Easy Apply" : "Application"}
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${(state.step / 3) * 100}%`, background: board.accent }} />
          </div>
          <span className="font-sans text-[9px] font-medium text-slate-500">
            {state.step}/3 · {stepTitle}
          </span>
        </div>
      </div>

      <div key={state.step} className="urlfade flex flex-1 flex-col gap-2.5 px-3.5 py-3">
        {state.step === 1 &&
          CONTACT.map((field) => (
            <Field key={field.key} label={field.label} active={state.activeField === field.key} accent={board.accent} fieldRef={register(`field-${field.key}`)}>
              <span className="truncate text-slate-800">{state.typed[field.key] ?? ""}</span>
              {state.activeField === field.key ? (
                <span className="ml-px inline-block h-[13px] w-[2px] animate-caret-blink" style={{ background: board.accent }} />
              ) : null}
            </Field>
          ))}

        {state.step === 2 && (
          <div ref={register("resume")} className="flex flex-col gap-2">
            <div className="font-sans text-[9px] font-medium uppercase tracking-wide text-slate-400">Résumé</div>
            <div
              className="flex items-center gap-2 rounded-lg border px-2.5 py-3 transition-all duration-300"
              style={{
                borderColor: state.attached ? "rgba(16,185,129,0.5)" : "rgba(15,23,42,0.18)",
                borderStyle: state.attached ? "solid" : "dashed",
                background: state.attached ? "rgba(16,185,129,0.07)" : "#f8fafc",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-slate-500">
                <path d="M14 3v4a1 1 0 0 0 1 1h4" stroke="currentColor" strokeWidth="1.7" />
                <path d="M5 21V5a2 2 0 0 1 2-2h7l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z" stroke="currentColor" strokeWidth="1.7" />
              </svg>
              <span className="font-sans text-[11px] text-slate-600">{state.attached ? APPLICANT.resume : "Upload résumé (PDF)"}</span>
              {state.attached ? (
                <span className="ml-auto font-sans text-[9.5px] font-semibold text-emerald-600">✓ attached</span>
              ) : null}
            </div>
            <div className="font-sans text-[9.5px] text-slate-400">Cover letter (optional)</div>
          </div>
        )}

        {state.step === 3 && (
          <>
            <Field label={YEARS.label} active={state.activeField === "years"} accent={board.accent} fieldRef={register("q-years")}>
              <span className={state.years ? "text-slate-800" : "text-slate-300"}>{state.years ?? "Select…"}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="ml-auto text-slate-400">
                <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {state.selectOpen ? (
                <div className="dropfade absolute left-0 right-0 top-[33px] z-20 overflow-hidden rounded-lg border border-black/10 bg-white py-1 shadow-xl">
                  {YEARS.options.map((option) => (
                    <div
                      key={option}
                      className="px-2.5 py-1 font-sans text-[10.5px]"
                      style={{ background: option === YEARS.value ? `${board.accent}1f` : "transparent", color: option === YEARS.value ? board.accent : "#475569" }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              ) : null}
            </Field>
            <div>
              <div className="mb-1.5 font-sans text-[9px] font-medium uppercase tracking-wide text-slate-400">{SPONSORSHIP.label}</div>
              <Choice options={["Yes", "No"]} value={state.sponsorship} accent={board.accent} choiceRef={register("q-sponsorship")} />
            </div>
            <div
              className="-mx-1.5 rounded-lg px-1.5 py-1 transition-colors duration-300"
              style={{ background: state.activeField === "relocate" ? "rgba(245,158,11,0.10)" : "transparent" }}
            >
              <div className="mb-1.5 flex items-center justify-between font-sans text-[9px] font-medium uppercase tracking-wide text-slate-400">
                {RELOCATE.label}
                {state.activeField === "relocate" ? <span className="normal-case tracking-normal text-amber-600">Asked you →</span> : null}
              </div>
              <Choice options={["Yes", "No"]} value={state.relocate} accent={board.accent} />
            </div>
          </>
        )}

        <div className="flex-1" />
        {state.step < 3 ? (
          <span ref={register("next")} className="flex h-9 items-center justify-center rounded-lg font-sans text-[12px] font-semibold text-white" style={{ background: board.accent }}>
            Next
          </span>
        ) : (
          <span
            ref={register("finish")}
            className="flex h-9 items-center justify-center gap-1.5 rounded-lg font-sans text-[12px] font-semibold text-white transition-colors duration-300"
            style={{ background: state.ready ? "#10b981" : board.accent }}
          >
            {state.ready ? "✓ Ready for your review" : "Review application"}
          </span>
        )}
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
          background: "radial-gradient(circle, rgba(49,147,233,0.6), transparent 70%)",
          transform: clicking ? "scale(2)" : "scale(0)",
          opacity: clicking ? 0 : 1,
          transition: "transform 300ms ease-out, opacity 300ms ease-out",
        }}
      />
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        className="drop-shadow-[0_2px_5px_rgba(15,23,42,0.45)]"
        style={{ transform: clicking ? "scale(0.84)" : "scale(1)", transition: "transform 120ms ease-out" }}
      >
        <path d="M5 3.5 18.5 11l-6 1.4 3.2 6.2-2.6 1.3-3.2-6.3L5 18.6Z" fill="#fff" stroke="#10151b" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ──────────────────────────── static / reduced-motion frame ──────────────────────────── */

function StaticFrame() {
  const frame: State = {
    ...INITIAL,
    screen: "apply",
    step: 3,
    url: BOARDS[0].applyHost,
    typed: Object.fromEntries(CONTACT.map((f) => [f.key, f.value])),
    attached: true,
    years: YEARS.value,
    sponsorship: SPONSORSHIP.value,
    relocate: RELOCATE.value,
    memory: "saved",
    ready: true,
    status: "ready",
    prepared: 1,
    cx: 110,
    cy: 110,
    log: ["Filled contact details", `Attached ${APPLICANT.resume}`, "Answered 2 screening questions", `You answered: ${RELOCATE.short}`, "Ready for your review"],
  };
  return <Scene state={frame} />;
}
