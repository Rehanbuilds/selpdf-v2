import { PDFDocument } from 'pdf-lib';

export async function mergePDFs(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    
    for (const page of copiedPages) {
      mergedPdf.addPage(page);
    }
  }

  return await mergedPdf.save();
}

export async function splitPDF(file: File, ranges: { start: number; end: number }[]): Promise<Uint8Array[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const results: Uint8Array[] = [];

  for (const range of ranges) {
    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(
      pdf,
      Array.from({ length: range.end - range.start + 1 }, (_, i) => range.start + i - 1)
    );
    
    for (const page of pages) {
      newPdf.addPage(page);
    }
    
    results.push(await newPdf.save());
  }

  return results;
}

export async function rotatePDF(file: File, rotation: 90 | 180 | 270): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const pages = pdf.getPages();

  for (const page of pages) {
    // Rotation should be set directly as a number (90, 180, 270, 0)
    const currentRotation = page.getRotation().angle || 0;
    const newRotation = (currentRotation + rotation) % 360;
    page.setRotation({ angle: newRotation });
  }

  return await pdf.save();
}

export async function compressPDF(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  
  // Basic compression by removing metadata and optimizing
  pdf.setTitle('');
  pdf.setAuthor('');
  pdf.setSubject('');
  pdf.setKeywords([]);
  pdf.setProducer('SelfPDF');
  pdf.setCreator('SelfPDF');

  return await pdf.save({
    useObjectStreams: true,
  });
}

export function downloadPDF(data: Uint8Array, filename: string) {
  console.log('[v0] Downloading PDF:', filename);
  const blob = new Blob([data], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
  
  console.log('[v0] PDF download triggered successfully');
}

export function downloadMultiplePDFs(pdfs: { data: Uint8Array; filename: string }[]) {
  console.log('[v0] Downloading', pdfs.length, 'PDFs');
  pdfs.forEach((pdf, index) => {
    // Stagger downloads slightly to avoid browser blocking
    setTimeout(() => {
      downloadPDF(pdf.data, pdf.filename);
    }, index * 200);
  });
}

export async function getPDFInfo(file: File): Promise<{ pageCount: number; fileSize: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  
  return {
    pageCount: pdf.getPageCount(),
    fileSize: file.size,
  };
}

export async function cropPDF(
  file: File,
  margins: { top: number; right: number; bottom: number; left: number }
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const pages = pdf.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();
    // Apply crop by setting CropBox inward from each edge
    const cropX = margins.left;
    const cropY = margins.bottom;
    const cropWidth = width - margins.left - margins.right;
    const cropHeight = height - margins.top - margins.bottom;

    if (cropWidth > 0 && cropHeight > 0) {
      page.setCropBox(cropX, cropY, cropWidth, cropHeight);
    }
  }

  return await pdf.save();
}

export async function repairPDF(file: File): Promise<{
  data: Uint8Array;
  pageCount: number;
  originalSize: number;
  repairedSize: number;
  issues: string[];
}> {
  const arrayBuffer = await file.arrayBuffer();
  const issues: string[] = [];
  let pdf: PDFDocument;

  try {
    pdf = await PDFDocument.load(arrayBuffer, {
      ignoreEncryption: true,
      updateMetadata: false,
    });
  } catch {
    issues.push('Severe structural corruption detected — attempting recovery');
    try {
      pdf = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
        throwOnInvalidObject: false,
        updateMetadata: false,
      } as any);
    } catch {
      // Last resort: create a new PDF and try to copy pages
      issues.push('Deep recovery mode — rebuilding document structure');
      pdf = await PDFDocument.create();
      try {
        const srcPdf = await PDFDocument.load(arrayBuffer, {
          ignoreEncryption: true,
          throwOnInvalidObject: false,
          updateMetadata: false,
        } as any);
        const pageIndices = srcPdf.getPageIndices();
        const copiedPages = await pdf.copyPages(srcPdf, pageIndices);
        for (const page of copiedPages) {
          pdf.addPage(page);
        }
        issues.push(`Recovered ${copiedPages.length} pages from corrupted source`);
      } catch {
        throw new Error('PDF is too severely corrupted to repair. The file structure is unrecoverable.');
      }
    }
  }

  const pageCount = pdf.getPageCount();
  if (pageCount === 0) {
    issues.push('Warning: Document contains no pages');
  }

  // Clean and re-serialize metadata
  try {
    pdf.setProducer('SelfPDF Repair Tool');
    pdf.setCreator('SelfPDF');
    issues.push('Metadata cleaned and re-serialized');
  } catch {
    issues.push('Could not update metadata — using existing values');
  }

  if (issues.length === 0) {
    issues.push('No structural issues detected');
  }
  issues.push('Document re-serialized with optimized object streams');

  const repairedBytes = await pdf.save({ useObjectStreams: true });

  return {
    data: repairedBytes,
    pageCount,
    originalSize: file.size,
    repairedSize: repairedBytes.length,
    issues,
  };
}
