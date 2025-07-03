import React, { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (isValidFileType(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isValidFileType(file)) {
        onFileSelect(file);
      }
    }
  };

  const isValidFileType = (file: File) => {
    const validTypes = ['.png', '.jpg', '.jpeg', '.pdf'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    return validTypes.includes(fileExtension);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer group
        ${isDragOver 
          ? 'border-doc-primary bg-doc-primary/10 shadow-lg shadow-doc-primary/25 animate-glow-pulse' 
          : 'border-doc-primary/30 hover:border-doc-primary/60 hover:bg-doc-primary/5'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleBrowseClick}
    >
      {/* Neon glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-doc-primary/10 via-doc-secondary/10 to-doc-accent/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <UploadCloud 
          size={64} 
          className={`mx-auto mb-6 transition-all duration-300 ${
            isDragOver 
              ? 'text-doc-primary animate-pulse scale-110' 
              : 'text-doc-primary/70 group-hover:text-doc-primary group-hover:scale-105'
          }`} 
        />
        <p className="text-xl font-semibold text-foreground mb-3">
          Drop your document here
        </p>
        <p className="text-foreground/60 mb-6 text-lg">or</p>
        <button 
          className="bg-gradient-to-r from-doc-primary to-doc-secondary hover:from-doc-primary-hover hover:to-doc-secondary text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-doc-primary/25"
          onClick={(e) => {
            e.stopPropagation();
            handleBrowseClick();
          }}
        >
          🚀 Browse Files
        </button>
        <p className="text-sm text-foreground/50 mt-6 font-medium">
          Supports PNG, JPG, JPEG, PDF files • Max 10MB
        </p>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.pdf"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};

export default FileUpload;