'use client';

import { FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { PDFFile } from '@/lib/store/pdf-store';

interface FileListProps {
  files: PDFFile[];
  onRemove: (id: string) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

export function FileList({ files, onRemove }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Selected Files ({files.length})</h3>
      </div>
      
      <div className="space-y-2">
        {files.map((file, index) => (
          <Card key={file.id} className="group transition-colors hover:bg-muted/50">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="size-5 text-primary" />
              </div>
              
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(file.size)} • File {index + 1}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(file.id)}
                className="shrink-0"
              >
                <X className="size-4" />
                <span className="sr-only">Remove file</span>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
