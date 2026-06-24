import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BookOpen, FileText, Scissors, Minimize2, ImageIcon, FileImage, FileType, RotateCw, Lock, Shield,
  Droplet, Hash, PenTool, Scan, Presentation, Table, Crop, Code, Wrench, ScanLine, ArrowRight,
  Zap, Globe, Github, ChevronRight, Terminal, CheckCircle2, AlertCircle, Info
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Documentation — SelfPDF',
  description:
    'Complete documentation for SelfPDF. Learn how to use every PDF tool, understand how client-side processing works, and discover tips for getting the best results.',
};

const QUICK_LINKS = [
  { label: 'Getting Started', href: '#getting-started', icon: Zap },
  { label: 'How It Works', href: '#how-it-works', icon: Globe },
  { label: 'All Tools', href: '#tools', icon: FileText },
  { label: 'Organize', href: '#organize', icon: FileText },
  { label: 'Convert', href: '#convert', icon: FileType },
  { label: 'Edit', href: '#edit', icon: PenTool },
  { label: 'Security', href: '#security', icon: Shield },
  { label: 'Tips & Limits', href: '#tips', icon: Info },
  { label: 'Self-Hosting', href: '#self-hosting', icon: Terminal },
  { label: 'Contributing', href: '#contributing', icon: Github },
  { label: 'FAQ', href: '#faq', icon: AlertCircle },
];

const ORGANIZE_TOOLS = [
  {
    id: 'merge',
    icon: FileText,
    name: 'Merge PDF',
    href: '/tools/merge',
    badge: 'Organize',
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    summary: 'Combine two or more PDF files into a single document, in any order you choose.',
    steps: [
      'Click "Add Files" or drag-and-drop your PDF files into the upload area.',
      'Reorder the files by dragging them into the desired sequence.',
      'Click "Merge PDF" to combine them.',
      'Download the merged PDF.',
    ],
    tips: [
      'You can add as many files as your device\'s RAM allows.',
      'The output file order matches the order shown in the list.',
    ],
    limitations: ['Files must be valid, non-corrupted PDFs.', 'Password-protected PDFs must be unlocked first.'],
  },
  {
    id: 'split',
    icon: Scissors,
    name: 'Split PDF',
    href: '/tools/split',
    badge: 'Organize',
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    summary: 'Extract specific pages or page ranges from a PDF into one or more separate documents.',
    steps: [
      'Upload your PDF file.',
      'Choose a split mode: split by every page, by fixed intervals, or by custom page ranges.',
      'Preview the split result.',
      'Download the individual PDF(s).',
    ],
    tips: [
      'Use custom ranges (e.g., "1-3, 5, 7-10") for precise extraction.',
      'Splitting by every page is useful for creating individual slide PDFs.',
    ],
    limitations: ['Page ranges must be within the document\'s page count.'],
  },
  {
    id: 'compress',
    icon: Minimize2,
    name: 'Compress PDF',
    href: '/tools/compress',
    badge: 'Organize',
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    summary: 'Reduce the file size of your PDF for easier sharing and storage.',
    steps: [
      'Upload the PDF you want to compress.',
      'Select a compression level (Low, Medium, High).',
      'Click "Compress" and download the smaller file.',
    ],
    tips: [
      'PDFs that are mostly text won\'t shrink much — compression works best on image-heavy PDFs.',
      'Higher compression = smaller file but potentially lower image quality.',
    ],
    limitations: ['Output quality depends on the content of the original PDF.'],
  },
  {
    id: 'repair',
    icon: Wrench,
    name: 'Repair PDF',
    href: '/tools/repair',
    badge: 'Organize',
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    summary: 'Attempt to fix corrupted or damaged PDF files that won\'t open in standard readers.',
    steps: [
      'Upload the corrupted PDF.',
      'Click "Repair PDF".',
      'If reparable, the fixed version will be available for download.',
    ],
    tips: ['Works best on PDFs with minor structural damage or incomplete writes.'],
    limitations: ['Severely corrupted files with missing data may not be recoverable.'],
  },
];

