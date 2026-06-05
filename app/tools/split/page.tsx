'use client';

import { useState } from 'react';
import { Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ToolLayout } from '@/components/pdf/tool-layout';
import { FileDropzone } from '@/components/pdf/file-dropzone';
import { FileList } from '@/components/pdf/file-list';
import { ProcessingIndicator } from '@/components/pdf/processing-indicator';
import { FilenameDialog } from '@/components/pdf/filename-dialog';
import { usePDFStore } from '@/lib/store/pdf-store';
import { splitPDF, downloadMultiplePDFs, getPDFInfo } from '@/lib/pdf/utils';

export default function SplitPDFPage() {
  const { files, addFiles, removeFile, clearFiles, isProcessing, setProcessing, progress, setProgress, error, setError } = usePDFStore();
  const [splitMode, setSplitMode] = useState<'all' | 'range'>('all');
  const [startPage, setStartPage] = useState('1');
  const [endPage, setEndPage] = useState('1');
  const [pageCount, setPageCount] = useState(0);
  const [showFilenameDialog, setShowFilenameDialog] = useState(false);
  const [processedPDFs, setProcessedPDFs] = useState<{ data: Uint8Array; filename: string }[]>([]);

  const handleFilesSelected = async (newFiles: File[]) => {
    const pdfFiles = newFiles.filter((file) => file.type === 'application/pdf');
    if (pdfFiles.length > 0) {
      addFiles(pdfFiles);
      setError(null);
      
      // Get page count
      try {
        const info = await getPDFInfo(pdfFiles[0]);
        setPageCount(info.pageCount);
        setEndPage(info.pageCount.toString());
      } catch (err) {
        console.error('Failed to get PDF info:', err);
      }
    } else {
      setError('Please select a valid PDF file.');
    }
  };

  const handleSplit = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file to split.');
      return;
    }

    setProcessing(true);
    setError(null);
    setProgress(0);

    try {
      console.log('[v0] Starting split operation');
      setProgress(10);
      const file = files[0].file;
      
      let ranges: { start: number; end: number }[];
      
      if (splitMode === 'all') {
        // Split into individual pages
        ranges = Array.from({ length: pageCount }, (_, i) => ({
          start: i + 1,
          end: i + 1,
        }));
      } else {
        // Split by range
        const start = Number.parseInt(startPage, 10);
        const end = Number.parseInt(endPage, 10);
        
        if (start < 1 || end > pageCount || start > end) {
          setError(`Invalid page range. Please enter values between 1 and ${pageCount}.`);
          setProcessing(false);
          return;
        }
        
        ranges = [{ start, end }];
      }
      
      setProgress(30);
      const splitPdfs = await splitPDF(file, ranges);
      console.log('[v0] Split complete, generated', splitPdfs.length, 'PDFs');
      
      setProgress(80);
      
      // Prepare PDFs for download
      const pdfsToDownload = splitPdfs.map((pdf, index) => {
        if (splitMode === 'all') {
          return { data: pdf, filename: `page-${index + 1}.pdf` };
        } else {
          return { data: pdf, filename: `pages-${startPage}-to-${endPage}.pdf` };
        }
      });
      
      setProcessedPDFs(pdfsToDownload);
      
      // For single file, show rename dialog. For multiple files, download directly
      if (pdfsToDownload.length === 1) {
        setShowFilenameDialog(true);
      } else {
        console.log('[v0] Downloading', pdfsToDownload.length, 'split PDFs');
        downloadMultiplePDFs(pdfsToDownload);
        setTimeout(() => {
          clearFiles();
        }, 1000);
      }
      
      setProgress(100);
      setProcessing(false);
    } catch (err) {
      console.error('[v0] Split error:', err);
      setError(err instanceof Error ? err.message : 'Failed to split PDF. Please try again.');
      setProcessing(false);
    }
  };

  const handleDownload = (filename: string) => {
    if (processedPDFs.length > 0) {
      console.log('[v0] Downloading split PDF as:', filename);
      const pdf = processedPDFs[0];
      pdf.filename = filename;
      downloadMultiplePDFs([pdf]);
      setShowFilenameDialog(false);
      setProcessedPDFs([]);
      setTimeout(() => {
        clearFiles();
      }, 500);
    }
  };

  return (
    <ToolLayout
      title="Split PDF"
      description="Extract pages from your PDF document"
      icon={Scissors}
      color="bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
    >
      <FilenameDialog
        open={showFilenameDialog}
        defaultFilename={processedPDFs[0]?.filename || 'split-document.pdf'}
        onConfirm={handleDownload}
        onCancel={() => {
          setShowFilenameDialog(false);
          setProcessedPDFs([]);
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
          <ProcessingIndicator progress={progress} message="Splitting your PDF..." />
        ) : (
          <>
            {files.length === 0 ? (
              <FileDropzone onFilesSelected={handleFilesSelected} accept=".pdf" multiple={false} />
            ) : (
              <>
                <FileList files={files} onRemove={removeFile} />
                
                <div className="space-y-6 rounded-2xl border bg-card p-6">
                  <div>
                    <Label className="mb-3 block text-base font-semibold">Split Options</Label>
                    <RadioGroup value={splitMode} onValueChange={(value: 'all' | 'range') => setSplitMode(value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all" />
                        <Label htmlFor="all" className="cursor-pointer font-normal">
                          Extract all pages individually ({pageCount} pages)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="range" id="range" />
                        <Label htmlFor="range" className="cursor-pointer font-normal">
                          Extract page range
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {splitMode === 'range' && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="startPage">Start Page</Label>
                        <Input
                          id="startPage"
                          type="number"
                          min="1"
                          max={pageCount}
                          value={startPage}
                          onChange={(e) => setStartPage(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="endPage">End Page</Label>
                        <Input
                          id="endPage"
                          type="number"
                          min="1"
                          max={pageCount}
                          value={endPage}
                          onChange={(e) => setEndPage(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" className="flex-1" onClick={handleSplit}>
                    Split PDF
                  </Button>
                  <Button size="lg" variant="outline" onClick={clearFiles}>
                    Clear
                  </Button>
                </div>
              </>
            )}
          </>
        )}

        <div className="rounded-2xl border bg-muted/30 p-6">
          <h3 className="mb-3 font-semibold">Split PDF options:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Extract all pages as individual PDF files</li>
            <li>• Extract a specific range of pages</li>
            <li>• Keep the original quality and formatting</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
