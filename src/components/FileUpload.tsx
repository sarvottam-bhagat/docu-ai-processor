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
        border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer
        ${isDragOver 
          ? 'border-doc-primary bg-suggestion-bg' 
          : 'border-gray-300 hover:border-gray-400'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleBrowseClick}
    >
      <UploadCloud 
        size={48} 
        className={`mx-auto mb-4 ${isDragOver ? 'text-doc-primary' : 'text-gray-400'}`} 
      />
      <p className="text-lg font-medium text-gray-700 mb-2">
        Drag and drop your document here
      </p>
      <p className="text-gray-500 mb-4">or</p>
      <button 
        className="bg-doc-primary hover:bg-doc-primary-hover text-white px-6 py-3 rounded-lg font-medium transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          handleBrowseClick();
        }}
      >
        Browse Files
      </button>
      <p className="text-sm text-gray-400 mt-4">
        Supports PNG, JPG, JPEG, PDF files
      </p>
      
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