const CONVERT_TOOLS = [
  {
    id: 'pdf-to-images',
    icon: ImageIcon,
    name: 'PDF to Images',
    href: '/tools/pdf-to-images',
    badge: 'Convert',
    badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    summary: 'Convert each page of your PDF into a high-quality PNG or JPEG image.',
    steps: ['Upload your PDF.', 'Choose output format (PNG or JPEG) and resolution.', 'Download images as a ZIP archive.'],
    tips: ['PNG provides lossless quality, ideal for documents with text.', 'JPEG produces smaller files, better for photo-heavy PDFs.'],
    limitations: ['Very large or complex PDFs may take longer to render.'],
  },
  {
    id: 'images-to-pdf',
    icon: FileImage,
    name: 'Images to PDF',
    href: '/tools/images-to-pdf',
    badge: 'Convert',
    badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    summary: 'Convert one or more images (PNG, JPEG, WEBP, GIF) into a single PDF document.',
    steps: ['Upload your images.', 'Reorder them if needed.', 'Select page size and orientation.', 'Download the PDF.'],
    tips: ['Images are fitted to the selected page size while preserving aspect ratio.'],
    limitations: ['Supported formats: PNG, JPEG, WEBP, GIF, BMP, TIFF.'],
  },
  {
    id: 'pdf-to-word',
    icon: FileType,
    name: 'PDF to Word',
    href: '/tools/pdf-to-word',
    badge: 'Convert',
    badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    summary: 'Convert a PDF document into an editable Microsoft Word (.docx) file.',
    steps: ['Upload your PDF.', 'Click "Convert to Word".', 'Download the .docx file.'],
    tips: ['Best results with text-based PDFs. Scanned PDFs should use OCR first.'],
    limitations: ['Complex formatting (multi-column, tables) may not convert perfectly.'],
  },
  {
    id: 'word-to-pdf',
    icon: FileType,
    name: 'Word to PDF',
    href: '/tools/word-to-pdf',
    badge: 'Convert',
    badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    summary: 'Convert a Microsoft Word (.docx or .doc) file into a PDF.',
    steps: ['Upload your Word file.', 'Click "Convert to PDF".', 'Download the PDF.'],
    tips: ['Preserves fonts, images, and basic layout.'],
    limitations: ['Complex macros or embedded objects may not be preserved.'],
  },
  {
    id: 'pdf-to-powerpoint',
    icon: Presentation,
    name: 'PDF to PowerPoint',
    href: '/tools/pdf-to-powerpoint',
    badge: 'Convert',
    badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    summary: 'Convert PDF pages into editable PowerPoint slides (.pptx).',
    steps: ['Upload your PDF.', 'Click "Convert to PowerPoint".', 'Download the .pptx file.'],
    tips: ['Each PDF page becomes one slide.'],
    limitations: ['Animations and transitions from original presentations cannot be recovered.'],
  },
  {
    id: 'powerpoint-to-pdf',
    icon: Presentation,
    name: 'PowerPoint to PDF',
    href: '/tools/powerpoint-to-pdf',
    badge: 'Convert',
    badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    summary: 'Convert PowerPoint presentations (.pptx) into a PDF.',
    steps: ['Upload your .pptx file.', 'Click "Convert to PDF".', 'Download the PDF.'],
    tips: ['Great for sharing presentations without requiring PowerPoint.'],
    limitations: ['Animations are flattened to static slides in the output.'],
  },
  {
    id: 'pdf-to-excel',
    icon: Table,
    name: 'PDF to Excel',
    href: '/tools/pdf-to-excel',
    badge: 'Convert',
    badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    summary: 'Extract tables from a PDF and convert them into an editable Excel spreadsheet (.xlsx).',
    steps: ['Upload your PDF.', 'Click "Convert to Excel".', 'Download the .xlsx file.'],
    tips: ['Works best when the PDF contains clearly formatted, bordered tables.'],
    limitations: ['Merged cells and complex table styles may not convert perfectly.'],
  },
  {
    id: 'excel-to-pdf',
    icon: Table,
    name: 'Excel to PDF',
    href: '/tools/excel-to-pdf',
    badge: 'Convert',
    badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    summary: 'Convert an Excel spreadsheet (.xlsx or .xls) into a PDF.',
    steps: ['Upload your Excel file.', 'Click "Convert to PDF".', 'Download the PDF.'],
    tips: ['Each worksheet becomes a separate page in the PDF.'],
    limitations: ['Charts and graphs may not render identically to Excel\'s native print output.'],
  },
  {
    id: 'html-to-pdf',
    icon: Code,
    name: 'HTML to PDF',
    href: '/tools/html-to-pdf',
    badge: 'Convert',
    badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    summary: 'Convert an HTML file (with embedded CSS) into a PDF document.',
    steps: ['Upload your .html file, or paste HTML directly into the editor.', 'Click "Convert to PDF".', 'Download the PDF.'],
    tips: ['Inline your CSS for the most accurate output.', 'External fonts and images may not load if they require an internet connection.'],
    limitations: ['JavaScript is not executed during conversion.'],
  },
  {
    id: 'ocr',
    icon: Scan,
    name: 'OCR Scanner',
    href: '/tools/ocr',
    badge: 'Convert',
    badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    summary: 'Extract text from scanned or image-based PDFs using Optical Character Recognition (OCR).',
    steps: ['Upload your scanned PDF.', 'Select the language(s) present in the document.', 'Click "Run OCR".', 'Download the searchable PDF or the extracted text file.'],
    tips: ['Higher-resolution scans produce more accurate results.', 'Supported languages: English, French, German, Spanish, Arabic, Chinese, Japanese, and many more via Tesseract.js.'],
    limitations: ['Handwritten text recognition is limited and may be inaccurate.', 'OCR of complex layouts (multi-column, tables) may require manual cleanup.'],
  },
  {
    id: 'scan',
    icon: ScanLine,
    name: 'Scan PDF',
    href: '/tools/scan',
    badge: 'Convert',
    badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    summary: 'Combine one or more scanned images into a single, organised PDF document.',
    steps: ['Upload scanned images (PNG, JPEG, WEBP).', 'Order the pages.', 'Download the assembled PDF.'],
    tips: ['Use a consistent resolution across all scans for a uniform-looking document.'],
    limitations: ['Image-only PDF — for searchable output, run OCR afterwards.'],
  },
];

