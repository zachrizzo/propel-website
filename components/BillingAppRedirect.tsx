"use client";

import { useEffect } from "react";
import { PROPEL_BILLING_DEEP_LINK } from "@/lib/app-links";

export default function BillingAppRedirect() {
  useEffect(() => {
    // Give React one turn to paint the fallback before asking the browser to
    // open the registered desktop app. Unsupported browsers stay on this page.
    const redirect = window.setTimeout(() => {
      window.location.assign(PROPEL_BILLING_DEEP_LINK);
    }, 0);

    return () => window.clearTimeout(redirect);
  }, []);

  return (
    <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
      <a
        href={PROPEL_BILLING_DEEP_LINK}
        className="rounded-lg bg-iris-500 px-5 py-2.5 text-[15px] font-medium text-cream transition-colors hover:bg-iris-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris-300"
      >
        Open Propel
      </a>
      <a
        href="/#download"
        className="text-[15px] text-iris-300/80 underline-offset-4 transition-colors hover:text-cream hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris-300"
      >
        Get the desktop app
      </a>
    </div>
  );
}
