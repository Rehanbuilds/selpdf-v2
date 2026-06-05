import { create } from 'zustand';

export interface PDFFile {
  id: string;
  file: File;
  name: string;
  size: number;
  preview?: string;
}

interface PDFStore {
  files: PDFFile[];
  isProcessing: boolean;
  progress: number;
  error: string | null;
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  setProcessing: (isProcessing: boolean) => void;
  setProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  reorderFiles: (startIndex: number, endIndex: number) => void;
}

export const usePDFStore = create<PDFStore>((set) => ({
  files: [],
  isProcessing: false,
  progress: 0,
  error: null,
  
  addFiles: (newFiles: File[]) => {
    const pdfFiles: PDFFile[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      name: file.name,
      size: file.size,
    }));
    set((state) => ({ files: [...state.files, ...pdfFiles] }));
  },
  
  removeFile: (id: string) =>
    set((state) => ({ files: state.files.filter((file) => file.id !== id) })),
  
  clearFiles: () => set({ files: [], progress: 0, error: null }),
  
  setProcessing: (isProcessing: boolean) => set({ isProcessing }),
  
  setProgress: (progress: number) => set({ progress }),
  
  setError: (error: string | null) => set({ error }),
  
  reorderFiles: (startIndex: number, endIndex: number) =>
    set((state) => {
      const result = Array.from(state.files);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { files: result };
    }),
}));
