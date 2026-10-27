"use client";

import { useEffect } from "react";
import { CAMPAIGN_STORAGE_KEY, campaignAt, campaignHref } from "@/lib/campaign";

export default function CampaignAttribution() {
  useEffect(() => {
    const current = new URL(window.location.href);
    let stored: string | null = null;
    try { stored = sessionStorage.getItem(CAMPAIGN_STORAGE_KEY); } catch { /* Storage may be blocked. */ }
    const campaign = campaignAt(current, stored, Date.now());
    try {
      if (campaign) sessionStorage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(campaign));
      else sessionStorage.removeItem(CAMPAIGN_STORAGE_KEY);
    } catch { /* Query attribution still works without browser storage. */ }
    if (!campaign) return;

    // Only the fixed campaign label is retained. No visitor ID, email, IP or fingerprint is stored.
    const taggedCurrent = campaignHref(current.href, current);
    if (`${current.pathname}${current.search}${current.hash}` !== taggedCurrent) {
      window.history.replaceState(window.history.state, "", taggedCurrent);
    }
    for (const anchor of document.querySelectorAll<HTMLAnchorElement>("a[href]")) {
      const href = anchor.getAttribute("href");
      if (href) anchor.setAttribute("href", campaignHref(href, current));
    }
  }, []);
  return null;
}
