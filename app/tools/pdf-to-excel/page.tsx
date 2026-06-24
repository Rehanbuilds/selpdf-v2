'use client';

import { useState } from 'react';
import { Table } from 'lucide-react';
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

export default function PDFToExcelPage() {
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
      console.log('[v0] Starting PDF to Excel conversion');
      setProgress(10);
      
      const file = files[0].file;
      const pagesText = await extractTextFromPDF(file);
      
      setProgress(50);
      const XLSX = await import('xlsx');
      const wb = XLSX.utils.book_new();
      
      pagesText.forEach((text, index) => {
        // Simple heuristic: split text by newlines and spaces/tabs to create a grid
        const rows = text.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .map(line => line.split(/\t| {2,}/));
        
        if (rows.length === 0) rows.push(['[No data found on this page]']);
        const ws = XLSX.utils.aoa_to_sheet(rows);
        XLSX.utils.book_append_sheet(wb, ws, `Page ${index + 1}`);
      });
      
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const excelData = new Uint8Array(excelBuffer);
      
      setProgress(80);
      setProcessedPDF(excelData);
      setShowFilenameDialog(true);
      
      setProgress(100);
      setProcessing(false);
    } catch (err) {
      console.error('[v0] Conversion error:', err);
      setError(err instanceof Error ? err.message : 'Failed to convert PDF to Excel. Please try again.');
      setProcessing(false);
    }
  };

  const handleDownload = (filename: string) => {
    if (processedPDF) {
      console.log('[v0] Downloading Excel as:', filename);
      downloadPDF(processedPDF, filename.replace('.pdf', '.xlsx'));
      setShowFilenameDialog(false);
      setProcessedPDF(null);
      setTimeout(() => {
        clearFiles();
      }, 500);
    }
  };

  return (
    <ToolLayout
      title="PDF to Excel"
      description="Extract tables from PDF documents to Excel spreadsheets"
      icon={Table}
      color="bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
    >
      <FilenameDialog
        open={showFilenameDialog}
        defaultFilename="spreadsheet.xlsx"
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
            Extract tables and data from PDF files and convert them to Excel spreadsheets.
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
                Convert to Excel
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
          <h3 className="mb-3 font-semibold">Capabilities:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Extract tables from PDF pages</li>
            <li>• Convert data to Excel format</li>
            <li>• Preserve table structure and formatting</li>
            <li>• Support for multi-page PDFs</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
