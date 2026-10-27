"use client";

import { Analytics } from "@vercel/analytics/next";
import { publicAnalyticsUrl } from "@/lib/campaign";

export default function SiteAnalytics() {
  return <Analytics beforeSend={(event) => {
    const url = publicAnalyticsUrl(event.url);
    return url ? { ...event, url } : null;
  }} />;
}
