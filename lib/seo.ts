import type { Metadata } from "next";
import { site } from "@/lib/site";

// Nested Open Graph and Twitter objects replace parent metadata in Next.js.
// Keep each public page's canonical URL, social text and preview image together.
export function publicPageMetadata({ title, description, path, article = false }: {
  title: string;
  description: string;
  path: string;
  article?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: article ? "article" : "website",
      url: `${site.url}${path}`,
      title,
      description,
      siteName: site.name,
      locale: "en_US",
      images: [{ url: "/opengraph-image", width: 1200, height: 630,
        alt: "Propel Extension — job applications in Chrome" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
  };
}
