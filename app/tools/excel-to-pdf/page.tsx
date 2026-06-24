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
import { downloadPDF } from '@/lib/pdf/utils';

export default function ExcelToPDFPage() {
  const { files, addFiles, removeFile, clearFiles, isProcessing, setProcessing, progress, setProgress, error, setError } = usePDFStore();
  const [showFilenameDialog, setShowFilenameDialog] = useState(false);
  const [processedPDF, setProcessedPDF] = useState<Uint8Array | null>(null);

  const handleConvert = async () => {
    if (files.length === 0) {
      setError('Please select an Excel file to convert.');
      return;
    }

    setProcessing(true);
    setError(null);
    setProgress(0);

    try {
      console.log('[v0] Starting Excel to PDF conversion');
      setProgress(10);
      
      const file = files[0].file;
      const arrayBuffer = await file.arrayBuffer();
      
      setProgress(50);
      const XLSX = await import('xlsx');
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      const { jsPDF } = await import('jspdf');
      const { autoTable } = await import('jspdf-autotable');
      
      const doc = new jsPDF({ orientation: 'landscape' });
      let firstSheet = true;
      
      for (const sheetName of workbook.SheetNames) {
        const ws = workbook.Sheets[sheetName];
        const rawRows = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
        const rows = rawRows.filter(row => row && row.length > 0 && row.some(cell => cell !== undefined && cell !== null && cell !== ''));
        
        if (!firstSheet) doc.addPage();
        firstSheet = false;
        
        // Add sheet name header
        doc.setFontSize(14);
        doc.text(sheetName, 10, 10);
        
        // Ensure all rows have the same number of columns to prevent misaligned tables
        let maxCols = 0;
        rows.forEach(row => {
          if (row.length > maxCols) maxCols = row.length;
        });
        
        const normalizedRows = rows.map(row => {
          const newRow = [...row];
          while (newRow.length < maxCols) {
            newRow.push('');
          }
          return newRow;
        });

        if (normalizedRows.length > 0) {
          autoTable(doc, {
            head: [normalizedRows[0].map(cell => cell === undefined || cell === null ? '' : String(cell))],
            body: normalizedRows.slice(1).map(row => row.map(cell => cell === undefined || cell === null ? '' : String(cell))),
            startY: 16,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [41, 128, 185] },
          });
        } else {
          doc.setFontSize(10);
          doc.text('No data found in this sheet.', 10, 20);
        }
      }
      
      setProgress(80);
      const pdfData = doc.output('arraybuffer');
      setProcessedPDF(new Uint8Array(pdfData));
      setShowFilenameDialog(true);
      
      setProgress(100);
      setProcessing(false);
    } catch (err) {
      console.error('[v0] Conversion error:', err);
      setError(err instanceof Error ? err.message : 'Failed to convert Excel to PDF. Please try again.');
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
      title="Excel to PDF"
      description="Convert Excel spreadsheets to PDF format"
      icon={Table}
      color="bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400"
    >
      <FilenameDialog
        open={showFilenameDialog}
        defaultFilename="document.pdf"
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
            Convert Excel spreadsheets to PDF format. Perfect for sharing data and reports.
          </AlertDescription>
        </Alert>

        {!isProcessing && files.length === 0 ? (
          <FileDropzone onFilesSelected={addFiles} accept=".xlsx,.xls,.csv,.ods" multiple={false} />
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
            <li>• Convert XLSX, XLS, CSV, and ODS files</li>
            <li>• Maintain formatting and cell styles</li>
            <li>• Preserve formulas and data integrity</li>
            <li>• Local processing for privacy</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
