import type { Metadata } from 'next';
import Link from 'next/link';
import { Scale, FileCheck, AlertTriangle, ShieldCheck, RefreshCw, Globe, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Terms of Service — SelfPDF',
  description:
    'Read the SelfPDF Terms of Service. By using SelfPDF, you agree to use it lawfully and responsibly. The service is provided free of charge under the MIT open-source license.',
};

const TOC = [
  { id: 'acceptance', label: '1. Acceptance of Terms' },
  { id: 'description', label: '2. Description of Service' },
  { id: 'use', label: '3. Permitted & Prohibited Use' },
  { id: 'ip', label: '4. Intellectual Property' },
  { id: 'disclaimers', label: '5. Disclaimers & Warranties' },
  { id: 'liability', label: '6. Limitation of Liability' },
  { id: 'privacy', label: '7. Privacy' },
  { id: 'opensource', label: '8. Open-Source License' },
  { id: 'thirdparty', label: '9. Third-Party Services' },
  { id: 'changes', label: '10. Changes to Terms' },
  { id: 'governing', label: '11. Governing Law' },
  { id: 'contact', label: '12. Contact' },
];

export default function TermsPage() {
  const lastUpdated = 'June 21, 2025';

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* ─── Hero ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b bg-gradient-to-b from-muted/60 to-background py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
          </div>

          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-1.5 text-sm backdrop-blur">
              <Scale className="size-4 text-amber-500" />
              <span>Plain-Language Terms</span>
            </div>

            <h1 className="mb-4 text-5xl font-bold tracking-tight sm:text-6xl">Terms of Service</h1>
            <p className="mb-2 text-lg text-muted-foreground">
              Last updated: <time dateTime="2025-06-21">{lastUpdated}</time>
            </p>
            <p className="max-w-2xl text-xl leading-relaxed text-muted-foreground">
              These Terms of Service govern your use of SelfPDF. We\'ve written them in plain language so you can actually understand what you\'re agreeing to.
              The core ask is simple: use SelfPDF responsibly and legally.
            </p>
          </div>
        </section>

        {/* ─── Layout: ToC + Content ────────────────────────────── */}
        <section className="pb-24 pt-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">

              {/* Table of Contents (sticky on large screens) */}
              <aside className="shrink-0 lg:w-56">
                <div className="lg:sticky lg:top-24">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Contents</p>
                  <nav>
                    <ul className="space-y-1.5">
                      {TOC.map(({ id, label }) => (
                        <li key={id}>
                          <a
                            href={`#${id}`}
                            className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
                          >
                            {label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </aside>

              {/* Main content */}
              <div className="flex-1 min-w-0">
                <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:scroll-mt-28 prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-lg prose-h3:font-semibold prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">

                  <h2 id="acceptance">1. Acceptance of Terms</h2>
                  <p>
                    By accessing or using SelfPDF (available at <a href="https://selfpdf.com" className="text-primary no-underline hover:underline">selfpdf.com</a> and
                    its subdomains), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of
                    these terms, you must discontinue use of the service immediately.
                  </p>
                  <p>
                    Your continued use of SelfPDF after any modification to these terms constitutes your acceptance of the updated terms. We will always post a
                    new "Last updated" date at the top of this page when changes are made.
                  </p>

                  <h2 id="description">2. Description of Service</h2>
                  <p>
                    SelfPDF provides a suite of free, browser-based PDF processing tools, including but not limited to:
                  </p>
                  <ul>
                    <li><strong>Organisation tools:</strong> Merge, Split, Compress, Repair PDF</li>
                    <li><strong>Conversion tools:</strong> PDF to/from Word, Excel, PowerPoint, Images, HTML; OCR Scanner; Scan to PDF</li>
                    <li><strong>Editing tools:</strong> Rotate, Watermark, Page Numbers, Sign, Crop PDF</li>
                    <li><strong>Security tools:</strong> Protect PDF (add password), Unlock PDF (remove password)</li>
                  </ul>
                  <p>
                    All tools run <strong>entirely in your web browser</strong> using client-side JavaScript and WebAssembly. No files are transmitted to or
                    stored on SelfPDF\'s servers. The service is provided free of charge and requires no account or registration.
                  </p>

                  <h2 id="use">3. Permitted &amp; Prohibited Use</h2>

                  <h3>3.1 Permitted Use</h3>
                  <p>You may use SelfPDF for any lawful personal, educational, or commercial purpose, including:</p>
                  <ul>
                    <li>Processing your own documents or documents you have legal authority to process</li>
                    <li>Integrating SelfPDF\'s open-source code into your own projects (subject to the MIT License)</li>
                    <li>Self-hosting your own instance of the application</li>
                  </ul>

                  <h3>3.2 Prohibited Use</h3>
                  <p>You agree <strong>not</strong> to:</p>
                  <ul>
                    <li>Use the service to process documents that contain illegal content, including but not limited to child sexual abuse material (CSAM), material that promotes violence or terrorism, or content that violates any applicable laws</li>
                    <li>Attempt to reverse-engineer, circumvent, or tamper with any security or anti-abuse measures in the application</li>
                    <li>Use automated scripts, bots, or scrapers to access the service at a rate that unreasonably burdens our infrastructure</li>
                    <li>Represent SelfPDF as your own product or remove attribution from the open-source code in violation of the MIT License</li>
                    <li>Use the service to infringe any third party's copyright, trademark, patent, trade secret, or other proprietary rights</li>
                    <li>Engage in any activity that interferes with or disrupts the service or the servers hosting it</li>
                  </ul>

                  <h2 id="ip">4. Intellectual Property</h2>

                  <h3>4.1 SelfPDF\'s Intellectual Property</h3>
                  <p>
                    The SelfPDF codebase, design, and documentation are released under the <strong>MIT License</strong>. You are free to use, copy, modify,
                    merge, publish, distribute, sublicense, and/or sell copies of the software, subject to the license terms. The SelfPDF name and logo are
                    identifiers of the project; please do not use them in a way that implies an official endorsement without written permission.
                  </p>

                  <h3>4.2 Your Content</h3>
                  <p>
                    Because all processing happens locally in your browser, SelfPDF never receives, stores, or has any access to your PDF files or their
                    contents. You retain 100% ownership of and responsibility for all files you process using SelfPDF. We make no claim to any rights over
                    your documents.
                  </p>

                  <h2 id="disclaimers">5. Disclaimers &amp; Warranties</h2>
                  <p>
                    SelfPDF is provided <strong>"as is"</strong> and <strong>"as available"</strong> without any warranties of any kind, express or implied,
                    including but not limited to warranties of merchantability, fitness for a particular purpose, accuracy, non-infringement, or uninterrupted
                    service.
                  </p>
                  <p>Specifically, we do <strong>not</strong> warrant that:</p>
                  <ul>
                    <li>The service will meet your specific requirements</li>
                    <li>The service will be available 100% of the time or error-free</li>
                    <li>All PDF operations will produce perfect output for every file type and PDF version</li>
                    <li>Any errors or defects in the service will be corrected within a specific timeframe</li>
                  </ul>
                  <p>
                    You use SelfPDF entirely at your own risk. We strongly recommend keeping backup copies of any documents you process.
                  </p>

                  <h2 id="liability">6. Limitation of Liability</h2>
                  <p>
                    To the maximum extent permitted by applicable law, SelfPDF and its contributors, maintainers, and affiliates shall not be liable for any:
                  </p>
                  <ul>
                    <li>Direct, indirect, incidental, special, consequential, or punitive damages</li>
                    <li>Loss of profits, data, business, or goodwill</li>
                    <li>Damage to documents, files, or other data arising from the use of our tools</li>
                    <li>Cost of procurement of substitute goods or services</li>
                  </ul>
                  <p>
                    This limitation applies regardless of the legal theory under which damages are sought (contract, tort, strict liability, or otherwise), and
                    even if SelfPDF has been advised of the possibility of such damages.
                  </p>
                  <p>
                    In jurisdictions that do not allow the exclusion or limitation of certain damages, SelfPDF\'s liability is limited to the maximum extent
                    permitted by law.
                  </p>

                  <h2 id="privacy">7. Privacy</h2>
                  <p>
                    Your use of SelfPDF is also governed by our{' '}
                    <Link href="/privacy" className="text-primary no-underline hover:underline">
                      Privacy Policy
                    </Link>
                    , which is incorporated into these Terms by reference. In summary: we collect virtually no personal data, and your PDF files never leave
                    your device. Please read the full Privacy Policy for complete details.
                  </p>

                  <h2 id="opensource">8. Open-Source License</h2>
                  <p>
                    SelfPDF is released under the <strong>MIT License</strong>. The full license text is available in the project's GitHub repository. In
                    accordance with the MIT License:
                  </p>
                  <ul>
                    <li>You may use the software for any purpose, including commercial use</li>
                    <li>You may modify, copy, merge, publish, and distribute the software</li>
                    <li>You must include the original MIT License notice in any substantial portion of the software you redistribute</li>
                    <li>The software is provided "as is" with no warranty (see Section 5 above)</li>
                  </ul>

                  <h2 id="thirdparty">9. Third-Party Services</h2>
                  <p>
                    SelfPDF may contain links to third-party websites and integrations with third-party services (including open-source libraries and ad
                    providers). These third-party services are governed by their own terms of service and privacy policies. SelfPDF is not responsible for the
                    content, practices, or policies of any third-party service. Your interactions with third-party services are at your own risk.
                  </p>
                  <p>
                    Advertising on SelfPDF is provided by a third-party ad network. By using SelfPDF, you may be subject to the ad network's own terms and
                    data practices when interacting with advertisements.
                  </p>

                  <h2 id="changes">10. Changes to Terms</h2>
                  <p>
                    We reserve the right to modify these Terms of Service at any time. Changes become effective immediately upon posting to this page. We will
                    update the "Last updated" date at the top of this document when changes are made. For significant changes, we may also post a notice on
                    the SelfPDF homepage or GitHub repository.
                  </p>
                  <p>
                    Your continued use of SelfPDF following the posting of changes constitutes your acceptance of those changes. If you do not agree to the
                    revised terms, you must stop using the service.
                  </p>

                  <h2 id="governing">11. Governing Law</h2>
                  <p>
                    These Terms of Service shall be governed by and construed in accordance with applicable laws, without giving effect to any choice or
                    conflict of law provisions. Any disputes arising from these terms or your use of SelfPDF shall be resolved in the courts of competent
                    jurisdiction in the applicable territory.
                  </p>
                  <p>
                    If any provision of these Terms is found to be unenforceable, the remaining provisions will continue to be in full force and effect.
                  </p>

                  <h2 id="contact">12. Contact</h2>
                  <p>
                    For questions, concerns, or requests related to these Terms of Service, please open an issue on our{' '}
                    <a href="https://github.com/Rehanbuilds/selpdf-v2" target="_blank" rel="noopener noreferrer" className="text-primary no-underline hover:underline">
                      GitHub repository
                    </a>
                    . This ensures your question is visible to all maintainers and receives the fastest possible response.
                  </p>
                </div>

                {/* Quick links */}
                <div className="mt-12 flex flex-wrap gap-3 border-t pt-8">
                  <Link
                    href="/privacy"
                    className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                  >
                    Privacy Policy →
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
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
