"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";

const links = [
  { href: "#how", label: "How it works" },
  { href: "#demo", label: "Watch it apply" },
  { href: "#features", label: "Features" },
  { href: "#faq", label: "FAQ" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-iris-400/10 bg-ink/70 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" aria-label="Propel home">
          <Logo />
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[14px] font-medium text-iris-300/70 transition-colors hover:text-cream"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#download"
          className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 font-display text-[14px] font-semibold text-ink transition-transform hover:scale-[1.04] active:scale-95"
        >
          Get Propel
        </a>
      </div>
    </header>
  );
}
