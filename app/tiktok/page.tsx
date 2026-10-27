import type { Metadata } from "next";
import HomePage from "../page";

// Keep the campaign entry path visible to the existing, included page-view analytics.
// This renders the actual homepage, so the hero, demo and signup never drift apart.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  robots: { index: false, follow: true },
};

export const revalidate = 3600;

export default HomePage;
