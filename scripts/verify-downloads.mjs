#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const releaseRepo = "zachrizzo/propel-releases";
const releaseBase = `https://github.com/${releaseRepo}/releases/latest/download`;
const requiredRoutePaths = {
  mac: "/download/mac",
  windows: "/download/windows",
};
const acceptedAssets = {
  mac: ["Propel.dmg", "Pilot.dmg"],
  windows: ["Propel-Setup.exe", "Pilot-Setup.exe"],
};
const sourceDirs = ["app", "components", "lib"];

function fail(message) {
  console.error(`download verification failed: ${message}`);
  process.exitCode = 1;
}

async function readText(path) {
  return readFile(path, "utf8");
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(path);
    } else {
      yield path;
    }
  }
}

async function verifySiteConfig() {
  const siteConfig = await readText("lib/site.ts");
  for (const [platform, path] of Object.entries(requiredRoutePaths)) {
    if (!siteConfig.includes(path)) {
      fail(`lib/site.ts must use the website-owned ${platform} download route: ${path}`);
    }
  }
}

async function verifyNoPinnedReleaseLinks() {
  const pinnedPattern = /propel-releases\/releases\/download\/v\d+\.\d+\.\d+/;
  for (const dir of sourceDirs) {
    for await (const path of walk(dir)) {
      if (!/\.(tsx?|jsx?|md)$/.test(path)) continue;
      const text = await readText(path);
      if (pinnedPattern.test(text)) {
        fail(`${path} contains a version-pinned release URL; use releases/latest/download instead`);
      }
    }
  }
}

async function verifyLatestReleaseAssets() {
  const res = await fetch(`https://api.github.com/repos/${releaseRepo}/releases/latest`, {
    headers: { accept: "application/vnd.github+json" },
  });
  if (!res.ok) {
    fail(`GitHub latest release API returned HTTP ${res.status}`);
    return;
  }

  const release = await res.json();
  const names = new Set((release.assets ?? []).map((asset) => asset.name));
  const selected = {};
  for (const [platform, candidates] of Object.entries(acceptedAssets)) {
    const found = candidates.find((name) => names.has(name));
    if (found === undefined) {
      fail(`latest release ${release.tag_name ?? "(unknown)"} is missing ${candidates.join(" or ")}`);
    } else {
      selected[platform] = found;
    }
  }

  for (const [platform, asset] of Object.entries(selected)) {
    const url = `${releaseBase}/${asset}`;
    const head = await fetch(url, { method: "HEAD", redirect: "follow" });
    if (!head.ok) {
      fail(`${platform} stable download URL returned HTTP ${head.status}: ${url}`);
    }
  }

  if (process.exitCode !== 1) {
    console.log(
      `download verification passed: ${release.tag_name ?? "latest"} has Mac and Windows assets (${selected.mac}, ${selected.windows})`,
    );
  }
}

await verifySiteConfig();
await verifyNoPinnedReleaseLinks();
await verifyLatestReleaseAssets();
