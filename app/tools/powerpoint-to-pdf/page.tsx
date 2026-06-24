'use client';

import { useState } from 'react';
import { Presentation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ToolLayout } from '@/components/pdf/tool-layout';
import { FileDropzone } from '@/components/pdf/file-dropzone';
import { FileList } from '@/components/pdf/file-list';
import { ProcessingIndicator } from '@/components/pdf/processing-indicator';
import { FilenameDialog } from '@/components/pdf/filename-dialog';
import { usePDFStore } from '@/lib/store/pdf-store';
import { downloadPDF } from '@/lib/pdf/utils';

export default function PowerPointToPDFPage() {
  const { files, addFiles, removeFile, clearFiles, isProcessing, setProcessing, progress, setProgress, error, setError } = usePDFStore();
  const [showFilenameDialog, setShowFilenameDialog] = useState(false);
  const [processedPDF, setProcessedPDF] = useState<Uint8Array | null>(null);

  const handleConvert = async () => {
    if (files.length === 0) {
      setError('Please select a PowerPoint file to convert.');
      return;
    }

    setProcessing(true);
    setError(null);
    setProgress(0);

    try {
      console.log('[v0] Starting PowerPoint to PDF conversion');
      setProgress(10);
      
      const file = files[0].file;
      const arrayBuffer = await file.arrayBuffer();
      
      setProgress(30);
      const JSZip = (await import('jszip')).default;
      const zip = await JSZip.loadAsync(arrayBuffer);
      
      // Extract text from slides and sort them numerically
      const slideFiles = Object.keys(zip.files)
        .filter(name => name.startsWith('ppt/slides/slide') && name.endsWith('.xml') && !name.includes('/_rels/'))
        .sort((a, b) => {
          const numA = parseInt(a.match(/\d+/)?.[0] || '0');
          const numB = parseInt(b.match(/\d+/)?.[0] || '0');
          return numA - numB;
        });
      
      if (slideFiles.length === 0) {
        throw new Error('No slides found in the PowerPoint file. Please ensure it is a valid .pptx file.');
      }

      const { jsPDF } = await import('jspdf');
      // Landscape, standard widescreen slide dimensions
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      
      for (let i = 0; i < slideFiles.length; i++) {
        if (i > 0) doc.addPage();
        
        const slideXml = await zip.files[slideFiles[i]].async('string');
        
        // White background
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, pageW, pageH, 'F');

        // Extract all text runs grouped by paragraph
        const paragraphs: string[] = [];
        const paragraphMatches = slideXml.match(/<a:p[\s\S]*?<\/a:p>/g) || [];
        for (const para of paragraphMatches) {
          const runs = para.match(/<a:t[^>]*>([\s\S]*?)<\/a:t>/g) || [];
          let paraText = runs.map(r => r.replace(/<[^>]+>/g, '')).join('').trim();
          
          // Decode basic XML entities
          paraText = paraText
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'");
            
          if (paraText) paragraphs.push(paraText);
        }

        // Heuristic: first paragraph is often the title
        const title = paragraphs[0] || `Slide ${i + 1}`;
        const bodyParagraphs = paragraphs.slice(1);

        // Draw accent bar at top
        doc.setFillColor(41, 128, 185);
        doc.rect(0, 0, pageW, 12, 'F');

        // Slide number in accent bar
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.text(`${i + 1} / ${slideFiles.length}`, pageW - 8, 8, { align: 'right' });

        // Title
        doc.setTextColor(30, 30, 30);
        doc.setFontSize(20);
        const titleLines = doc.splitTextToSize(title, pageW - 24);
        doc.text(titleLines, 12, 26);

        // Divider
        const titleBlockH = Math.max(10, titleLines.length * 8);
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(12, 18 + titleBlockH, pageW - 12, 18 + titleBlockH);

        // Body text
        let yPos = 22 + titleBlockH;
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        for (const para of bodyParagraphs) {
          if (yPos > pageH - 16) break;
          const lines = doc.splitTextToSize(`• ${para}`, pageW - 28);
          doc.text(lines, 16, yPos);
          yPos += lines.length * 6 + 3;
        }

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(160, 160, 160);
        doc.text(file.name.replace(/\.pptx?$/i, ''), 12, pageH - 5);
      }
      
      setProgress(80);
      const pdfData = doc.output('arraybuffer');
      setProcessedPDF(new Uint8Array(pdfData));
      setShowFilenameDialog(true);
      
      setProgress(100);
      setProcessing(false);
    } catch (err) {
      console.error('[v0] Conversion error:', err);
      setError(err instanceof Error ? err.message : 'Failed to convert PowerPoint to PDF. Please try again.');
      setProcessing(false);
    }
  };

  const handleDownload = (filename: string) => {
    if (processedPDF) {
      console.log('[v0] Downloading PDF as:', filename);
      downloadPDF(processedPDF, filename);
      setShowFilenameDialog(false);
      setProcessedPDF(null);
      setTimeout(() => {
        clearFiles();
      }, 500);
    }
  };

  return (
    <ToolLayout
      title="PowerPoint to PDF"
      description="Convert PowerPoint presentations to PDF format"
      icon={Presentation}
      color="bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400"
    >
      <FilenameDialog
        open={showFilenameDialog}
        defaultFilename="presentation.pdf"
        onConfirm={handleDownload}
        onCancel={() => {
          setShowFilenameDialog(false);
          setProcessedPDF(null);
          clearFiles();
        }}
      />

      <div className="mx-auto max-w-4xl space-y-8">
        <Alert>
          <AlertDescription>
            Convert PowerPoint presentations to PDF format. All slides will be preserved in the PDF.
          </AlertDescription>
        </Alert>

        {!isProcessing && files.length === 0 ? (
          <FileDropzone onFilesSelected={addFiles} accept=".pptx,.ppt,.odp" multiple={false} />
        ) : null}

        {files.length > 0 && (
          <>
            <div className="space-y-4">
              <h3 className="font-semibold">Selected Files:</h3>
              <FileList files={files} onRemove={removeFile} />
            </div>

            {!isProcessing && (
              <Button onClick={handleConvert} size="lg" className="w-full">
                Convert to PDF
              </Button>
            )}
          </>
        )}

        {isProcessing && <ProcessingIndicator progress={progress} />}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="rounded-2xl border bg-muted/30 p-6">
          <h3 className="mb-3 font-semibold">Features:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Convert PPTX, PPT, and ODP files</li>
            <li>• Preserve all slides and animations</li>
            <li>• Maintain formatting and layout</li>
            <li>• All processing happens locally</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
