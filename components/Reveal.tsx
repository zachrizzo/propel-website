"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
  id,
  immediate = false,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  id?: string;
  /** Animate on mount instead of on scroll — use for above-the-fold content,
   *  where whileInView can fail to fire for elements already in view. */
  immediate?: boolean;
}) {
  // Above-the-fold: pure-CSS load animation. No framer-motion, no IntersectionObserver,
  // no hydration timing — it cannot get stuck at opacity 0.
  if (immediate) {
    return (
      <div id={id} className={className ? `reveal-up ${className}` : "reveal-up"} style={{ animationDelay: `${delay}s` }}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      id={id}
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
