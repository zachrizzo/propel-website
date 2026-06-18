import { NextResponse } from "next/server";
import { releaseDownloads } from "@/lib/site";

export const dynamic = "force-dynamic";

type Platform = keyof typeof releaseDownloads;

function isPlatform(value: string): value is Platform {
  return value === "mac" || value === "windows";
}

async function exists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow", cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

export async function GET(_request: Request, { params }: { params: { platform: string } }) {
  if (!isPlatform(params.platform)) {
    return new Response("Unknown download platform", { status: 404 });
  }

  const downloads = releaseDownloads[params.platform];
  const target = (await exists(downloads.preferred)) ? downloads.preferred : downloads.legacy;
  return NextResponse.redirect(target, 302);
}
