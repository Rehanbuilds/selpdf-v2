'use client';

import { useState } from 'react';
import { FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ToolLayout } from '@/components/pdf/tool-layout';
import { FileDropzone } from '@/components/pdf/file-dropzone';
import { DraggableFileList } from '@/components/pdf/draggable-file-list';
import { ProcessingIndicator } from '@/components/pdf/processing-indicator';
import { FilenameDialog } from '@/components/pdf/filename-dialog';
import { usePDFStore } from '@/lib/store/pdf-store';
import { downloadPDF } from '@/lib/pdf/utils';

export default function ImagesToPDFPage() {
  const { files, addFiles, removeFile, clearFiles, isProcessing, setProcessing, progress, setProgress, error, setError, reorderFiles } = usePDFStore();
  const [showFilenameDialog, setShowFilenameDialog] = useState(false);
  const [processedPDF, setProcessedPDF] = useState<Uint8Array | null>(null);

  const handleFilesSelected = (newFiles: File[]) => {
    const imageFiles = newFiles.filter((file) => 
      file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg'
    );
    if (imageFiles.length > 0) {
      addFiles(imageFiles);
      setError(null);
    } else {
      setError('Please select valid image files (PNG, JPG, JPEG).');
    }
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      setError('Please select at least one image file.');
      return;
    }

    setProcessing(true);
    setError(null);
    setProgress(0);

    try {
      console.log('[v0] Starting Images to PDF conversion');
      setProgress(10);
      const imageFiles = files.map((f) => f.file);
      
      setProgress(30);
      const { imagesToPDF } = await import('@/lib/pdf/convert');
      const pdfData = await imagesToPDF(imageFiles);
      console.log('[v0] Conversion complete, PDF size:', pdfData.length, 'bytes');
      
      setProgress(80);
      setProcessedPDF(pdfData);
      setShowFilenameDialog(true);
      
      setProgress(100);
      setProcessing(false);
    } catch (err) {
      console.error('[v0] Conversion error:', err);
      setError(err instanceof Error ? err.message : 'Failed to convert images to PDF. Please try again.');
      setProcessing(false);
    }
  };

  const handleDownload = (filename: string) => {
    if (processedPDF) {
      console.log('[v0] Downloading Images to PDF as:', filename);
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
      title="Images to PDF"
      description="Convert images to a single PDF document"
      icon={FileImage}
      color="bg-pink-50 text-pink-600 dark:bg-pink-950 dark:text-pink-400"
    >
      <FilenameDialog
        open={showFilenameDialog}
        defaultFilename="images-to-pdf.pdf"
        onConfirm={handleDownload}
        onCancel={() => {
          setShowFilenameDialog(false);
          setProcessedPDF(null);
          clearFiles();
        }}
      />
      
      <div className="mx-auto max-w-4xl space-y-8">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isProcessing ? (
          <ProcessingIndicator progress={progress} message="Converting images to PDF..." />
        ) : (
          <>
            <FileDropzone 
              onFilesSelected={handleFilesSelected} 
              accept=".png,.jpg,.jpeg,image/png,image/jpeg" 
              multiple 
            />
            
            <DraggableFileList files={files} onRemove={removeFile} onReorder={reorderFiles} />
            
            {files.length > 0 && (
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="flex-1" onClick={handleConvert}>
                  Convert {files.length} {files.length === 1 ? 'Image' : 'Images'} to PDF
                </Button>
                <Button size="lg" variant="outline" onClick={clearFiles}>
                  Clear All
                </Button>
              </div>
            )}
          </>
        )}

        <div className="rounded-2xl border bg-muted/30 p-6">
          <h3 className="mb-3 font-semibold">How it works:</h3>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li>1. Upload or drag and drop your image files (PNG, JPG, JPEG)</li>
            <li>2. Arrange them in the desired order</li>
            <li>3. Click "Convert" to create a PDF with all images</li>
            <li>4. Each image becomes a page in the PDF</li>
          </ol>
        </div>
      </div>
    </ToolLayout>
  );
}
