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
      
      const file = files[0].file;
      const arrayBuffer = await file.arrayBuffer();
      
      setProgress(30);
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer as any });
      const text = result.value;
      
      setProgress(50);
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      // Split text to fit within page width
      const splitText = doc.splitTextToSize(text, 180);
      
      let cursorY = 10;
      for (let i = 0; i < splitText.length; i++) {
        if (cursorY > 280) {
          doc.addPage();
          cursorY = 10;
        }
        doc.text(splitText[i], 10, cursorY);
        cursorY += 7;
      }
      
      setProgress(80);
      const pdfData = doc.output('arraybuffer');
      setProcessedPDF(new Uint8Array(pdfData));
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
