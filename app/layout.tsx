import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
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
    default: "Propel: LinkedIn Easy Apply & Multi-Step Job Agent",
    template: `%s · ${site.productName}`,
  },
  description: site.description,
  keywords: [
    "AI job application agent",
    "job application agent",
    "LinkedIn Easy Apply automation",
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
    title: "Propel | Easy Apply and Multi-Step Job Applications",
    description: site.description,
    siteName: site.name,
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Propel — one agent for LinkedIn Easy Apply and multi-step job applications",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Propel | Easy Apply and Multi-Step Job Applications",
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
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-128.png", sizes: "128x128", type: "image/png" },
    ],
    apple: "/icon-128.png",
  },
  category: "technology",
  other: {
    "apple-mobile-web-app-title": site.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#fbfbff",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
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
      logo: `${site.url}/icon-128.png`,
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
      operatingSystem: "macOS, Windows",
      description: site.description,
      featureList: [
        "Completes LinkedIn Easy Apply applications",
        "Completes supported multi-step applications on other job sites and employer career pages",
        "Fills repeat application fields from a saved profile",
        "Saves answers for reuse when the same question appears later",
        "Generates tailored answers to application questions",
        "Lets the user review the application before submission",
        "Tracks submitted applications",
      ],
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      downloadUrl: [site.downloads.mac, site.downloads.windows],
      sameAs: [site.social.github, site.downloads.chrome],
      url: site.url,
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="grain font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
