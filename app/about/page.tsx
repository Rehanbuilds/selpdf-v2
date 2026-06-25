import type { Metadata } from 'next';
import Link from 'next/link';
import { Github, Heart, Shield, Zap, Code, Lock, Globe, Users, Cpu, ArrowRight, CheckCircle2, BookOpen, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'About SelfPDF — Free, Private, Open-Source PDF Toolkit',
  description:
    'Learn how SelfPDF was built with privacy-first principles. No uploads, no tracking, no accounts — professional PDF tools that run entirely in your browser.',
};

const VALUES = [
  {
    icon: Shield,
    title: 'Privacy First',
    color: 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400',
    description:
      'Every PDF you open in SelfPDF stays on your device. We engineered a strictly client-side architecture so your documents never touch our servers — not for a millisecond.',
  },
  {
    icon: Code,
    title: '100% Open Source',
    color: 'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400',
    description:
      'The entire codebase is public under the MIT License. Audit it, fork it, self-host it, or contribute to it. Transparency is not optional for us — it\'s a promise.',
  },
  {
    icon: Zap,
    title: 'Instant Processing',
    color: 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400',
    description:
      'Browser-native APIs and WebAssembly give you server-class PDF operations at near-native speed. No queues, no waiting for uploads, no bandwidth limits.',
  },
  {
    icon: Heart,
    title: 'Free Forever',
    color: 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400',
    description:
      'There are no premium tiers, no paywalls, no credits system. Every tool — all 22 of them — is free to use as much as you need, forever.',
  },
  {
    icon: Globe,
    title: 'Works Offline',
    color: 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400',
    description:
      'Once the page loads, your internet connection becomes optional. All processing is local, so you can work with sensitive documents in air-gapped environments.',
  },
  {
    icon: Users,
    title: 'Built for Everyone',
    color: 'bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400',
    description:
      'From students compressing lecture slides to legal teams handling confidential contracts — SelfPDF is designed for any person, any device, any workflow.',
  },
];

