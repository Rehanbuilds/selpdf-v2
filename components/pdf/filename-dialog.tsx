'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FilenameDialogProps {
  open: boolean;
  defaultFilename: string;
  onConfirm: (filename: string) => void;
  onCancel: () => void;
}

export function FilenameDialog({
  open,
  defaultFilename,
  onConfirm,
  onCancel,
}: FilenameDialogProps) {
  const [filename, setFilename] = useState(defaultFilename);

  const handleConfirm = () => {
    // Remove .pdf extension if user added it
    let cleanFilename = filename.trim();
    if (cleanFilename.toLowerCase().endsWith('.pdf')) {
      cleanFilename = cleanFilename.slice(0, -4);
    }
    
    // Add .pdf extension back
    onConfirm(cleanFilename ? `${cleanFilename}.pdf` : defaultFilename);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save PDF</DialogTitle>
          <DialogDescription>
            Enter a name for your PDF file
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-2">
          <Label htmlFor="filename">Filename</Label>
          <div className="flex gap-2">
            <Input
              id="filename"
              value={filename.replace('.pdf', '')}
              onChange={(e) => setFilename(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter filename"
              autoFocus
            />
            <span className="flex items-center text-muted-foreground">.pdf</span>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
