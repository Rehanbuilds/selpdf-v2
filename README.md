# SelfPDF - The Ultimate Open-Source PDF Toolkit

<p align="center">
  <img src="public/selfpdf-logo.png" alt="SelfPDF Logo" width="100"/>
</p>

<p align="center">
  A free, fast, and completely private PDF toolkit built with modern web technologies. Process your documents entirely in your browser with zero server uploads—your data never leaves your device.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> · 
  <a href="#getting-started"><strong>Getting Started</strong></a> · 
  <a href="#tech-stack"><strong>Tech Stack</strong></a> · 
  <a href="#contributing"><strong>Contributing</strong></a>
</p>

---

## 🚀 Why SelfPDF?

In a world where data privacy is constantly compromised, SelfPDF brings the power of desktop PDF tools straight to your browser. By utilizing client-side processing, SelfPDF guarantees that **your files are never uploaded to any server**. Everything runs locally, ensuring zero wait times for uploads/downloads and 100% privacy for your sensitive documents.

## ✨ Features

SelfPDF offers a comprehensive suite of tools categorized for your convenience. Whether you need to organize pages, convert formats, edit content, or secure your files, we've got you covered.

### 📁 Organize
*   **Merge PDF** - Combine multiple PDFs into a single, continuous document.
*   **Split PDF** - Extract specific pages or split a PDF into individual pages.
*   **Compress PDF** - Shrink your PDF file size while maintaining excellent quality.
*   **Repair PDF** - Fix and recover data from corrupted or damaged PDF files.

### 🔄 Convert
*   **PDF to Images** - Convert your PDF pages into high-quality PNG or JPG images.
*   **Images to PDF** - Compile a list of images into a single PDF document.
*   **PDF to Word** - Convert PDF files into editable DOCX format.
*   **Word to PDF** - Generate standard PDF documents from DOCX files.
*   **PDF to PowerPoint** - Transform PDFs into presentation-ready PPTX slides.
*   **PowerPoint to PDF** - Convert PPTX presentations into universally accessible PDFs.
*   **PDF to Excel** - Extract tables from your PDFs into editable XLSX spreadsheets.
*   **Excel to PDF** - Convert XLSX data sheets into clean, formatted PDFs.
*   **HTML to PDF** - Turn raw HTML and CSS into a beautifully rendered PDF.
*   **OCR Scanner** - Extract raw, selectable text from scanned image-based PDFs.
*   **Scan PDF** - Scan physical documents directly into PDF format.

### ✏️ Edit
*   **Rotate PDF** - Rotate individual pages or the entire document (90°, 180°, 270°).
*   **Watermark** - Stamp your documents with text or image watermarks.
*   **Page Numbers** - Easily add customizable page numbers to your PDFs.
*   **Sign PDF** - Add digital signatures or draw your signature on your document.
*   **Crop PDF** - Adjust margins and crop out unwanted areas of your PDF pages.

### 🔐 Security
*   **Protect PDF** - Secure your sensitive PDFs with strong password encryption.
*   **Unlock PDF** - Remove password protection and restrictions from your PDFs.

## 🛠 Tech Stack

SelfPDF is built with a modern, scalable, and highly performant tech stack:

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
*   **PDF Processing:** [pdf-lib](https://pdf-lib.js.org/) & [PDF.js](https://mozilla.github.io/pdf.js/)
*   **State Management:** [Zustand](https://github.com/pmndrs/zustand)
*   **Deployment:** Optimized for Vercel

## 💻 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

Clone the repository and install the dependencies:

```bash
# Clone the repository
git clone https://github.com/Rehanbuilds/selpdf-v2.git
cd selfpdf

# Install dependencies using your preferred package manager
npm install
# or
pnpm install
# or
yarn install
```

### Development

Run the local development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Navigate to `http://localhost:3000` in your browser to explore the application.

### Build for Production

To create an optimized production build:

```bash
npm run build
npm start
```

## 📂 Project Structure

```text
selfpdf/
├── app/
│   ├── about/          # About page
│   ├── docs/           # Documentation pages
│   ├── privacy/        # Privacy Policy
│   ├── terms/          # Terms of Service
│   ├── tools/          # All individual PDF tool pages (/merge, /split, etc.)
│   └── page.tsx        # Application landing page
├── components/
│   ├── pdf/            # Core PDF processing components (Dropzones, Layouts, etc.)
│   ├── ui/             # Reusable shadcn/ui components
│   ├── header.tsx      # Global navigation header
│   └── footer.tsx      # Global footer
├── lib/
│   ├── config/         # Tool registry and configuration (tools.ts)
│   ├── pdf/            # PDF manipulation utilities and conversion logic
│   └── store/          # Zustand global state (pdf-store.ts)
└── public/             # Static assets
```

## 🤝 Contributing

SelfPDF is a community-driven open-source project. We welcome contributions of all kinds:

1.  **Bug Reports & Feature Requests**: Use the issue tracker to report bugs or suggest new features.
2.  **Code Contributions**: 
    - Fork the repository.
    - Create a new branch (`git checkout -b feature/amazing-feature`).
    - Commit your changes (`git commit -m 'Add amazing feature'`).
    - Push to the branch (`git push origin feature/amazing-feature`).
    - Open a Pull Request.
3.  **UI/UX Improvements**: Help us make the tools even more intuitive and accessible.

Please ensure your code follows the existing style conventions and passes all type checks.

## 🛡️ Privacy by Design

Privacy isn't just a feature; it's the core philosophy of SelfPDF.
- **Zero Uploads:** No document is ever transmitted over the network.
- **Client-Side Execution:** All PDF manipulation relies entirely on your browser's processing power.
- **No Trackers:** We don't embed third-party analytics that track your document usage.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <b>Built with ❤️ for privacy and the open-source community.</b><br/>
  <b>Built by Rehan Builds</b>
</p>
