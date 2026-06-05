import Link from 'next/link';
import { Github, Twitter } from 'lucide-react';
import Image from 'next/image';
import { ThemeSwitcher } from '@/components/theme-switcher';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/chatgpt-image-jan-17-2026-09-26-55-pm-removebg-preview.png"
                alt="SelfPDF Logo"
                width={32}
                height={32}
                className="size-8"
              />
              <span className="text-lg font-bold">SelfPDF</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your self-service PDF toolkit. Free, fast, and private.
            </p>
            <div className="flex gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-lg border bg-background transition-colors hover:bg-accent"
              >
                <Github className="size-4" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-lg border bg-background transition-colors hover:bg-accent"
              >
                <Twitter className="size-4" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold">Tools</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tools/merge" className="text-muted-foreground transition-colors hover:text-foreground">
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link href="/tools/split" className="text-muted-foreground transition-colors hover:text-foreground">
                  Split PDF
                </Link>
              </li>
              <li>
                <Link href="/tools/compress" className="text-muted-foreground transition-colors hover:text-foreground">
                  Compress PDF
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-muted-foreground transition-colors hover:text-foreground">
                  View All Tools
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground transition-colors hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground transition-colors hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Source Code
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Contributing
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8">
          <div className="flex flex-col items-center gap-4">
            <p className="text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} SelfPDF. Open source under MIT License.
            </p>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
