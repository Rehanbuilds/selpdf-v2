'use client';

import { useState, useRef, useCallback } from 'react';
import { ScanLine, Plus, X, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ToolLayout } from '@/components/pdf/tool-layout';
import { ProcessingIndicator } from '@/components/pdf/processing-indicator';
import { FilenameDialog } from '@/components/pdf/filename-dialog';
import { downloadPDF } from '@/lib/pdf/utils';

interface ScanImage {
  id: string;
  file: File;
  originalUrl: string;
  processedUrl: string | null;
}

export default function ScanPDFPage() {
  const [images, setImages] = useState<ScanImage[]>([]);
  const [grayscale, setGrayscale] = useState(true);
  const [contrast, setContrast] = useState(130);
  const [brightness, setBrightness] = useState(110);
  const [threshold, setThreshold] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showFilenameDialog, setShowFilenameDialog] = useState(false);
  const [processedPDF, setProcessedPDF] = useState<Uint8Array | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    const newImages: ScanImage[] = Array.from(fileList)
      .filter(f => f.type.startsWith('image/'))
      .map(f => ({ id: Math.random().toString(36).substring(7), file: f, originalUrl: URL.createObjectURL(f), processedUrl: null }));
    if (newImages.length === 0) { setError('Please select image files (JPG, PNG).'); return; }
    setImages(prev => [...prev, ...newImages]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) { URL.revokeObjectURL(img.originalUrl); if (img.processedUrl) URL.revokeObjectURL(img.processedUrl); }
      return prev.filter(i => i.id !== id);
    });
  };

  const applyFilter = useCallback((img: HTMLImageElement): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.filter = `contrast(${contrast}%) brightness(${brightness}%)${grayscale ? ' grayscale(100%)' : ''}`;
    ctx.drawImage(img, 0, 0);

    if (threshold > 0) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const t = threshold;
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const val = avg > t ? 255 : 0;
        data[i] = data[i + 1] = data[i + 2] = val;
      }
      ctx.putImageData(imageData, 0, 0);
    }
    return canvas;
  }, [contrast, brightness, grayscale, threshold]);

  const handleConvert = async () => {
    if (images.length === 0) { setError('Please add at least one image.'); return; }
    setIsProcessing(true); setError(null); setProgress(0);

    try {
      const { PDFDocument } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.create();

      for (let i = 0; i < images.length; i++) {
        setProgress((i / images.length) * 90);
        const img = new Image();
        await new Promise<void>((res, rej) => {
          img.onload = () => res(); img.onerror = () => rej(new Error('Failed to load image'));
          img.src = images[i].originalUrl;
        });

        const canvas = applyFilter(img);
        const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b || new Blob()), 'image/png'));
        const buffer = await blob.arrayBuffer();
        const pngImage = await pdfDoc.embedPng(buffer);

        // A4 page at 72 DPI
        const pageWidth = 595; const pageHeight = 842;
        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        const scale = Math.min((pageWidth - 40) / pngImage.width, (pageHeight - 40) / pngImage.height, 1);
        const w = pngImage.width * scale; const h = pngImage.height * scale;
        page.drawImage(pngImage, { x: (pageWidth - w) / 2, y: (pageHeight - h) / 2, width: w, height: h });
      }

      setProgress(95);
      const pdfBytes = await pdfDoc.save();
      setProcessedPDF(pdfBytes);
      setShowFilenameDialog(true);
      setProgress(100); setIsProcessing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create scanned PDF.');
      setIsProcessing(false);
    }
  };

  const handleDownload = (filename: string) => {
    if (processedPDF) { downloadPDF(processedPDF, filename); setShowFilenameDialog(false); setProcessedPDF(null); }
  };

  // Generate a preview of the filter on a small canvas
  const previewFilter = (originalUrl: string, imgEl: HTMLImageElement | null) => {
    if (!imgEl) return {};
    return {
      filter: `contrast(${contrast}%) brightness(${brightness}%)${grayscale ? ' grayscale(100%)' : ''}`,
    };
  };

  return (
    <ToolLayout title="Scan PDF" description="Scan images into a clean, professional PDF document" icon={ScanLine} color="bg-stone-50 text-stone-600 dark:bg-stone-950 dark:text-stone-400">
      <FilenameDialog open={showFilenameDialog} defaultFilename="scanned-document.pdf" onConfirm={handleDownload} onCancel={() => { setShowFilenameDialog(false); setProcessedPDF(null); }} />
      <div className="mx-auto max-w-5xl space-y-8">
        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
        {isProcessing ? <ProcessingIndicator progress={progress} message="Creating scanned PDF..." /> : (
          <>
            {/* Upload Area */}
            <div className="group relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-muted-foreground/25 bg-muted/30 p-8 text-center transition-all hover:border-primary/50 hover:bg-muted/50">
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFilesSelected} className="absolute inset-0 cursor-pointer opacity-0" />
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                <ScanLine className="size-8 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-semibold">Drop images or click to upload</p>
                <p className="text-sm text-muted-foreground">JPG, PNG • Take a photo or select from device</p>
              </div>
            </div>

            {images.length > 0 && (
              <>
                {/* Filter Controls */}
                <Card>
                  <CardContent className="space-y-5 p-6">
                    <h3 className="font-semibold">Scan Filters</h3>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex justify-between"><Label>Contrast</Label><span className="text-sm tabular-nums">{contrast}%</span></div>
                        <Slider value={[contrast]} onValueChange={([v]) => setContrast(v)} min={50} max={250} step={5} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between"><Label>Brightness</Label><span className="text-sm tabular-nums">{brightness}%</span></div>
                        <Slider value={[brightness]} onValueChange={([v]) => setBrightness(v)} min={50} max={200} step={5} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between"><Label>B&W Threshold</Label><span className="text-sm tabular-nums">{threshold === 0 ? 'Off' : threshold}</span></div>
                        <Slider value={[threshold]} onValueChange={([v]) => setThreshold(v)} min={0} max={255} step={5} />
                      </div>
                      <div className="flex items-center justify-between rounded-lg border p-3">
                        <Label>Grayscale</Label>
                        <Switch checked={grayscale} onCheckedChange={setGrayscale} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Image Previews */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Scanned Pages ({images.length})</h3>
                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                      <Plus className="mr-1 size-4" /> Add More
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {images.map((img, idx) => (
                      <Card key={img.id} className="group relative overflow-hidden">
                        <CardContent className="p-3">
                          <div className="relative mb-2 overflow-hidden rounded-lg bg-gray-100">
                            <img
                              src={img.originalUrl}
                              alt={`Page ${idx + 1}`}
                              className="h-48 w-full object-contain"
                              style={{ filter: `contrast(${contrast}%) brightness(${brightness}%)${grayscale ? ' grayscale(100%)' : ''}` }}
                            />
                            <button onClick={() => removeImage(img.id)} className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80">
                              <X className="size-4" />
                            </button>
                          </div>
                          <p className="truncate text-sm text-muted-foreground">Page {idx + 1} — {img.file.name}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" className="flex-1" onClick={handleConvert}>Create Scanned PDF</Button>
                  <Button size="lg" variant="outline" onClick={() => { images.forEach(i => { URL.revokeObjectURL(i.originalUrl); }); setImages([]); }}>Clear All</Button>
                </div>
              </>
            )}
          </>
        )}
        <div className="rounded-2xl border bg-muted/30 p-6">
          <h3 className="mb-3 font-semibold">Scan features:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Upload photos or images from your device</li>
            <li>• Adjustable contrast, brightness, and threshold filters</li>
            <li>• Grayscale and black & white modes</li>
            <li>• Live filter preview on all images</li>
            <li>• Combines all images into a single A4 PDF</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
