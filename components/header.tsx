import Link from 'next/link';
import { Github } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-2 z-50 w-full px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-2xl border bg-background/80 shadow-lg backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/chatgpt-image-jan-17-2026-09-26-55-pm-removebg-preview.png"
              alt="SelfPDF Logo"
              width={36}
              height={36}
              className="size-9"
            />
            <span className="text-xl font-bold">SelfPDF</span>
          </Link>
          
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/tools" className="text-sm font-medium transition-colors hover:text-primary">
              All Tools
            </Link>
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
              About
            </Link>
            <Link href="/privacy" className="text-sm font-medium transition-colors hover:text-primary">
              Privacy
            </Link>
          </nav>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-lg" asChild>
              <a href="https://github.com/Rehanbuilds/selpdf-v2" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="size-5" />
              </a>
            </Button>
            <Button asChild className="hidden md:inline-flex">
              <Link href="/tools">Start Using Tools</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
