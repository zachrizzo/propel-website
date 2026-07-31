"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  analyticsEnabled,
  flushAnalytics,
  trackDownloadClick,
  trackPageView,
  trackScrollDepth,
  trackSectionView,
} from "@/lib/analytics-client";
import {
  isTrackedPagePath,
  type DownloadTarget,
  type ScrollDepth,
} from "@/lib/analytics-events";

const SCROLL_MILESTONES: ScrollDepth[] = [25, 50, 75, 90];
const DOWNLOAD_TARGETS = new Set<DownloadTarget>([
  "mac",
  "windows",
  "chrome",
  "download_section",
]);
let previousPagePath: string | null = null;

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isTrackedPagePath(pathname) || !analyticsEnabled()) return;
    const pagePath = pathname;

    if (previousPagePath !== pagePath) {
      previousPagePath = pagePath;
      trackPageView(pagePath);
    }

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const sectionKey = (entry.target as HTMLElement).dataset.analyticsSection;
          if (sectionKey) trackSectionView(pagePath, sectionKey);
        }
      },
      // A narrow viewport band records intentional progress even for sections
      // that are taller than the screen and can never reach a 50% ratio.
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );
    document.querySelectorAll<HTMLElement>("[data-analytics-section]").forEach((section) => {
      sectionObserver.observe(section);
    });

    let scrollFrame: number | null = null;
    const checkScroll = () => {
      scrollFrame = null;
      const documentHeight = document.documentElement.scrollHeight;
      if (documentHeight <= 0) return;
      const progress = Math.min(100, ((window.scrollY + window.innerHeight) / documentHeight) * 100);
      for (const milestone of SCROLL_MILESTONES) {
        if (progress >= milestone) trackScrollDepth(pagePath, milestone);
      }
    };
    const onScroll = () => {
      if (scrollFrame === null) scrollFrame = window.requestAnimationFrame(checkScroll);
    };

    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLElement>("[data-analytics-download]");
      const target = link?.dataset.analyticsDownload as DownloadTarget | undefined;
      if (target && DOWNLOAD_TARGETS.has(target)) trackDownloadClick(pagePath, target);
    };

    const onPageExit = () => void flushAnalytics(true);
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") onPageExit();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", onPageExit);
    document.addEventListener("visibilitychange", onVisibilityChange);
    document.addEventListener("click", onClick, true);
    checkScroll();

    return () => {
      sectionObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", onPageExit);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("click", onClick, true);
      if (scrollFrame !== null) window.cancelAnimationFrame(scrollFrame);
      void flushAnalytics(true);
    };
  }, [pathname]);

  return null;
}
