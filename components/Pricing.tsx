import Reveal from "@/components/Reveal";
import { formatPrice, type Catalog } from "@/lib/plans";

// Every plan includes the same agent; plans differ only in how many applications a month.
const INCLUDED = [
  "LinkedIn Easy Apply and supported Indeed",
  "Your saved profile, résumé and answers",
  "Review before anything is submitted",
  "A record of every application",
];

const Check = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="mt-[3px] shrink-0 text-iris-400">
    <path d="m5 12 4 4L19 6" />
  </svg>
);

export default function Pricing({ catalog, headingLevel = "h2" }: { catalog: Catalog; headingLevel?: "h1" | "h2" }) {
  const Heading = headingLevel;
  // Plan names sit one level below the section heading.
  const PlanHeading = headingLevel === "h1" ? "h2" : "h3";
  return (
    <div className="mx-auto max-w-6xl">
      <Reveal>
        <span className="font-mono text-[11px] uppercase tracking-widest text-iris-400">Pricing</span>
        <Heading className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl balance">
          Start free. <span className="text-gradient">Pay when you apply more.</span>
        </Heading>
        <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-mist">
          An application counts only when Propel reaches the final submit step. Skipped jobs and
          mismatches are free, and you can change or cancel your plan anytime.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {catalog.tiers.map((plan) => {
          const free = plan.kind === "free";
          return (
            <Reveal key={plan.key}>
              <div className={`flex h-full flex-col rounded-2xl p-6 ${free ? "border border-iris-400/15 bg-ink-800/60" : "ring-grad glass"}`}>
                <PlanHeading className="font-display text-lg font-semibold text-cream">{plan.name}</PlanHeading>
                <p className="mt-4 flex items-baseline gap-1.5 text-cream">
                  <span className="font-display text-4xl font-bold tracking-tight">{free ? "$0" : formatPrice(plan)}</span>
                  <span className="text-[14px] text-fog">/ month</span>
                </p>
                <p className="mt-3 text-[15px] font-medium text-iris-300">
                  {plan.monthlyApplications === null ? "Uncapped applications" : `${plan.monthlyApplications} applications a month`}
                </p>
                <div className="flex-1" />
                <a
                  href={free ? "/#download" : "/account"}
                  className={`mt-6 inline-flex h-11 items-center justify-center rounded-xl text-[14.5px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris-300 ${
                    free
                      ? "border border-iris-400/25 text-cream hover:border-iris-400/50 hover:bg-iris-500/10"
                      : "bg-gradient-to-br from-iris-600 to-iris-400 text-white shadow-[0_7px_18px_rgba(35,134,231,0.22)] hover:-translate-y-px"
                  }`}
                >
                  {free ? "Download free" : `Choose ${plan.name}`}
                </a>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal>
        <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-iris-400/10 bg-ink-800/40 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {INCLUDED.map((item) => (
              <li key={item} className="flex gap-2.5 text-[14.5px] text-mist">
                <Check />
                {item}
              </li>
            ))}
          </ul>
          {catalog.extra ? (
            <p className="text-[14px] text-mist lg:max-w-[260px] lg:text-right">
              Need a few more this month? Extra applications are{" "}
              <strong className="font-semibold text-cream">{formatPrice(catalog.extra)} each</strong>.
            </p>
          ) : null}
        </div>
      </Reveal>
    </div>
  );
}
