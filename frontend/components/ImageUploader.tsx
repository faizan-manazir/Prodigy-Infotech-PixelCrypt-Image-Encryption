'use client';

import { useState } from 'react';
import { UploadCloud, FileImage, X } from 'lucide-react';
import clsx from 'clsx';

interface ImageUploaderProps {
  onImageSelected: (file: File | null) => void;
  selectedFile: File | null;
  label?: string;
}

export default function ImageUploader({ onImageSelected, selectedFile, label = "Upload Image" }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Basic validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'];
    if (!validTypes.includes(file.type)) {
      alert("Unsupported file type. Please upload a JPG, PNG, WEBP, or BMP.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Maximum size is 10MB.");
      return;
    }
    onImageSelected(file);
  };

  if (selectedFile) {
    return (
      <div className="w-full glass-panel rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden group border border-primary/30">
        <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
        <FileImage className="w-12 h-12 text-primary mb-3 relative z-10" />
        <p className="text-white font-medium truncate max-w-full px-4 relative z-10">{selectedFile.name}</p>
        <p className="text-muted text-sm mt-1 relative z-10">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
        
        <button 
          onClick={() => onImageSelected(null)}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-surface hover:bg-danger text-muted hover:text-white transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div 
      className={clsx(
        "w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer relative",
        isDragging ? "border-primary bg-primary/10" : "border-white/20 bg-surface/30 hover:border-primary/50 hover:bg-surface/60"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        accept="image/png, image/jpeg, image/webp, image/bmp"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        onChange={handleFileInput}
      />
      <UploadCloud className={clsx("w-12 h-12 mb-4 transition-colors", isDragging ? "text-primary" : "text-muted")} />
      <h3 className="text-lg font-medium text-white mb-1">{label}</h3>
      <p className="text-sm text-muted text-center px-4">
        Drag & drop here or click to browse<br/>
        <span className="text-xs mt-2 block opacity-70">Supports PNG, JPG, WEBP up to 10MB</span>
      </p>
    </div>
  );
}
