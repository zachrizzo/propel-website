"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

type OS = "mac" | "windows" | "other";

function detectOS(): OS {
  if (typeof navigator === "undefined") return "other";
  const p = `${navigator.userAgent} ${navigator.platform}`.toLowerCase();
  if (p.includes("mac")) return "mac";
  if (p.includes("win")) return "windows";
  return "other";
}

const MacGlyph = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.8-3.5.8s-1.8-.8-3-.8c-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.8 1.1 9 .7 1.1 1.6 2.3 2.8 2.3 1.1 0 1.5-.7 2.9-.7s1.7.7 2.9.7 2-1.1 2.7-2.1c.8-1.2 1.2-2.4 1.2-2.4s-2.3-.9-2.3-3.5ZM14.2 5.5c.6-.8 1-1.8.9-2.9-.9 0-2 .6-2.6 1.3-.6.7-1.1 1.7-.9 2.7 1 .1 2-.5 2.6-1.1Z" />
  </svg>
);

const WinGlyph = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M3 5.5 10.5 4.4v7.1H3V5.5ZM10.5 12.5v7.1L3 18.5v-6H10.5ZM11.6 4.2 21 3v8.5h-9.4V4.2ZM21 12.5V21l-9.4-1.3v-7.2H21Z" />
  </svg>
);

const ChromeGlyph = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
    <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.7" />
    <path d="M12 8.6h8.4M8.9 13.7 4.7 6.5M15.1 13.7l-4.2 7.2" stroke="currentColor" strokeWidth="1.7" />
  </svg>
);

export function PrimaryDownload() {
  const [os, setOs] = useState<OS>("other");
  useEffect(() => setOs(detectOS()), []);

  const macPrimary = site.downloadAvailability.mac
    ? { href: site.downloads.mac, label: "Download for Mac", glyph: <MacGlyph /> }
    : { href: site.downloads.mac, label: "Mac build coming soon", glyph: <MacGlyph /> };
  const primary =
    os === "windows"
      ? { href: site.downloads.windows, label: "Download for Windows", glyph: <WinGlyph /> }
      : macPrimary;
  const otherLabel = os === "windows" ? (site.downloadAvailability.mac ? "macOS" : "Mac status") : "Windows";
  const otherHref = os === "windows" ? site.downloads.mac : site.downloads.windows;

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row">
      <a
        href={primary.href}
        className="group relative inline-flex h-13 items-center gap-2.5 overflow-hidden rounded-full bg-cream px-7 py-3.5 font-display text-[15px] font-semibold text-ink transition-transform hover:scale-[1.03] active:scale-95"
      >
        <span className="relative z-10 flex items-center gap-2.5">
          {primary.glyph}
          {primary.label}
        </span>
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-iris-300/0 via-iris-300/40 to-iris-300/0 transition-transform duration-700 group-hover:translate-x-full" />
      </a>
      <a
        href={otherHref}
        className="text-[14px] font-medium text-iris-300/80 underline-offset-4 transition-colors hover:text-cream hover:underline"
      >
        or get it for {otherLabel}
      </a>
    </div>
  );
}

export function DownloadTrio() {
  const items = [
    {
      href: site.downloads.mac,
      label: "macOS",
      sub: site.downloadAvailability.mac ? "Universal .dmg" : "Signed build coming soon",
      glyph: <MacGlyph />,
    },
    { href: site.downloads.windows, label: "Windows", sub: "10 / 11 · x64 .exe", glyph: <WinGlyph /> },
    { href: site.downloads.chrome, label: "Chrome extension", sub: "Propel Bridge", glyph: <ChromeGlyph /> },
  ];
  return (
    <div className="grid w-full gap-3 sm:grid-cols-3">
      {items.map((it) => (
        <a
          key={it.label}
          href={it.href}
          className="ring-grad glass group flex items-center gap-3 rounded-xl px-4 py-4 transition-transform hover:-translate-y-1"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-iris-500/15 text-iris-300 transition-colors group-hover:bg-iris-500/25">
            {it.glyph}
          </span>
          <span className="min-w-0">
            <span className="block font-display text-[15px] font-semibold text-cream">{it.label}</span>
            <span className="block truncate font-mono text-[11px] text-iris-300/60">{it.sub}</span>
          </span>
        </a>
      ))}
    </div>
  );
}
