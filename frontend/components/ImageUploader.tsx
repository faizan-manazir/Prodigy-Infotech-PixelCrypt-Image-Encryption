'use client';

import { useEffect, useState } from 'react';
import { UploadCloud, FileImage, X } from 'lucide-react';
import clsx from 'clsx';

interface ImageUploaderProps {
  onImageSelected: (file: File | null) => void;
  selectedFile: File | null;
  label?: string;
  onError?: (message: string) => void;
}

const VALID_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'];
const MAX_SIZE = 10 * 1024 * 1024;

export default function ImageUploader({ onImageSelected, selectedFile, label = 'Upload Image', onError }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const validateAndSetFile = (file: File) => {
    if (!VALID_TYPES.includes(file.type)) {
      onError?.('Unsupported file type. Please upload a PNG, JPG, JPEG, WEBP, or BMP image.');
      return;
    }
    if (file.size > MAX_SIZE) {
      onError?.('File is too large. The maximum upload size is 10 MB.');
      return;
    }
    onImageSelected(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) validateAndSetFile(e.dataTransfer.files[0]);
  };

  if (selectedFile) {
    return (
      <div className="w-full glass-panel rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden group border border-primary/30">
        {previewUrl && (
          <div className="mb-4 h-48 w-full overflow-hidden rounded-lg border border-white/10 bg-black/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Selected image preview" className="h-full w-full object-contain" />
          </div>
        )}
        <div className="flex items-center gap-3">
          <FileImage className="h-9 w-9 text-primary" />
          <div className="min-w-0">
            <p className="text-white font-medium truncate max-w-[240px]">{selectedFile.name}</p>
            <p className="text-muted text-sm">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
          </div>
        </div>
        <button onClick={() => onImageSelected(null)} className="absolute top-3 right-3 p-1.5 rounded-full bg-surface hover:bg-danger text-muted hover:text-white transition-colors" aria-label="Remove selected image">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer relative',
        isDragging ? 'border-primary bg-primary/10' : 'border-white/20 bg-surface/30 hover:border-primary/50 hover:bg-surface/60'
      )}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
      onDrop={handleDrop}
    >
      <input type="file" accept="image/png,image/jpeg,image/webp,image/bmp" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])} />
      <UploadCloud className={clsx('w-12 h-12 mb-4 transition-colors', isDragging ? 'text-primary' : 'text-muted')} />
      <h3 className="text-lg font-medium text-white mb-1">{label}</h3>
      <p className="text-sm text-muted text-center px-4">
        Drag & drop here or click to browse
        <span className="text-xs mt-2 block opacity-70">PNG, JPG, JPEG, WEBP, BMP • Maximum 10 MB</span>
      </p>
    </div>
  );
}
