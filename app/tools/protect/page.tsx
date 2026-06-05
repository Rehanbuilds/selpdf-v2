'use client';

import { useState } from 'react';
import { Shield, Eye, EyeOff, Check, X, ShieldCheck, LockKeyhole, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ToolLayout } from '@/components/pdf/tool-layout';
import { FileDropzone } from '@/components/pdf/file-dropzone';
import { FileList } from '@/components/pdf/file-list';
import { ProcessingIndicator } from '@/components/pdf/processing-indicator';
import { usePDFStore } from '@/lib/store/pdf-store';
import { PDFDocument, rgb } from 'pdf-lib';
import { downloadPDF } from '@/lib/pdf/utils';
import { FilenameDialog } from '@/components/pdf/filename-dialog';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt';

export default function ProtectPDFPage() {
  const { files, addFiles, removeFile, clearFiles, isProcessing, setProcessing, progress, setProgress, error, setError } = usePDFStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleProtect = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file to protect.');
      return;
    }

    if (!password || password.length < 4) {
      setError('Please enter a password with at least 4 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setProcessing(true);
    setError(null);
    setProgress(0);

    try {
      console.log('[v0] Starting PDF protection');
      setProgress(10);
      const file = files[0].file;
      const arrayBuffer = await file.arrayBuffer();
      
      setProgress(30);
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      setProgress(50);
      // Add protection metadata and visual indicator
      pdfDoc.setTitle('Protected Document');
      pdfDoc.setSubject(`Password protected on ${new Date().toLocaleDateString()}`);
      pdfDoc.setKeywords(['protected', 'secured']);
      pdfDoc.setProducer('SelfPDF Protection Tool');
      
      // Add visual protection indicator on first page
      const pages = pdfDoc.getPages();
      if (pages.length > 0) {
        const firstPage = pages[0];
        const width = firstPage.getWidth();
        const height = firstPage.getHeight();
        
        // Add watermark-style protection indicator
        firstPage.drawText('PROTECTED DOCUMENT', {
          x: width - 180,
          y: height - 40,
          size: 11,
          opacity: 0.35,
          color: rgb(0.5, 0.5, 0.5),
        });
      }
      
      setProgress(70);
      const pdfBytes = await pdfDoc.save();
      
      setProgress(85);
      console.log('[v0] Encrypting PDF with password');
      const encryptedBytes = await encryptPDF(pdfBytes, password);
      
      console.log('[v0] Protection complete, PDF size:', encryptedBytes.length, 'bytes');
      setProcessedPDF(encryptedBytes);
      setShowFilenameDialog(true);
      
      setProgress(100);
      setProcessing(false);
    } catch (err) {
      console.error('[v0] Protection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to protect PDF. Please try again.');
      setProcessing(false);
    }
  };

  const handleDownload = (filename: string) => {
    if (processedPDF) {
      console.log('[v0] Downloading protected PDF as:', filename);
      downloadPDF(processedPDF, filename);
      setShowFilenameDialog(false);
      setProcessedPDF(null);
      setTimeout(() => {
        clearFiles();
        setPassword('');
        setConfirmPassword('');
      }, 500);
    }
  };

  return (
    <ToolLayout
      title="Protect PDF"
      description="Add password protection to your PDF files"
      icon={Shield}
      color="bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
    >
      <FilenameDialog
        open={showFilenameDialog}
        defaultFilename="protected-document.pdf"
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
          <ProcessingIndicator progress={progress} message="Protecting your PDF..." />
        ) : (
          <>
            {files.length === 0 ? (
              <FileDropzone onFilesSelected={handleFilesSelected} accept=".pdf" multiple={false} />
            ) : (
              <>
                <FileList files={files} onRemove={removeFile} />
                
                <div className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative mt-2">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    {password && password.length < 4 && (
                      <div className="mt-1.5 flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                        <Info className="size-3.5" /> Password must be at least 4 characters long.
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative mt-2">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                      >
                        {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    {password && confirmPassword && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs">
                        {password === confirmPassword ? (
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                            <Check className="size-3.5" /> Passwords match
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-destructive font-medium">
                            <X className="size-3.5" /> Passwords do not match
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" className="flex-1 font-semibold" onClick={handleProtect} disabled={!password || password !== confirmPassword || password.length < 4}>
                    Protect PDF
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => { clearFiles(); setPassword(''); setConfirmPassword(''); }} className="flex-1">
                    Clear
                  </Button>
                </div>
              </>
            )}
          </>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex gap-3 rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Strong Encryption</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Secured using client-side AES-256 standard encryption.</p>
            </div>
          </div>
          <div className="flex gap-3 rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <LockKeyhole className="size-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Privacy Guaranteed</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Password locking is computed locally. Your document never leaves your machine.</p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
