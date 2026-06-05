import Link from 'next/link';
import { Github, Heart, Shield, Zap, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="border-b bg-muted/30 py-16 md:py-24">
          <div className="container max-w-4xl px-4 sm:px-6 lg:px-8">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
              About SelfPDF
            </h1>
            <p className="text-balance text-xl text-muted-foreground leading-relaxed">
              SelfPDF is a free, open-source PDF toolkit built with privacy and performance in mind. 
              We believe everyone should have access to professional PDF tools without compromising their data security.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl font-bold tracking-tight">Our Mission</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardContent className="flex flex-col gap-4 p-6">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                    <Shield className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">Privacy First</h3>
                    <p className="text-sm text-muted-foreground">
                      All PDF processing happens in your browser. Your files never leave your device, 
                      ensuring complete privacy and security.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col gap-4 p-6">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                    <Code className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">Open Source</h3>
                    <p className="text-sm text-muted-foreground">
                      Built transparently in the open. Anyone can audit the code, contribute features, 
                      or self-host their own instance.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col gap-4 p-6">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                    <Zap className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">Lightning Fast</h3>
                    <p className="text-sm text-muted-foreground">
                      Powered by modern web technologies and edge computing for instant PDF processing 
                      without server delays.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col gap-4 p-6">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                    <Heart className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">Free Forever</h3>
                    <p className="text-sm text-muted-foreground">
                      No subscriptions, no hidden fees, no premium tiers. Professional PDF tools 
                      accessible to everyone, always.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="border-y bg-muted/30 py-16 md:py-24">
          <div className="container max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">Open Source</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              SelfPDF is built on open-source technologies and is itself open source. 
              Contribute, fork, or self-host your own instance.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 size-4" />
                  View on GitHub
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/tools">
                  Try the Tools
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl font-bold tracking-tight">Technology Stack</h2>
            <div className="prose prose-slate max-w-none dark:prose-invert">
              <ul className="space-y-3 text-muted-foreground">
                <li><strong className="text-foreground">Next.js 14</strong> - React framework with App Router</li>
                <li><strong className="text-foreground">TypeScript</strong> - Type-safe development</li>
                <li><strong className="text-foreground">Tailwind CSS</strong> - Utility-first styling</li>
                <li><strong className="text-foreground">pdf-lib</strong> - PDF manipulation library</li>
                <li><strong className="text-foreground">pdfjs-dist</strong> - PDF rendering and parsing</li>
                <li><strong className="text-foreground">Zustand</strong> - Lightweight state management</li>
                <li><strong className="text-foreground">shadcn/ui</strong> - Beautiful UI components</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