const EDIT_TOOLS = [
  {
    id: 'rotate',
    icon: RotateCw,
    name: 'Rotate PDF',
    href: '/tools/rotate',
    badge: 'Edit',
    badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    summary: 'Rotate individual pages or all pages in a PDF by 90°, 180°, or 270°.',
    steps: ['Upload your PDF.', 'Choose which pages to rotate and the rotation angle.', 'Download the rotated PDF.'],
    tips: ['You can rotate individual pages independently.'],
    limitations: [],
  },
  {
    id: 'watermark',
    icon: Droplet,
    name: 'Watermark PDF',
    href: '/tools/watermark',
    badge: 'Edit',
    badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    summary: 'Add a text or image watermark to every page of your PDF.',
    steps: ['Upload your PDF.', 'Enter watermark text or upload a watermark image.', 'Adjust position, opacity, size, and rotation.', 'Download the watermarked PDF.'],
    tips: ['Use a low opacity (15–30%) for a subtle, professional-looking watermark.'],
    limitations: ['Image watermarks should be PNG with a transparent background for best results.'],
  },
  {
    id: 'page-numbers',
    icon: Hash,
    name: 'Page Numbers',
    href: '/tools/page-numbers',
    badge: 'Edit',
    badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    summary: 'Add customisable page numbers (e.g., "Page 1 of 10") to your PDF.',
    steps: ['Upload your PDF.', 'Choose position (header or footer, left/centre/right), starting number, and format.', 'Download the numbered PDF.'],
    tips: ['You can start numbering from any number to skip a cover page, for example.'],
    limitations: [],
  },
  {
    id: 'sign',
    icon: PenTool,
    name: 'Sign PDF',
    href: '/tools/sign',
    badge: 'Edit',
    badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    summary: 'Draw or type a signature and embed it onto your PDF document.',
    steps: ['Upload your PDF.', 'Draw your signature on the canvas, type it, or upload an image.', 'Click to place the signature on the desired page and location.', 'Download the signed PDF.'],
    tips: ['For a professional look, use the draw mode with a stylus or mouse.', 'Uploaded signatures should be PNG images with a transparent background.'],
    limitations: ['This is a visual signature, not a cryptographic digital signature. For legally binding eSignatures, use a dedicated eSign service.'],
  },
  {
    id: 'crop',
    icon: Crop,
    name: 'Crop PDF',
    href: '/tools/crop',
    badge: 'Edit',
    badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    summary: 'Crop the page boundaries of your PDF to remove unwanted margins or whitespace.',
    steps: ['Upload your PDF.', 'Drag the crop handles to define the desired crop area.', 'Apply the crop and download.'],
    tips: ['Cropping only adjusts the visible area — it does not permanently delete content outside the crop area in all viewers.'],
    limitations: ['Page dimensions will change after cropping.'],
  },
];

