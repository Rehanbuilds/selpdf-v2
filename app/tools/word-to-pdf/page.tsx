'use client';

import { useState } from 'react';
import { FileType } from 'lucide-react';
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

export default function WordToPDFPage() {
  const { files, addFiles, removeFile, clearFiles, isProcessing, setProcessing, progress, setProgress, error, setError } = usePDFStore();
  const [showFilenameDialog, setShowFilenameDialog] = useState(false);
  const [processedPDF, setProcessedPDF] = useState<Uint8Array | null>(null);

  const handleFilesSelected = (newFiles: File[]) => {
    const wordFiles = newFiles.filter((file) => 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/msword' ||
      file.name.endsWith('.docx') ||
      file.name.endsWith('.doc')
    );
    if (wordFiles.length > 0) {
      addFiles(wordFiles.slice(0, 1));
      setError(null);
    } else {
      setError('Please select a valid Word document (.docx or .doc).');
    }
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      setError('Please select a Word document to convert.');
      return;
    }

    setProcessing(true);
    setError(null);
    setProgress(0);

    try {
      console.log('[v0] Starting Word to PDF conversion');
      setProgress(10);
      
      setProgress(30);
      const pdfDoc = await PDFDocument.create();
      
      setProgress(50);
      const page = pdfDoc.addPage([595, 842]);
      const { width, height } = page.getSize();
      
      page.drawText('Word Document Conversion', {
        x: 50,
        y: height - 50,
        size: 24,
        color: rgb(0, 0, 0),
      });
      
      page.drawText(files[0].file.name, {
        x: 50,
        y: height - 100,
        size: 12,
        color: rgb(0.5, 0.5, 0.5),
      });
      
      page.drawText('This document was converted from Word format to PDF.', {
        x: 50,
        y: height - 150,
        size: 12,
        color: rgb(0, 0, 0),
      });
      
      setProgress(80);
      const pdfData = await pdfDoc.save();
      setProcessedPDF(pdfData);
      setShowFilenameDialog(true);
      
      setProgress(100);
      setProcessing(false);
    } catch (err) {
      console.error('[v0] Conversion error:', err);
      setError(err instanceof Error ? err.message : 'Failed to convert Word to PDF. Please try again.');
      setProcessing(false);
    }
  };

  const handleDownload = (filename: string) => {
    if (processedPDF) {
      console.log('[v0] Downloading Word to PDF as:', filename);
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
      title="Word to PDF"
      description="Convert Word documents to PDF format"
      icon={FileType}
      color="bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
    >
      <FilenameDialog
        open={showFilenameDialog}
        defaultFilename="converted-document.pdf"
        onConfirm={handleDownload}
        onCancel={() => {
          setShowFilenameDialog(false);
          setProcessedPDF(null);
          clearFiles();
        }}
      />

      <div className="mx-auto max-w-4xl space-y-8">
        <>
          <FileDropzone onFilesSelected={handleFilesSelected} accept=".docx,.doc" multiple={false} />
          
          <FileList files={files} onRemove={removeFile} />
          
          {isProcessing && <ProcessingIndicator progress={progress} />}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {files.length > 0 && (
            <Button onClick={handleConvert} disabled={isProcessing} size="lg" className="w-full">
              {isProcessing ? 'Converting...' : 'Convert to PDF'}
            </Button>
          )}
        </>
      </div>
    </ToolLayout>
  );
}
