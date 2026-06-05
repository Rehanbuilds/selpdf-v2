'use client';

import { useState } from 'react';
import { Droplet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ToolLayout } from '@/components/pdf/tool-layout';
import { FileDropzone } from '@/components/pdf/file-dropzone';
import { FileList } from '@/components/pdf/file-list';
import { ProcessingIndicator } from '@/components/pdf/processing-indicator';
import { FilenameDialog } from '@/components/pdf/filename-dialog';
import { usePDFStore } from '@/lib/store/pdf-store';
import { PDFDocument, rgb } from 'pdf-lib';
import { downloadPDF } from '@/lib/pdf/utils';

export default function WatermarkPage() {
  const { files, addFiles, removeFile, clearFiles, isProcessing, setProcessing, progress, setProgress, error, setError } = usePDFStore();
  const [watermarkText, setWatermarkText] = useState('WATERMARK');
  const [opacity, setOpacity] = useState(0.3);
  const [showFilenameDialog, setShowFilenameDialog] = useState(false);
  const [processedPDF, setProcessedPDF] = useState<Uint8Array | null>(null);

  const handleFilesSelected = (newFiles: File[]) => {
    const pdfFiles = newFiles.filter((file) => file.type === 'application/pdf');
    if (pdfFiles.length > 0) {
      addFiles(pdfFiles.slice(0, 1));
      setError(null);
    } else {
      setError('Please select a valid PDF file.');
    }
  };

  const handleAddWatermark = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file.');
      return;
    }

    if (!watermarkText.trim()) {
      setError('Please enter watermark text.');
      return;
    }

    setProcessing(true);
    setError(null);
    setProgress(0);

    try {
      console.log('[v0] Starting watermark addition');
      setProgress(10);
      const file = files[0].file;
      
      setProgress(30);
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      setProgress(50);
      const pages = pdfDoc.getPages();
      
      pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        
        // Add diagonal watermark with rotation
        page.drawText(watermarkText, {
          x: width / 2 - 100,
          y: height / 2,
          size: 60,
          color: rgb(0.5, 0.5, 0.5),
          opacity: opacity,
          rotate: { angle: 45, type: 'degrees' },
        });
        
        setProgress(50 + (index / pages.length) * 30);
      });
      
      setProgress(80);
      const watermarkedPdf = await pdfDoc.save();
      setProcessedPDF(watermarkedPdf);
      setShowFilenameDialog(true);
      
      setProgress(100);
      setProcessing(false);
    } catch (err) {
      console.error('[v0] Watermark error:', err);
      setError(err instanceof Error ? err.message : 'Failed to add watermark. Please try again.');
      setProcessing(false);
    }
  };

  const handleDownload = (filename: string) => {
    if (processedPDF) {
      console.log('[v0] Downloading watermarked PDF as:', filename);
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
      title="Add Watermark"
      description="Add text watermarks to your PDF"
      icon={Droplet}
      color="bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400"
    >
      <FilenameDialog
        open={showFilenameDialog}
        defaultFilename="watermarked-document.pdf"
        onConfirm={handleDownload}
        onCancel={() => {
          setShowFilenameDialog(false);
          setProcessedPDF(null);
          clearFiles();
        }}
      />

      <div className="mx-auto max-w-4xl space-y-8">
        <>
          <FileDropzone onFilesSelected={handleFilesSelected} accept=".pdf" multiple={false} />
          
          <FileList files={files} onRemove={removeFile} />
          
          {files.length > 0 && (
            <div className="rounded-2xl border bg-muted/30 p-6 space-y-4">
              <div>
                <Label htmlFor="watermark-text">Watermark Text</Label>
                <Input
                  id="watermark-text"
                  type="text"
                  placeholder="Enter watermark text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  disabled={isProcessing}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="opacity">Opacity: {Math.round(opacity * 100)}%</Label>
                <input
                  id="opacity"
                  type="range"
                  min="0"
                  max="100"
                  value={opacity * 100}
                  onChange={(e) => setOpacity(Number(e.target.value) / 100)}
                  disabled={isProcessing}
                  className="w-full mt-2"
                />
              </div>
            </div>
          )}
          
          {isProcessing && <ProcessingIndicator progress={progress} />}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {files.length > 0 && (
            <Button onClick={handleAddWatermark} disabled={isProcessing} size="lg" className="w-full">
              {isProcessing ? 'Adding Watermark...' : 'Add Watermark'}
            </Button>
          )}
        </>
      </div>
    </ToolLayout>
  );
}
