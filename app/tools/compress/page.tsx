'use client';

import { useState, useEffect } from 'react';
import { Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { ToolLayout } from '@/components/pdf/tool-layout';
import { FileDropzone } from '@/components/pdf/file-dropzone';
import { FileList } from '@/components/pdf/file-list';
import { ProcessingIndicator } from '@/components/pdf/processing-indicator';
import { FilenameDialog } from '@/components/pdf/filename-dialog';
import { usePDFStore } from '@/lib/store/pdf-store';
import { compressPDF, downloadPDF } from '@/lib/pdf/utils';

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

export default function CompressPDFPage() {
  const { files, addFiles, removeFile, clearFiles, isProcessing, setProcessing, progress, setProgress, error, setError } = usePDFStore();
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [showFilenameDialog, setShowFilenameDialog] = useState(false);
  const [processedPDF, setProcessedPDF] = useState<Uint8Array | null>(null);

  useEffect(() => {
    if (files.length > 0) {
      setOriginalSize(files[0].size);
    } else {
      setOriginalSize(0);
      setCompressedSize(0);
    }
  }, [files]);

  const handleFilesSelected = (newFiles: File[]) => {
    const pdfFiles = newFiles.filter((file) => file.type === 'application/pdf');
    if (pdfFiles.length > 0) {
      addFiles(pdfFiles.slice(0, 1)); // Only take the first file
      setError(null);
    } else {
      setError('Please select a valid PDF file.');
    }
  };

  const handleCompress = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file to compress.');
      return;
    }

    setProcessing(true);
    setError(null);
    setProgress(0);

    try {
      console.log('[v0] Starting compression');
      setProgress(10);
      const file = files[0].file;
      
      setProgress(30);
      const compressedPdf = await compressPDF(file);
      console.log('[v0] Compression complete, size:', compressedPdf.length, 'bytes');
      
      setProgress(80);
      setCompressedSize(compressedPdf.length);
      setProcessedPDF(compressedPdf);
      setShowFilenameDialog(true);
      
      setProgress(100);
      setProcessing(false);
    } catch (err) {
      console.error('[v0] Compression error:', err);
      setError(err instanceof Error ? err.message : 'Failed to compress PDF. Please try again.');
      setProcessing(false);
    }
  };

  const handleDownload = (filename: string) => {
    if (processedPDF) {
      console.log('[v0] Downloading compressed PDF as:', filename);
      downloadPDF(processedPDF, filename);
      setShowFilenameDialog(false);
      setProcessedPDF(null);
      setTimeout(() => {
        clearFiles();
        setCompressedSize(0);
      }, 500);
    }
  };

  const compressionRatio = originalSize > 0 && compressedSize > 0 
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
    : 0;

  return (
    <ToolLayout
      title="Compress PDF"
      description="Reduce PDF file size while maintaining quality"
      icon={Minimize2}
      color="bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
    >
      <FilenameDialog
        open={showFilenameDialog}
        defaultFilename="compressed-document.pdf"
        onConfirm={handleDownload}
        onCancel={() => {
          setShowFilenameDialog(false);
          setProcessedPDF(null);
        }}
      />
      
      <div className="mx-auto max-w-4xl space-y-8">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isProcessing ? (
          <ProcessingIndicator progress={progress} message="Compressing your PDF..." />
        ) : (
          <>
            {files.length === 0 ? (
              <FileDropzone onFilesSelected={handleFilesSelected} accept=".pdf" multiple={false} />
            ) : (
              <>
                <FileList files={files} onRemove={removeFile} />
                
                {originalSize > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                          <p className="mb-2 text-sm text-muted-foreground">Original Size</p>
                          <p className="text-2xl font-bold">{formatFileSize(originalSize)}</p>
                        </div>
                        {compressedSize > 0 && (
                          <>
                            <div>
                              <p className="mb-2 text-sm text-muted-foreground">Compressed Size</p>
                              <p className="text-2xl font-bold text-primary">{formatFileSize(compressedSize)}</p>
                            </div>
                            <div className="sm:col-span-2">
                              <p className="mb-2 text-sm text-muted-foreground">Size Reduction</p>
                              <div className="flex items-center gap-3">
                                <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                                  <div 
                                    className="h-full bg-primary transition-all"
                                    style={{ width: `${compressionRatio}%` }}
                                  />
                                </div>
                                <span className="text-xl font-bold text-primary">{compressionRatio}%</span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" className="flex-1" onClick={handleCompress}>
                    Compress PDF
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => { clearFiles(); setCompressedSize(0); }}>
                    Clear
                  </Button>
                </div>
              </>
            )}
          </>
        )}

        <div className="rounded-2xl border bg-muted/30 p-6">
          <h3 className="mb-3 font-semibold">Compression features:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Smart compression algorithm</li>
            <li>• Maintains document quality</li>
            <li>• No data loss or formatting changes</li>
            <li>• Optimized for web and email sharing</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
