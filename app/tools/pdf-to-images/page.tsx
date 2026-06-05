'use client';

import { useState } from 'react';
import { ImageIcon } from 'lucide-react';
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

export default function PDFToImagesPage() {
  const { files, addFiles, removeFile, clearFiles, isProcessing, setProcessing, progress, setProgress, error, setError } = usePDFStore();
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [showFilenameDialog, setShowFilenameDialog] = useState(false);
  const [processedImages, setProcessedImages] = useState<{ data: Blob; filename: string }[] | null>(null);

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
      console.log('[v0] Starting PDF to Images conversion');
      setProgress(10);
      const file = files[0].file;
      
      setProgress(30);
      const { pdfToImages } = await import('@/lib/pdf/convert');
      const images = await pdfToImages(file, format);
      console.log('[v0] Conversion complete, generated', images.length, 'images');
      
      setProgress(80);
      const filenames = images.map((_, index) => `page-${index + 1}.${format}`);
      setProcessedImages(images.map((img, index) => ({ data: img, filename: filenames[index] })));
      setShowFilenameDialog(true);
      
      setProgress(100);
      setProcessing(false);
    } catch (err) {
      console.error('[v0] Conversion error:', err);
      setError(err instanceof Error ? err.message : 'Failed to convert PDF to images. Please try again.');
      setProcessing(false);
    }
  };

  const handleDownload = async (baseFilename: string) => {
    if (!processedImages) return;
    
    try {
      console.log('[v0] Starting image download as:', baseFilename);
      const { downloadZip } = await import('@/lib/pdf/convert');
      
      // Extract name without extension
      const nameWithoutExt = baseFilename.replace(/\.[^/.]+$/, '');
      const filenames = processedImages.map((_, index) => `${nameWithoutExt}-${index + 1}.${format}`);
      
      downloadZip(processedImages.map(img => img.data), filenames, nameWithoutExt);
      
      setShowFilenameDialog(false);
      setProcessedImages(null);
      setTimeout(() => {
        clearFiles();
      }, 500);
    } catch (err) {
      console.error('[v0] Download error:', err);
      setError('Failed to download images. Please try again.');
    }
  };

  return (
    <ToolLayout
      title="PDF to Images"
      description="Convert PDF pages to PNG or JPG images"
      icon={ImageIcon}
      color="bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400"
    >
      <FilenameDialog
        open={showFilenameDialog}
        defaultFilename={`pdf-images.${format}`}
        onConfirm={handleDownload}
        onCancel={() => {
          setShowFilenameDialog(false);
          setProcessedImages(null);
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
          <ProcessingIndicator progress={progress} message="Converting PDF to images..." />
        ) : (
          <>
            {files.length === 0 ? (
              <FileDropzone onFilesSelected={handleFilesSelected} accept=".pdf" multiple={false} />
            ) : (
              <>
                <FileList files={files} onRemove={removeFile} />
                
                <div className="space-y-4 rounded-2xl border bg-card p-6">
                  <Label className="text-base font-semibold">Output Format</Label>
                  <RadioGroup value={format} onValueChange={(value: 'png' | 'jpeg') => setFormat(value)}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex items-center space-x-2 rounded-lg border p-4">
                        <RadioGroupItem value="png" id="png" />
                        <Label htmlFor="png" className="cursor-pointer font-normal">
                          PNG (Lossless, larger file size)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-lg border p-4">
                        <RadioGroupItem value="jpeg" id="jpeg" />
                        <Label htmlFor="jpeg" className="cursor-pointer font-normal">
                          JPEG (Compressed, smaller file size)
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" className="flex-1" onClick={handleConvert}>
                    Convert to Images
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
          <h3 className="mb-3 font-semibold">Conversion features:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Extract all pages as separate images</li>
            <li>• Choose between PNG and JPEG formats</li>
            <li>• High-quality image output</li>
            <li>• Perfect for presentations and web use</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
