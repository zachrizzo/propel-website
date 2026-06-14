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
  const shared = {
    id,
    className,
    initial: { opacity: 0, y },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  };
  if (immediate) {
    return (
      <motion.div {...shared} animate={{ opacity: 1, y: 0 }}>
        {children}
      </motion.div>
    );
  }
  return (
    <motion.div
      {...shared}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}
