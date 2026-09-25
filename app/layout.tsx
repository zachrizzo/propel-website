import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { getCatalog } from "@/lib/plans";
import { site } from "@/lib/site";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  title: {
    default: "Propel: AI Job Application Agent for LinkedIn & Indeed",
    template: `%s · ${site.productName}`,
  },
  description: site.description,
  keywords: [
    "AI job application agent",
    "job application agent",
    "LinkedIn Easy Apply automation",
    "Indeed application automation",
    "multi-step job application automation",
    "auto apply to jobs",
    "job application autofill",
    "browser job application agent",
    "Propel Job Agent",
    "Propel Bridge",
  ],
  referrer: "origin-when-cross-origin",
  authors: [{ name: "Propel" }],
  creator: "Propel",
  publisher: "Propel",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    title: "Propel | Stop Starting Job Applications from Scratch",
    description: site.description,
    siteName: site.name,
    locale: "en_US",
      images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Propel — a browser agent for LinkedIn Easy Apply and Indeed applications",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Propel | Stop Starting Job Applications from Scratch",
    description: site.description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon-128.png", sizes: "128x128", type: "image/png" },
      { url: "/propel-logo.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icon-128.png",
  },
  category: "technology",
  other: {
    "apple-mobile-web-app-title": site.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#10151b",
  width: "device-width",
  initialScale: 1,
};

async function siteJsonLd() {
  const catalog = await getCatalog();
  const prices = catalog.tiers.map((plan) => plan.amountCents / 100);
  return {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      name: site.productName,
      alternateName: site.name,
      url: site.url,
      description: site.description,
      inLanguage: "en-US",
      publisher: { "@id": `${site.url}/#org` },
    },
    {
      "@type": "Organization",
      "@id": `${site.url}/#org`,
      name: site.name,
      url: site.url,
      logo: `${site.url}/propel-logo.png`,
      description: site.description,
      sameAs: [site.social.github, site.downloads.chrome],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${site.url}/#software`,
      name: site.productName,
      alternateName: [site.name, "Propel Bridge"],
      brand: { "@type": "Brand", name: site.name },
      applicationCategory: "BusinessApplication",
      operatingSystem: "macOS",
      description: site.description,
      featureList: [
        "Fills LinkedIn Easy Apply and Indeed applications in your Chrome tab",
        "Uses a saved profile to fill repeat application fields",
        "Attaches saved résumés and requested application materials",
        "Reuses saved answers when the same question appears later",
        "Brings you in to review the application before submission",
        "Tracks submitted applications",
      ],
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: Math.min(...prices).toFixed(2),
        highPrice: Math.max(...prices).toFixed(2),
        offerCount: catalog.tiers.length,
        url: `${site.url}/pricing`,
      },
      downloadUrl: site.downloads.mac,
      sameAs: [site.social.github, site.downloads.chrome],
      url: site.url,
    },
  ],
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="grain font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(await siteJsonLd()) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
