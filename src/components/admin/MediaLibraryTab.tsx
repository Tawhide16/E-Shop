import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import gsap from 'gsap';
import { Upload, Copy, Check, Trash2, Image as ImageIcon, Plus } from 'lucide-react';
import { fileToOptimizedDataUrl } from '../../utils/imageUpload';

export const MediaLibraryTab: React.FC = () => {
  const { mediaAssets, addMediaAsset, deleteMediaAsset } = useStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, scale: 0.9, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, stagger: 0.04, ease: 'power2.out' }
      );
    }
  }, [mediaAssets.length]);

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const dataUrl = await fileToOptimizedDataUrl(file);
          const sizeKb = Math.round(file.size / 1024);
          const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

          addMediaAsset({
            filename: file.name,
            url: dataUrl,
            category: 'banners',
            fileSize: sizeStr,
            dimensions: 'Optimized'
          });
        }
      }
    } catch (err) {
      console.error('Error uploading media:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Input */}
      <input 
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-black">Media Asset Library</h2>
          <p className="text-xs text-gray-500 font-semibold mt-0.5">
            Directly upload photos, banners, and product graphics from your device
          </p>
        </div>

        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-1.5 bg-black text-white text-xs font-extrabold px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer shadow-md disabled:opacity-50"
        >
          <Upload size={16} />
          <span>{isUploading ? 'Uploading...' : 'Upload Image File'}</span>
        </button>
      </div>

      {/* Drop area */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-200 hover:border-black rounded-xl p-6 text-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <div className="space-y-1.5 pointer-events-none">
          <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center mx-auto">
            <Plus size={18} />
          </div>
          <p className="text-xs font-extrabold text-black">Click here to upload images from your computer or phone</p>
          <p className="text-[10px] text-gray-400 font-medium">PNG, JPG, WEBP, SVG (Select multiple files to upload at once)</p>
        </div>
      </div>

      <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {mediaAssets.map((asset) => {
          const title = (asset as any).title || asset.filename || 'Image Asset';
          const type = (asset as any).type || asset.category || 'image';
          const size = (asset as any).size || asset.fileSize || '';

          return (
            <div key={asset.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-xs space-y-2 group relative">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                <img src={asset.url} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <button
                  type="button"
                  onClick={() => deleteMediaAsset(asset.id)}
                  className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 cursor-pointer shadow-xs"
                  title="Delete asset"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-xs text-black truncate" title={title}>{title}</p>
                <p className="text-[10px] text-gray-400 uppercase font-mono">{type} {size ? `• ${size}` : ''}</p>
              </div>
              <button 
                onClick={() => handleCopy(asset.url, asset.id)}
                className="w-full bg-gray-50 hover:bg-black hover:text-white text-gray-800 text-[11px] font-extrabold py-1.5 rounded transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                {copiedId === asset.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                <span>{copiedId === asset.id ? 'Copied Data!' : 'Copy Image Data'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
