import React from "react"
import Link from 'next/link';
import { ArrowLeft, Type as type, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  children: React.ReactNode;
}

export function ToolLayout({ title, description, icon: Icon, color, children }: ToolLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="border-b bg-muted/30">
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/tools">
                <ArrowLeft className="mr-2 size-4" />
                All Tools
              </Link>
            </Button>
            
            <div className="flex items-start gap-4">
              <div className={`flex size-16 shrink-0 items-center justify-center rounded-2xl ${color}`}>
                <Icon className="size-8" />
              </div>
              <div>
                <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
                <p className="text-lg text-muted-foreground">{description}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
