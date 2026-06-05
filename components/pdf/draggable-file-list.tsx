'use client';

import { FileText, GripVertical, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { PDFFile } from '@/lib/store/pdf-store';
import { useState } from 'react';

interface DraggableFileListProps {
  files: PDFFile[];
  onRemove: (id: string) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

export function DraggableFileList({ files, onRemove, onReorder }: DraggableFileListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  if (files.length === 0) return null;

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      console.log('[v0] Reordering files from', draggedIndex, 'to', targetIndex);
      onReorder(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Selected Files ({files.length})</h3>
        <p className="text-xs text-muted-foreground">Drag to reorder</p>
      </div>
      
      <div className="space-y-2">
        {files.map((file, index) => (
          <Card
            key={file.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`group transition-all cursor-move ${
              draggedIndex === index 
                ? 'opacity-50 bg-muted' 
                : 'hover:bg-muted/50'
            }`}
          >
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex shrink-0 items-center justify-center text-muted-foreground hover:text-foreground">
                <GripVertical className="size-5" />
              </div>

              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="size-5 text-primary" />
              </div>
              
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(file.size)} • Position {index + 1}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold text-primary bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center">
                  {index + 1}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(file.id)}
                  className="shrink-0"
                >
                  <X className="size-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center bg-muted/30 rounded-lg p-3">
        Files will be processed in the order shown (1, 2, 3...)
      </p>
    </div>
  );
}
