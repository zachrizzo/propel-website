import type { Metadata } from "next";
import Aurora from "@/components/Aurora";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Pricing from "@/components/Pricing";
import Reveal from "@/components/Reveal";
import { formatPrice, getCatalog } from "@/lib/plans";
import { site } from "@/lib/site";
import { jsonLd } from "@/lib/json-ld";

const PATH = "/pricing";
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const catalog = await getCatalog();
  const free = catalog.tiers.find((plan) => plan.kind === "free");
  const paid = catalog.tiers.filter((plan) => plan.kind === "subscription");
  const cheapest = paid[0];
  const description = [
    "Propel pricing:",
    free?.monthlyApplications ? `free plan with ${free.monthlyApplications} applications a month,` : "",
    cheapest ? `paid plans from ${formatPrice(cheapest)}/mo.` : "",
    "You only pay for applications that reach final submit.",
  ].filter(Boolean).join(" ");
  return {
    title: "Pricing",
    description,
    alternates: { canonical: PATH },
    openGraph: { url: `${site.url}${PATH}`, title: "Propel pricing", description },
  };
}

export default async function PricingPage() {
  const catalog = await getCatalog();
  const paid = catalog.tiers.filter((plan) => plan.kind === "subscription");
  const structured = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${site.url}${PATH}#product`,
        name: site.productName,
        description: site.description,
        brand: { "@type": "Brand", name: site.name },
        image: `${site.url}/propel-logo.png`,
        offers: catalog.tiers.map((plan) => ({
          "@type": "Offer",
          name: plan.name,
          price: (plan.amountCents / 100).toFixed(2),
          priceCurrency: plan.currency.toUpperCase(),
          description: plan.monthlyApplications === null ? "Uncapped applications" : `${plan.monthlyApplications} applications a month`,
          url: `${site.url}${PATH}`,
          availability: "https://schema.org/InStock",
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Propel", item: site.url },
          { "@type": "ListItem", position: 2, name: "Pricing", item: `${site.url}${PATH}` },
        ],
      },
    ],
  };
  return (
    <main className="relative overflow-x-clip">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structured) }} />
      <Nav />
      <section className="relative px-5 pb-24 pt-36">
        <Aurora />
        <Pricing catalog={catalog} headingLevel="h1" />
      </section>
      <section className="relative px-5 pb-24">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold text-cream">How billing works</h2>
            <div className="mt-4 space-y-4 text-[15.5px] leading-relaxed text-mist">
              <p>
                An application counts toward your plan only when Propel reaches the final submit step. Jobs you
                skip, listings that don&apos;t match and forms Propel hands back to you are free.
              </p>
              <p>
                {paid.length
                  ? `Paid plans renew monthly: ${paid.map((plan, index) => (index === 0 ? `${plan.name} includes ${plan.monthlyApplications} applications` : `${plan.name} ${plan.monthlyApplications}`)).join(", ")}.`
                  : ""}
                {catalog.extra ? ` If you run out before your plan renews, extra applications are ${formatPrice(catalog.extra)} each.` : ""}
              </p>
              <p>
                Upgrade, change or cancel anytime from{" "}
                <a href="/account" className="font-medium text-iris-300 underline-offset-4 hover:underline">your account</a>.
                Payments are handled by Stripe.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
      <Footer />
    </main>
  );
}
