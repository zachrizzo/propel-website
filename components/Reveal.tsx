import type { CSSProperties, ReactNode } from "react";

/** Fades content in. Above the fold (`immediate`) it plays once on load; below the
 *  fold it follows the scroll, in CSS only. Neither hides content without JavaScript. */
export default function Reveal({
  children,
  delay = 0,
  className,
  id,
  immediate = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  id?: string;
  immediate?: boolean;
}) {
  const base = immediate ? "reveal-up" : "reveal";
  const style: CSSProperties | undefined = immediate && delay ? { animationDelay: `${delay}s` } : undefined;
  return (
    <div id={id} className={className ? `${base} ${className}` : base} style={style}>
      {children}
    </div>
  );
}
