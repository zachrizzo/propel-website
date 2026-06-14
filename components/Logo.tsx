export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className="grid place-items-center rounded-[10px] shadow-lg shadow-iris-700/40"
        style={{
          width: size,
          height: size,
          background: "linear-gradient(160deg, #818cf8, #4338ca)",
        }}
      >
        <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 100 100" aria-hidden>
          <path d="M50 16 L80 54 H62 V84 H38 V54 H20 Z" fill="#fff" />
        </svg>
      </span>
      <span className="font-display text-[19px] font-bold tracking-tight text-cream">Propel</span>
    </span>
  );
}
