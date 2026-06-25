import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'SelfPDF - Free PDF Tools Online | Merge, Split, Compress & Convert',
  description: 'SelfPDF is a free, fast, and private online PDF toolkit. Merge, split, compress, convert, and edit PDF files instantly without sign-up. 100% open source and secure.',
  keywords: [
    'PDF tools',
    'merge PDF',
    'split PDF',
    'compress PDF',
    'convert PDF',
    'free PDF editor',
    'online PDF tools',
    'PDF converter',
    'PDF compressor',
    'edit PDF online',
    'free PDF merge',
    'PDF splitter',
    'PDF processing',
    'no signup PDF tools',
    'open source PDF'
  ],
  authors: [{ name: 'SelfPDF' }],
  creator: 'SelfPDF',
  category: 'Productivity',
  classification: 'Software',
  openGraph: {
    title: 'SelfPDF - Free PDF Tools Online',
    description: 'Fast, private, and free PDF toolkit. Merge, split, compress, convert PDF files online without sign-up.',
    type: 'website',
    url: 'https://selfpdf.com',
    siteName: 'SelfPDF',
    images: [
      {
        url: '/selfpdf-logo.png',
        width: 1200,
        height: 630,
        alt: 'SelfPDF - PDF Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SelfPDF - Free PDF Tools Online',
    description: 'Merge, split, compress, and convert PDF files instantly. Free, fast, and private.',
    images: ['/selfpdf-logo.png'],
  },
  icons: {
    icon: [
      {
        url: '/favicon.png',
        type: 'image/png',
      },
    ],
    apple: '/apple-icon.png',
    shortcut: '/favicon.png',
  },
  alternates: {
    canonical: 'https://selfpdf.com',
  },
  verification: {
    google: 'UrnTHeuyZsULh51e1768MOmnLROFkvMpQJTKnrh7wEY',
  },
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="UrnTHeuyZsULh51e1768MOmnLROFkvMpQJTKnrh7wEY" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="white" />
      </head>
      <body className={`font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
