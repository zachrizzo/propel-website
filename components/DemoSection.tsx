"use client";

import { useEffect, useState } from "react";

const MEDIA = "/media/propel-demo/";
const narration = [
  "Meet Propel, a Chrome extension that helps with the repetitive parts of job applications.",
  "Add your résumé and choose your submission settings. Then open a role you want, and select Apply here.",
  "Propel fills supported fields from your saved information, and attaches your résumé.",
  "If a question needs you, it pauses. Answer in the side panel, then continue.",
  "With automatic submission switched off before you start, Propel stops before submit. Review the form, and send it yourself.",
  "Your applications stay together in Propel. Some pages and sign-in checks still need you. You stay in control.",
];

export default function DemoSection() {
  const [format, setFormat] = useState<"desktop" | "phone" | null>(null);
  // Choose once on this page load. Resizing must not interrupt a video already playing.
  useEffect(() => { setFormat(window.matchMedia("(max-width: 640px)").matches ? "phone" : "desktop"); }, []);
  const phone = format === "phone";
  return (
    <section id="walkthrough" aria-labelledby="walkthrough-heading" className="relative scroll-mt-20 px-5 pb-16 pt-8 sm:pb-20 sm:pt-12">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-iris-300">See how it works</p>
          <h2 id="walkthrough-heading" className="mt-3 font-display text-3xl font-bold tracking-tight text-cream sm:text-4xl">A short tour of Propel</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-mist">Follow a sample application, from adding a résumé to reviewing the filled form.</p>
        </div>
        <div className="mt-8 rounded-3xl border border-iris-400/20 bg-ink-800/70 p-2 shadow-2xl shadow-ink/30 sm:p-3">
          <video
            id="propel-guided-demo"
            controls
            playsInline
            preload="metadata"
            src={format ? `${MEDIA}${phone ? "propel-demo-mobile.mp4" : "propel-demo.mp4"}` : undefined}
            poster={`${MEDIA}${phone ? "propel-demo-poster-mobile.jpg" : "propel-demo-poster.jpg"}`}
            width={phone ? 720 : 1280}
            height={phone ? 1280 : 720}
            aria-label="Propel guided demo using synthetic application data"
            aria-describedby="walkthrough-disclosure"
            className="mx-auto block h-auto max-h-[80svh] w-full rounded-2xl bg-ink object-contain max-sm:w-auto max-sm:max-w-full"
          >
            <track kind="captions" srcLang="en" label="English" src={`${MEDIA}propel-demo.en.vtt`} />
            Your browser does not support video. <a href={`${MEDIA}propel-demo.mp4`}>Download the demo</a> or read the transcript below.
          </video>
        </div>
        <p id="walkthrough-disclosure" className="mx-auto mt-4 max-w-3xl text-center text-[12px] leading-relaxed text-fog">
          Illustrative demo with synthetic data and a computer-generated voice. Captions are included in the video. No real application was submitted.
        </p>
        <div className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-x-5 gap-y-2 text-[13px] text-iris-300">
          <a href={`${MEDIA}transcript.txt`} className="underline-offset-4 hover:underline">Download transcript</a>
          <a href={`${MEDIA}${phone ? "propel-demo-mobile-silent.mp4" : "propel-demo-silent.mp4"}`} className="underline-offset-4 hover:underline">Watch without narration</a>
          <a href={`${MEDIA}THIRD_PARTY_NOTICES.txt`} className="underline-offset-4 hover:underline">Media credits</a>
        </div>
        <details className="mx-auto mt-6 max-w-3xl rounded-2xl border border-iris-400/15 bg-ink-800/40 px-5 py-4 text-[14px] text-mist">
          <summary className="cursor-pointer font-medium text-cream">Read the transcript and visual description</summary>
          <div className="mt-4 space-y-3 leading-relaxed">
            {narration.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <p>Visual description: This illustrative walkthrough uses synthetic data in Propel&rsquo;s current side panel. A fictional applicant adds sample-resume.pdf, switches automatic submission off, then selects Apply here for a fictional Product Designer role. Example name, email and portfolio fields fill in. Propel asks when the applicant could start; a sample answer appears in the panel. Propel stops at Ready for you to submit. The last view shows one pending application. No application is submitted.</p>
          </div>
        </details>
      </div>
    </section>
  );
}
