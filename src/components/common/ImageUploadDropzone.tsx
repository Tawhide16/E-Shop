import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle, RefreshCw } from 'lucide-react';
import { fileToOptimizedDataUrl } from '../../utils/imageUpload';

interface ImageUploadDropzoneProps {
  value: string | string[];
  onChange: (value: any) => void;
  multiple?: boolean;
  label?: string;
  helperText?: string;
  aspectRatio?: 'square' | 'banner' | 'auto';
  className?: string;
}

export const ImageUploadDropzone: React.FC<ImageUploadDropzoneProps> = ({
  value,
  onChange,
  multiple = false,
  label = 'Upload Image',
  helperText = 'PNG, JPG, WEBP, SVG up to 10MB (Auto-optimized)',
  aspectRatio = 'auto',
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const images: string[] = Array.isArray(value) ? value : value ? [value] : [];

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setLoading(true);

    try {
      const processed: string[] = [];
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (file.type.startsWith('image/')) {
          const dataUrl = await fileToOptimizedDataUrl(file);
          processed.push(dataUrl);
        }
      }

      if (processed.length > 0) {
        if (multiple) {
          onChange([...images, ...processed]);
        } else {
          onChange(processed[0]);
        }
      }
    } catch (err) {
      console.error('Failed to process image upload:', err);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (indexToRemove: number) => {
    if (multiple) {
      const updated = images.filter((_, idx) => idx !== indexToRemove);
      onChange(updated);
    } else {
      onChange('');
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block font-bold text-gray-700 uppercase text-xs">{label}</label>
          {images.length > 0 && (
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle size={11} /> {images.length} image{images.length > 1 ? 's' : ''} loaded
            </span>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-black bg-neutral-100 scale-[1.01]'
            : 'border-gray-200 hover:border-black bg-gray-50/60 hover:bg-gray-50'
        }`}
      >
        <div className="space-y-1.5 pointer-events-none">
          <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
            {loading ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <Upload size={18} />
            )}
          </div>
          <p className="text-xs font-extrabold text-black">
            {loading ? 'Processing image...' : 'Click to browse or drag & drop image'}
          </p>
          <p className="text-[10px] text-gray-400 font-medium">{helperText}</p>
        </div>
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className={`grid gap-2 pt-1 ${
          multiple ? 'grid-cols-3 sm:grid-cols-4' : 'grid-cols-1'
        }`}>
          {images.map((imgUrl, idx) => (
            <div
              key={idx}
              className={`relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-100 ${
                aspectRatio === 'square'
                  ? 'aspect-square'
                  : aspectRatio === 'banner'
                  ? 'aspect-21/9'
                  : 'h-24'
              }`}
            >
              <img
                src={imgUrl}
                alt={`Preview ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(idx);
                  }}
                  className="bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors shadow-md cursor-pointer"
                  title="Remove image"
                >
                  <X size={13} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded hover:bg-gray-800 transition-colors shadow-md cursor-pointer"
                  title="Replace image"
                >
                  Change
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
