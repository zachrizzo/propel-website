import type { Metadata } from "next";
import Logo from "@/components/Logo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What Propel collects, what stays on your computer, what is stored in your Propel account, what is sent to AI models, and the choices you have.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "September 25, 2026";

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
        Propel Job Agent (&ldquo;Propel&rdquo;) fills out job applications for you. It is made up of the Propel app for
        Mac, the Propel Bridge extension for Chrome, your Propel account, and this website. This policy explains what
        each of them handles, where that data goes, and the choices you have.
      </p>

      <Section title="The short version">
        <List>
          <li>Résumé files, saved screenshots and any job-site logins Propel creates are stored only on your Mac.</li>
          <li>
            Your profile, saved answers and application history are stored in your Propel account, so every
            application can use them.
          </li>
          <li>
            To fill an application, Propel sends the application page and the parts of your profile it needs to
            OpenAI&rsquo;s API. We ask OpenAI not to store these requests.
          </li>
          <li>We don&rsquo;t sell your data, show you ads, or use your data to train AI models.</li>
          <li>Propel never asks for your LinkedIn or Indeed password.</li>
        </List>
      </Section>

      <Section title="What stays on your computer">
        <p>The Propel app keeps its files in a private folder on your Mac. That includes:</p>
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
          <Strong>The Chrome extension.</Strong> Propel Bridge connects Chrome to the Propel app on your computer and
          makes no network requests of its own. It can see the titles and addresses of your open tabs, and it reads and
          controls the tabs Propel works in. It stores only its connection state in Chrome.
        </p>
      </Section>

      <Section title="What is stored in your Propel account">
        <p>When you sign in, Propel stores the following on our servers, which run on Supabase:</p>
        <List>
          <li>
            <Strong>Account:</Strong> your email address, plus your name and photo if you sign in with Google.
          </li>
          <li>
            <Strong>Profile:</Strong> contact details (name, email, phone, address), work authorization, sponsorship,
            availability, salary expectations, links, and the roles and locations you want.
          </li>
          <li>
            <Strong>Résumé details:</Strong> the work history, education and skills Propel extracts from your résumé.
            The résumé file itself and its full text are not stored.
          </li>
          <li>
            <Strong>Saved answers</Strong> to screening questions, and a search index of your profile, résumé details
            and answers, so Propel can find what each application needs.
          </li>
          <li>
            <Strong>Applications:</Strong> each job&rsquo;s address, company, title and location, the posting&rsquo;s
            details, the application&rsquo;s status and outcome, and any questions waiting for you.
          </li>
          <li>
            <Strong>Run logs:</Strong> which steps Propel took, timing, usage, page field labels and the job details.
            The values you entered, page text, email addresses and phone numbers are removed before these logs are
            uploaded, and screenshots are not uploaded.
          </li>
          <li>
            <Strong>Plan and usage:</Strong> your plan and how many applications you&rsquo;ve used.
          </li>
          <li>
            <Strong>Bug reports</Strong> you choose to send.
          </li>
        </List>
      </Section>

      <Section title="What is sent to AI models">
        <p>
          Propel uses OpenAI&rsquo;s API to read application pages and decide what to fill. These requests go through
          our servers using our OpenAI account. They can include:
        </p>
        <List>
          <li>
            the content of the application page, including values already in the form (passwords and one-time codes are
            masked);
          </li>
          <li>screenshots of the page;</li>
          <li>the parts of your profile, résumé details and saved answers relevant to the application;</li>
          <li>your résumé&rsquo;s text when you import a résumé, so Propel can extract its details.</li>
        </List>
        <p>
          Requests are sent with OpenAI&rsquo;s response storage turned off, along with an anonymous account identifier.
          We don&rsquo;t keep the contents of these requests on our servers. OpenAI&rsquo;s handling of API data is
          described in its{" "}
          <a href="https://openai.com/policies/api-data-usage-policies" className="text-iris-300 underline underline-offset-4 hover:text-cream">
            API data usage policies
          </a>
          .
        </p>
        <p>We don&rsquo;t use your data to train AI models.</p>
      </Section>

      <Section title="Gmail (optional)">
        <p>
          You can connect Gmail so Propel can match employer replies to your applications and read verification codes
          sent while you apply. Propel asks for read-only access. It reads the sender, subject and a short preview of
          hiring-related emails from the last 30 days onward, and it opens a message only to read a verification code.
          Its access tokens are stored encrypted. Stored email details are deleted after 180 days, and disconnecting
          Gmail revokes Propel&rsquo;s access and deletes them.
        </p>
      </Section>

      <Section title="Payments">
        <p>
          Payments are handled by Stripe on Stripe&rsquo;s own checkout page. Propel never sees or stores your card
          number. We keep the customer and subscription records Stripe sends us, which can include your name, email,
          billing address, and your card&rsquo;s brand and last four digits.
        </p>
      </Section>

      <Section title="This website">
        <p>
          If you sign in on propeljobagent.com, a cookie keeps you signed in. We use Vercel Web Analytics to count page
          views; it doesn&rsquo;t use cookies. The site is hosted by Vercel, which keeps standard server logs.
        </p>
      </Section>

      <Section title="Who we share data with">
        <p>We don&rsquo;t sell your data or share it for advertising. We use these service providers to run Propel:</p>
        <List>
          <li><Strong>Supabase</Strong> for your account, sign-in and stored data;</li>
          <li><Strong>OpenAI</Strong> for the AI models, as described above;</li>
          <li><Strong>Stripe</Strong> for payments;</li>
          <li><Strong>Google</Strong> if you sign in with Google or connect Gmail;</li>
          <li><Strong>Vercel</Strong> to host this website and count page views;</li>
          <li>
            <Strong>GitHub</Strong>, where the Mac app checks for updates (GitHub sees your IP address and app version).
          </li>
        </List>
      </Section>

      <Section title="How long we keep data">
        <p>
          We keep your account data for as long as you have an account. Files on your Mac stay until you delete them or
          uninstall Propel. Email details from Gmail are deleted after 180 days. We keep payment records as long as we
          need them for accounting and tax purposes.
        </p>
      </Section>

      <Section title="Your choices">
        <List>
          <li>Delete saved answers in the Propel app.</li>
          <li>Leave automatic sign-in and account creation off, or turn them off at any time.</li>
          <li>Disconnect Gmail at any time.</li>
          <li>
            Remove Propel Bridge from <span className="font-mono text-cream">chrome://extensions</span> to stop its
            access immediately, and uninstall the Propel app to remove it from your Mac.
          </li>
          <li>
            To see or delete the data in your Propel account, email us from your account&rsquo;s address and we&rsquo;ll
            do it.
          </li>
        </List>
      </Section>

      <Section title="Security">
        <p>
          Data travels over encrypted connections, Gmail tokens are stored encrypted, and job-site logins never leave
          your Mac. No system is perfectly secure, so please tell us if you find a problem.
        </p>
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
