'use client';

import { useState, useRef, useCallback } from 'react';
import { Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolLayout } from '@/components/pdf/tool-layout';
import { ProcessingIndicator } from '@/components/pdf/processing-indicator';
import { FilenameDialog } from '@/components/pdf/filename-dialog';
import { downloadPDF } from '@/lib/pdf/utils';

const PAGE_SIZES: Record<string, { width: number; height: number; label: string }> = {
  a4: { width: 595, height: 842, label: 'A4 (210×297mm)' },
  letter: { width: 612, height: 792, label: 'Letter (8.5×11in)' },
  legal: { width: 612, height: 1008, label: 'Legal (8.5×14in)' },
  a3: { width: 842, height: 1191, label: 'A3 (297×420mm)' },
};

const DEFAULT_HTML = `<!DOCTYPE html>
<html><head><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', sans-serif; padding: 48px; color: #1a1a2e; }
.header { text-align: center; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 3px solid #e94560; }
.header h1 { font-size: 32px; color: #0f3460; margin-bottom: 8px; }
.header p { font-size: 14px; color: #666; }
.content { line-height: 1.8; font-size: 15px; }
.content h2 { color: #0f3460; font-size: 22px; margin: 24px 0 12px; }
.content p { margin-bottom: 16px; color: #333; }
.stats { display: flex; gap: 16px; margin: 24px 0; }
.stat-card { flex: 1; background: #f8f9fa; border-radius: 12px; padding: 20px; text-align: center; border: 1px solid #eee; }
.stat-card .number { font-size: 28px; font-weight: 700; color: #e94560; }
.stat-card .label { font-size: 12px; color: #888; margin-top: 4px; }
.footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #aaa; }
</style></head><body>
<div class="header"><h1>SelfPDF Report</h1><p>Generated with HTML to PDF</p></div>
<div class="content">
<h2>Overview</h2>
<p>This is a sample document created using the HTML to PDF converter. Edit the HTML and CSS to create your own professional PDFs.</p>
<div class="stats">
<div class="stat-card"><div class="number">100%</div><div class="label">Client-Side</div></div>
<div class="stat-card"><div class="number">Free</div><div class="label">No Cost</div></div>
<div class="stat-card"><div class="number">Private</div><div class="label">Secure</div></div>
</div>
<h2>How It Works</h2>
<p>Edit the HTML and CSS in the editor. The preview updates live. Click "Convert to PDF" to generate your document.</p>
</div>
<div class="footer">Created with SelfPDF</div>
</body></html>`;

