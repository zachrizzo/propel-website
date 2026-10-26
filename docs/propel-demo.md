# Guided demo integration

`components/DemoSection.tsx` appears immediately after the unchanged hero in `app/page.tsx`.

The media is the verified 39.47-second illustrative walkthrough from `/Users/zachrizzo/Documents/Codex/2026-10-25/task-3/media/propel-demo`. It stages synthetic data in Propel's current panel; it is not a recording of a completed end-to-end agent run. No real application was submitted. The section repeats this disclosure and uses the provided computer-generated local Kokoro narration. No Apple system voice or unsupported private speech endpoint was used for the supplied final MP4 files.

The player chooses the 1280×720 desktop or 720×1280 phone source once at initial load (640px breakpoint), retains native controls and playsInline, preloads metadata, and does not autoplay. Resizing does not change a playing source. Both versions contain visible captions. The supplied WebVTT track remains available but is off initially to avoid duplicate captions. An expandable transcript and visual description, downloadable transcript, silent alternatives, and media credits are available beside the player.

Only delivery assets live in `public/media/propel-demo`: two narrated MP4s, two silent MP4s, two posters, VTT, transcript and the original `THIRD_PARTY_NOTICES.txt`. The original notices identify Kokoro and the Apache-2.0 model license. No weights, runtime, intermediate audio, frames, credentials or private source snapshot are included in the public assets.

The source `validation.json` records full decode, audio and caption verification, plus SHA-256 hashes. Integration checks compare delivered asset hashes and verify actual website playback, seeking, initial source selection, caption loading, transcript/credits access, no autoplay, mobile layout, and unchanged hero markup.

This integration has not been deployed. Website release remains subject to the parent-confirmed scope. The Vercel target is team `zachrizzos-projects`, project `propel-website`, verified through the current website commit’s deployment status; verify its production domain binding before deployment.
