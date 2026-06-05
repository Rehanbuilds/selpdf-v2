'use client';

import { useState } from 'react';
import { Wrench, CheckCircle, AlertTriangle, FileText, HardDrive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { ToolLayout } from '@/components/pdf/tool-layout';
import { FileDropzone } from '@/components/pdf/file-dropzone';
import { FileList } from '@/components/pdf/file-list';
import { ProcessingIndicator } from '@/components/pdf/processing-indicator';
import { FilenameDialog } from '@/components/pdf/filename-dialog';
import { usePDFStore } from '@/lib/store/pdf-store';
import { repairPDF, downloadPDF } from '@/lib/pdf/utils';

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

export default function RepairPDFPage() {
  const { files, addFiles, removeFile, clearFiles, isProcessing, setProcessing, progress, setProgress, error, setError } = usePDFStore();
  const [showFilenameDialog, setShowFilenameDialog] = useState(false);
  const [processedPDF, setProcessedPDF] = useState<Uint8Array | null>(null);
  const [repairResult, setRepairResult] = useState<{
    pageCount: number; originalSize: number; repairedSize: number; issues: string[];
  } | null>(null);

  const handleFilesSelected = (newFiles: File[]) => {
    const pdfFiles = newFiles.filter(f => f.name.toLowerCase().endsWith('.pdf') || f.type === 'application/pdf');
    if (pdfFiles.length > 0) {
      clearFiles(); addFiles(pdfFiles.slice(0, 1)); setError(null); setRepairResult(null);
    } else {
      setError('Please select a PDF file.');
    }
  };

  const handleRepair = async () => {
    if (files.length === 0) { setError('Please select a PDF file to repair.'); return; }
    setProcessing(true); setError(null); setProgress(0); setRepairResult(null);

    try {
      setProgress(10);
      const file = files[0].file;
      setProgress(30);
      const result = await repairPDF(file);
      setProgress(80);
      setRepairResult({ pageCount: result.pageCount, originalSize: result.originalSize, repairedSize: result.repairedSize, issues: result.issues });
      setProcessedPDF(result.data);
      setProgress(100); setProcessing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to repair PDF. The file may be too severely corrupted.');
      setProcessing(false);
    }
  };

  const handleDownloadClick = () => { setShowFilenameDialog(true); };

  const handleDownload = (filename: string) => {
    if (processedPDF) {
      downloadPDF(processedPDF, filename); setShowFilenameDialog(false); setProcessedPDF(null);
      setTimeout(() => { clearFiles(); setRepairResult(null); }, 500);
    }
  };

  return (
    <ToolLayout title="Repair PDF" description="Fix and repair corrupted or damaged PDF files" icon={Wrench} color="bg-yellow-50 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400">
      <FilenameDialog open={showFilenameDialog} defaultFilename="repaired-document.pdf" onConfirm={handleDownload} onCancel={() => { setShowFilenameDialog(false); setProcessedPDF(null); }} />
      <div className="mx-auto max-w-4xl space-y-8">
        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
        {isProcessing ? <ProcessingIndicator progress={progress} message="Repairing your PDF..." /> : (
          <>
            {files.length === 0 ? (
              <FileDropzone onFilesSelected={handleFilesSelected} accept=".pdf" multiple={false} />
            ) : (
              <>
                <FileList files={files} onRemove={removeFile} />

                {repairResult ? (
                  <Card className="border-green-200 dark:border-green-900">
                    <CardContent className="space-y-6 p-6">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                          <CheckCircle className="size-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-green-700 dark:text-green-400">Repair Complete</h3>
                          <p className="text-sm text-muted-foreground">Your PDF has been successfully processed</p>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
                          <FileText className="size-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Pages</p>
                            <p className="text-lg font-bold">{repairResult.pageCount}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
                          <HardDrive className="size-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Original</p>
                            <p className="text-lg font-bold">{formatFileSize(repairResult.originalSize)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
                          <HardDrive className="size-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Repaired</p>
                            <p className="text-lg font-bold text-primary">{formatFileSize(repairResult.repairedSize)}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                          <AlertTriangle className="size-4 text-yellow-500" /> Diagnostic Log
                        </h4>
                        <div className="space-y-1.5 rounded-lg bg-muted/30 p-4">
                          {repairResult.issues.map((issue, i) => (
                            <p key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-yellow-500" />
                              {issue}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button size="lg" className="flex-1" onClick={handleDownloadClick}>Download Repaired PDF</Button>
                        <Button size="lg" variant="outline" onClick={() => { clearFiles(); setRepairResult(null); setProcessedPDF(null); }}>Process Another</Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button size="lg" className="flex-1" onClick={handleRepair}>Repair PDF</Button>
                    <Button size="lg" variant="outline" onClick={() => { clearFiles(); setRepairResult(null); }}>Clear</Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
        <div className="rounded-2xl border bg-muted/30 p-6">
          <h3 className="mb-3 font-semibold">Repair features:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Fixes broken cross-reference tables</li>
            <li>• Recovers pages from corrupted documents</li>
            <li>• Re-serializes with optimized object streams</li>
            <li>• Cleans and rebuilds document metadata</li>
            <li>• Handles encrypted PDFs gracefully</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
