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
    default: `${site.productName} | ${site.tagline}`,
    template: `%s · ${site.productName}`,
  },
  description: site.description,
  keywords: [
    "auto apply jobs",
    "job application automation",
    "autofill job applications",
    "apply to jobs faster",
    "auto fill job applications",
    "save time job applications",
    "Workday autofill",
    "Greenhouse autofill",
    "Lever autofill",
    "job search tool",
    "AI job application assistant",
    "AI job agent",
    "Propel Job Agent",
    "Propel Bridge",
    "supervised job application agent",
    "AI auto apply tool",
    "automatic job application filler",
  ],
  referrer: "origin-when-cross-origin",
  authors: [{ name: "Propel" }],
  creator: "Propel",
  publisher: "Propel",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    title: `${site.productName} | ${site.tagline}`,
    description: site.description,
    siteName: site.name,
    locale: "en_US",
    images: [{ url: "/og.png", width: 1280, height: 800, alt: `${site.productName} — auto-apply to jobs` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.productName} | ${site.tagline}`,
    description: site.description,
    images: ["/og.png"],
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
  icons: { icon: "/icon-128.png", apple: "/icon-128.png" },
  category: "technology",
  other: {
    "apple-mobile-web-app-title": site.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#07060f",
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
        "Auto-fills and submits job applications on real career sites",
        "Works on Workday, Greenhouse, Lever, Ashby, iCIMS and company portals",
        "Remembers your answers and reuses them on future applications",
        "Generates tailored answers to application questions",
        "You review and approve every application before it is submitted",
        "Tracks every application you've sent",
      ],
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      downloadUrl: [site.downloads.mac, site.downloads.windows],
      sameAs: [site.social.github, site.downloads.chrome],
      url: site.url,
    },
    {
      "@type": "HowTo",
      "@id": `${site.url}/#howto`,
      name: "How to auto-apply to jobs with Propel",
      description:
        "Set up Propel once, then let it fill and submit job applications for you on real career sites while you review and approve.",
      step: [
        { "@type": "HowToStep", position: 1, name: "Add your profile once", text: "Install the desktop app and set up your details and résumé a single time. Propel reuses them on every application." },
        { "@type": "HowToStep", position: 2, name: "Add the Chrome bridge", text: "Install the Propel Bridge extension; it links your browser to the desktop app and pairs automatically." },
        { "@type": "HowToStep", position: 3, name: "Apply, hands-free", text: "Open any job posting and let Propel read the form, fill every field from your profile, and submit — you review and approve." },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${site.url}/#faq`,
      mainEntity: site.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
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
