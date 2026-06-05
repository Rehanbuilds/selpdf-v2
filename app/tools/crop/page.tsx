'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Crop } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { ToolLayout } from '@/components/pdf/tool-layout';
import { FileDropzone } from '@/components/pdf/file-dropzone';
import { FileList } from '@/components/pdf/file-list';
import { ProcessingIndicator } from '@/components/pdf/processing-indicator';
import { FilenameDialog } from '@/components/pdf/filename-dialog';
import { usePDFStore } from '@/lib/store/pdf-store';
import { cropPDF, downloadPDF } from '@/lib/pdf/utils';

export default function CropPDFPage() {
  const { files, addFiles, removeFile, clearFiles, isProcessing, setProcessing, progress, setProgress, error, setError } = usePDFStore();
  const [margins, setMargins] = useState({ top: 0, right: 0, bottom: 0, left: 0 });
  const [showFilenameDialog, setShowFilenameDialog] = useState(false);
  const [processedPDF, setProcessedPDF] = useState<Uint8Array | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<{ width: number; height: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Render PDF preview
  const renderPreview = useCallback(async (file: File) => {
    try {
      const pdfjsLib = await import('pdfjs-dist');
      if (typeof window !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      }
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.0 });

      setPageInfo({ width: Math.round(viewport.width), height: Math.round(viewport.height) });

      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext('2d');
      if (!context) return;

      const scale = Math.min(500 / viewport.width, 600 / viewport.height);
      const scaledViewport = page.getViewport({ scale });

      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;

      await page.render({
        canvasContext: context,
        viewport: scaledViewport,
      }).promise;
    } catch (err) {
      console.error('Preview error:', err);
    }
  }, []);

  useEffect(() => {
    if (files.length > 0) {
      renderPreview(files[0].file);
    } else {
      setPageInfo(null);
    }
  }, [files, renderPreview]);

  const handleFilesSelected = (newFiles: File[]) => {
    const pdfFiles = newFiles.filter((file) => file.type === 'application/pdf');
    if (pdfFiles.length > 0) {
      clearFiles();
      addFiles(pdfFiles.slice(0, 1));
      setError(null);
      setMargins({ top: 0, right: 0, bottom: 0, left: 0 });
    } else {
      setError('Please select a valid PDF file.');
    }
  };

  const handleCrop = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file to crop.');
      return;
    }

    if (margins.top === 0 && margins.right === 0 && margins.bottom === 0 && margins.left === 0) {
      setError('Please set at least one crop margin.');
      return;
    }

    setProcessing(true);
    setError(null);
    setProgress(0);

    try {
      setProgress(20);
      const file = files[0].file;
      
      setProgress(50);
      const croppedPdf = await cropPDF(file, margins);
      
      setProgress(90);
      setProcessedPDF(croppedPdf);
      setShowFilenameDialog(true);
      
      setProgress(100);
      setProcessing(false);
    } catch (err) {
      console.error('Crop error:', err);
      setError(err instanceof Error ? err.message : 'Failed to crop PDF. Please try again.');
      setProcessing(false);
    }
  };

  const handleDownload = (filename: string) => {
    if (processedPDF) {
      downloadPDF(processedPDF, filename);
      setShowFilenameDialog(false);
      setProcessedPDF(null);
      setTimeout(() => {
        clearFiles();
        setMargins({ top: 0, right: 0, bottom: 0, left: 0 });
      }, 500);
    }
  };

  const updateMargin = (side: keyof typeof margins, value: number) => {
    setMargins((prev) => ({ ...prev, [side]: Math.max(0, value) }));
  };

  // Calculate crop overlay for the canvas preview
  const getCropOverlay = () => {
    if (!canvasRef.current || !pageInfo) return null;
    const canvas = canvasRef.current;
    const scaleX = canvas.width / pageInfo.width;
    const scaleY = canvas.height / pageInfo.height;

    return {
      top: margins.top * scaleY,
      right: margins.right * scaleX,
      bottom: margins.bottom * scaleY,
      left: margins.left * scaleX,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
    };
  };

  const overlay = getCropOverlay();

  return (
    <ToolLayout
      title="Crop PDF"
      description="Crop and trim PDF page margins with precision"
      icon={Crop}
      color="bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400"
    >
      <FilenameDialog
        open={showFilenameDialog}
        defaultFilename="cropped-document.pdf"
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
          <ProcessingIndicator progress={progress} message="Cropping your PDF..." />
        ) : (
          <>
            {files.length === 0 ? (
              <FileDropzone onFilesSelected={handleFilesSelected} accept=".pdf" multiple={false} />
            ) : (
              <>
                <FileList files={files} onRemove={removeFile} />

                <div className="grid gap-8 lg:grid-cols-2">
                  {/* Preview Panel */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="mb-4 font-semibold">Preview</h3>
                      <div className="relative mx-auto inline-block overflow-hidden rounded-lg border bg-white">
                        <canvas ref={canvasRef} className="block max-w-full" />
                        {overlay && (
                          <>
                            {/* Top overlay */}
                            <div
                              className="absolute left-0 top-0 bg-red-500/25"
                              style={{ width: overlay.canvasWidth, height: overlay.top }}
                            />
                            {/* Bottom overlay */}
                            <div
                              className="absolute bottom-0 left-0 bg-red-500/25"
                              style={{ width: overlay.canvasWidth, height: overlay.bottom }}
                            />
                            {/* Left overlay */}
                            <div
                              className="absolute left-0 bg-red-500/25"
                              style={{ width: overlay.left, top: overlay.top, height: overlay.canvasHeight - overlay.top - overlay.bottom }}
                            />
                            {/* Right overlay */}
                            <div
                              className="absolute right-0 bg-red-500/25"
                              style={{ width: overlay.right, top: overlay.top, height: overlay.canvasHeight - overlay.top - overlay.bottom }}
                            />
                          </>
                        )}
                      </div>
                      {pageInfo && (
                        <p className="mt-3 text-center text-sm text-muted-foreground">
                          Page size: {pageInfo.width} × {pageInfo.height} pts
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Controls Panel */}
                  <Card>
                    <CardContent className="space-y-6 p-6">
                      <h3 className="font-semibold">Crop Margins (points)</h3>
                      <p className="text-sm text-muted-foreground">
                        Set how many points to trim from each edge. 72 points = 1 inch.
                      </p>

                      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
                        <div key={side} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="capitalize">{side}</Label>
                            <span className="text-sm font-medium tabular-nums">{margins[side]} pt</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <Slider
                              value={[margins[side]]}
                              onValueChange={([v]) => updateMargin(side, v)}
                              max={pageInfo ? (side === 'top' || side === 'bottom' ? Math.floor(pageInfo.height / 2) : Math.floor(pageInfo.width / 2)) : 300}
                              step={1}
                              className="flex-1"
                            />
                            <Input
                              type="number"
                              value={margins[side]}
                              onChange={(e) => updateMargin(side, Number(e.target.value))}
                              className="w-20"
                              min={0}
                            />
                          </div>
                        </div>
                      ))}

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            const v = 36;
                            setMargins({ top: v, right: v, bottom: v, left: v });
                          }}
                        >
                          Trim ½ inch
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            const v = 72;
                            setMargins({ top: v, right: v, bottom: v, left: v });
                          }}
                        >
                          Trim 1 inch
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setMargins({ top: 0, right: 0, bottom: 0, left: 0 })}
                        >
                          Reset
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" className="flex-1" onClick={handleCrop}>
                    Crop PDF
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => { clearFiles(); setMargins({ top: 0, right: 0, bottom: 0, left: 0 }); }}>
                    Clear
                  </Button>
                </div>
              </>
            )}
          </>
        )}

        <div className="rounded-2xl border bg-muted/30 p-6">
          <h3 className="mb-3 font-semibold">Crop features:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Set precise crop margins for each edge independently</li>
            <li>• Live visual preview with crop overlay</li>
            <li>• Quick presets for common trim sizes</li>
            <li>• Applies crop to all pages in the document</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
