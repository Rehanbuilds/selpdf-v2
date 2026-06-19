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
import { extractTextFromPDF } from '@/lib/pdf/convert';
import { downloadPDF } from '@/lib/pdf/utils';

export default function PDFToWordPage() {
  const { files, addFiles, removeFile, clearFiles, isProcessing, setProcessing, progress, setProgress, error, setError } = usePDFStore();
  const [showFilenameDialog, setShowFilenameDialog] = useState(false);
  const [processedFile, setProcessedFile] = useState<Uint8Array | null>(null);

  const handleFilesSelected = (newFiles: File[]) => {
    const pdfFiles = newFiles.filter((file) => file.type === 'application/pdf');
    if (pdfFiles.length > 0) {
      addFiles(pdfFiles.slice(0, 1));
      setError(null);
    } else {
      setError('Please select a valid PDF file.');
    }
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file to convert.');
      return;
    }

    setProcessing(true);
    setError(null);
    setProgress(0);

    try {
      console.log('[v0] Starting PDF to Word conversion');
      setProgress(10);
      const file = files[0].file;
      
      setProgress(30);
      const pagesText = await extractTextFromPDF(file);
      
      setProgress(60);
      
      const { Document, Packer, Paragraph, TextRun } = await import('docx');
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: pagesText.map(
              (text, index) =>
                new Paragraph({
                  children: [
                    new TextRun({ text: `Page ${index + 1}`, bold: true }),
                    new TextRun({ text: `\n\n${text}`, break: 1 }),
                  ],
                })
            ),
          },
        ],
      });
      
      const docxData = await Packer.toBuffer(doc);
      const uint8Array = new Uint8Array(docxData);
      
      setProgress(80);
      setProcessedFile(uint8Array);
      setShowFilenameDialog(true);
      
      setProgress(100);
      setProcessing(false);
    } catch (err) {
      console.error('[v0] Conversion error:', err);
      setError(err instanceof Error ? err.message : 'Failed to convert PDF to Word. Please try again.');
      setProcessing(false);
    }
  };

  const handleDownload = (filename: string) => {
    if (processedFile) {
      console.log('[v0] Downloading PDF to Word as:', filename);
      // For DOCX, we need to create proper DOCX format
      downloadPDF(processedFile, filename);
      setShowFilenameDialog(false);
      setProcessedFile(null);
      setTimeout(() => {
        clearFiles();
      }, 500);
    }
  };

  return (
    <ToolLayout
      title="PDF to Word"
      description="Convert PDF documents to editable Word files"
      icon={FileType}
      color="bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400"
    >
      <FilenameDialog
        open={showFilenameDialog}
        defaultFilename="converted-document.docx"
        onConfirm={handleDownload}
        onCancel={() => {
          setShowFilenameDialog(false);
          setProcessedFile(null);
          clearFiles();
        }}
      />

      <div className="mx-auto max-w-4xl space-y-8">
        <>
          <FileDropzone onFilesSelected={handleFilesSelected} accept=".pdf" multiple={false} />
          
          <FileList files={files} onRemove={removeFile} />
          
          {isProcessing && <ProcessingIndicator progress={progress} />}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {files.length > 0 && (
            <Button onClick={handleConvert} disabled={isProcessing} size="lg" className="w-full">
              {isProcessing ? 'Converting...' : 'Convert to Word'}
            </Button>
          )}
        </>
      </div>
    </ToolLayout>
  );
}
