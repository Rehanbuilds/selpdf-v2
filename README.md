# SelfPDF - Your Self-Service PDF Toolkit

A free, fast, and private PDF toolkit built with Next.js. Process your PDFs entirely in your browser with no server uploads required.

## Features

### Core PDF Tools
- **Merge PDF** - Combine multiple PDFs into one document
- **Split PDF** - Extract pages from your PDF (all pages or custom ranges)
- **Compress PDF** - Reduce file size while maintaining quality
- **Rotate PDF** - Rotate pages by 90°, 180°, or 270°

### Conversion Tools
- **PDF to Images** - Convert PDF pages to PNG or JPEG
- **Images to PDF** - Create PDFs from image files
- **PDF to Word** - Convert to editable DOCX (planned)
- **Word to PDF** - Convert DOCX to PDF (planned)

### Security & Editing
- **Protect PDF** - Add password protection (demo)
- **Unlock PDF** - Remove password protection (planned)
- **Add Watermark** - Text/image watermarks (planned)
- **Page Numbers** - Add page numbering (planned)
- **Sign PDF** - Digital signatures (planned)
- **OCR Scanner** - Extract text from scans (planned)

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **PDF Processing:** pdf-lib + pdfjs-dist
- **State Management:** Zustand
- **Deployment:** Vercel-optimized

## Privacy & Security

- **No file uploads** - All processing happens in your browser
- **No data collection** - We don't track or store anything
- **Open source** - Audit the code yourself
- **Privacy first** - Your files never leave your device

## Getting Started

### Installation

```bash
npm install
# or
pnpm install
# or
yarn install
```

### Development

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
/app
  /tools          - Individual tool pages
    /merge        - Merge PDFs
    /split        - Split PDFs
    /compress     - Compress PDFs
    /rotate       - Rotate PDFs
    /pdf-to-images - PDF to image conversion
    /images-to-pdf - Images to PDF conversion
    [...]         - Other tools
  /about          - About page
  /privacy        - Privacy policy
  /terms          - Terms of service
  page.tsx        - Landing page

/components
  /pdf            - PDF-specific components
  /ui             - shadcn/ui components
  header.tsx      - Main header/navigation
  footer.tsx      - Footer component

/lib
  /config         - Tool configurations
  /pdf            - PDF processing utilities
  /store          - Zustand state management
```

## Features Implementation Status

### ✅ Fully Functional
- Merge PDF
- Split PDF (all pages or ranges)
- Compress PDF
- Rotate PDF
- PDF to Images (PNG/JPEG)
- Images to PDF

### 🚧 Partial/Demo
- Protect PDF (basic implementation, needs encryption library)

### 📋 Planned
- PDF ↔ Word/Excel/PowerPoint conversions
- Unlock PDF
- Watermarks
- Page numbering
- Digital signatures
- OCR text extraction

## Contributing

SelfPDF is open source and welcomes contributions! Whether it's bug fixes, new features, or documentation improvements, all contributions are appreciated.

## License

MIT License - see LICENSE file for details

## Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [pdf-lib](https://pdf-lib.js.org/)
- [PDF.js](https://mozilla.github.io/pdf.js/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Made with ❤️ for privacy and open source**
