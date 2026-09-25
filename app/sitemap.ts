import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date("2026-09-25");
  const guides = new Date("2026-07-28");

  return [
    { url: site.url, lastModified: updated, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/pricing`, lastModified: updated, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/how-to-auto-apply-to-jobs`, lastModified: guides, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/job-application-agent`, lastModified: guides, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/privacy`, lastModified: updated, changeFrequency: "yearly", priority: 0.4 },
  ];
}