const TECH_STACK = [
  { name: 'Next.js 14', role: 'React framework with App Router for server & client components', link: 'https://nextjs.org' },
  { name: 'TypeScript', role: 'Type-safe development throughout the entire codebase', link: 'https://www.typescriptlang.org' },
  { name: 'Tailwind CSS', role: 'Utility-first CSS for a consistent, responsive design system', link: 'https://tailwindcss.com' },
  { name: 'shadcn/ui', role: 'Accessible, beautifully styled UI component primitives', link: 'https://ui.shadcn.com' },
  { name: 'pdf-lib', role: 'Full-featured PDF manipulation — merge, split, edit, protect', link: 'https://pdf-lib.js.org' },
  { name: 'pdfjs-dist', role: 'Mozilla\'s battle-tested PDF rendering & parsing engine', link: 'https://mozilla.github.io/pdf.js' },
  { name: 'Tesseract.js', role: 'WASM-powered OCR engine for text extraction from scanned PDFs', link: 'https://tesseract.projectnaptha.com' },
  { name: 'Zustand', role: 'Lightweight, intuitive state management with zero boilerplate', link: 'https://zustand-demo.pmnd.rs' },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* ─── Hero ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b bg-gradient-to-b from-muted/60 to-background py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
          </div>

          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-1.5 text-sm backdrop-blur">
              <Github className="size-4" />
              <span>100% Open Source · MIT License</span>
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
              About <span className="text-primary">SelfPDF</span>
            </h1>

            <p className="mb-8 max-w-3xl text-xl leading-relaxed text-muted-foreground">
              SelfPDF is a free, open-source PDF toolkit built with a single obsession: <strong className="text-foreground">your privacy</strong>. We give you
              professional-grade PDF tools that run entirely in your browser — no accounts, no uploads, no compromises.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/tools">
                  Explore All Tools
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="https://github.com/Rehanbuilds/selpdf-v2" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 size-4" />
                  View Source Code
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* ─── The Story ────────────────────────────────────────── */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">Our Story</div>
            <h2 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">
              Why we built SelfPDF
            </h2>

            <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>
                Every time you use a popular online PDF service, you upload your documents to a stranger's server. Your tax returns. Your medical records.
                Your confidential business contracts. Most services promise they delete files after a few hours — but can you verify that? With SelfPDF, you
                don\'t need to trust anyone.
              </p>
              <p>
                We built SelfPDF because we believe powerful document tools shouldn't require you to hand over your data. Modern browser technology —
                WebAssembly, the File System Access API, and powerful JavaScript PDF libraries — make it possible to process PDFs directly in the browser
                with performance that rivals server-side solutions.
              </p>
              <p>
                The result is a toolkit of <strong className="text-foreground">22 professional PDF tools</strong>, all running entirely on your device,
                all completely free, and all released under the MIT open-source license so anyone can inspect, trust, and build on the work.
              </p>
            </div>
          </div>
        </section>

        {/* ─── Values ───────────────────────────────────────────── */}
        <section className="border-y bg-muted/30 py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <div className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">Core Values</div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">What we stand for</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Every decision we make is guided by these principles — from how we architect the app to what features we build next.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {VALUES.map(({ icon: Icon, title, color, description }) => (
                <Card key={title} className="group transition-all hover:shadow-md">
                  <CardContent className="flex flex-col gap-4 p-6">
                    <div className={`inline-flex size-12 items-center justify-center rounded-xl ${color}`}>
                      <Icon className="size-6" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ─── How it works ─────────────────────────────────────── */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">Under the Hood</div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">How client-side processing works</h2>
            <p className="mb-12 text-lg text-muted-foreground">
              Unlike traditional PDF services, SelfPDF never sends your files anywhere. Here's exactly what happens when you process a PDF:
            </p>

            <div className="space-y-6">
              {[
                {
                  step: '01',
                  title: 'You select your file',
                  body: 'Your file is read by the browser\'s native File API. It lives in your device\'s RAM — no internet connection required at this point.',
                },
                {
                  step: '02',
                  title: 'WebAssembly does the heavy lifting',
                  body: 'Our PDF libraries (pdf-lib, pdfjs-dist, Tesseract.js) run as compiled WebAssembly modules directly in your browser tab, providing near-native execution speed.',
                },
                {
                  step: '03',
                  title: 'The result is generated locally',
                  body: 'The processed PDF is assembled entirely in memory on your device. It is never transmitted over the network.',
                },
                {
                  step: '04',
                  title: 'You download the output',
                  body: 'Your browser triggers a local download using the Blob URL API. When you close the tab, all data is immediately garbage-collected.',
                },
              ].map(({ step, title, body }) => (
                <div key={step} className="flex gap-6">
                  <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                    {step}
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">{title}</h3>
                    <p className="text-muted-foreground">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Tools overview ───────────────────────────────────── */}
        <section className="border-y bg-muted/30 py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">The Toolkit</div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">22 tools, zero compromises</h2>
            <p className="mb-10 text-lg text-muted-foreground">
              Organised into four categories so you can find what you need instantly.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  cat: 'Organize',
                  color: 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30',
                  badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
                  tools: ['Merge PDF', 'Split PDF', 'Compress PDF', 'Repair PDF'],
                },
                {
                  cat: 'Convert',
                  color: 'border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/30',
                  badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
                  tools: ['PDF to Images', 'Images to PDF', 'PDF to Word', 'Word to PDF', 'PDF to PowerPoint', 'PowerPoint to PDF', 'PDF to Excel', 'Excel to PDF', 'HTML to PDF', 'OCR Scanner', 'Scan PDF'],
                },
                {
                  cat: 'Edit',
                  color: 'border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/30',
                  badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
                  tools: ['Rotate PDF', 'Watermark', 'Page Numbers', 'Sign PDF', 'Crop PDF'],
                },
                {
                  cat: 'Security',
                  color: 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/30',
                  badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
                  tools: ['Unlock PDF', 'Protect PDF'],
                },
              ].map(({ cat, color, badge, tools }) => (
                <Card key={cat} className={`border ${color}`}>
                  <CardContent className="p-6">
                    <h3 className="mb-3 font-semibold">{cat}</h3>
                    <div className="flex flex-wrap gap-2">
                      {tools.map((t) => (
                        <span key={t} className={`rounded-full px-2.5 py-1 text-xs font-medium ${badge}`}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button size="lg" asChild>
                <Link href="/tools">
                  Browse All Tools
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ─── Tech Stack ───────────────────────────────────────── */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">Technology</div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Built with the best open-source tools</h2>
            <p className="mb-10 text-lg text-muted-foreground">
              SelfPDF stands on the shoulders of giants. Every library we use is open-source and battle-tested.
            </p>

            <div className="overflow-hidden rounded-xl border">
              {TECH_STACK.map(({ name, role, link }, idx) => (
                <a
                  key={name}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-start gap-4 px-6 py-4 transition-colors hover:bg-muted/60 ${idx !== 0 ? 'border-t' : ''}`}
                >
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Cpu className="size-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold group-hover:text-primary">{name}</p>
                    <p className="text-sm text-muted-foreground">{role}</p>
                  </div>
                  <ExternalLink className="mt-1 size-4 shrink-0 text-muted-foreground/50 group-hover:text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Open Source CTA ──────────────────────────────────── */}
        <section className="border-t bg-gradient-to-b from-muted/30 to-background py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-center">
              <div className="flex size-20 items-center justify-center rounded-3xl bg-primary/10">
                <Github className="size-10 text-primary" />
              </div>
            </div>

            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Proudly Open Source</h2>
            <p className="mb-8 text-xl text-muted-foreground">
              SelfPDF is built in public. Star the repo, file issues, or submit a pull request — every contribution makes the toolkit better for everyone.
            </p>

            <div className="mx-auto mb-8 flex max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
              {[
                '⭐ Star the repository',
                '🐛 Report bugs or request features',
                '🔀 Submit pull requests',
                '🚀 Self-host your own instance',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground sm:justify-center">
                  <CheckCircle2 className="size-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <a href="https://github.com/Rehanbuilds/selpdf-v2" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 size-4" />
                  Contribute on GitHub
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs">
                  <BookOpen className="mr-2 size-4" />
                  Read the Docs
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
