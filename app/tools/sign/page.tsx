'use client';

import { useState, useRef } from 'react';
import { PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ToolLayout } from '@/components/pdf/tool-layout';
import { FileDropzone } from '@/components/pdf/file-dropzone';
import { FileList } from '@/components/pdf/file-list';
import { ProcessingIndicator } from '@/components/pdf/processing-indicator';
import { FilenameDialog } from '@/components/pdf/filename-dialog';
import { usePDFStore } from '@/lib/store/pdf-store';
import { PDFDocument, rgb } from 'pdf-lib';
import { downloadPDF } from '@/lib/pdf/utils';

export default function SignPDFPage() {
  const { files, addFiles, removeFile, clearFiles, isProcessing, setProcessing, progress, setProgress, error, setError } = usePDFStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureName, setSignatureName] = useState('');
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

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    setIsDrawing(true);
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  const handleSignPDF = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file.');
      return;
    }

    if (!canvasRef.current) {
      setError('Signature canvas not available.');
      return;
    }

    setProcessing(true);
    setError(null);
    setProgress(0);

    try {
      console.log('[v0] Starting PDF signing');
      setProgress(10);
      const file = files[0].file;
      
      setProgress(30);
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      setProgress(50);
      // Get signature image from canvas
      const signatureImageBlob = await new Promise<Blob>((resolve) => {
        canvasRef.current?.toBlob((blob) => {
          resolve(blob || new Blob());
        }, 'image/png');
      });
      const signatureImageData = await signatureImageBlob.arrayBuffer();
      const signatureImage = await pdfDoc.embedPng(signatureImageData);
      
      setProgress(60);
      // Add signature to the last page
      const pages = pdfDoc.getPages();
      const lastPage = pages[pages.length - 1];
      const { width, height } = lastPage.getSize();
      
      // Draw signature in bottom right corner
      lastPage.drawImage(signatureImage, {
        x: width - 150,
        y: 30,
        width: 100,
        height: 50,
      });
      
      // Add signature metadata
      if (signatureName) {
        lastPage.drawText(`Signed by: ${signatureName}`, {
          x: width - 150,
          y: 15,
          size: 8,
          color: rgb(0.5, 0.5, 0.5),
        });
      }
      
      setProgress(80);
      const signedPdf = await pdfDoc.save();
      setProcessedPDF(signedPdf);
      setShowFilenameDialog(true);
      
      setProgress(100);
      setProcessing(false);
    } catch (err) {
      console.error('[v0] Sign error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign PDF. Please try again.');
      setProcessing(false);
    }
  };

  const handleDownload = (filename: string) => {
    if (processedPDF) {
      console.log('[v0] Downloading signed PDF as:', filename);
      downloadPDF(processedPDF, filename);
      setShowFilenameDialog(false);
      setProcessedPDF(null);
      setTimeout(() => {
        clearFiles();
        clearCanvas();
      }, 500);
    }
  };

  return (
    <ToolLayout
      title="Sign PDF"
      description="Add digital signatures to your PDF documents"
      icon={PenTool}
      color="bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
    >
      <FilenameDialog
        open={showFilenameDialog}
        defaultFilename="signed-document.pdf"
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
                <label className="mb-2 block font-semibold">Your Signature:</label>
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={120}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="border-2 border-dashed border-muted-foreground rounded cursor-crosshair bg-white"
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearCanvas}
                    disabled={isProcessing}
                  >
                    Clear Signature
                  </Button>
                </div>
              </div>

              <div>
                <label htmlFor="name" className="mb-2 block font-semibold">Name (Optional):</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  disabled={isProcessing}
                  className="w-full px-3 py-2 border rounded-lg"
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
            <Button onClick={handleSignPDF} disabled={isProcessing} size="lg" className="w-full">
              {isProcessing ? 'Signing PDF...' : 'Sign PDF'}
            </Button>
          )}
        </>
      </div>
    </ToolLayout>
  );
}
