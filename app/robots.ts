import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // Sign-in callbacks are not pages. Account pages stay crawlable so their noindex is seen.
    rules: { userAgent: "*", allow: "/", disallow: ["/auth/"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
