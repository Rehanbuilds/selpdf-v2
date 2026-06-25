import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Shield, Zap, Lock, Github, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { AnimatedHero } from '@/components/animated-hero';
import { AdBanner } from '@/components/ad-banner';
import { pdfTools, toolCategories } from '@/lib/config/tools';
import { HeroBackground } from '@/components/hero-background';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden mx-auto w-full flex-col items-center gap-6 px-4 py-12 text-center sm:px-6 md:py-16 lg:px-8 lg:py-20">
          <HeroBackground />
          <div className="mx-auto flex max-w-6xl flex-col gap-5">
            <div className="inline-flex items-center gap-2 self-center rounded-full border bg-muted px-4 py-1.5 text-sm">
              <Github className="size-4" />
              <span>100% Open Source</span>
            </div>
            
            <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Your <span className="text-primary">Self-Service</span>
              <br />
              PDF Toolkit
            </h1>

            <p className="mx-auto max-w-3xl text-pretty text-base text-muted-foreground sm:text-lg md:text-xl">
              Process your PDF files directly in your browser with professional-grade tools. No uploads to servers, no tracking. Everything happens locally on your device for maximum privacy and security.
            </p>
            
            <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" asChild className="h-12 px-8 text-base">
                <Link href="/tools">
                  Start Using Tools
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Animated Hero Graphic */}
          <AnimatedHero />
        </section>

        {/* Ad Banner - Below Hero */}
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <AdBanner />
        </div>

        {/* Features Grid */}
        <section className="border-y bg-muted/30 py-16 md:py-24">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                All the PDF Tools You Need
              </h2>
              <p className="text-lg text-muted-foreground">
                Professional-grade PDF processing in your browser
              </p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pdfTools.slice(0, 8).map((tool) => {
                const Icon = tool.icon;
                return (
                  <Card key={tool.id} className="group transition-all hover:shadow-lg">
                    <CardContent className="p-6">
                      <Link href={tool.href} className="flex flex-col gap-3">
                        <div className={`inline-flex size-12 items-center justify-center rounded-xl ${tool.color}`}>
                          <Icon className="size-6" />
                        </div>
                        <div>
                          <h3 className="mb-1 font-semibold group-hover:text-primary">
                            {tool.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {tool.description}
                          </p>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="mt-8 text-center">
              <Button variant="outline" size="lg" asChild>
                <Link href="/tools">
                  View All {pdfTools.length} Tools
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Use Cases Bento Grid */}
        <section className="border-y bg-muted/30 py-16 md:py-24">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Built For Everyone
              </h2>
              <p className="text-lg text-muted-foreground">
                From students to enterprises, discover how SelfPDF makes PDF work easier
              </p>
            </div>
            
            <div className="grid auto-rows-fr gap-4 md:grid-cols-3">
              {/* Large card - Students */}
              <Card className="group relative overflow-hidden md:col-span-2 md:row-span-2 bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-950 dark:to-blue-900">
                <div className="absolute right-0 top-0 -mr-20 -mt-20 size-64 rounded-full bg-blue-200/20 dark:bg-blue-500/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-32 -mb-32 size-56 rounded-full bg-blue-300/10 dark:bg-blue-500/5 blur-3xl" />
                <CardContent className="relative flex h-full flex-col justify-between p-8">
                  <div>
                    <div className="mb-6 inline-flex rounded-xl bg-blue-500 p-4 shadow-lg">
                      <svg className="size-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="mb-3 text-2xl font-bold">For Students</h3>
                    <p className="mb-6 text-muted-foreground">
                      Merge lecture notes, compress assignments for email, split study materials, and organize research papers. All the tools you need for academic success.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Merge Notes</span>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Compress Files</span>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Split PDFs</span>
                  </div>
                </CardContent>
              </Card>

              {/* Medium card - Business */}
              <Card className="group relative overflow-hidden md:row-span-1 bg-gradient-to-br from-orange-50 to-orange-50/50 dark:from-orange-950 dark:to-orange-900">
                <div className="absolute -right-12 -top-12 size-40 rounded-full bg-orange-200/20 dark:bg-orange-500/10 blur-3xl" />
                <CardContent className="relative flex h-full flex-col justify-between p-6">
                  <div>
                    <div className="mb-3 inline-flex rounded-lg bg-orange-500 p-2.5 shadow-md">
                      <svg className="size-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-xl font-bold">For Business</h3>
                    <p className="text-sm text-muted-foreground">
                      Streamline contracts, invoices, and reports. Process documents securely without third-party servers.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Medium card - Professionals */}
              <Card className="group relative overflow-hidden md:row-span-1 bg-gradient-to-br from-purple-50 to-purple-50/50 dark:from-purple-950 dark:to-purple-900">
                <div className="absolute -left-16 -bottom-16 size-48 rounded-full bg-purple-200/20 dark:bg-purple-500/10 blur-3xl" />
                <CardContent className="relative flex h-full flex-col justify-between p-6">
                  <div>
                    <div className="mb-3 inline-flex rounded-lg bg-purple-500 p-2.5 shadow-md">
                      <svg className="size-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-xl font-bold">For Professionals</h3>
                    <p className="text-sm text-muted-foreground">
                      Edit portfolios, rotate scanned documents, and convert file formats on the go.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Wide card - Researchers */}
              <Card className="group relative overflow-hidden md:col-span-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-900">
                <div className="absolute -top-20 -right-20 size-64 rounded-full bg-green-200/15 dark:bg-green-500/10 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 size-56 rounded-full bg-emerald-200/10 dark:bg-emerald-500/5 blur-3xl" />
                <CardContent className="relative flex h-full flex-col justify-between p-6 md:flex-row md:items-center md:gap-6">
                  <div className="flex-1">
                    <div className="mb-3 inline-flex rounded-lg bg-green-500 p-2.5 shadow-md">
                      <svg className="size-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-xl font-bold">For Researchers & Writers</h3>
                    <p className="text-sm text-muted-foreground">
                      Organize papers, extract chapters, merge bibliographies, and protect sensitive research data with local processing.
                    </p>
                  </div>
                  <div className="mt-4 flex gap-2 md:mt-0">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">Extract</span>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">Protect</span>
                  </div>
                </CardContent>
              </Card>

              {/* Small card - Personal Use */}
              <Card className="group relative overflow-hidden bg-gradient-to-br from-pink-50 to-pink-50/50 dark:from-pink-950 dark:to-pink-900">
                <div className="absolute -right-16 -top-16 size-40 rounded-full bg-pink-200/20 dark:bg-pink-500/10 blur-3xl" />
                <CardContent className="relative flex h-full flex-col justify-between p-6">
                  <div>
                    <div className="mb-3 inline-flex rounded-lg bg-pink-500 p-2.5 shadow-md">
                      <svg className="size-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-lg font-bold">Personal Use</h3>
                    <p className="text-sm text-muted-foreground">
                      Organize receipts, scan documents, and manage household files with ease.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Ad Banner - Mid Content */}
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <AdBanner />
        </div>

        {/* Trust Section */}
        <section className="border-y bg-muted/30 py-16 md:py-24">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Why Choose SelfPDF?
              </h2>
              <p className="text-lg text-muted-foreground">
                Built with privacy, speed, and transparency in mind
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Github className="size-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">100% Open Source</h3>
                    <p className="text-sm text-muted-foreground">
                      Full transparency. Audit our code anytime on GitHub.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Lock className="size-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">No File Storage</h3>
                    <p className="text-sm text-muted-foreground">
                      Files are processed in your browser. Nothing is saved.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Shield className="size-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">Privacy First</h3>
                    <p className="text-sm text-muted-foreground">
                      No tracking, no analytics, no data collection.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Zap className="size-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">Fast Processing</h3>
                    <p className="text-sm text-muted-foreground">
                      Edge computing for lightning-fast PDF operations.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Ad Banner - Pre CTA */}
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <AdBanner />
        </div>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardContent className="flex flex-col items-center gap-6 p-8 text-center md:p-12">
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  Ready to Process Your PDFs?
                </h2>
                <p className="max-w-2xl text-lg text-muted-foreground">
                  No sign-up required. No credit card needed. Start using professional PDF tools right now.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button size="lg" asChild className="group">
                    <Link href="/tools">
                      Start Using Tools
                      <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="https://github.com/Rehanbuilds/selpdf-v2" target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 size-4" />
                      Star on GitHub
                    </a>
                  </Button>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-primary" />
                    <span>Free Forever</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-primary" />
                    <span>No Sign-Up</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-primary" />
                    <span>Open Source</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
