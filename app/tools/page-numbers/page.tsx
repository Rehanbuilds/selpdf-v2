'use client';

import { useState } from 'react';
import { Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ToolLayout } from '@/components/pdf/tool-layout';
import { FileDropzone } from '@/components/pdf/file-dropzone';
import { FileList } from '@/components/pdf/file-list';
import { ProcessingIndicator } from '@/components/pdf/processing-indicator';
import { FilenameDialog } from '@/components/pdf/filename-dialog';
import { usePDFStore } from '@/lib/store/pdf-store';
import { PDFDocument, rgb } from 'pdf-lib';
import { downloadPDF } from '@/lib/pdf/utils';

export default function PageNumbersPage() {
  const { files, addFiles, removeFile, clearFiles, isProcessing, setProcessing, progress, setProgress, error, setError } = usePDFStore();
  const [position, setPosition] = useState<'top' | 'bottom'>('bottom');
  const [format, setFormat] = useState<'1,2,3' | 'i,ii,iii'>('1,2,3');
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

  const getPageNumberText = (pageNum: number): string => {
    if (format === '1,2,3') {
      return pageNum.toString();
    } else {
      // Convert to Roman numerals
      const romanNumerals = ['i', 'iv', 'v', 'ix', 'x', 'xl', 'l', 'xc', 'c', 'cm', 'd', 'm'];
      const arabicNumerals = [1, 4, 5, 9, 10, 40, 50, 90, 100, 900, 500, 1000];
      
      let roman = '';
      let num = pageNum;
      
      for (let i = arabicNumerals.length - 1; i >= 0; i--) {
        while (num >= arabicNumerals[i]) {
          roman += romanNumerals[i];
          num -= arabicNumerals[i];
        }
      }
      
      return roman;
    }
  };

  const handleAddPageNumbers = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file.');
      return;
    }

    setProcessing(true);
    setError(null);
    setProgress(0);

    try {
      console.log('[v0] Starting page numbers addition');
      setProgress(10);
      const file = files[0].file;
      
      setProgress(30);
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      setProgress(50);
      const pages = pdfDoc.getPages();
      
      pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        const pageNum = index + 1;
        const pageText = getPageNumberText(pageNum);
        
        // Determine Y position
        const yPosition = position === 'bottom' ? 30 : height - 30;
        
        // Add page number centered at bottom or top
        page.drawText(pageText, {
          x: width / 2 - 10,
          y: yPosition,
          size: 12,
          color: rgb(0, 0, 0),
        });
        
        setProgress(50 + (index / pages.length) * 30);
      });
      
      setProgress(80);
      const numberedPdf = await pdfDoc.save();
      setProcessedPDF(numberedPdf);
      setShowFilenameDialog(true);
      
      setProgress(100);
      setProcessing(false);
    } catch (err) {
      console.error('[v0] Page numbers error:', err);
      setError(err instanceof Error ? err.message : 'Failed to add page numbers. Please try again.');
      setProcessing(false);
    }
  };

  const handleDownload = (filename: string) => {
    if (processedPDF) {
      console.log('[v0] Downloading PDF with page numbers as:', filename);
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
      title="Add Page Numbers"
      description="Add page numbers to your PDF document"
      icon={Hash}
      color="bg-lime-50 text-lime-600 dark:bg-lime-950 dark:text-lime-400"
    >
      <FilenameDialog
        open={showFilenameDialog}
        defaultFilename="numbered-document.pdf"
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
            <div className="rounded-2xl border bg-muted/30 p-6 space-y-6">
              <div>
                <Label className="mb-3 block font-semibold">Position</Label>
                <RadioGroup value={position} onValueChange={(val) => setPosition(val as 'top' | 'bottom')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="top" id="top" />
                    <Label htmlFor="top" className="font-normal cursor-pointer">Top of page</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bottom" id="bottom" />
                    <Label htmlFor="bottom" className="font-normal cursor-pointer">Bottom of page</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label className="mb-3 block font-semibold">Format</Label>
                <RadioGroup value={format} onValueChange={(val) => setFormat(val as '1,2,3' | 'i,ii,iii')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1,2,3" id="arabic" />
                    <Label htmlFor="arabic" className="font-normal cursor-pointer">Numbers (1, 2, 3...)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="i,ii,iii" id="roman" />
                    <Label htmlFor="roman" className="font-normal cursor-pointer">Roman numerals (i, ii, iii...)</Label>
                  </div>
                </RadioGroup>
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
            <Button onClick={handleAddPageNumbers} disabled={isProcessing} size="lg" className="w-full">
              {isProcessing ? 'Adding Page Numbers...' : 'Add Page Numbers'}
            </Button>
          )}
        </>
      </div>
    </ToolLayout>
  );
}
