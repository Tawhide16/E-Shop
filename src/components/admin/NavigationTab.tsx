import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { MenuItem } from '../../types/cms';
import { INITIAL_MENU_ITEMS } from '../../data/initialData';
import { 
  Plus, 
  Trash2, 
  Edit, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  X, 
  Menu, 
  ChevronRight, 
  ChevronDown, 
  Layers, 
  Link as LinkIcon, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  FolderPlus
} from 'lucide-react';

export const NavigationTab: React.FC = () => {
  const { menuItems, updateMenuItems, themeSettings, setActiveView, setActiveStorefrontPage } = useStore();

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Menu Item Form State
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newIsMega, setNewIsMega] = useState(false);

  // Edit Menu Item Form State
  const [editLabel, setEditLabel] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editIsMega, setEditIsMega] = useState(false);
  const [editChildren, setEditChildren] = useState<MenuItem['children']>([]);

  // Sub-item add state
  const [newSubGroupTitle, setNewSubGroupTitle] = useState('');
  const [newSubItemLabel, setNewSubItemLabel] = useState('');
  const [newSubItemUrl, setNewSubItemUrl] = useState('');
  const [selectedGroupIdx, setSelectedGroupIdx] = useState<number>(0);

  // Success notice
  const [savedNotice, setSavedNotice] = useState(false);

  const triggerNotice = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  // Reordering
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= menuItems.length) return;

    const updated = [...menuItems];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    updateMenuItems(updated);
    triggerNotice();
  };

  // Deletion
  const handleRemove = (id: string, label: string) => {
    if (window.confirm(`Are you sure you want to remove "${label}" from the navbar?`)) {
      const updated = menuItems.filter(item => item.id !== id);
      updateMenuItems(updated);
      triggerNotice();
    }
  };

  // Add Item
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const cleanLabel = newLabel.trim().toUpperCase();
    const cleanUrl = newUrl.trim() || `/shop`;

    const newItem: MenuItem = {
      id: `menu-${Date.now()}`,
      label: cleanLabel,
      url: cleanUrl,
      isMegaMenu: newIsMega,
      children: newIsMega ? [
        {
          title: 'CATEGORIES',
          items: [
            { label: 'All Items', url: '/shop' },
            { label: 'Bestsellers', url: '/shop?badge=BESTSELLER' }
          ]
        }
      ] : undefined
    };

    updateMenuItems([...menuItems, newItem]);
    setNewLabel('');
    setNewUrl('');
    setNewIsMega(false);
    setShowAddModal(false);
    triggerNotice();
  };

  // Open Edit Modal
  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setEditLabel(item.label);
    setEditUrl(item.url || '');
    setEditIsMega(!!item.isMegaMenu);
    setEditChildren(item.children ? JSON.parse(JSON.stringify(item.children)) : []);
    setSelectedGroupIdx(0);
  };

  // Save Edit Item
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editLabel.trim()) return;

    const updated = menuItems.map(item => {
      if (item.id === editingItem.id) {
        return {
          ...item,
          label: editLabel.trim().toUpperCase(),
          url: editUrl.trim() || '/shop',
          isMegaMenu: editIsMega,
          children: editIsMega ? editChildren : undefined
        };
      }
      return item;
    });

    updateMenuItems(updated);
    setEditingItem(null);
    triggerNotice();
  };

  // Sub-items management in Edit Modal
  const handleAddSubGroup = () => {
    if (!newSubGroupTitle.trim()) return;
    const updated = [...(editChildren || []), {
      title: newSubGroupTitle.trim().toUpperCase(),
      items: []
    }];
    setEditChildren(updated);
    setNewSubGroupTitle('');
    setSelectedGroupIdx(updated.length - 1);
  };

  const handleAddSubItem = (groupIdx: number) => {
    if (!newSubItemLabel.trim()) return;
    const updated = [...(editChildren || [])];
    if (!updated[groupIdx]) return;

    updated[groupIdx].items.push({
      label: newSubItemLabel.trim(),
      url: newSubItemUrl.trim() || '/shop'
    });

    setEditChildren(updated);
    setNewSubItemLabel('');
    setNewSubItemUrl('');
  };

  const handleRemoveSubItem = (groupIdx: number, itemIdx: number) => {
    const updated = [...(editChildren || [])];
    if (!updated[groupIdx]) return;
    updated[groupIdx].items.splice(itemIdx, 1);
    setEditChildren(updated);
  };

  const handleRemoveSubGroup = (groupIdx: number) => {
    const updated = [...(editChildren || [])];
    updated.splice(groupIdx, 1);
    setEditChildren(updated);
    if (selectedGroupIdx >= updated.length) {
      setSelectedGroupIdx(Math.max(0, updated.length - 1));
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset navbar menus back to the default Gymshark layout?')) {
      updateMenuItems(INITIAL_MENU_ITEMS);
      triggerNotice();
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header Card */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-black flex items-center gap-2">
            <Menu size={18} />
            <span>Storefront Navbar & Menu Management</span>
          </h2>
          <p className="text-xs text-gray-500 font-semibold mt-0.5">
            Add, edit labels, customize dropdown links, reorder or remove menus from your top header
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button 
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer border border-gray-200"
            title="Restore original menu layout"
          >
            <RotateCcw size={13} />
            <span>Reset Defaults</span>
          </button>

          <button 
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-black text-white text-xs font-extrabold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer shadow-md"
          >
            <Plus size={16} />
            <span>Add Menu Item</span>
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="bg-emerald-500 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <Check size={16} />
          <span>Navbar menus updated and saved successfully!</span>
        </div>
      )}

      {/* Live Header Navbar Preview */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-mono">
            Live Navbar Preview (Desktop Header)
          </span>
          <button
            onClick={() => {
              setActiveView('storefront');
              setActiveStorefrontPage('home');
            }}
            className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>View Live Storefront</span>
            <ExternalLink size={12} />
          </button>
        </div>

        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs bg-white">
          <div className="px-6 h-14 border-b border-gray-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              {themeSettings?.logoUrl ? (
                <img src={themeSettings.logoUrl} alt="Logo" className="h-6 object-contain" />
              ) : (
                <div className="flex items-center gap-1 font-mono font-black text-black">
                  <span className="bg-black text-white px-1 text-xs">GS</span>
                  <span className="text-sm tracking-tight font-extrabold">GYMSHARK</span>
                </div>
              )}

              {/* Navigation Items Preview */}
              <div className="flex items-center gap-5 text-xs font-bold text-gray-800">
                <span className="text-black font-extrabold border-b-2 border-black pb-0.5">SHOP ALL</span>
                {menuItems.map(item => (
                  <span 
                    key={item.id} 
                    className="hover:text-black cursor-default flex items-center gap-1 font-semibold uppercase text-gray-600"
                  >
                    {item.label}
                    {item.isMegaMenu && <ChevronDown size={11} className="text-gray-400" />}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-[10px] text-gray-400 font-mono">
              Total {menuItems.length} Menus Active
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items Table / List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase text-gray-600 tracking-wider">
            Current Header Navigation Menus ({menuItems.length})
          </span>
          <span className="text-[11px] text-gray-400 font-medium">
            Use arrows to reorder, click edit to modify, or trash to remove
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {menuItems.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p className="font-bold text-sm">No custom menu items currently active</p>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="mt-3 bg-black text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-800 cursor-pointer inline-flex items-center gap-1"
              >
                <Plus size={14} /> Add First Menu
              </button>
            </div>
          ) : (
            menuItems.map((item, idx) => {
              const subCount = item.children?.reduce((acc, g) => acc + (g.items?.length || 0), 0) || 0;

              return (
                <div 
                  key={item.id}
                  className="p-3.5 sm:px-6 flex items-center justify-between gap-4 hover:bg-gray-50/80 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-[11px] font-mono font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-xs text-black uppercase tracking-wide">
                          {item.label}
                        </h4>
                        {item.isMegaMenu ? (
                          <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Layers size={10} /> Dropdown Menu ({subCount} links)
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Direct Link
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                        URL: {item.url || '/shop'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Reorder Up */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="p-1.5 text-gray-400 hover:text-black rounded hover:bg-gray-200 disabled:opacity-20 cursor-pointer transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp size={14} />
                    </button>

                    {/* Reorder Down */}
                    <button
                      type="button"
                      disabled={idx === menuItems.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-1.5 text-gray-400 hover:text-black rounded hover:bg-gray-200 disabled:opacity-20 cursor-pointer transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>

                    {/* Edit Menu */}
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-gray-600 hover:text-black rounded hover:bg-gray-200 cursor-pointer transition-colors ml-1"
                      title="Edit Menu Label & Links"
                    >
                      <Edit size={14} />
                    </button>

                    {/* Remove Menu */}
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id, item.label)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 cursor-pointer transition-colors"
                      title="Remove Menu Item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ================= ADD MENU ITEM MODAL ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form onSubmit={handleAddSubmit} className="bg-white max-w-md w-full p-6 rounded-2xl shadow-2xl space-y-4 relative">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="font-extrabold text-sm text-black uppercase">Add New Navbar Menu</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="p-1 text-gray-400 hover:text-black cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Menu Label *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. OUTLET, NEW ARRIVALS, WINTER WEAR"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full border border-gray-200 p-2.5 rounded-xl font-bold uppercase focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Destination URL / Route</label>
                <input
                  type="text"
                  placeholder="e.g. /shop, /category/leggings, /collections/sale"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full border border-gray-200 p-2.5 rounded-xl font-mono text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={newIsMega}
                    onChange={(e) => setNewIsMega(e.target.checked)}
                    className="w-4 h-4 rounded text-black focus:ring-black"
                  />
                  <span>Enable Mega Menu Dropdown for this item</span>
                </label>
                <p className="text-[11px] text-gray-400 mt-1 pl-6">
                  Allows customers to hover and browse sub-categories and collections.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-black cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-black text-white px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider hover:bg-gray-800 cursor-pointer shadow-md"
              >
                Add Menu Item
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= EDIT MENU ITEM MODAL ================= */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <form onSubmit={handleEditSubmit} className="bg-white max-w-lg w-full p-6 rounded-2xl shadow-2xl space-y-4 my-8 relative">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-sm text-black uppercase">Edit Navbar Menu</h3>
                <p className="text-[11px] text-gray-400 font-mono">{editingItem.id}</p>
              </div>
              <button type="button" onClick={() => setEditingItem(null)} className="p-1 text-gray-400 hover:text-black cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Menu Label *</label>
                <input
                  type="text"
                  required
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  className="w-full border border-gray-200 p-2.5 rounded-xl font-bold uppercase focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Destination URL / Route</label>
                <input
                  type="text"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  placeholder="/shop"
                  className="w-full border border-gray-200 p-2.5 rounded-xl font-mono text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div className="pt-1 pb-2 border-b border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={editIsMega}
                    onChange={(e) => setEditIsMega(e.target.checked)}
                    className="w-4 h-4 rounded text-black focus:ring-black"
                  />
                  <span>Enable Mega Menu Dropdown with Sub-Links</span>
                </label>
              </div>

              {/* Sub-links editor if Mega Menu is enabled */}
              {editIsMega && (
                <div className="space-y-3 pt-1 bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold uppercase text-[11px] text-gray-700">
                      Dropdown Columns & Sub-Links
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {editChildren?.length || 0} columns
                    </span>
                  </div>

                  {/* Add New Column Header */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add New Column (e.g. CATEGORIES, COLLECTIONS)"
                      value={newSubGroupTitle}
                      onChange={(e) => setNewSubGroupTitle(e.target.value)}
                      className="flex-1 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-semibold focus:outline-none focus:border-black"
                    />
                    <button
                      type="button"
                      onClick={handleAddSubGroup}
                      disabled={!newSubGroupTitle.trim()}
                      className="bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-lg disabled:opacity-40 cursor-pointer"
                    >
                      + Add Column
                    </button>
                  </div>

                  {/* Columns List */}
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-gray-200">
                    {editChildren && editChildren.map((group, gIdx) => (
                      <div key={gIdx} className="pt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-black uppercase font-mono">
                            {group.title || `Column ${gIdx + 1}`}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubGroup(gIdx)}
                            className="text-[10px] text-red-600 hover:underline font-bold"
                          >
                            Delete Column
                          </button>
                        </div>

                        {/* Items under this column */}
                        <div className="space-y-1 pl-2 border-l-2 border-gray-300">
                          {group.items.map((sub, sIdx) => (
                            <div key={sIdx} className="flex items-center justify-between text-[11px] bg-white p-1.5 rounded border border-gray-200">
                              <span className="font-semibold text-gray-800">{sub.label}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400 font-mono text-[9px]">{sub.url}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSubItem(gIdx, sIdx)}
                                  className="text-gray-400 hover:text-red-600 p-0.5 cursor-pointer"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            </div>
                          ))}

                          {/* Quick add sub-item under this column */}
                          <div className="flex gap-1.5 pt-1">
                            <input
                              type="text"
                              placeholder="Sub-link name (e.g. Shorts)"
                              value={selectedGroupIdx === gIdx ? newSubItemLabel : ''}
                              onFocus={() => setSelectedGroupIdx(gIdx)}
                              onChange={(e) => {
                                setSelectedGroupIdx(gIdx);
                                setNewSubItemLabel(e.target.value);
                              }}
                              className="flex-1 bg-white border border-gray-200 px-2 py-1 rounded text-[11px] focus:outline-none focus:border-black"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddSubItem(gIdx)}
                              disabled={selectedGroupIdx !== gIdx || !newSubItemLabel.trim()}
                              className="bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded disabled:opacity-30 cursor-pointer"
                            >
                              + Add Link
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-black cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-black text-white px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider hover:bg-gray-800 cursor-pointer shadow-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
