'use client';

import { useState } from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ToolLayout } from '@/components/pdf/tool-layout';
import { FileDropzone } from '@/components/pdf/file-dropzone';
import { DraggableFileList } from '@/components/pdf/draggable-file-list';
import { ProcessingIndicator } from '@/components/pdf/processing-indicator';
import { FilenameDialog } from '@/components/pdf/filename-dialog';
import { usePDFStore } from '@/lib/store/pdf-store';
import { mergePDFs, downloadPDF } from '@/lib/pdf/utils';

export default function MergePDFPage() {
  const { files, addFiles, removeFile, clearFiles, isProcessing, setProcessing, progress, setProgress, error, setError, reorderFiles } = usePDFStore();
  const [showFilenameDialog, setShowFilenameDialog] = useState(false);
  const [processedPDF, setProcessedPDF] = useState<Uint8Array | null>(null);

  const handleFilesSelected = (newFiles: File[]) => {
    const pdfFiles = newFiles.filter((file) => file.type === 'application/pdf');
    if (pdfFiles.length > 0) {
      addFiles(pdfFiles);
      setError(null);
    } else {
      setError('Please select valid PDF files.');
    }
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge.');
      return;
    }

    setProcessing(true);
    setError(null);
    setProgress(0);

    try {
      console.log('[v0] Starting merge of', files.length, 'files');
      setProgress(10);
      const pdfFiles = files.map((f) => f.file);
      
      setProgress(30);
      const mergedPdf = await mergePDFs(pdfFiles);
      console.log('[v0] Merge complete, PDF size:', mergedPdf.length, 'bytes');
      
      setProgress(80);
      setProcessedPDF(mergedPdf);
      setShowFilenameDialog(true);
      
      setProgress(100);
      setProcessing(false);
    } catch (err) {
      console.error('[v0] Merge error:', err);
      setError(err instanceof Error ? err.message : 'Failed to merge PDFs. Please try again.');
      setProcessing(false);
    }
  };

  const handleDownload = (filename: string) => {
    if (processedPDF) {
      console.log('[v0] Downloading merged PDF as:', filename);
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
      title="Merge PDF"
      description="Combine multiple PDF files into one document"
      icon={FileText}
      color="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
    >
      <FilenameDialog
        open={showFilenameDialog}
        defaultFilename="merged-document.pdf"
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
          <ProcessingIndicator progress={progress} message="Merging your PDFs..." />
        ) : (
          <>
            <FileDropzone onFilesSelected={handleFilesSelected} accept=".pdf" multiple />
            
            <DraggableFileList files={files} onRemove={removeFile} onReorder={reorderFiles} />
            
            {files.length > 0 && (
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="flex-1" onClick={handleMerge} disabled={files.length < 2}>
                  Merge {files.length} {files.length === 1 ? 'File' : 'Files'}
                </Button>
                <Button size="lg" variant="outline" onClick={clearFiles}>
                  Clear All
                </Button>
              </div>
            )}
          </>
        )}

        <div className="rounded-2xl border bg-muted/30 p-6">
          <h3 className="mb-3 font-semibold">How to merge PDFs:</h3>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li>1. Upload or drag and drop your PDF files</li>
            <li>2. Arrange them in the order you want (drag to reorder)</li>
            <li>3. Click "Merge" to combine them into one PDF</li>
            <li>4. Download your merged PDF instantly</li>
          </ol>
        </div>
      </div>
    </ToolLayout>
  );
}
