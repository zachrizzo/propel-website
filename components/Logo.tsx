export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <img
        src="/propel-logo.png"
        alt=""
        aria-hidden="true"
        className="shrink-0 rounded-[10px]"
        style={{
          width: size,
          height: size,
        }}
      />
      <span className="font-display text-[19px] font-bold tracking-tight text-cream">Propel</span>
    </span>
  );
}
