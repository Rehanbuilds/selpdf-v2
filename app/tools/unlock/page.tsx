'use client';

import { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, LockKeyhole, AlertCircle, Info, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ToolLayout } from '@/components/pdf/tool-layout';
import { FileDropzone } from '@/components/pdf/file-dropzone';
import { FileList } from '@/components/pdf/file-list';
import { ProcessingIndicator } from '@/components/pdf/processing-indicator';
import { FilenameDialog } from '@/components/pdf/filename-dialog';
import { usePDFStore } from '@/lib/store/pdf-store';
import { downloadPDF } from '@/lib/pdf/utils';
import { decryptPDF, isEncrypted } from '@pdfsmaller/pdf-decrypt';

interface EncryptionStatus {
  encrypted: boolean;
  algorithm?: 'AES-256' | 'RC4';
}

export default function UnlockPDFPage() {
  const { files, addFiles, removeFile, clearFiles, isProcessing, setProcessing, progress, setProgress, error, setError } = usePDFStore();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showFilenameDialog, setShowFilenameDialog] = useState(false);
  const [processedPDF, setProcessedPDF] = useState<Uint8Array | null>(null);
  const [isCheckingEncryption, setIsCheckingEncryption] = useState(false);
  const [encryptionInfo, setEncryptionInfo] = useState<EncryptionStatus | null>(null);

  const handleFilesSelected = async (newFiles: File[]) => {
    const pdfFiles = newFiles.filter((file) => file.type === 'application/pdf');
    if (pdfFiles.length > 0) {
      const selectedFile = pdfFiles[0];
      addFiles([selectedFile]);
      setError(null);
      setEncryptionInfo(null);
      setIsCheckingEncryption(true);
      
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const info = await isEncrypted(new Uint8Array(arrayBuffer));
        setEncryptionInfo(info);
        if (!info.encrypted) {
          setError('This PDF is not password protected. There is no need to unlock it.');
        }
      } catch (err) {
        console.error('Error checking encryption:', err);
        setError('Failed to check if PDF is encrypted.');
      } finally {
        setIsCheckingEncryption(false);
      }
    } else {
      setError('Please select a valid PDF file.');
    }
  };

  const handleRemoveFile = (id: string) => {
    removeFile(id);
    setEncryptionInfo(null);
    setError(null);
    setPassword('');
  };

  const handleClear = () => {
    clearFiles();
    setEncryptionInfo(null);
    setError(null);
    setPassword('');
  };

  const handleUnlock = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file to unlock.');
      return;
    }

    if (!password) {
      setError('Please enter the PDF password.');
      return;
    }

    setProcessing(true);
    setError(null);
    setProgress(0);

    try {
      console.log('[v0] Starting PDF unlock');
      setProgress(20);
      const file = files[0].file;
      
      setProgress(40);
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      setProgress(65);
      // Double check if encrypted
      const info = await isEncrypted(uint8Array);
      if (!info.encrypted) {
        throw new Error('This PDF is not password protected.');
      }
      
      setProgress(80);
      console.log('[v0] Decrypting PDF with password');
      const unlockedPdf = await decryptPDF(uint8Array, password);
      console.log('[v0] PDF unlocked successfully, size:', unlockedPdf.length, 'bytes');
      
      setProgress(95);
      setProcessedPDF(unlockedPdf);
      setShowFilenameDialog(true);
      
      setProgress(100);
      setProcessing(false);
    } catch (err) {
      console.error('[v0] Unlock error:', err);
      setError(err instanceof Error ? err.message : 'Failed to unlock PDF. Please check the password and try again.');
      setProcessing(false);
    }
  };

  const handleDownload = (filename: string) => {
    if (processedPDF) {
      console.log('[v0] Downloading unlocked PDF as:', filename);
      downloadPDF(processedPDF, filename);
      setShowFilenameDialog(false);
      setProcessedPDF(null);
      setTimeout(() => {
        handleClear();
      }, 500);
    }
  };

  return (
    <ToolLayout
      title="Unlock PDF"
      description="Remove password protection from PDF files"
      icon={Lock}
      color="bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
    >
      <FilenameDialog
        open={showFilenameDialog}
        defaultFilename="unlocked-document.pdf"
        onConfirm={handleDownload}
        onCancel={() => {
          setShowFilenameDialog(false);
          setProcessedPDF(null);
          handleClear();
        }}
      />

      <div className="mx-auto max-w-4xl space-y-8">
        {error && (
          <Alert variant={encryptionInfo && !encryptionInfo.encrypted ? 'default' : 'destructive'}>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isProcessing ? (
          <ProcessingIndicator progress={progress} message="Unlocking your PDF..." />
        ) : (
          <>
            {files.length === 0 ? (
              <FileDropzone onFilesSelected={handleFilesSelected} accept=".pdf" multiple={false} />
            ) : (
              <>
                <FileList files={files} onRemove={handleRemoveFile} />
                
                <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
                  {isCheckingEncryption ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                      <Info className="size-4 animate-spin" /> Checking PDF encryption status...
                    </div>
                  ) : encryptionInfo ? (
                    encryptionInfo.encrypted ? (
                      <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 font-medium animate-fade-in">
                        <AlertCircle className="size-4 animate-bounce-slow" /> Detected: Password Protected (Encrypted using {encryptionInfo.algorithm || 'AES-256'})
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                        <Check className="size-4" /> This PDF is not password protected.
                      </div>
                    )
                  ) : null}

                  {encryptionInfo?.encrypted && (
                    <>
                      <div>
                        <Label htmlFor="password">PDF Password</Label>
                        <div className="relative mt-2">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter the PDF password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isProcessing}
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isProcessing}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                          >
                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3 sm:flex-row pt-2">
                        <Button onClick={handleUnlock} disabled={isProcessing || !password} size="lg" className="flex-1 font-semibold">
                          Unlock PDF
                        </Button>
                        <Button size="lg" variant="outline" onClick={handleClear} disabled={isProcessing} className="flex-1">
                          Clear
                        </Button>
                      </div>
                    </>
                  )}

                  {encryptionInfo && !encryptionInfo.encrypted && (
                    <div className="flex flex-col gap-3 sm:flex-row pt-2">
                      <Button size="lg" variant="outline" onClick={handleClear} className="w-full font-semibold">
                        Clear
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex gap-3 rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
              <Lock className="size-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Remove PDF Protection</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Decrypt security restrictions and clear user passwords completely.</p>
            </div>
          </div>
          <div className="flex gap-3 rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
              <LockKeyhole className="size-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Local Decryption</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Decryption computes instantly in the browser. Zero server data exchange.</p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
