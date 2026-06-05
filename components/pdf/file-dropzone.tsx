'use client';

import React from "react"

import { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  className?: string;
}

export function FileDropzone({
  onFilesSelected,
  accept = '.pdf',
  multiple = true,
  maxSize = 200 * 1024 * 1024, // 200MB
  className,
}: FileDropzoneProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const droppedFiles = Array.from(e.dataTransfer.files).filter((file) => {
        if (accept && !accept.includes(file.type) && !accept.includes(`.${file.name.split('.').pop()}`)) {
          return false;
        }
        if (maxSize && file.size > maxSize) {
          return false;
        }
        return true;
      });

      if (droppedFiles.length > 0) {
        onFilesSelected(droppedFiles);
      }
    },
    [onFilesSelected, accept, maxSize]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFilesSelected(Array.from(files));
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={cn(
        'group relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-muted-foreground/25 bg-muted/30 p-12 text-center transition-all hover:border-primary/50 hover:bg-muted/50',
        className
      )}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInput}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
      
      <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
        <Upload className="size-10 text-primary" />
      </div>
      
      <div className="space-y-2">
        <p className="text-lg font-semibold">Drop your files here</p>
        <p className="text-sm text-muted-foreground">
          or click to browse from your device
        </p>
        <p className="text-xs text-muted-foreground">
          {accept.toUpperCase()} files • Max {Math.floor(maxSize / (1024 * 1024))}MB
        </p>
      </div>
    </div>
  );
}
