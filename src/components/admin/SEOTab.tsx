import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Search, 
  Save, 
  Check, 
  Globe, 
  Sparkles, 
  Share2, 
  FileCode, 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  Smartphone,
  Monitor
} from 'lucide-react';
import gsap from 'gsap';

export const SEOTab: React.FC = () => {
  const { seoSettings, updateSEOSettings, products } = useStore();
  const [title, setTitle] = useState(seoSettings?.metaTitle || '');
  const [desc, setDesc] = useState(seoSettings?.metaDescription || '');
  const [keywords, setKeywords] = useState(
    Array.isArray(seoSettings?.keywords)
      ? (seoSettings.keywords as unknown as string[]).join(', ')
      : typeof seoSettings?.keywords === 'string'
      ? seoSettings.keywords
      : ''
  );
  const [saved, setSaved] = useState(false);
  const [copiedType, setCopiedType] = useState<'sitemap' | 'robots' | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [activeSubTab, setActiveSubTab] = useState<'metadata' | 'serp' | 'social' | 'sitemap'>('metadata');

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [activeSubTab]);

  const handleSave = () => {
    updateSEOSettings({
      metaTitle: title,
      metaDescription: desc,
      keywords: keywords
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // SEO Score Calculation
  const calculateSEOScore = () => {
    let score = 0;
    if (title.length >= 30 && title.length <= 60) score += 30;
    else if (title.length > 0) score += 15;

    if (desc.length >= 100 && desc.length <= 160) score += 35;
    else if (desc.length > 0) score += 20;

    if (keywords.split(',').filter(k => k.trim()).length >= 4) score += 20;
    else if (keywords.length > 0) score += 10;

    if (products.length > 0) score += 15;

    return score;
  };

  const seoScore = calculateSEOScore();

  const generateSitemapXml = () => {
    const origin = window.location.origin;
    const date = new Date().toISOString().split('T')[0];
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    xml += `  <url>\n    <loc>${origin}/</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
    xml += `  <url>\n    <loc>${origin}/category</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    products.forEach(p => {
      xml += `  <url>\n    <loc>${origin}/product/${p.id}</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    });
    xml += `</urlset>`;
    return xml;
  };

  const generateRobotsTxt = () => {
    return `User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${window.location.origin}/sitemap.xml`;
  };

  const handleCopyText = (text: string, type: 'sitemap' | 'robots') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-black">SEO & Metadata Suite</h2>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
              <Sparkles size={10} /> Active
            </span>
          </div>
          <p className="text-xs text-gray-500 font-semibold mt-0.5">Optimize search rank, Google rich snippets, and social sharing for Bangladesh</p>
        </div>

        <button 
          onClick={handleSave}
          className="flex items-center justify-center gap-2 bg-black text-white text-xs font-extrabold px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-all cursor-pointer shadow-md active:scale-95 shrink-0"
        >
          {saved ? <Check size={16} className="text-emerald-400" /> : <Save size={16} />}
          <span>{saved ? 'Settings Saved!' : 'Save SEO Configuration'}</span>
        </button>
      </div>

      {/* SEO Score Gauge Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="relative flex items-center justify-center">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle cx="40" cy="40" r="32" stroke="#f3f4f6" strokeWidth="8" fill="transparent" />
              <circle 
                cx="40" 
                cy="40" 
                r="32" 
                stroke={seoScore >= 80 ? '#10b981' : seoScore >= 50 ? '#f59e0b' : '#ef4444'} 
                strokeWidth="8" 
                strokeDasharray={200}
                strokeDashoffset={200 - (200 * seoScore) / 100}
                strokeLinecap="round"
                fill="transparent" 
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <span className="absolute font-mono font-black text-lg text-black">{seoScore}%</span>
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-black">Search Engine Readiness Score</h3>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">
              {seoScore >= 80 
                ? 'Excellent! Your storefront is fully optimized for Google search results.' 
                : seoScore >= 50 
                ? 'Good, but could be improved by adding longer meta descriptions and keywords.'
                : 'Needs attention! Please complete meta title and description tags.'}
            </p>
          </div>
        </div>

        {/* Audit Checklist */}
        <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto text-xs font-bold text-gray-700">
          <div className={`p-2.5 rounded-lg border flex items-center gap-1.5 ${title.length >= 30 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
            {title.length >= 30 ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            <span>Title Length ({title.length}/60)</span>
          </div>
          <div className={`p-2.5 rounded-lg border flex items-center gap-1.5 ${desc.length >= 100 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
            {desc.length >= 100 ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            <span>Meta Description ({desc.length}/160)</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-gray-200 text-xs font-bold space-x-6">
        <button
          onClick={() => setActiveSubTab('metadata')}
          className={`pb-3 border-b-2 cursor-pointer transition-colors flex items-center gap-2 ${
            activeSubTab === 'metadata' ? 'border-black text-black font-extrabold' : 'border-transparent text-gray-400 hover:text-black'
          }`}
        >
          <Globe size={16} />
          <span>Meta Tags & Keywords</span>
        </button>

        <button
          onClick={() => setActiveSubTab('serp')}
          className={`pb-3 border-b-2 cursor-pointer transition-colors flex items-center gap-2 ${
            activeSubTab === 'serp' ? 'border-black text-black font-extrabold' : 'border-transparent text-gray-400 hover:text-black'
          }`}
        >
          <Search size={16} />
          <span>Google SERP Simulator</span>
        </button>

        <button
          onClick={() => setActiveSubTab('social')}
          className={`pb-3 border-b-2 cursor-pointer transition-colors flex items-center gap-2 ${
            activeSubTab === 'social' ? 'border-black text-black font-extrabold' : 'border-transparent text-gray-400 hover:text-black'
          }`}
        >
          <Share2 size={16} />
          <span>Social Media Card</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sitemap')}
          className={`pb-3 border-b-2 cursor-pointer transition-colors flex items-center gap-2 ${
            activeSubTab === 'sitemap' ? 'border-black text-black font-extrabold' : 'border-transparent text-gray-400 hover:text-black'
          }`}
        >
          <FileCode size={16} />
          <span>Sitemap & Robots.txt</span>
        </button>
      </div>

      {/* Sub-Tab Content with GSAP Ref */}
      <div ref={cardRef} className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs space-y-6">
        {activeSubTab === 'metadata' && (
          <div className="space-y-5 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-extrabold text-gray-800 uppercase tracking-wide">
                  Meta Title Tag <span className="text-red-500">*</span>
                </label>
                <span className={`font-mono font-bold ${title.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                  {title.length} / 60 chars
                </span>
              </div>
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Gymshark Official Store Bangladesh | High Performance Activewear"
                className="w-full border border-gray-200 p-3 rounded-lg font-medium focus:outline-none focus:border-black transition-colors"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                The main header that appears in search engine tabs and Google click-through titles.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-extrabold text-gray-800 uppercase tracking-wide">
                  Meta Description <span className="text-red-500">*</span>
                </label>
                <span className={`font-mono font-bold ${desc.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                  {desc.length} / 160 chars
                </span>
              </div>
              <textarea 
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="e.g. Shop official Gymshark leggings, sports bras, hoodies & workout tees in Bangladesh. Fast local delivery with bKash and Nagad payment."
                className="w-full border border-gray-200 p-3 rounded-lg font-medium focus:outline-none focus:border-black transition-colors"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Summarizes store offerings for searchers. Keep it concise, engaging, and under 160 characters.
              </p>
            </div>

            <div>
              <label className="block font-extrabold text-gray-800 uppercase tracking-wide mb-1">
                Target SEO Keywords (Comma-Separated)
              </label>
              <input 
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="gymshark, gymwear bangladesh, sports bra, activewear, fitness clothing, bkash"
                className="w-full border border-gray-200 p-3 rounded-lg font-mono font-medium focus:outline-none focus:border-black transition-colors"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Keywords help search engines understand key search terms relevant to your catalog.
              </p>
            </div>
          </div>
        )}

        {activeSubTab === 'serp' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-black uppercase tracking-wider">
                Google Search Result Preview
              </h3>
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg text-xs font-bold">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-3 py-1 rounded cursor-pointer transition-all flex items-center gap-1.5 ${
                    previewDevice === 'desktop' ? 'bg-white text-black shadow-xs' : 'text-gray-500'
                  }`}
                >
                  <Monitor size={14} /> Desktop
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`px-3 py-1 rounded cursor-pointer transition-all flex items-center gap-1.5 ${
                    previewDevice === 'mobile' ? 'bg-white text-black shadow-xs' : 'text-gray-500'
                  }`}
                >
                  <Smartphone size={14} /> Mobile
                </button>
              </div>
            </div>

            <div className={`bg-gray-50 p-5 rounded-xl border border-gray-200 font-sans space-y-1.5 transition-all ${
              previewDevice === 'mobile' ? 'max-w-xs mx-auto shadow-md' : 'w-full'
            }`}>
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <div className="w-4 h-4 bg-black text-white rounded-full flex items-center justify-center text-[8px] font-black">
                  GS
                </div>
                <span className="truncate font-mono text-[11px] text-gray-600">
                  {window.location.origin} › bd › gymwear
                </span>
              </div>
              <h4 className="text-base text-blue-800 hover:underline font-normal cursor-pointer line-clamp-1 leading-snug">
                {title || 'Gymshark Official Store | Activewear & Gym Clothes Bangladesh'}
              </h4>
              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                {desc || 'Shop official Gymshark gym clothing and workout wear in Bangladesh. Fast shipping and local payment options.'}
              </p>
            </div>
          </div>
        )}

        {activeSubTab === 'social' && (
          <div className="space-y-4 max-w-md mx-auto">
            <h3 className="text-xs font-extrabold text-black uppercase tracking-wider text-center">
              Social Media OpenGraph Share Preview
            </h3>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
              <div className="h-48 bg-gray-900 relative overflow-hidden">
                <img 
                  src={products[0]?.images[0] || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'} 
                  alt="Social Preview" 
                  className="w-full h-full object-cover opacity-90"
                />
                <span className="absolute bottom-2 left-2 bg-black/80 text-white font-mono text-[9px] px-2 py-0.5 rounded font-bold uppercase">
                  gymshark.com
                </span>
              </div>
              <div className="p-4 space-y-1 bg-gray-50">
                <p className="text-[10px] text-gray-400 font-bold uppercase font-mono tracking-wider">
                  GYMSHARK.COM
                </p>
                <h4 className="font-extrabold text-sm text-black line-clamp-1">
                  {title || 'Gymshark Official Store'}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-2 leading-snug">
                  {desc || 'Explore premium activewear and performance apparel in Bangladesh.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'sitemap' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-extrabold text-xs text-black uppercase tracking-wider flex items-center gap-1.5">
                  <FileCode size={16} /> Dynamic Sitemap.xml
                </h4>
                <button
                  onClick={() => handleCopyText(generateSitemapXml(), 'sitemap')}
                  className="bg-gray-100 hover:bg-black hover:text-white text-black px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedType === 'sitemap' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  <span>{copiedType === 'sitemap' ? 'Copied XML!' : 'Copy Sitemap XML'}</span>
                </button>
              </div>
              <pre className="bg-gray-900 text-gray-200 p-4 rounded-xl text-[11px] font-mono overflow-x-auto max-h-40 border border-gray-800">
                {generateSitemapXml()}
              </pre>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-extrabold text-xs text-black uppercase tracking-wider flex items-center gap-1.5">
                  <FileCode size={16} /> Robots.txt Config
                </h4>
                <button
                  onClick={() => handleCopyText(generateRobotsTxt(), 'robots')}
                  className="bg-gray-100 hover:bg-black hover:text-white text-black px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedType === 'robots' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  <span>{copiedType === 'robots' ? 'Copied Robots.txt!' : 'Copy Robots.txt'}</span>
                </button>
              </div>
              <pre className="bg-gray-900 text-gray-200 p-4 rounded-xl text-[11px] font-mono overflow-x-auto border border-gray-800">
                {generateRobotsTxt()}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
