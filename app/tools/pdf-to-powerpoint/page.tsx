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
import { extractTextFromPDF } from '@/lib/pdf/convert';
import { downloadPDF } from '@/lib/pdf/utils';

export default function PDFToPowerPointPage() {
  const { files, addFiles, removeFile, clearFiles, isProcessing, setProcessing, progress, setProgress, error, setError } = usePDFStore();
  const [showFilenameDialog, setShowFilenameDialog] = useState(false);
  const [processedPDF, setProcessedPDF] = useState<Uint8Array | null>(null);

  const handleConvert = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file to convert.');
      return;
    }

    setProcessing(true);
    setError(null);
    setProgress(0);

    try {
      console.log('[v0] Starting PDF to PowerPoint conversion');
      setProgress(10);
      
      const file = files[0].file;
      const pagesText = await extractTextFromPDF(file);
      
      setProgress(50);
      const pptxgenModule = await import('pptxgenjs');
      const PptxGenJS = pptxgenModule.default || pptxgenModule;
      const pres = new (PptxGenJS as any)();
      
      pagesText.forEach((text, index) => {
        const slide = pres.addSlide();
        
        // White background
        slide.background = { color: 'FFFFFF' };

        // Split paragraphs: first non-empty line = title, rest = body
        const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean);
        const titleText = lines[0] || `Page ${index + 1}`;
        const bodyLines = lines.slice(1);

        // Blue accent bar at top
        slide.addShape('rect' as any, { x: 0, y: 0, w: '100%', h: 0.18, fill: { color: '2980B9' } });

        // Title
        slide.addText(titleText, {
          x: 0.4, y: 0.3, w: '92%', h: 0.8,
          fontSize: 24, bold: true, color: '1A1A2E',
          align: 'left', valign: 'top',
        });

        // Body
        if (bodyLines.length > 0) {
          slide.addText(bodyLines.join('\n'), {
            x: 0.4, y: 1.3, w: '92%', h: '75%',
            fontSize: 13, color: '363636',
            align: 'left', valign: 'top',
          });
        } else if (!text.trim()) {
          slide.addText(`[No text found on page ${index + 1}]`, {
            x: 0.4, y: 1.3, w: '92%', h: '75%',
            fontSize: 13, color: '999999',
            align: 'left', valign: 'middle',
          });
        }

        // Slide number
        slide.addText(`${index + 1} / ${pagesText.length}`, {
          x: 0, y: '90%', w: '100%', h: 0.3,
          fontSize: 8, color: 'AAAAAA', align: 'right',
        });
      });
      
      setProgress(80);
      const pptxData = await pres.write({ outputType: 'arraybuffer' }) as ArrayBuffer;
      setProcessedPDF(new Uint8Array(pptxData));
      setShowFilenameDialog(true);
      
      setProgress(100);
      setProcessing(false);
    } catch (err) {
      console.error('[v0] Conversion error:', err);
      setError(err instanceof Error ? err.message : 'Failed to convert PDF to PowerPoint. Please try again.');
      setProcessing(false);
    }
  };

  const handleDownload = (filename: string) => {
    if (processedPDF) {
      console.log('[v0] Downloading PowerPoint as:', filename);
      downloadPDF(processedPDF, filename.replace('.pdf', '.pptx'));
      setShowFilenameDialog(false);
      setProcessedPDF(null);
      setTimeout(() => {
        clearFiles();
      }, 500);
    }
  };

  return (
    <ToolLayout
      title="PDF to PowerPoint"
      description="Convert PDF documents to PowerPoint presentations"
      icon={Presentation}
      color="bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
    >
      <FilenameDialog
        open={showFilenameDialog}
        defaultFilename="presentation.pptx"
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
            Convert PDF pages into PowerPoint slides. Each page becomes a slide in the presentation.
          </AlertDescription>
        </Alert>

        {!isProcessing && files.length === 0 ? (
          <FileDropzone onFilesSelected={addFiles} accept=".pdf" multiple={false} />
        ) : null}

        {files.length > 0 && (
          <>
            <div className="space-y-4">
              <h3 className="font-semibold">Selected Files:</h3>
              <FileList files={files} onRemove={removeFile} />
            </div>

            {!isProcessing && (
              <Button onClick={handleConvert} size="lg" className="w-full">
                Convert to PowerPoint
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
          <h3 className="mb-3 font-semibold">How it works:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Upload a PDF file</li>
            <li>• Each page will be converted to a PowerPoint slide</li>
            <li>• Download your presentation</li>
            <li>• All processing happens locally on your device</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