const SECURITY_TOOLS = [
  {
    id: 'protect',
    icon: Shield,
    name: 'Protect PDF',
    href: '/tools/protect',
    badge: 'Security',
    badgeColor: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    summary: 'Add a password to your PDF to restrict opening, printing, or copying content.',
    steps: ['Upload your PDF.', 'Set an "Open Password" (required to view the file) and/or a "Permissions Password" (controls editing/printing rights).', 'Click "Protect" and download the secured PDF.'],
    tips: ['Use a strong, unique password. SelfPDF has no way to recover it if lost.', 'AES-256 encryption is used for maximum security.'],
    limitations: ['You are responsible for remembering your password. SelfPDF cannot recover it.'],
  },
  {
    id: 'unlock',
    icon: Lock,
    name: 'Unlock PDF',
    href: '/tools/unlock',
    badge: 'Security',
    badgeColor: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    summary: 'Remove password protection from a PDF file you own.',
    steps: ['Upload the password-protected PDF.', 'Enter the password.', 'Click "Unlock" and download the unprotected PDF.'],
    tips: ['Only use this tool on PDFs you own or have explicit permission to unlock.'],
    limitations: ['Requires the correct password — SelfPDF does not perform brute-force cracking.'],
  },
];

function ToolCard({ tool }: { tool: (typeof ORGANIZE_TOOLS)[0] }) {
  const Icon = tool.icon;
  return (
    <div id={tool.id} className="scroll-mt-28 rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="size-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-semibold">{tool.name}</h3>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tool.badgeColor}`}>{tool.badge}</span>
          </div>
          <p className="mt-1 text-muted-foreground">{tool.summary}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">How to use</p>
          <ol className="space-y-1.5">
            {tool.steps.map((step, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div>
          {tool.tips.length > 0 && (
            <>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tips</p>
              <ul className="space-y-1.5">
                {tool.tips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-500" />
                    {tip}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div>
          {tool.limitations.length > 0 && (
            <>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Limitations</p>
              <ul className="space-y-1.5">
                {tool.limitations.map((lim, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-500" />
                    {lim}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 border-t pt-4">
        <Button size="sm" variant="outline" asChild>
          <Link href={tool.href}>
            Open {tool.name} <ArrowRight className="ml-1.5 size-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function DocsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* ─── Hero ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b bg-gradient-to-b from-muted/60 to-background py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
          </div>

          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-1.5 text-sm backdrop-blur">
              <BookOpen className="size-4" />
              <span>SelfPDF Documentation</span>
            </div>

            <h1 className="mb-4 text-5xl font-bold tracking-tight sm:text-6xl">Documentation</h1>
            <p className="mb-8 max-w-3xl text-xl leading-relaxed text-muted-foreground">
              Everything you need to know about SelfPDF — from a 30-second quickstart to detailed per-tool guides and self-hosting instructions.
            </p>

            <div className="flex flex-wrap gap-3">
              {QUICK_LINKS.slice(0, 4).map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="rounded-lg border bg-background/70 px-4 py-2 text-sm font-medium transition-colors hover:bg-muted backdrop-blur"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Main Layout ──────────────────────────────────────── */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-12 py-12 lg:py-16">

            {/* ── Sidebar ── */}
            <aside className="hidden lg:block w-56 shrink-0">
              <div className="sticky top-24">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">On this page</p>
                <nav>
                  <ul className="space-y-1">
                    {QUICK_LINKS.map(({ label, href, icon: Icon }) => (
                      <li key={label}>
                        <a
                          href={href}
                          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Icon className="size-3.5 shrink-0" />
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* ── Content ── */}
            <div className="flex-1 min-w-0 space-y-20">

              {/* Getting Started */}
              <section id="getting-started" className="scroll-mt-28">
                <h2 className="mb-6 text-3xl font-bold tracking-tight">Getting Started</h2>
                <p className="mb-6 text-lg text-muted-foreground">
                  SelfPDF requires no installation, no sign-up, and no payment. Open your browser, visit the tool you need, and you\'re done.
                </p>

                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { step: '1', title: 'Pick a tool', body: 'Browse the tools page or use the navigation to find the PDF operation you need.' },
                    { step: '2', title: 'Upload your file', body: 'Drag and drop your PDF (or other file format) into the upload area.' },
                    { step: '3', title: 'Download the result', body: 'Click the action button, then download your processed file instantly.' },
                  ].map(({ step, title, body }) => (
                    <Card key={step}>
                      <CardContent className="p-6">
                        <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                          {step}
                        </div>
                        <h3 className="mb-1.5 font-semibold">{title}</h3>
                        <p className="text-sm text-muted-foreground">{body}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/30 p-5">
                  <div className="flex gap-3">
                    <Info className="mt-0.5 size-5 shrink-0 text-blue-500" />
                    <div>
                      <p className="font-semibold text-blue-900 dark:text-blue-100">No account needed</p>
                      <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                        There is no sign-up, no email, and no account required. Every tool is free to use immediately, unlimited times.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* How It Works */}
              <section id="how-it-works" className="scroll-mt-28">
                <h2 className="mb-6 text-3xl font-bold tracking-tight">How It Works</h2>
                <p className="mb-6 text-lg text-muted-foreground">
                  SelfPDF is built on a strict client-side architecture. Understanding how it works explains why it\'s both private and fast.
                </p>

                <div className="space-y-4">
                  {[
                    {
                      title: 'No server involved in file processing',
                      body: 'Unlike cloud PDF services, SelfPDF does not send your files to any server. All processing is performed by JavaScript and WebAssembly code running inside your browser tab. The server only serves the application code (HTML, JS, CSS) — never your documents.',
                    },
                    {
                      title: 'WebAssembly for native-speed performance',
                      body: 'Computationally intensive operations (OCR, compression, rendering) use WebAssembly (WASM) modules compiled from native code. This allows SelfPDF to achieve performance that approaches native apps, while running in a sandboxed browser environment.',
                    },
                    {
                      title: 'In-memory processing',
                      body: 'Your file is loaded into the browser tab\'s heap memory, processed, and the result is generated as a Blob URL. Nothing is written to disk by SelfPDF. When you close the tab, the garbage collector reclaims the memory immediately.',
                    },
                    {
                      title: 'Offline capable',
                      body: 'Once the page and its WASM modules have loaded, SelfPDF requires no internet connection to process files. This makes it suitable for sensitive environments.',
                    },
                  ].map(({ title, body }) => (
                    <div key={title} className="flex gap-4 rounded-xl border p-5">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
                      <div>
                        <h3 className="font-semibold">{title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Organize Tools */}
              <section id="organize" className="scroll-mt-28">
                <div className="mb-6">
                  <h2 id="tools" className="text-3xl font-bold tracking-tight">
                    <span className="mr-3 inline-flex size-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-sm font-bold">O</span>
                    Organize Tools
                  </h2>
                  <p className="mt-2 text-muted-foreground">Manage the structure and size of your PDF documents.</p>
                </div>
                <div className="space-y-6">
                  {ORGANIZE_TOOLS.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
                </div>
              </section>

              {/* Convert Tools */}
              <section id="convert" className="scroll-mt-28">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold tracking-tight">
                    <span className="mr-3 inline-flex size-8 items-center justify-center rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 text-sm font-bold">C</span>
                    Convert Tools
                  </h2>
                  <p className="mt-2 text-muted-foreground">Convert PDFs to other formats and other formats to PDF.</p>
                </div>
                <div className="space-y-6">
                  {CONVERT_TOOLS.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
                </div>
              </section>

              {/* Edit Tools */}
              <section id="edit" className="scroll-mt-28">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold tracking-tight">
                    <span className="mr-3 inline-flex size-8 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 text-sm font-bold">E</span>
                    Edit Tools
                  </h2>
                  <p className="mt-2 text-muted-foreground">Modify the appearance and content of your PDF pages.</p>
                </div>
                <div className="space-y-6">
                  {EDIT_TOOLS.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
                </div>
              </section>

              {/* Security Tools */}
              <section id="security" className="scroll-mt-28">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold tracking-tight">
                    <span className="mr-3 inline-flex size-8 items-center justify-center rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 text-sm font-bold">S</span>
                    Security Tools
                  </h2>
                  <p className="mt-2 text-muted-foreground">Protect your PDFs with passwords and remove existing protection.</p>
                </div>
                <div className="space-y-6">
                  {SECURITY_TOOLS.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
                </div>
              </section>

              {/* Tips & Limitations */}
              <section id="tips" className="scroll-mt-28">
                <h2 className="mb-6 text-3xl font-bold tracking-tight">Tips &amp; General Limitations</h2>

                <div className="space-y-4">
                  <div className="rounded-xl border border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/30 p-5">
                    <div className="flex gap-3">
                      <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-500" />
                      <div>
                        <p className="font-semibold">File size is limited by your device\'s RAM</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Since processing happens in your browser\'s memory, the maximum file size you can work with depends on your device\'s available
                          RAM. For most laptops and desktops (8 GB+ RAM), files up to ~500 MB should work without issues. For very large files, close
                          other browser tabs to free up memory.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border p-5">
                    <p className="font-semibold">Always keep the original file</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      SelfPDF processes files non-destructively — your original file is never modified. However, as a best practice, always keep a backup
                      of important documents before processing them.
                    </p>
                  </div>

                  <div className="rounded-xl border p-5">
                    <p className="font-semibold">PDF version compatibility</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      SelfPDF handles most PDF versions (1.0 through 2.0). Some very old or exotic PDF features may not be supported. If a file fails to
                      process, try opening it in Adobe Acrobat Reader and re-saving it to update the format before using SelfPDF.
                    </p>
                  </div>

                  <div className="rounded-xl border p-5">
                    <p className="font-semibold">Browser compatibility</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      SelfPDF is optimised for modern, evergreen browsers: Chrome 90+, Firefox 90+, Safari 15+, and Edge 90+. Internet Explorer is not
                      supported. For the best experience and performance, use the latest version of Chrome or Firefox.
                    </p>
                  </div>
                </div>
              </section>

              {/* Self-Hosting */}
              <section id="self-hosting" className="scroll-mt-28">
                <h2 className="mb-4 text-3xl font-bold tracking-tight">Self-Hosting</h2>
                <p className="mb-6 text-lg text-muted-foreground">
                  Want to run SelfPDF on your own infrastructure? It's a standard Next.js application and deploys easily to any Node.js environment,
                  Vercel, Netlify, Docker, or a plain VPS.
                </p>

                <div className="rounded-xl border bg-zinc-950 p-6 font-mono text-sm text-zinc-100">
                  <p className="mb-1 text-zinc-500"># Clone the repository</p>
                  <p className="mb-4 text-green-400">git clone https://github.com/your-org/selfpdf.git</p>
                  <p className="mb-1 text-zinc-500"># Install dependencies</p>
                  <p className="mb-4">npm install</p>
                  <p className="mb-1 text-zinc-500"># Run in development mode</p>
                  <p className="mb-4">npm run dev</p>
                  <p className="mb-1 text-zinc-500"># Build for production</p>
                  <p>npm run build &amp;&amp; npm start</p>
                </div>

                <p className="mt-4 text-sm text-muted-foreground">
                  No environment variables or backend services are required for core functionality. The application is purely static except for optional
                  server-side metadata generation.
                </p>
              </section>

              {/* Contributing */}
              <section id="contributing" className="scroll-mt-28">
                <h2 className="mb-4 text-3xl font-bold tracking-tight">Contributing</h2>
                <p className="mb-6 text-lg text-muted-foreground">
                  SelfPDF is a community-maintained open-source project. Contributions of all kinds are welcome — bug reports, feature requests, code
                  improvements, documentation fixes, and translations.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { title: '🐛 Report a Bug', body: 'Found something that doesn\'t work? Open a GitHub Issue with steps to reproduce, your browser version, and the PDF that caused the problem (if shareable).' },
                    { title: '💡 Request a Feature', body: 'Have an idea for a new tool or improvement? Open a GitHub Issue and describe the use case. Feature requests with clear rationale are prioritised.' },
                    { title: '🔀 Submit a PR', body: 'Fork the repository, make your changes, and open a Pull Request. Please include a description of what changed and why. Tests are appreciated.' },
                    { title: '📖 Improve Docs', body: 'Notice something missing or unclear in the documentation? Docs improvements are just as valuable as code changes — and often faster to merge.' },
                  ].map(({ title, body }) => (
                    <Card key={title}>
                      <CardContent className="p-5">
                        <h3 className="mb-2 font-semibold">{title}</h3>
                        <p className="text-sm text-muted-foreground">{body}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6">
                  <Button asChild>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 size-4" />
                      View on GitHub
                    </a>
                  </Button>
                </div>
              </section>

              {/* FAQ */}
              <section id="faq" className="scroll-mt-28 pb-4">
                <h2 className="mb-6 text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>

                <div className="space-y-4">
                  {[
                    {
                      q: 'Are my files really never uploaded?',
                      a: 'Yes. SelfPDF is built so that all PDF processing happens in your browser using JavaScript and WebAssembly. Your files are loaded into your browser\'s memory from your local disk and never sent over any network connection. You can verify this by opening your browser\'s network developer tools while using SelfPDF — you\'ll see no outgoing file requests.',
                    },
                    {
                      q: 'Is there a file size limit?',
                      a: 'There is no hard-coded file size limit in the application. The practical limit is determined by your device\'s available RAM. For most modern devices, files up to several hundred megabytes work fine. For very large files (1 GB+), you may experience slowdowns or browser memory warnings.',
                    },
                    {
                      q: 'Does SelfPDF work offline?',
                      a: 'Yes, once the page has fully loaded (including the WebAssembly modules), SelfPDF works without an internet connection. For the best offline experience, visit the tool page you need while online to allow it to cache, then you can use it offline.',
                    },
                    {
                      q: 'Can I use SelfPDF commercially?',
                      a: 'Absolutely. SelfPDF is MIT-licensed software. You can use it for any purpose, including commercial use, at no cost. If you choose to self-host and modify the code, you must include the MIT license notice as per the license terms.',
                    },
                    {
                      q: 'Why does OCR take so long?',
                      a: 'OCR (Optical Character Recognition) is computationally intensive. Tesseract.js runs as a WebAssembly module in your browser, which is significantly faster than pure JavaScript but slower than running natively. Processing time scales with the number of pages and image resolution. A 10-page scanned document typically takes 30–60 seconds.',
                    },
                    {
                      q: 'Why isn\'t my password-protected PDF unlocking?',
                      a: 'You must enter the exact password used to protect the file. SelfPDF does not perform brute-force password cracking. If you\'ve forgotten the password, unfortunately SelfPDF cannot help — and neither can any legitimate tool without cracking, which is both time-intensive and often illegal without the document owner\'s permission.',
                    },
                    {
                      q: 'How do I report a security vulnerability?',
                      a: 'Please do not open a public GitHub Issue for security vulnerabilities. Instead, contact the maintainers privately through the GitHub Security Advisories feature in the repository settings. We aim to respond to all security reports within 72 hours.',
                    },
                  ].map(({ q, a }, idx) => (
                    <details key={idx} className="group rounded-xl border p-5 open:ring-1 open:ring-primary/20 transition-all">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                        {q}
                        <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                      </summary>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{a}</p>
                    </details>
                  ))}
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
