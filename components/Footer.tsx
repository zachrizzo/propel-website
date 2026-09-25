import Logo from "@/components/Logo";
import { site } from "@/lib/site";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/#how", label: "How it works" },
      { href: "/#features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Guides",
    links: [
      { href: "/job-application-agent", label: "Job application agent" },
      { href: "/how-to-auto-apply-to-jobs", label: "How to auto-apply to jobs" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/account", label: "Sign in" },
      { href: site.downloads.mac, label: "Download for Mac" },
      { href: site.downloads.chrome, label: "Chrome extension" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: `mailto:${site.email}`, label: "Contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-iris-400/10 px-5 pb-10 pt-14">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.3fr_repeat(4,1fr)]">
        <div>
          <Logo size={28} />
          <p className="mt-4 max-w-[240px] text-[14px] leading-relaxed text-fog">
            The job application agent that fills LinkedIn Easy Apply and supported Indeed forms in your Chrome tab.
          </p>
        </div>
        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="font-mono text-[11px] uppercase tracking-widest text-fog">{column.title}</p>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-[14px] text-mist transition-colors hover:text-cream">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-3 border-t border-iris-400/10 pt-6 text-[13px] text-fog sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Propel</span>
        <span>Propel is independent and not affiliated with LinkedIn or Indeed.</span>
      </div>
    </footer>
  );
}
