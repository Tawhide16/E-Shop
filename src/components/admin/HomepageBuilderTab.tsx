import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { SectionConfig, SectionType, MenuItem } from '../../types/cms';
import gsap from 'gsap';
import { 
  GripVertical, 
  Eye, 
  EyeOff, 
  Edit3, 
  Trash2, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Save, 
  RotateCcw, 
  History, 
  CheckCircle, 
  Sparkles,
  X,
  Layers,
  Upload,
  Image as ImageIcon,
  Compass,
  Link as LinkIcon,
  Sliders,
  Check,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export const HomepageBuilderTab: React.FC = () => {
  const { 
    draftSections, 
    updateDraftSections, 
    toggleSectionVisibility, 
    moveSection, 
    deleteSection, 
    addSection, 
    publishHomepage, 
    discardDraftChanges, 
    isDraftModified, 
    versionHistory, 
    restoreVersion,
    previewDevice,
    setPreviewDevice,
    updateSection,
    menuItems,
    updateMenuItems,
    themeSettings,
    updateThemeSettings,
    mediaAssets
  } = useStore();

  // Mode switcher: 'navbar' | 'banner' | 'sections'
  const [builderTab, setBuilderTab] = useState<'navbar' | 'banner' | 'sections'>('navbar');
  const [selectedBannerId, setSelectedBannerId] = useState<string | null>(null);

  // Section editing state
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [publishNote, setPublishNote] = useState('');
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Logo upload state
  const [logoInputUrl, setLogoInputUrl] = useState(themeSettings.logoUrl || '');
  const [logoHeight, setLogoHeight] = useState(themeSettings.logoHeight || 32);
  const [logoSavedNotice, setLogoSavedNotice] = useState(false);

  // Navigation Menu state
  const [draggedMenuIndex, setDraggedMenuIndex] = useState<number | null>(null);
  const [dragOverMenuIndex, setDragOverMenuIndex] = useState<number | null>(null);
  const [editingMenuItemId, setEditingMenuItemId] = useState<string | null>(null);
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [newMenuLabel, setNewMenuLabel] = useState('');
  const [newMenuUrl, setNewMenuUrl] = useState('');
  const [newMenuIsMega, setNewMenuIsMega] = useState(false);
  const [menuSavedNotice, setMenuSavedNotice] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [builderTab]);

  const editingSection = draftSections.find(s => s.id === editingSectionId);

  const handlePublish = () => {
    publishHomepage(publishNote || 'Updated Homepage Layout');
    setShowPublishModal(false);
    setPublishNote('');
  };

  // --- LOGO UPLOAD HANDLERS ---
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Logo image should be smaller than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setLogoInputUrl(result);
      updateThemeSettings({ logoUrl: result, logoHeight });
      triggerLogoSaveNotice();
    };
    reader.readAsDataURL(file);
  };

  const handleApplyLogoUrl = (url: string) => {
    setLogoInputUrl(url);
    updateThemeSettings({ logoUrl: url, logoHeight });
    triggerLogoSaveNotice();
  };

  const handleLogoHeightChange = (height: number) => {
    setLogoHeight(height);
    updateThemeSettings({ logoHeight: height });
  };

  const handleClearLogo = () => {
    setLogoInputUrl('');
    updateThemeSettings({ logoUrl: '' });
    triggerLogoSaveNotice();
  };

  const triggerLogoSaveNotice = () => {
    setLogoSavedNotice(true);
    setTimeout(() => setLogoSavedNotice(false), 2200);
  };

  // --- NAVIGATION MENU HANDLERS ---
  const handleAddMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuLabel.trim()) return;

    const newItem: MenuItem = {
      id: `menu-${Date.now()}`,
      label: newMenuLabel.trim().toUpperCase(),
      url: newMenuUrl.trim() || `/category/${newMenuLabel.toLowerCase().replace(/\s+/g, '-')}`,
      isMegaMenu: newMenuIsMega,
      children: newMenuIsMega ? [
        {
          title: 'CATEGORIES',
          items: [
            { label: 'All Items', url: '/category/all' },
            { label: 'Bestsellers', url: '/category/bestsellers', badge: 'HOT' }
          ]
        }
      ] : undefined
    };

    updateMenuItems([...menuItems, newItem]);
    setNewMenuLabel('');
    setNewMenuUrl('');
    setNewMenuIsMega(false);
    setShowAddMenuModal(false);
    triggerMenuSaveNotice();
  };

  const handleRemoveMenuItem = (id: string) => {
    const updated = menuItems.filter(item => item.id !== id);
    updateMenuItems(updated);
    triggerMenuSaveNotice();
  };

  const handleMoveMenuItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= menuItems.length) return;

    const updated = [...menuItems];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    updateMenuItems(updated);
    triggerMenuSaveNotice();
  };

  // Drag & Drop reordering
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedMenuIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverMenuIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedMenuIndex === null || draggedMenuIndex === dropIndex) {
      setDraggedMenuIndex(null);
      setDragOverMenuIndex(null);
      return;
    }

    const updated = [...menuItems];
    const [draggedItem] = updated.splice(draggedMenuIndex, 1);
    updated.splice(dropIndex, 0, draggedItem);

    updateMenuItems(updated);
    setDraggedMenuIndex(null);
    setDragOverMenuIndex(null);
    triggerMenuSaveNotice();
  };

  const triggerMenuSaveNotice = () => {
    setMenuSavedNotice(true);
    setTimeout(() => setMenuSavedNotice(false), 2200);
  };

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Top Publish & Builder Mode Switcher */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-black text-white rounded-lg">
              <Layers size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-black">Storefront Homepage & Navbar Builder</h2>
                {isDraftModified ? (
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    ● Section Changes Pending
                  </span>
                ) : (
                  <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    ● Live Synchronized
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 font-semibold mt-0.5">Customize homepage sections, upload brand logo, and manage header navigation links</p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <button 
              onClick={() => setShowHistoryModal(true)}
              className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-black text-xs font-bold px-3 py-2 rounded-lg cursor-pointer transition-colors"
            >
              <History size={14} />
              <span>Version History</span>
            </button>

            {isDraftModified && (
              <button 
                onClick={discardDraftChanges}
                className="flex items-center gap-1.5 bg-gray-100 hover:bg-red-100 hover:text-red-700 text-gray-700 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer transition-colors"
              >
                <RotateCcw size={14} />
                <span>Discard Draft</span>
              </button>
            )}

            <button 
              onClick={() => setShowPublishModal(true)}
              disabled={!isDraftModified}
              className={`flex items-center gap-1.5 text-xs font-extrabold px-5 py-2 rounded-lg cursor-pointer transition-all shadow-md ${
                isDraftModified 
                  ? 'bg-black text-white hover:bg-gray-800' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Save size={14} />
              <span>Publish Homepage</span>
            </button>
          </div>
        </div>

        {/* Builder Mode Selector Tabs */}
        <div className="flex items-center gap-2 pt-1 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setBuilderTab('navbar')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-all ${
              builderTab === 'navbar' 
                ? 'bg-black text-white shadow-sm' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black'
            }`}
          >
            <Compass size={16} />
            <span>1. Navbar Customizer</span>
            {themeSettings.logoUrl && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            )}
          </button>

          <button
            onClick={() => setBuilderTab('banner')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-all ${
              builderTab === 'banner' 
                ? 'bg-black text-white shadow-sm' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black'
            }`}
          >
            <ImageIcon size={16} />
            <span>2. Banner Customizer</span>
          </button>

          <button
            onClick={() => setBuilderTab('sections')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-all ${
              builderTab === 'sections' 
                ? 'bg-black text-white shadow-sm' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black'
            }`}
          >
            <Layers size={16} />
            <span>3. Page Sections ({draftSections.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SECTION BUILDER */}
      {builderTab === 'sections' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left List of Sections (Span 5) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-xs font-extrabold text-black uppercase tracking-wider">Homepage Layout Order ({draftSections.length})</h3>
              <button 
                onClick={() => setShowAddSectionModal(true)}
                className="flex items-center gap-1 bg-black text-white text-[11px] font-extrabold px-3 py-1.5 rounded-md hover:bg-gray-800 cursor-pointer"
              >
                <Plus size={13} />
                <span>Add Section</span>
              </button>
            </div>

            <div className="space-y-2">
              {draftSections.map((sec, idx) => (
                <div 
                  key={sec.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                    editingSectionId === sec.id ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-0.5 text-gray-400">
                      <button 
                        onClick={() => moveSection(sec.id, 'up')}
                        disabled={idx === 0}
                        className="hover:text-black disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button 
                        onClick={() => moveSection(sec.id, 'down')}
                        disabled={idx === draftSections.length - 1}
                        className="hover:text-black disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-black uppercase">{sec.title}</h4>
                      <span className="text-[10px] text-gray-400 font-mono">Type: {sec.type}</span>
                    </div>
                  </div>

                  {/* Section Actions */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleSectionVisibility(sec.id)}
                      className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                        sec.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-400'
                      }`}
                      title={sec.enabled ? "Section Visible (ON)" : "Section Hidden (OFF)"}
                    >
                      {sec.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>

                    <button 
                      onClick={() => setEditingSectionId(sec.id)}
                      className="p-1.5 rounded-md bg-gray-100 hover:bg-black hover:text-white text-gray-800 cursor-pointer transition-colors"
                      title="Edit Section Settings"
                    >
                      <Edit3 size={14} />
                    </button>

                    <button 
                      onClick={() => deleteSection(sec.id)}
                      className="p-1.5 rounded-md bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-400 cursor-pointer transition-colors"
                      title="Delete Section"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Preview Viewport Pane (Span 7) */}
          <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-xs font-extrabold text-black uppercase tracking-wider">Live Preview Canvas</h3>

              {/* Device Switcher */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                <button 
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded cursor-pointer ${previewDevice === 'desktop' ? 'bg-white shadow-xs text-black' : 'text-gray-400'}`}
                  title="Desktop View"
                >
                  <Monitor size={16} />
                </button>
                <button 
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-1.5 rounded cursor-pointer ${previewDevice === 'tablet' ? 'bg-white shadow-xs text-black' : 'text-gray-400'}`}
                  title="Tablet View"
                >
                  <Tablet size={16} />
                </button>
                <button 
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded cursor-pointer ${previewDevice === 'mobile' ? 'bg-white shadow-xs text-black' : 'text-gray-400'}`}
                  title="Mobile View"
                >
                  <Smartphone size={16} />
                </button>
              </div>
            </div>

            {/* Device Frame */}
            <div className="bg-gray-100 p-4 rounded-xl flex justify-center items-center min-h-[580px] overflow-hidden">
              <div 
                className={`bg-white shadow-2xl transition-all duration-300 overflow-y-auto max-h-[620px] border border-gray-200 rounded-md ${
                  previewDevice === 'mobile' ? 'w-[375px]' : previewDevice === 'tablet' ? 'w-[600px]' : 'w-full'
                }`}
              >
                {/* Header Preview Bar */}
                <div className="border-b border-gray-200 p-3 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {themeSettings.logoUrl ? (
                      <img src={themeSettings.logoUrl} alt="Logo" style={{ height: `${themeSettings.logoHeight || 28}px` }} className="object-contain max-w-[120px]" />
                    ) : (
                      <span className="font-mono font-black text-sm uppercase">GS GYMSHARK</span>
                    )}
                  </div>
                  <div className="flex gap-2 text-[10px] font-bold text-gray-500 uppercase">
                    {menuItems.slice(0, 3).map(m => (
                      <span key={m.id}>{m.label}</span>
                    ))}
                  </div>
                </div>

                {/* Render Sections in draft order */}
                <div className="divide-y divide-gray-100">
                  {draftSections.filter(s => s.enabled).map(s => {
                    const isBanner = s.type === 'hero' || s.type === 'promo_banner' || Boolean(s.settings.bannerImage) || Boolean(s.settings.heroSlides);
                    const bannerImg = s.settings.bannerImage || s.settings.heroSlides?.[0]?.desktopImage || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800';
                    const btn1 = s.settings.primaryBtnText || s.settings.heroSlides?.[0]?.button1Text || 'Bestsellers';
                    const btn2 = s.settings.secondaryBtnText || s.settings.heroSlides?.[0]?.button2Text;

                    return (
                      <div key={s.id} className="relative group/preview border-b border-gray-100">
                        <div className="p-2.5 bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase flex justify-between items-center">
                          <span>{s.title} ({s.type})</span>
                          <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                            ● Active
                          </span>
                        </div>

                        {isBanner ? (
                          <div className="relative h-44 bg-black overflow-hidden text-white group">
                            <img 
                              src={bannerImg} 
                              alt={s.title}
                              className="w-full h-full object-cover"
                            />
                            <div 
                              className="absolute inset-0 bg-black" 
                              style={{ opacity: (s.styles.overlayDarkness ?? 35) / 100 }}
                            />
                            <div className="absolute inset-0 p-4 flex flex-col justify-end items-start gap-1 z-10">
                              <h4 className="font-extrabold text-sm uppercase text-white font-mono leading-tight drop-shadow-sm">
                                {s.title}
                              </h4>
                              {s.subtitle && (
                                <p className="text-[11px] text-gray-200 line-clamp-1 drop-shadow-xs">
                                  {s.subtitle}
                                </p>
                              )}
                              <div className="flex gap-2 pt-1">
                                <span className="bg-white text-black font-extrabold text-[9px] uppercase px-2.5 py-1 rounded shadow-sm">
                                  {btn1}
                                </span>
                                {btn2 && (
                                  <span className="bg-transparent border border-white text-white font-extrabold text-[9px] uppercase px-2.5 py-1 rounded">
                                    {btn2}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3.5 text-xs font-semibold text-gray-800">
                            <p className="font-bold text-black uppercase">{s.title}</p>
                            {s.subtitle && <p className="text-gray-500 text-[11px]">{s.subtitle}</p>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: NAVBAR CUSTOMIZER */}
      {builderTab === 'navbar' && (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-extrabold text-black uppercase tracking-wider flex items-center gap-2">
                <ImageIcon size={18} /> Storefront Logo Customizer
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Upload your brand logo image or select from preset graphics to display in the main navigation bar.
              </p>
            </div>

            {logoSavedNotice && (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-in fade-in">
                <Check size={14} /> Logo Updated Live!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Upload Controls (Span 7) */}
            <div className="lg:col-span-7 space-y-6">
              {/* File Drag & Drop Upload Zone */}
              <div>
                <label className="block text-xs font-extrabold text-gray-800 uppercase tracking-wider mb-2">
                  1. Upload Logo Image File (PNG, SVG, JPG, WEBP)
                </label>

                <div className="border-2 border-dashed border-gray-200 hover:border-black rounded-xl p-6 text-center bg-gray-50/50 transition-colors relative cursor-pointer group">
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg, image/svg+xml, image/webp"
                    onChange={handleLogoFileUpload}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                  />
                  <div className="space-y-2 pointer-events-none">
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <Upload size={20} />
                    </div>
                    <p className="text-xs font-extrabold text-black">Click or drag logo image here to upload</p>
                    <p className="text-[11px] text-gray-400 font-medium">Recommended: Transparent PNG or SVG (Max 5MB)</p>
                  </div>
                </div>
              </div>

              {/* URL Text Input Option */}
              <div>
                <label className="block text-xs font-extrabold text-gray-800 uppercase tracking-wider mb-2">
                  2. Or Paste Direct Image URL
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon size={16} className="absolute left-3 top-3 text-gray-400" />
                    <input 
                      type="text"
                      placeholder="https://example.com/brand-logo.png"
                      value={logoInputUrl}
                      onChange={(e) => setLogoInputUrl(e.target.value)}
                      className="w-full border border-gray-200 pl-9 pr-3 py-2.5 rounded-lg text-xs font-mono font-medium focus:outline-none focus:border-black"
                    />
                  </div>
                  <button 
                    onClick={() => handleApplyLogoUrl(logoInputUrl)}
                    className="bg-black text-white text-xs font-extrabold px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer shrink-0"
                  >
                    Apply URL
                  </button>
                </div>
              </div>

              {/* Sample Preset Brand Logos */}
              <div>
                <label className="block text-xs font-extrabold text-gray-800 uppercase tracking-wider mb-2">
                  3. Select Sample Brand Graphic
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: 'Gymshark Crest', url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80' },
                    { name: 'Athletic Apex', url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=400' },
                    { name: 'Power Fitness', url: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=400' }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleApplyLogoUrl(preset.url)}
                      className="p-3 border border-gray-200 hover:border-black rounded-lg text-left bg-white hover:bg-gray-50 transition-all cursor-pointer group flex flex-col items-center gap-2"
                    >
                      <img src={preset.url} alt={preset.name} className="h-10 w-10 object-cover rounded-full border border-gray-200" />
                      <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wide group-hover:underline text-center">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Logo Height Slider */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">
                    Logo Height in Navigation Bar
                  </label>
                  <span className="font-mono text-xs font-extrabold text-black">{logoHeight}px</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="60" 
                  value={logoHeight}
                  onChange={(e) => handleLogoHeightChange(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
              </div>

              {/* Clear Logo Option */}
              {themeSettings.logoUrl && (
                <div className="pt-2">
                  <button
                    onClick={handleClearLogo}
                    className="text-xs font-extrabold text-red-600 hover:text-red-800 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 size={14} />
                    <span>Remove Logo Image (Revert to Bold Text Logo)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right Live Preview Cards (Span 5) */}
            <div className="lg:col-span-5 space-y-4">
              <h4 className="text-xs font-extrabold text-black uppercase tracking-wider">Header Navbar Live Preview</h4>

              {/* Light Mode Header Preview */}
              <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-xs space-y-2">
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">LIGHT STOREFRONT HEADER</span>
                <div className="h-14 bg-white border border-gray-100 rounded-lg px-4 flex items-center justify-between">
                  {themeSettings.logoUrl ? (
                    <img src={themeSettings.logoUrl} alt="Store Logo" style={{ height: `${logoHeight}px` }} className="max-w-[140px] object-contain" />
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <div className="bg-black text-white p-1 rounded-sm font-black text-sm leading-none">GS</div>
                      <span className="font-extrabold tracking-tighter text-base text-black font-mono">GYMSHARK</span>
                    </div>
                  )}

                  <div className="flex gap-3 text-[11px] font-bold text-gray-800 uppercase">
                    {menuItems.slice(0, 3).map(m => (
                      <span key={m.id}>{m.label}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dark Mode Header Preview */}
              <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl shadow-xs space-y-2 text-white">
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">DARK CAMPAIGN HEADER</span>
                <div className="h-14 bg-black border border-gray-800 rounded-lg px-4 flex items-center justify-between">
                  {themeSettings.logoUrl ? (
                    <img src={themeSettings.logoUrl} alt="Store Logo" style={{ height: `${logoHeight}px` }} className="max-w-[140px] object-contain brightness-110" />
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <div className="bg-white text-black p-1 rounded-sm font-black text-sm leading-none">GS</div>
                      <span className="font-extrabold tracking-tighter text-base text-white font-mono">GYMSHARK</span>
                    </div>
                  )}

                  <div className="flex gap-3 text-[11px] font-bold text-gray-300 uppercase">
                    {menuItems.slice(0, 3).map(m => (
                      <span key={m.id}>{m.label}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BANNER CUSTOMIZER */}
      {builderTab === 'banner' && (() => {
        const allBanners = draftSections.filter(s => s.type === 'hero' || s.type === 'promo_banner');
        if (allBanners.length === 0) return null;

        const activeBanner = allBanners.find(s => s.id === selectedBannerId) || allBanners[0];
        const isHero = activeBanner.type === 'hero';

        const currentBannerImg = activeBanner.settings.bannerImage || activeBanner.settings.heroSlides?.[0]?.desktopImage || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200';
        const currentTitle = activeBanner.title || activeBanner.settings.heroSlides?.[0]?.title || 'BANNER HEADING';
        const currentSubtitle = activeBanner.subtitle || activeBanner.settings.heroSlides?.[0]?.subtitle || '';
        const currentPrimaryBtnText = activeBanner.settings.primaryBtnText || activeBanner.settings.heroSlides?.[0]?.button1Text || 'Shop Now';
        const currentPrimaryBtnUrl = activeBanner.settings.primaryBtnUrl || activeBanner.settings.heroSlides?.[0]?.button1Url || '/collections/all';
        const currentSecondaryBtnText = activeBanner.settings.secondaryBtnText || activeBanner.settings.heroSlides?.[0]?.button2Text || '';
        const currentSecondaryBtnUrl = activeBanner.settings.secondaryBtnUrl || activeBanner.settings.heroSlides?.[0]?.button2Url || '/collections/all';
        const currentOverlayDarkness = activeBanner.styles?.overlayDarkness ?? 35;

        const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (file.size > 8 * 1024 * 1024) {
            alert('Banner image file must be smaller than 8MB');
            return;
          }
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            handleUpdateActiveBannerImage(result);
          };
          reader.readAsDataURL(file);
        };

        const handleUpdateActiveBannerImage = (imgUrl: string) => {
          const heroSlides = activeBanner.settings.heroSlides;
          const updatedHeroSlides = heroSlides ? [
            { ...heroSlides[0], desktopImage: imgUrl },
            ...heroSlides.slice(1)
          ] : undefined;

          updateSection(activeBanner.id, {
            settings: {
              ...activeBanner.settings,
              bannerImage: imgUrl,
              ...(updatedHeroSlides ? { heroSlides: updatedHeroSlides } : {})
            }
          });
        };

        return (
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-100 gap-4">
              <div>
                <h3 className="text-sm font-extrabold text-black uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon size={18} /> Banner Customizer
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Select any banner on your page to update image, upload files, customize heading, subtitle & action buttons.
                </p>
              </div>

              {/* Banner Selector Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Select Banner:</span>
                {allBanners.map(b => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBannerId(b.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeBanner.id === b.id
                        ? 'bg-black text-white shadow-sm ring-2 ring-black/10'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <ImageIcon size={13} />
                    {b.type === 'hero' ? 'Hero Banner' : b.title || b.id}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Form Controls */}
              <div className="lg:col-span-6 space-y-5 text-xs">
                {/* Currently Editing Badge */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-black text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                      Editing
                    </span>
                    <span className="font-extrabold text-xs text-black uppercase">{activeBanner.title || activeBanner.id}</span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Type: {activeBanner.type.toUpperCase()}</span>
                </div>

                {/* Title */}
                <div>
                  <label className="block font-extrabold text-gray-800 uppercase mb-1">
                    Banner Title / Heading
                  </label>
                  <input 
                    type="text"
                    value={currentTitle}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      const heroSlides = activeBanner.settings.heroSlides;
                      const updatedHeroSlides = heroSlides ? [
                        { ...heroSlides[0], title: newTitle },
                        ...heroSlides.slice(1)
                      ] : undefined;
                      updateSection(activeBanner.id, {
                        title: newTitle,
                        settings: {
                          ...activeBanner.settings,
                          ...(updatedHeroSlides ? { heroSlides: updatedHeroSlides } : {})
                        }
                      });
                    }}
                    className="w-full border border-gray-200 p-2.5 rounded-lg font-black text-xs uppercase focus:outline-none focus:border-black"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block font-extrabold text-gray-800 uppercase mb-1">
                    Banner Subtitle / Description
                  </label>
                  <input 
                    type="text"
                    value={currentSubtitle}
                    onChange={(e) => {
                      const newSubtitle = e.target.value;
                      const heroSlides = activeBanner.settings.heroSlides;
                      const updatedHeroSlides = heroSlides ? [
                        { ...heroSlides[0], subtitle: newSubtitle },
                        ...heroSlides.slice(1)
                      ] : undefined;
                      updateSection(activeBanner.id, {
                        subtitle: newSubtitle,
                        settings: {
                          ...activeBanner.settings,
                          ...(updatedHeroSlides ? { heroSlides: updatedHeroSlides } : {})
                        }
                      });
                    }}
                    className="w-full border border-gray-200 p-2.5 rounded-lg font-medium text-xs focus:outline-none focus:border-black"
                  />
                </div>

                {/* Banner Image Customizer */}
                <div className="pt-2 border-t border-gray-100 space-y-3">
                  <label className="block font-extrabold text-gray-800 uppercase tracking-wide">
                    Banner Image Upload & URL
                  </label>

                  {/* File Upload Zone */}
                  <div className="border-2 border-dashed border-gray-200 hover:border-black rounded-lg p-4 text-center bg-gray-50/50 transition-colors relative cursor-pointer group">
                    <input 
                      type="file" 
                      accept="image/png, image/jpeg, image/webp, image/svg+xml"
                      onChange={handleBannerFileUpload}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                    />
                    <div className="space-y-1 pointer-events-none">
                      <Upload size={18} className="mx-auto text-gray-500 group-hover:scale-110 transition-transform" />
                      <p className="text-xs font-bold text-black">Upload Banner Image File</p>
                      <p className="text-[10px] text-gray-400">Click or drag banner image here (PNG, JPG, WEBP)</p>
                    </div>
                  </div>

                  {/* Direct Image URL */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                      Or Image Web URL
                    </label>
                    <input 
                      type="text"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={currentBannerImg}
                      onChange={(e) => handleUpdateActiveBannerImage(e.target.value)}
                      className="w-full border border-gray-200 p-2 rounded-lg font-mono text-xs focus:outline-none focus:border-black"
                    />
                  </div>

                  {/* Sample Presets */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
                      Sample Banner Image Presets
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { name: 'Gym Bestsellers', url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200' },
                        { name: 'Power Lifting', url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=1200' },
                        { name: 'Men Workout', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200' },
                        { name: 'Seamless Pink', url: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=1200' },
                        { name: 'Athletic Apex', url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=1200' },
                        { name: 'Urban Workout', url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200' }
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleUpdateActiveBannerImage(preset.url)}
                          className="relative h-12 rounded overflow-hidden border border-gray-200 hover:border-black group cursor-pointer"
                        >
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="text-[9px] font-extrabold text-white uppercase text-center px-1 leading-tight">{preset.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="pt-2 border-t border-gray-100 space-y-3">
                  <label className="block font-extrabold text-gray-800 uppercase tracking-wide">
                    Banner Action Buttons
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Primary Button Text</label>
                      <input 
                        type="text"
                        value={currentPrimaryBtnText}
                        onChange={(e) => {
                          const text = e.target.value;
                          const heroSlides = activeBanner.settings.heroSlides;
                          const updatedHeroSlides = heroSlides ? [
                            { ...heroSlides[0], button1Text: text },
                            ...heroSlides.slice(1)
                          ] : undefined;
                          updateSection(activeBanner.id, {
                            settings: {
                              ...activeBanner.settings,
                              primaryBtnText: text,
                              ...(updatedHeroSlides ? { heroSlides: updatedHeroSlides } : {})
                            }
                          });
                        }}
                        className="w-full border border-gray-200 p-2 rounded-lg font-bold text-xs uppercase focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Primary Target URL</label>
                      <input 
                        type="text"
                        value={currentPrimaryBtnUrl}
                        onChange={(e) => {
                          const url = e.target.value;
                          const heroSlides = activeBanner.settings.heroSlides;
                          const updatedHeroSlides = heroSlides ? [
                            { ...heroSlides[0], button1Url: url },
                            ...heroSlides.slice(1)
                          ] : undefined;
                          updateSection(activeBanner.id, {
                            settings: {
                              ...activeBanner.settings,
                              primaryBtnUrl: url,
                              ...(updatedHeroSlides ? { heroSlides: updatedHeroSlides } : {})
                            }
                          });
                        }}
                        className="w-full border border-gray-200 p-2 rounded-lg font-mono text-xs focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Secondary Button Text</label>
                      <input 
                        type="text"
                        value={currentSecondaryBtnText}
                        onChange={(e) => {
                          const text = e.target.value;
                          const heroSlides = activeBanner.settings.heroSlides;
                          const updatedHeroSlides = heroSlides ? [
                            { ...heroSlides[0], button2Text: text },
                            ...heroSlides.slice(1)
                          ] : undefined;
                          updateSection(activeBanner.id, {
                            settings: {
                              ...activeBanner.settings,
                              secondaryBtnText: text,
                              ...(updatedHeroSlides ? { heroSlides: updatedHeroSlides } : {})
                            }
                          });
                        }}
                        className="w-full border border-gray-200 p-2 rounded-lg font-bold text-xs uppercase focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Secondary Target URL</label>
                      <input 
                        type="text"
                        value={currentSecondaryBtnUrl}
                        onChange={(e) => {
                          const url = e.target.value;
                          const heroSlides = activeBanner.settings.heroSlides;
                          const updatedHeroSlides = heroSlides ? [
                            { ...heroSlides[0], button2Url: url },
                            ...heroSlides.slice(1)
                          ] : undefined;
                          updateSection(activeBanner.id, {
                            settings: {
                              ...activeBanner.settings,
                              secondaryBtnUrl: url,
                              ...(updatedHeroSlides ? { heroSlides: updatedHeroSlides } : {})
                            }
                          });
                        }}
                        className="w-full border border-gray-200 p-2 rounded-lg font-mono text-xs focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>

                {/* Overlay Darkness Slider */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-extrabold text-gray-800 uppercase tracking-wide">
                      Overlay Darkness
                    </label>
                    <span className="font-mono text-xs font-bold text-black">{currentOverlayDarkness}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="90"
                    value={currentOverlayDarkness}
                    onChange={(e) => {
                      updateSection(activeBanner.id, {
                        styles: { ...activeBanner.styles, overlayDarkness: Number(e.target.value) }
                      });
                    }}
                    className="w-full accent-black cursor-pointer"
                  />
                </div>
              </div>

              {/* Right Column: Live Banner Preview */}
              <div className="lg:col-span-6 space-y-3 sticky top-4">
                <h4 className="text-xs font-extrabold text-black uppercase tracking-wider flex items-center gap-1.5">
                  <Eye size={15} /> Live Banner Preview ({activeBanner.title || activeBanner.id})
                </h4>
                <div className="relative h-80 bg-black rounded-xl overflow-hidden shadow-lg border border-gray-200 text-white flex items-end p-6">
                  <img 
                    src={currentBannerImg} 
                    alt="Banner Preview" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div 
                    className="absolute inset-0 bg-black transition-opacity"
                    style={{ opacity: currentOverlayDarkness / 100 }}
                  />
                  <div className="relative z-10 space-y-2 max-w-lg">
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white leading-none font-mono drop-shadow">
                      {currentTitle}
                    </h2>
                    {currentSubtitle && (
                      <p className="text-xs text-gray-200 font-medium drop-shadow-xs">
                        {currentSubtitle}
                      </p>
                    )}
                    <div className="flex gap-2 pt-2">
                      <span className="bg-white text-black font-extrabold text-xs uppercase px-4 py-2 rounded shadow-md">
                        {currentPrimaryBtnText}
                      </span>
                      {currentSecondaryBtnText && (
                        <span className="bg-transparent border-2 border-white text-white font-extrabold text-xs uppercase px-4 py-2 rounded">
                          {currentSecondaryBtnText}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}


      {/* Add New Navigation Menu Item Modal */}
      {showAddMenuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full p-6 rounded-xl shadow-2xl relative space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-black uppercase flex items-center gap-2">
                <Plus size={18} /> Add Navigation Menu Item
              </h3>
              <button onClick={() => setShowAddMenuModal(false)} className="p-1 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddMenuItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-extrabold text-gray-800 uppercase tracking-wide mb-1">
                  Menu Label <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  placeholder="e.g. OUTLET or COMMUNITY or BESTSELLERS"
                  value={newMenuLabel}
                  onChange={(e) => setNewMenuLabel(e.target.value)}
                  required
                  autoFocus
                  className="w-full border border-gray-200 p-2.5 rounded-lg font-bold text-xs focus:outline-none focus:border-black uppercase"
                />
              </div>

              <div>
                <label className="block font-extrabold text-gray-800 uppercase tracking-wide mb-1">
                  Target Page URL Path
                </label>
                <input 
                  type="text"
                  placeholder="/category/outlet or /collection/power"
                  value={newMenuUrl}
                  onChange={(e) => setNewMenuUrl(e.target.value)}
                  className="w-full border border-gray-200 p-2.5 rounded-lg font-mono text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input 
                  type="checkbox"
                  id="megaMenuToggle"
                  checked={newMenuIsMega}
                  onChange={(e) => setNewMenuIsMega(e.target.checked)}
                  className="w-4 h-4 accent-black cursor-pointer rounded"
                />
                <label htmlFor="megaMenuToggle" className="font-extrabold text-gray-800 uppercase cursor-pointer">
                  Enable Mega Menu Dropdown Layout
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setShowAddMenuModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-black text-white px-5 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider cursor-pointer hover:bg-gray-800 transition-colors"
                >
                  Add To Navigation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Section Drawer */}
      {editingSection && (() => {
        const currentBannerImg = editingSection.settings.bannerImage || editingSection.settings.heroSlides?.[0]?.desktopImage || '';
        const currentPrimaryBtnText = editingSection.settings.primaryBtnText || editingSection.settings.heroSlides?.[0]?.button1Text || 'Bestsellers';
        const currentPrimaryBtnUrl = editingSection.settings.primaryBtnUrl || editingSection.settings.heroSlides?.[0]?.button1Url || '/bestsellers';
        const currentSecondaryBtnText = editingSection.settings.secondaryBtnText || editingSection.settings.heroSlides?.[0]?.button2Text || 'Shop Pink';
        const currentSecondaryBtnUrl = editingSection.settings.secondaryBtnUrl || editingSection.settings.heroSlides?.[0]?.button2Url || '/pink';
        const currentOverlayDarkness = editingSection.styles.overlayDarkness ?? 30;

        const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (file.size > 8 * 1024 * 1024) {
            alert('Banner image file must be smaller than 8MB');
            return;
          }
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            handleUpdateBannerImage(result);
          };
          reader.readAsDataURL(file);
        };

        const handleUpdateBannerImage = (imgUrl: string) => {
          const heroSlides = editingSection.settings.heroSlides;
          const updatedHeroSlides = heroSlides ? [
            { ...heroSlides[0], desktopImage: imgUrl },
            ...heroSlides.slice(1)
          ] : [{
            title: editingSection.title,
            subtitle: editingSection.subtitle || '',
            desktopImage: imgUrl,
            button1Text: currentPrimaryBtnText,
            button1Url: currentPrimaryBtnUrl,
            button2Text: currentSecondaryBtnText,
            button2Url: currentSecondaryBtnUrl
          }];

          updateSection(editingSection.id, {
            settings: {
              ...editingSection.settings,
              bannerImage: imgUrl,
              heroSlides: updatedHeroSlides
            }
          });
        };

        const handleUpdatePrimaryBtnText = (text: string) => {
          const heroSlides = editingSection.settings.heroSlides;
          const updatedHeroSlides = heroSlides ? [
            { ...heroSlides[0], button1Text: text },
            ...heroSlides.slice(1)
          ] : undefined;

          updateSection(editingSection.id, {
            settings: {
              ...editingSection.settings,
              primaryBtnText: text,
              heroSlides: updatedHeroSlides
            }
          });
        };

        const handleUpdatePrimaryBtnUrl = (url: string) => {
          const heroSlides = editingSection.settings.heroSlides;
          const updatedHeroSlides = heroSlides ? [
            { ...heroSlides[0], button1Url: url },
            ...heroSlides.slice(1)
          ] : undefined;

          updateSection(editingSection.id, {
            settings: {
              ...editingSection.settings,
              primaryBtnUrl: url,
              heroSlides: updatedHeroSlides
            }
          });
        };

        const handleUpdateSecondaryBtnText = (text: string) => {
          const heroSlides = editingSection.settings.heroSlides;
          const updatedHeroSlides = heroSlides ? [
            { ...heroSlides[0], button2Text: text },
            ...heroSlides.slice(1)
          ] : undefined;

          updateSection(editingSection.id, {
            settings: {
              ...editingSection.settings,
              secondaryBtnText: text,
              heroSlides: updatedHeroSlides
            }
          });
        };

        const handleUpdateSecondaryBtnUrl = (url: string) => {
          const heroSlides = editingSection.settings.heroSlides;
          const updatedHeroSlides = heroSlides ? [
            { ...heroSlides[0], button2Url: url },
            ...heroSlides.slice(1)
          ] : undefined;

          updateSection(editingSection.id, {
            settings: {
              ...editingSection.settings,
              secondaryBtnUrl: url,
              heroSlides: updatedHeroSlides
            }
          });
        };

        const handleUpdateOverlayDarkness = (darkness: number) => {
          updateSection(editingSection.id, {
            styles: {
              ...editingSection.styles,
              overlayDarkness: darkness
            }
          });
        };

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs">
            <div className="bg-white w-full max-w-lg h-full p-6 shadow-2xl overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-200">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-extrabold text-base text-black uppercase flex items-center gap-2">
                      <Sliders size={18} /> Edit {editingSection.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 font-medium">Type: {editingSection.type.toUpperCase()}</p>
                  </div>
                  <button onClick={() => setEditingSectionId(null)} className="p-1 cursor-pointer hover:bg-gray-100 rounded">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-5 text-xs">
                  {/* 1. Banner Heading Text */}
                  <div>
                    <label className="block font-extrabold text-gray-800 uppercase mb-1">
                      Banner Heading / Title
                    </label>
                    <input 
                      type="text"
                      value={editingSection.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        const heroSlides = editingSection.settings.heroSlides;
                        const updatedHeroSlides = heroSlides ? [
                          { ...heroSlides[0], title: newTitle },
                          ...heroSlides.slice(1)
                        ] : undefined;
                        updateSection(editingSection.id, {
                          title: newTitle,
                          settings: {
                            ...editingSection.settings,
                            heroSlides: updatedHeroSlides
                          }
                        });
                      }}
                      className="w-full border border-gray-200 p-2.5 rounded-lg font-black text-xs uppercase focus:outline-none focus:border-black"
                    />
                  </div>

                  {/* 2. Banner Subtitle */}
                  <div>
                    <label className="block font-extrabold text-gray-800 uppercase mb-1">
                      Banner Subtitle / Description
                    </label>
                    <input 
                      type="text"
                      value={editingSection.subtitle || ''}
                      onChange={(e) => {
                        const newSubtitle = e.target.value;
                        const heroSlides = editingSection.settings.heroSlides;
                        const updatedHeroSlides = heroSlides ? [
                          { ...heroSlides[0], subtitle: newSubtitle },
                          ...heroSlides.slice(1)
                        ] : undefined;
                        updateSection(editingSection.id, {
                          subtitle: newSubtitle,
                          settings: {
                            ...editingSection.settings,
                            heroSlides: updatedHeroSlides
                          }
                        });
                      }}
                      className="w-full border border-gray-200 p-2.5 rounded-lg font-medium text-xs focus:outline-none focus:border-black"
                    />
                  </div>

                  {/* 3. Banner Image Upload & Customizer */}
                  <div className="pt-2 border-t border-gray-100 space-y-3">
                    <label className="block font-extrabold text-gray-800 uppercase tracking-wide">
                      Banner Image Customizer
                    </label>

                    {/* Current Image Preview */}
                    {currentBannerImg && (
                      <div className="relative h-32 rounded-lg overflow-hidden border border-gray-200 group">
                        <img src={currentBannerImg} alt="Banner Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleUpdateBannerImage('')}
                            className="bg-red-600 text-white text-[11px] font-bold px-3 py-1.5 rounded cursor-pointer flex items-center gap-1 shadow"
                          >
                            <Trash2 size={12} /> Clear Banner Image
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Drag & Drop File Upload */}
                    <div className="border-2 border-dashed border-gray-200 hover:border-black rounded-lg p-4 text-center bg-gray-50/50 transition-colors relative cursor-pointer group">
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg, image/webp, image/svg+xml"
                        onChange={handleBannerFileUpload}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                      />
                      <div className="space-y-1 pointer-events-none">
                        <Upload size={18} className="mx-auto text-gray-500 group-hover:scale-110 transition-transform" />
                        <p className="text-xs font-bold text-black">Upload Custom Banner Image File</p>
                        <p className="text-[10px] text-gray-400">Click or drag image file here (PNG, JPG, WEBP)</p>
                      </div>
                    </div>

                    {/* Direct Image URL Input */}
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                        Or Image Web URL
                      </label>
                      <input 
                        type="text"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={currentBannerImg}
                        onChange={(e) => handleUpdateBannerImage(e.target.value)}
                        className="w-full border border-gray-200 p-2 rounded-lg font-mono text-xs focus:outline-none focus:border-black"
                      />
                    </div>

                    {/* Sample Preset Banner Images */}
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
                        Sample Fitness Banner Presets
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { name: 'Gym Bestsellers', url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200' },
                          { name: 'Power Lifting', url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=1200' },
                          { name: 'Men Workout', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200' },
                          { name: 'Seamless Pink', url: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=1200' },
                          { name: 'Athletic Apex', url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=1200' },
                          { name: 'Urban Workout', url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200' }
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleUpdateBannerImage(preset.url)}
                            className="relative h-14 rounded overflow-hidden border border-gray-200 hover:border-black group cursor-pointer"
                          >
                            <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <span className="text-[9px] font-extrabold text-white uppercase text-center px-1 leading-tight">{preset.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 4. Banner Primary Button Settings */}
                  <div className="pt-2 border-t border-gray-100 space-y-3">
                    <label className="block font-extrabold text-gray-800 uppercase tracking-wide">
                      Primary Banner Button
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Button Text</label>
                        <input 
                          type="text"
                          value={currentPrimaryBtnText}
                          onChange={(e) => handleUpdatePrimaryBtnText(e.target.value)}
                          className="w-full border border-gray-200 p-2 rounded-lg font-bold text-xs uppercase focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Target Link URL</label>
                        <input 
                          type="text"
                          value={currentPrimaryBtnUrl}
                          onChange={(e) => handleUpdatePrimaryBtnUrl(e.target.value)}
                          className="w-full border border-gray-200 p-2 rounded-lg font-mono text-xs focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 5. Banner Secondary Button Settings */}
                  <div className="pt-2 border-t border-gray-100 space-y-3">
                    <label className="block font-extrabold text-gray-800 uppercase tracking-wide">
                      Secondary Banner Button
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Button Text</label>
                        <input 
                          type="text"
                          value={currentSecondaryBtnText}
                          onChange={(e) => handleUpdateSecondaryBtnText(e.target.value)}
                          className="w-full border border-gray-200 p-2 rounded-lg font-bold text-xs uppercase focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Target Link URL</label>
                        <input 
                          type="text"
                          value={currentSecondaryBtnUrl}
                          onChange={(e) => handleUpdateSecondaryBtnUrl(e.target.value)}
                          className="w-full border border-gray-200 p-2 rounded-lg font-mono text-xs focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 6. Overlay Darkness Slider */}
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-extrabold text-gray-800 uppercase tracking-wide">
                        Banner Overlay Darkness
                      </label>
                      <span className="font-mono text-xs font-bold text-black">{currentOverlayDarkness}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="90"
                      value={currentOverlayDarkness}
                      onChange={(e) => handleUpdateOverlayDarkness(Number(e.target.value))}
                      className="w-full accent-black cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 mt-6">
                <button 
                  onClick={() => setEditingSectionId(null)}
                  className="w-full bg-black text-white font-extrabold text-xs py-3 uppercase tracking-wider rounded-lg cursor-pointer hover:bg-gray-800 transition-colors shadow-md"
                >
                  Save Section Settings
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Add Section Component Library Modal */}
      {showAddSectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-xl w-full p-6 rounded-xl shadow-2xl relative space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-black uppercase">Add New Component Section</h3>
              <button onClick={() => setShowAddSectionModal(false)} className="p-1 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
              {[
                { type: 'hero', name: 'Hero Banner', desc: 'Large billboard header with video/image' },
                { type: 'product_grid', name: 'Product Grid', desc: '4-column product card layout' },
                { type: 'promo_banner', name: 'Promotional Banner', desc: 'Split hero showcase image' },
                { type: 'category_grid', name: 'Category Grid', desc: 'Category cards with tabs' },
                { type: 'newsletter', name: 'Newsletter Signup', desc: 'Email discount sign up block' }
              ].map(comp => (
                <button
                  key={comp.type}
                  onClick={() => { addSection(comp.type as SectionType); setShowAddSectionModal(false); }}
                  className="p-4 border border-gray-200 hover:border-black rounded-lg text-left hover:bg-gray-50 transition-all cursor-pointer group"
                >
                  <h4 className="font-extrabold text-xs text-black uppercase group-hover:underline">{comp.name}</h4>
                  <p className="text-[11px] text-gray-500 mt-1 font-medium">{comp.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full p-6 rounded-xl shadow-2xl relative space-y-4">
            <h3 className="font-extrabold text-base text-black uppercase">Publish Homepage Changes</h3>
            <p className="text-xs text-gray-600 font-medium">
              Publishing will update the live storefront immediately. Add a version note for your team:
            </p>
            <input 
              type="text"
              placeholder="e.g. Updated Hero Banner and Bestsellers order"
              value={publishNote}
              onChange={(e) => setPublishNote(e.target.value)}
              className="w-full border border-gray-200 p-2.5 rounded text-xs font-medium focus:outline-none focus:border-black"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-black cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handlePublish}
                className="bg-black text-white px-5 py-2 rounded text-xs font-extrabold uppercase tracking-wider cursor-pointer"
              >
                Publish Live
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-xl w-full p-6 rounded-xl shadow-2xl relative space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-black uppercase">Version History Snapshots</h3>
              <button onClick={() => setShowHistoryModal(false)} className="p-1 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {versionHistory.map((ver) => (
                <div key={ver.id} className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-xs text-black">{ver.note}</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">{ver.timestamp} • {ver.author}</p>
                  </div>
                  <button 
                    onClick={() => { restoreVersion(ver.id); setShowHistoryModal(false); }}
                    className="bg-gray-100 hover:bg-black hover:text-white text-xs font-bold px-3 py-1.5 rounded transition-colors cursor-pointer"
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