export default function HtmlToPdfPage() {
  const [htmlContent, setHtmlContent] = useState(DEFAULT_HTML);
  const [pageSize, setPageSize] = useState('a4');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showFilenameDialog, setShowFilenameDialog] = useState(false);
  const [processedPDF, setProcessedPDF] = useState<Uint8Array | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleConvert = async () => {
    if (!htmlContent.trim()) { setError('Please enter some HTML content.'); return; }
    setIsProcessing(true); setError(null); setProgress(0);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const size = PAGE_SIZES[pageSize];
      setProgress(10);

      const offscreen = document.createElement('iframe');
      offscreen.style.cssText = 'position:fixed;left:-9999px;top:-9999px;border:none;';
      offscreen.style.width = `${size.width}px`;
      offscreen.style.height = `${size.height}px`;
      document.body.appendChild(offscreen);

      const oDoc = offscreen.contentDocument!;
      oDoc.open(); oDoc.write(htmlContent); oDoc.close();
      await new Promise(r => setTimeout(r, 800));
      setProgress(30);

      const contentHeight = Math.max(oDoc.body.scrollHeight, oDoc.documentElement.scrollHeight);
      const pageCount = Math.max(1, Math.ceil(contentHeight / size.height));
      const pdfDoc = await PDFDocument.create();

      for (let i = 0; i < pageCount; i++) {
        setProgress(30 + (i / pageCount) * 60);
        offscreen.contentWindow?.scrollTo(0, i * size.height);
        await new Promise(r => setTimeout(r, 300));

        const canvas = document.createElement('canvas');
        const sc = 2;
        canvas.width = size.width * sc; canvas.height = size.height * sc;
        const ctx = canvas.getContext('2d')!;
        ctx.scale(sc, sc); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, size.width, size.height);

        const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}"><foreignObject width="100%" height="100%">${new XMLSerializer().serializeToString(oDoc.documentElement)}</foreignObject></svg>`;
        const url = URL.createObjectURL(new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' }));
        const img = new Image();
        await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = () => rej(new Error('Render failed')); img.src = url; });
        ctx.drawImage(img, 0, -i * size.height);
        URL.revokeObjectURL(url);

        const pngBlob = await new Promise<Blob>(res => canvas.toBlob(b => res(b || new Blob()), 'image/png'));
        const pngImage = await pdfDoc.embedPng(await pngBlob.arrayBuffer());
        const page = pdfDoc.addPage([size.width, size.height]);
        page.drawImage(pngImage, { x: 0, y: 0, width: size.width, height: size.height });
      }

      document.body.removeChild(offscreen);
      setProgress(95);
      const pdfBytes = await pdfDoc.save();
      setProcessedPDF(pdfBytes);
      setShowFilenameDialog(true);
      setProgress(100); setIsProcessing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert HTML to PDF.');
      setIsProcessing(false);
    }
  };

  const handleDownload = (filename: string) => {
    if (processedPDF) { downloadPDF(processedPDF, filename); setShowFilenameDialog(false); setProcessedPDF(null); }
  };

  return (
    <ToolLayout title="HTML to PDF" description="Convert HTML & CSS code into a professional PDF document" icon={Code} color="bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-950 dark:text-fuchsia-400">
      <FilenameDialog open={showFilenameDialog} defaultFilename="html-document.pdf" onConfirm={handleDownload} onCancel={() => { setShowFilenameDialog(false); setProcessedPDF(null); }} />
      <div className="mx-auto max-w-6xl space-y-6">
        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
        {isProcessing ? <ProcessingIndicator progress={progress} message="Converting HTML to PDF..." /> : (
          <>
            <Card><CardContent className="flex flex-wrap items-center gap-4 p-4">
              <div className="flex items-center gap-2">
                <Label>Page Size</Label>
                <Select value={pageSize} onValueChange={setPageSize}>
                  <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(PAGE_SIZES).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="ml-auto flex gap-2">
                <Button variant="outline" onClick={() => setHtmlContent(DEFAULT_HTML)}>Reset Template</Button>
                <Button onClick={handleConvert}>Convert to PDF</Button>
              </div>
            </CardContent></Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="flex flex-col"><CardContent className="flex flex-1 flex-col p-0">
                <div className="flex items-center gap-2 border-b px-4 py-3">
                  <div className="flex gap-1.5"><div className="size-3 rounded-full bg-red-400" /><div className="size-3 rounded-full bg-yellow-400" /><div className="size-3 rounded-full bg-green-400" /></div>
                  <span className="text-sm font-medium text-muted-foreground">HTML Editor</span>
                </div>
                <textarea value={htmlContent} onChange={e => setHtmlContent(e.target.value)} className="min-h-[500px] flex-1 resize-none border-none bg-[#1e1e2e] p-4 font-mono text-sm text-[#cdd6f4] outline-none" spellCheck={false} />
              </CardContent></Card>

              <Card className="flex flex-col"><CardContent className="flex flex-1 flex-col p-0">
                <div className="flex items-center gap-2 border-b px-4 py-3"><span className="text-sm font-medium text-muted-foreground">Live Preview</span></div>
                <div className="flex-1 overflow-auto bg-white"><iframe ref={iframeRef} srcDoc={htmlContent} className="h-full min-h-[500px] w-full border-none" sandbox="allow-same-origin" title="HTML Preview" /></div>
              </CardContent></Card>
            </div>
          </>
        )}
        <div className="rounded-2xl border bg-muted/30 p-6">
          <h3 className="mb-3 font-semibold">HTML to PDF features:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Write custom HTML & CSS to design your PDF</li>
            <li>• Live preview updates as you type</li>
            <li>• Multiple page size options (A4, Letter, Legal, A3)</li>
            <li>• High-quality 2x DPI rendering</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
