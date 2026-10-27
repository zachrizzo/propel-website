import test from "node:test";
import assert from "node:assert/strict";
import { campaignAt, campaignHref, publicAnalyticsUrl, CAMPAIGN_WINDOW_MS } from "../lib/campaign.ts";

const root = new URL("https://propeljobagent.com/tiktok");

test("TikTok entry and its tagged navigation resolve to the fixed campaign", () => {
  assert.deepEqual(campaignAt(root, null, 100), { source: "tiktok", capturedAt: 100 });
  assert.equal(campaignAt(new URL("/?utm_source=tiktok", root), null, 100)?.source, "tiktok");
});

test("campaign survives an untagged page only within its tab window", () => {
  const saved = JSON.stringify({ source: "tiktok", capturedAt: 100 });
  assert.equal(campaignAt(new URL("/pricing", root), saved, 101)?.source, "tiktok");
  assert.equal(campaignAt(new URL("/pricing", root), saved, 100 + CAMPAIGN_WINDOW_MS), null);
  assert.equal(campaignAt(new URL("/pricing", root), saved, 99), null);
  assert.equal(campaignAt(new URL("/pricing", root), "not-json", 101), null);
});

test("different campaign and account pages cannot inherit TikTok", () => {
  const saved = JSON.stringify({ source: "tiktok", capturedAt: 100 });
  assert.equal(campaignAt(new URL("/?utm_source=other", root), saved, 101), null);
  assert.equal(campaignAt(new URL("/account", root), saved, 101), null);
});

test("marketing navigation keeps its hash and carries only fixed attribution values", () => {
  assert.equal(campaignHref("/#waitlist", root), "/?utm_source=tiktok&utm_medium=social&utm_campaign=bio#waitlist");
  assert.equal(campaignHref("#features", root), "/tiktok?utm_source=tiktok&utm_medium=social&utm_campaign=bio#features");
  assert.equal(campaignHref("/pricing?view=plans", root), "/pricing?view=plans&utm_source=tiktok&utm_medium=social&utm_campaign=bio");
});

test("external, media, download and auth links are not rewritten", () => {
  for (const href of ["https://example.com/", "mailto:hello@example.com", "/media/demo.mp4", "/download/mac", "/login", "/auth/callback"]) {
    assert.equal(campaignHref(href, root), href);
  }
  assert.equal(campaignHref("/?utm_source=other", root), "/?utm_source=other");
});

test("analytics excludes private routes and removes arbitrary query values and fragments", () => {
  assert.equal(publicAnalyticsUrl("https://propeljobagent.com/auth/callback?code=secret"), null);
  assert.equal(publicAnalyticsUrl("https://propeljobagent.com/account"), null);
  assert.equal(publicAnalyticsUrl("https://propeljobagent.com/?email=private#sensitive"), "https://propeljobagent.com/");
  assert.equal(publicAnalyticsUrl("https://propeljobagent.com/tiktok?utm_source=tiktok&token=private"),
    "https://propeljobagent.com/tiktok?utm_source=tiktok&utm_medium=social&utm_campaign=bio");
});
