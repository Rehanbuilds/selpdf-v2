'use client';

import { useState } from 'react';
import { RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ToolLayout } from '@/components/pdf/tool-layout';
import { FileDropzone } from '@/components/pdf/file-dropzone';
import { FileList } from '@/components/pdf/file-list';
import { ProcessingIndicator } from '@/components/pdf/processing-indicator';
import { FilenameDialog } from '@/components/pdf/filename-dialog';
import { usePDFStore } from '@/lib/store/pdf-store';
import { rotatePDF, downloadPDF } from '@/lib/pdf/utils';

export default function RotatePDFPage() {
  const { files, addFiles, removeFile, clearFiles, isProcessing, setProcessing, progress, setProgress, error, setError } = usePDFStore();
  const [rotation, setRotation] = useState<'90' | '180' | '270'>('90');
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

  const handleRotate = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file to rotate.');
      return;
    }

    setProcessing(true);
    setError(null);
    setProgress(0);

    try {
      console.log('[v0] Starting rotation');
      setProgress(10);
      const file = files[0].file;
      
      setProgress(30);
      const rotatedPdf = await rotatePDF(file, Number.parseInt(rotation, 10) as 90 | 180 | 270);
      console.log('[v0] Rotation complete');
      
      setProgress(80);
      setProcessedPDF(rotatedPdf);
      setShowFilenameDialog(true);
      
      setProgress(100);
      setProcessing(false);
    } catch (err) {
      console.error('[v0] Rotation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to rotate PDF. Please try again.');
      setProcessing(false);
    }
  };

  const handleDownload = (filename: string) => {
    if (processedPDF) {
      console.log('[v0] Downloading rotated PDF as:', filename);
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
      title="Rotate PDF"
      description="Rotate PDF pages clockwise"
      icon={RotateCw}
      color="bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400"
    >
      <FilenameDialog
        open={showFilenameDialog}
        defaultFilename="rotated-document.pdf"
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
          <ProcessingIndicator progress={progress} message="Rotating your PDF..." />
        ) : (
          <>
            {files.length === 0 ? (
              <FileDropzone onFilesSelected={handleFilesSelected} accept=".pdf" multiple={false} />
            ) : (
              <>
                <FileList files={files} onRemove={removeFile} />
                
                <Card>
                  <CardContent className="p-6">
                    <Label className="mb-4 block text-base font-semibold">Rotation Angle</Label>
                    <RadioGroup value={rotation} onValueChange={(value: '90' | '180' | '270') => setRotation(value)}>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="flex items-center space-x-2 rounded-lg border p-4">
                          <RadioGroupItem value="90" id="90" />
                          <Label htmlFor="90" className="cursor-pointer font-normal">
                            90° Clockwise
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-lg border p-4">
                          <RadioGroupItem value="180" id="180" />
                          <Label htmlFor="180" className="cursor-pointer font-normal">
                            180° (Upside down)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-lg border p-4">
                          <RadioGroupItem value="270" id="270" />
                          <Label htmlFor="270" className="cursor-pointer font-normal">
                            270° Clockwise
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
                
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" className="flex-1" onClick={handleRotate}>
                    Rotate PDF
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
          <h3 className="mb-3 font-semibold">Rotation options:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Rotate all pages by 90°, 180°, or 270°</li>
            <li>• Maintains document quality</li>
            <li>• Perfect for fixing scanned documents</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
