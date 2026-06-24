import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Lock, Eye, Server, Code, Mail, CheckCircle2, EyeOff, Wifi, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Privacy Policy — SelfPDF',
  description:
    'SelfPDF processes all PDF files entirely in your browser. No uploads, no tracking, no cookies, no data collection. Read our full privacy policy to learn exactly how we protect your data.',
};

const HIGHLIGHTS = [
  {
    icon: Lock,
    title: 'No File Uploads',
    body: 'Your PDFs never leave your device. Zero. Every operation runs locally in your browser tab.',
    color: 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400',
  },
  {
    icon: EyeOff,
    title: 'No Tracking',
    body: "We don\'t use Google Analytics, Hotjar, Mixpanel, or any other tracking software.",
    color: 'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400',
  },
  {
    icon: Eye,
    title: 'No Cookies',
    body: 'We set no tracking or preference cookies. Theme choice is stored only in your local browser storage.',
    color: 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400',
  },
  {
    icon: Server,
    title: 'No Server Storage',
    body: 'There is no database behind SelfPDF. Nothing is persisted anywhere after your session ends.',
    color: 'bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400',
  },
];

export default function PrivacyPage() {
  const lastUpdated = 'June 21, 2025';

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* ─── Hero ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b bg-gradient-to-b from-muted/60 to-background py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
          </div>

          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-1.5 text-sm backdrop-blur">
              <Shield className="size-4 text-blue-500" />
              <span>Privacy-First Architecture</span>
            </div>

            <h1 className="mb-4 text-5xl font-bold tracking-tight sm:text-6xl">Privacy Policy</h1>
            <p className="mb-2 text-lg text-muted-foreground">
              Last updated: <time dateTime="2025-06-21">{lastUpdated}</time>
            </p>
            <p className="max-w-2xl text-xl leading-relaxed text-muted-foreground">
              Privacy isn\'t a feature we added — it\'s the foundation SelfPDF was built on. This document explains, in plain language, what data we collect
              (spoiler: almost none), how we handle it, and what rights you have.
            </p>
          </div>
        </section>

        {/* ─── Quick Highlights ─────────────────────────────────── */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-center text-2xl font-bold">The short version</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {HIGHLIGHTS.map(({ icon: Icon, title, body, color }) => (
                <Card key={title}>
                  <CardContent className="flex flex-col gap-3 p-6">
                    <div className={`inline-flex size-10 items-center justify-center rounded-lg ${color}`}>
                      <Icon className="size-5" />
                    </div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Full Policy ──────────────────────────────────────── */}
        <section className="border-t pb-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-16">
            <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-lg prose-h3:font-semibold prose-p:text-muted-foreground prose-li:text-muted-foreground">

              <h2>1. Who We Are</h2>
              <p>
                SelfPDF (<strong>"we"</strong>, <strong>"us"</strong>, or <strong>"our"</strong>) is a free, open-source web application that provides PDF
                processing tools. SelfPDF is available at{' '}
                <a href="https://selfpdf.com" className="text-primary no-underline hover:underline">
                  selfpdf.com
                </a>
                . The project is maintained by its contributors and released under the MIT open-source license.
              </p>

              <h2>2. Information We Do Not Collect</h2>
              <p>
                To be completely transparent, here is a comprehensive list of data we <strong>do not</strong> collect:
              </p>
              <ul>
                <li><strong>Your PDF files or their contents.</strong> All PDF processing happens entirely in your browser using client-side JavaScript and WebAssembly. Your files are never uploaded to any server — ours or anyone else's.</li>
                <li><strong>Personal identifiers.</strong> We don\'t ask for your name, email address, phone number, or any other personally identifiable information. There is no sign-up, no login.</li>
                <li><strong>Behavioural analytics.</strong> We don\'t use Google Analytics, Mixpanel, Amplitude, Segment, Hotjar, FullStory, or any equivalent tracking or analytics service.</li>
                <li><strong>Usage patterns.</strong> We don\'t record which tools you use, how many files you process, or how long you spend on the site.</li>
                <li><strong>Device fingerprints.</strong> We don\'t build fingerprints from your browser version, screen resolution, fonts, or any other device characteristics.</li>
                <li><strong>IP addresses.</strong> While our hosting infrastructure may log IP addresses transiently (as is standard for web servers), we do not store, process, or analyse these logs for any purpose related to individual user identification.</li>
              </ul>

              <h2>3. Information We Do Collect</h2>

              <h3>3.1 Local Storage (Preferences Only)</h3>
              <p>
                SelfPDF stores one piece of data in your browser\'s local storage: your <strong>colour theme preference</strong> (light or dark mode). This
                data never leaves your device and can be cleared at any time by clearing your browser\'s site data.
              </p>

              <h3>3.2 Aggregate Performance Metrics</h3>
              <p>
                Our hosting provider (Vercel) automatically collects anonymised, aggregate infrastructure metrics such as request counts, response latency,
                and error rates. This data is used solely for monitoring uptime and performance. It contains no personally identifiable information and
                cannot be linked to individual users or sessions.
              </p>

              <h3>3.3 Advertising</h3>
              <p>
                SelfPDF displays ads through a third-party ad network to support its free operation. Ad providers may set their own cookies and collect
                certain data (such as approximate location derived from your IP address) in accordance with their own privacy policies. We recommend
                reviewing the privacy policy of any ad provider you interact with. You may opt out of personalised advertising through your browser\'s
                privacy settings or by using an ad blocker.
              </p>

              <h2>4. Cookies</h2>
              <p>
                SelfPDF itself does not set any first-party cookies. Third-party ad providers on the site may set cookies in accordance with their own
                policies. You can control or disable cookies at any time through your browser settings.
              </p>

              <h2>5. How Your Files Are Processed</h2>
              <p>
                When you open a PDF with SelfPDF, the following happens entirely on your device:
              </p>
              <ol>
                <li>Your browser reads the file from your local disk using the Web File API.</li>
                <li>The file data is loaded into your browser tab\'s memory (RAM).</li>
                <li>Our WebAssembly and JavaScript libraries process the file according to the operation you selected.</li>
                <li>The output file is made available for download directly from your browser\'s memory, using a temporary Blob URL.</li>
                <li>When you close the tab or navigate away, all file data is garbage-collected and permanently discarded.</li>
              </ol>
              <p>
                <strong>At no point does any file data leave your device or transit over any network connection.</strong>
              </p>

              <h2>6. Third-Party Libraries</h2>
              <p>
                SelfPDF uses the following open-source libraries for PDF processing. All of these run <em>entirely in your browser</em> and do not
                communicate with any external servers:
              </p>
              <ul>
                <li><strong>pdf-lib</strong> — PDF creation and manipulation</li>
                <li><strong>pdfjs-dist</strong> — PDF rendering and parsing (by Mozilla)</li>
                <li><strong>Tesseract.js</strong> — OCR text extraction via WebAssembly</li>
              </ul>

              <h2>7. Open Source Transparency</h2>
              <p>
                Because SelfPDF is fully open source, you don\'t have to take our word for any of this. You can inspect exactly how the application works,
                verify that no data leaves your browser, and even run your own private instance. The source code is available on{' '}
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-primary no-underline hover:underline">
                  GitHub
                </a>
                .
              </p>

              <h2>8. Children's Privacy</h2>
              <p>
                SelfPDF does not knowingly collect any information from children under the age of 13. Because we collect no personal data from any user,
                the service is safe for users of all ages. Parents and guardians who have concerns should contact us using the information below.
              </p>

              <h2>9. International Users</h2>
              <p>
                SelfPDF is accessible worldwide. Because we collect virtually no user data, GDPR (EU), CCPA (California), PIPEDA (Canada), and equivalent
                laws are straightforward to comply with — there is no personal data to process, transfer, or delete. If you have specific regulatory
                questions, please reach out.
              </p>

              <h2>10. Your Rights</h2>
              <p>
                Depending on your jurisdiction, you may have rights over your personal data, including the right to access, correct, or delete it. Because
                SelfPDF collects no personal data (other than the optional theme preference stored locally in your own browser), exercising most of these
                rights simply involves clearing your browser\'s local storage for our domain. If you have questions, please contact us.
              </p>

              <h2>11. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in technology, law, or our practices. Material changes will be
                posted on this page with an updated "Last updated" date at the top. We encourage you to review this policy periodically.
              </p>

              <h2>12. Contact</h2>
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy, please open an issue on our{' '}
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-primary no-underline hover:underline">
                  GitHub repository
                </a>
                . This is the fastest way to get a response from the maintainers.
              </p>
            </div>

            {/* Quick links */}
            <div className="mt-12 flex flex-wrap gap-3 border-t pt-8">
              <Link
                href="/terms"
                className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                Terms of Service →
              </Link>
              <Link
                href="/about"
                className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                About SelfPDF →
              </Link>
              <Link
                href="/docs"
                className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                Documentation →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
