import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import gsap from 'gsap';
import { Upload, Copy, Check, Image as ImageIcon } from 'lucide-react';

export const MediaLibraryTab: React.FC = () => {
  const { mediaAssets } = useStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, scale: 0.9, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [mediaAssets.length]);

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-black">Media Asset Library</h2>
          <p className="text-xs text-gray-500 font-semibold mt-0.5">Manage high-resolution photography, banners, and marketing videos</p>
        </div>

        <button 
          onClick={() => alert('Simulated asset upload! Drop images directly.')}
          className="flex items-center gap-1.5 bg-black text-white text-xs font-extrabold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer shadow-md"
        >
          <Upload size={16} />
          <span>Upload Asset</span>
        </button>
      </div>

      <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {mediaAssets.map((asset) => (
          <div key={asset.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-xs space-y-2 group">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
              <img src={asset.url} alt={asset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-xs text-black truncate">{asset.title}</p>
              <p className="text-[10px] text-gray-400 uppercase font-mono">{asset.type} • {asset.size}</p>
            </div>
            <button 
              onClick={() => handleCopy(asset.url, asset.id)}
              className="w-full bg-gray-50 hover:bg-black hover:text-white text-gray-800 text-[11px] font-extrabold py-1.5 rounded transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              {copiedId === asset.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
              <span>{copiedId === asset.id ? 'Copied URL!' : 'Copy Asset URL'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
