'use client';

import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';

interface ProcessingIndicatorProps {
  progress: number;
  message?: string;
}

export function ProcessingIndicator({ progress, message = 'Processing your PDF...' }: ProcessingIndicatorProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
        <Loader2 className="size-12 animate-spin text-primary" />
        <div className="w-full max-w-md space-y-3">
          <p className="font-semibold">{message}</p>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">{Math.round(progress)}% complete</p>
        </div>
      </CardContent>
    </Card>
  );
}
