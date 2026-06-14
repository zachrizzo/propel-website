// Pure-CSS atmospheric background: drifting aurora blobs over a dotted grid.
// Server component — no interactivity, just layered gradients with CSS animation.
export default function Aurora() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 dotgrid" />
      <div
        className="aurora animate-aurora-drift"
        style={{
          top: "-12%",
          left: "8%",
          width: "46vw",
          height: "46vw",
          background: "radial-gradient(circle at 30% 30%, #6366f1, transparent 62%)",
        }}
      />
      <div
        className="aurora animate-aurora-drift"
        style={{
          top: "2%",
          right: "-6%",
          width: "40vw",
          height: "40vw",
          background: "radial-gradient(circle at 60% 40%, #fb7185, transparent 60%)",
          animationDelay: "-6s",
          opacity: 0.4,
        }}
      />
      <div
        className="aurora animate-aurora-drift"
        style={{
          top: "30%",
          left: "30%",
          width: "38vw",
          height: "38vw",
          background: "radial-gradient(circle at 50% 50%, #4338ca, transparent 64%)",
          animationDelay: "-11s",
        }}
      />
      {/* fade to page bg at the bottom */}
      <div className="absolute inset-x-0 bottom-0 h-[40vh] bg-gradient-to-b from-transparent to-ink" />
    </div>
  );
}
