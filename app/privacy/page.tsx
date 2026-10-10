import type { Metadata } from "next";
import Logo from "@/components/Logo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What Propel collects, what stays on your computer, what is stored in your Propel account, what is sent to AI models, and the choices you have.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "October 10, 2026";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mt-10">
    <h2 className="font-display text-xl font-semibold text-cream">{title}</h2>
    <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-mist">{children}</div>
  </section>
);

const List = ({ children }: { children: React.ReactNode }) => (
  <ul className="list-disc space-y-2 pl-5 marker:text-iris-400">{children}</ul>
);

const Strong = ({ children }: { children: React.ReactNode }) => <strong className="font-semibold text-cream">{children}</strong>;

export default function Privacy() {
  return (
    <main className="relative mx-auto max-w-3xl px-5 py-16">
      <a href="/" className="inline-block">
        <Logo />
      </a>

      <h1 className="mt-12 font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl">Privacy Policy</h1>
      <p className="mt-3 font-mono text-[12px] text-fog">Last updated: {UPDATED}</p>

      <p className="mt-8 text-[15px] leading-relaxed text-mist">
        Propel Job Agent (&ldquo;Propel&rdquo;) fills out job applications through the Propel Chrome extension, your
        Propel account, and this website. This policy explains what data they handle, where it goes, and the choices
        you have. Sections marked &ldquo;Legacy&rdquo; describe the earlier Mac app and Propel Bridge.
      </p>

      <Section title="Propel Chrome extension">
        <p>The standalone extension reads form labels, choices, surrounding page text, and current field values on pages you choose to work on. It uses information you provide, saved answers, and documents to complete the task. Your Propel sign-in session, local task records, and an upload queue are stored in Chrome. Saved information, documents, and task history are also synchronized to your account on Propel&rsquo;s Supabase service. Offline changes wait on your device until synchronization succeeds.</p>
        <p>Relevant page content, document text, saved-answer values, and supporting information may be sent through Propel&rsquo;s authenticated model service to OpenAI or Jev for retrieval, drafting, and browser planning. When visual understanding is needed, a screenshot of the visible task tab may be sent to OpenAI. Screenshots may include personal information and values visible on the page. The document you select may also be attached to the employer&rsquo;s form. Employer browser-session cookies and credentials remain in the browser; credential headers and secret fields are excluded from task transcripts.</p>
        <p>Auto-submit is on by default. Turn it off in Settings to review each application and submit it yourself. Service providers may retain data under their own policies. Questions about your data: zachcilwa@gmail.com.</p>
      </Section>

      <Section title="Extension permissions">
        <p>The extension uses storage for your sign-in session and local task records; tabs and webNavigation to identify and follow the application tab and page changes; sidePanel to show application controls; tabGroups to organize job tabs; and offscreen to keep its local agent running. It uses scripting and HTTPS site access to read and fill the application pages you choose, including supported embedded forms on employer domains. The debugger permission lets Propel send trusted clicks and keystrokes, capture the visible application tab when visual planning is needed, and keep a job tab responsive while it works. Access to Propel's Supabase service supports sign-in, saved answers, plan checks, and requested AI planning. The extension does not need a desktop app or native messaging.</p>
      </Section>

      <Section title="The short version">
        <List>
          <li>Your profile, original saved answers, document files and extracted text, task history, and readable model inputs and outputs are stored in your Propel account on Supabase, with local copies in Chrome.</li>
          <li>To complete a task, Propel sends relevant page content and supporting saved information or document text to its AI providers. Visual requests may also include a screenshot.</li>
          <li>Employer browser-session cookies and credentials stay in the browser.</li>
          <li>We don&rsquo;t sell your data, show you ads, or use your data to train AI models.</li>
          <li>Propel never asks for your LinkedIn or Indeed password.</li>
        </List>
      </Section>

      <Section title="Legacy Mac app and Propel Bridge">
        <p>If you use the earlier Mac app and Propel Bridge, this section describes that legacy setup. The standalone Chrome extension stores account data as described above and below.</p>
        <p>The legacy Propel app keeps its files in a private folder on your Mac. That includes:</p>
        <List>
          <li>the résumé files you add;</li>
          <li>
            your application history, including the answers Propel filled in and up to eight screenshots of each
            application;
          </li>
          <li>logs of each run, and your settings;</li>
          <li>your Propel sign-in session.</li>
        </List>
        <p>
          <Strong>Job-site logins.</Strong> Some employer sites need an account before you can apply. If you turn on
          automatic sign-in or account creation (both are off by default), Propel creates a login using your email and
          a generated password. These logins are encrypted with a key protected by your Mac&rsquo;s Keychain and are
          never uploaded.
        </p>
        <p>
          <Strong>The legacy Propel Bridge.</Strong> Propel Bridge connects Chrome to the Propel app on your computer and
          makes no network requests of its own. It can see the titles and addresses of your open tabs, and it reads and
          controls the tabs Propel works in. It stores only its connection state in Chrome.
        </p>
      </Section>

      <Section title="What is stored in your Propel account">
        <p>When you sign in, Propel stores the following on our servers, which run on Supabase:</p>
        <List>
          <li><Strong>Account:</Strong> your email address, plus your name and photo if you sign in with Google.</li>
          <li><Strong>Profile:</Strong> contact details (name, email, phone, address), work authorization, sponsorship, availability, salary expectations, links, and the roles and locations you want.</li>
          <li><Strong>Documents:</Strong> original files you add, including résumés, are stored in private Supabase Storage. Extracted text, source locations, file versions, and document references are stored with your account records.</li>
          <li><Strong>Saved information:</Strong> your original answers, separately derived facts, corrections, conflicts, source references, reuse preferences, and a search index used to find relevant information. If you provide health, disability, accommodation, demographic, or other sensitive answers for an application, those answers may be included in this account data.</li>
          <li><Strong>Tasks and application history:</Strong> job/page details, status and outcome, pending questions, your task-specific answers and drafts, decisions, browser action receipts, and verification results.</li>
          <li><Strong>Model transcripts:</Strong> readable inputs sent to models and their returned outputs, kept with the task history. These can include page text, saved-answer values, and document excerpts. Credential fields, raw screenshot image bytes, and embedding vectors are omitted from the readable transcript.</li>
          <li><Strong>Run diagnostics:</Strong> signed-in runs upload operational records automatically when the service is available. They include account/run/task/event identifiers, site information, extension version, timings, outcome and reason codes, and step summaries and references. Summaries can include labels, file names, answer text, and excerpts of page or document content. Credential values are protected. These operational records are separate from the durable task history and model transcripts.</li>
          <li><Strong>Plan and usage:</Strong> your plan and how many applications you&rsquo;ve used.</li>
          <li><Strong>Bug reports</Strong> you choose to send.</li>
        </List>
      </Section>

      <Section title="What is sent to AI models">
        <p>Propel uses OpenAI and Jev through its authenticated Supabase model service to retrieve supporting information, draft answers under your writing settings, and plan browser actions. Requests can include:</p>
        <List>
          <li>relevant page text, form labels, choices and current values;</li>
          <li>relevant profile facts, saved answers, task-specific answers, and document text or excerpts;</li>
          <li>screenshots when visual planning is needed;</li>
          <li>text used to create a search index for your saved information.</li>
        </List>
        <p>OpenAI Responses requests set response storage to false. That setting does not prevent all provider retention. OpenAI&rsquo;s handling of API data is described in its <a href="https://developers.openai.com/api/docs/guides/your-data" className="text-iris-300 underline underline-offset-4 hover:text-cream">data-controls documentation</a>. Propel retains readable model inputs and returned outputs as account-owned task history on Supabase. Providers handle requests under their own applicable policies.</p>
        <p>We don&rsquo;t use your data to train AI models.</p>
      </Section>

      <Section title="Legacy Mac app: Gmail (optional)">
        <p>
          In the legacy Mac app, you can connect Gmail so Propel can match employer replies to your applications and read verification codes
          sent while you apply. Propel asks for read-only access. It reads the sender, subject and a short preview of
          hiring-related emails from the last 30 days onward, and it opens a message only to read a verification code.
          Its access tokens are stored encrypted. Stored email details are deleted after 180 days, and disconnecting
          Gmail revokes Propel&rsquo;s access and deletes them.
        </p>
      </Section>

      <Section title="Payments">
        <p>Payments are handled by Stripe on its checkout page. Propel stores account email and Stripe customer, subscription, checkout and payment-reference records, plus plan status, purchase amounts and currency, and application credits to manage access and usage. The Chrome extension does not receive your full payment-card number.</p>
      </Section>

      <Section title="This website">
        <p>
          If you sign in on propeljobagent.com, a cookie keeps you signed in. We use Vercel Web Analytics to count page
          views; it doesn&rsquo;t use cookies. The site is hosted by Vercel, which keeps standard server logs.
        </p>
        <p>
          If you join the extension waitlist, we store the email address you enter in Propel&rsquo;s Supabase
          database. We also store a keyed digest of your network address and a daily request count to limit abusive
          signups. Joining does not create an account, grant access, or subscribe you to marketing emails. We do not
          send an email when you join.
        </p>
      </Section>

      <Section title="Who we share data with">
        <p>We don&rsquo;t sell your data or share it for advertising. We use these service providers to run Propel:</p>
        <List>
          <li><Strong>Supabase</Strong> for your account, sign-in and stored data;</li>
          <li><Strong>OpenAI</Strong> for the AI models, as described above;</li>
          <li><Strong>Jev (Typesafe AI)</Strong> for selected saved-information retrieval and browser-planning requests;</li>
          <li><Strong>Stripe</Strong> for payments;</li>
          <li><Strong>Google</Strong> if you sign in with Google or connect Gmail in the legacy Mac app;</li>
          <li><Strong>Vercel</Strong> to host this website and count page views;</li>
          <li>The employer or application site receives the form values and documents that Propel fills or attaches on your behalf.</li>
          <li>
            <Strong>GitHub</Strong>, where the legacy Mac app checks for updates (GitHub sees your IP address and app version).
          </li>
        </List>
      </Section>

      <Section title="How long we keep data">
        <p>Durable saved information, documents, task history, model transcripts, and committed record revisions are not subject to the operational diagnostic retention limit. They remain in your account unless removed through the available deletion controls or account deletion. Operational run diagnostics have a 30-day retention policy. Local copies remain until removed from the browser or legacy app. Legacy Gmail email details are deleted after 180 days. We keep payment records as long as we need them for accounting and tax purposes.</p>
        <p>Stopping reuse does not delete saved information or the original file. &ldquo;Delete file&rdquo; removes the original file from this device and queues its cloud deletion; it is shown as deleted from your account after synchronization is acknowledged. Historical task records, excerpts, and previous record revisions may still contain information drawn from that file. Removing the extension does not delete your cloud account data.</p>
      </Section>

      <Section title="Your choices">
        <List>
          <li>Inspect and correct saved information, change where it may be reused, or stop using it under Saved information.</li>
          <li>Stop using a document while retaining its original, or select Delete file to remove the stored original. Offline deletions wait to synchronize.</li>
          <li>Pause or stop tasks and turn auto-submit off in Settings.</li>
          <li>Remove the standalone Propel extension from <span className="font-mono text-cream">chrome://extensions</span> to stop its browser access.</li>
          <li>For the legacy Mac app, leave automatic sign-in and account creation off, disconnect Gmail, or remove Propel Bridge and uninstall the Mac app.</li>
          <li>Delete your Propel account from your <a href="/account" className="text-iris-300 underline underline-offset-4 hover:text-cream">account page</a>. Local files remain until you remove them from your device.</li>
          <li>To get a copy of the data in your Propel account, email us from your account&rsquo;s address.</li>
        </List>
      </Section>

      <Section title="Security">
        <p>Data travels over encrypted connections. Supabase account records and private document storage use owner-scoped access controls. Browser-session credentials stay in the browser; credential headers and secret fields are excluded from task transcripts. The legacy Mac app&rsquo;s saved job-site logins and Gmail tokens use the protections described in its sections. No system is perfectly secure, so please tell us if you find a problem.</p>
      </Section>

      <Section title="Changes and contact">
        <p>
          If this policy changes, we&rsquo;ll update this page and the date at the top. Questions or requests:{" "}
          <a href={`mailto:${site.email}`} className="text-iris-300 underline underline-offset-4 hover:text-cream">
            {site.email}
          </a>
          .
        </p>
      </Section>

      <div className="mt-14 border-t border-iris-400/10 pt-6">
        <a href="/" className="font-mono text-[13px] text-fog transition-colors hover:text-cream">
          ← Back to Propel
        </a>
      </div>
    </main>
  );
}
