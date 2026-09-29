import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types/cms';
import gsap from 'gsap';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  FolderPlus, 
  Tag, 
  Check, 
  X, 
  Layers, 
  AlertCircle,
  Sparkles,
  CheckSquare,
  Square,
  MinusSquare,
  SlidersHorizontal,
  DollarSign,
  Package,
  TrendingDown,
  TrendingUp,
  Percent,
  CheckCircle2,
  ArrowUpDown
} from 'lucide-react';
import { ImageUploadDropzone } from '../common/ImageUploadDropzone';

export const ProductsTab: React.FC = () => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    bulkUpdateProducts,
    bulkDeleteProducts,
    categories, 
    addCategory, 
    updateCategory, 
    deleteCategory 
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Bulk Selection & Edit State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [bulkSuccessMsg, setBulkSuccessMsg] = useState<string | null>(null);

  // Bulk Edit Form State
  const [applyCategory, setApplyCategory] = useState(false);
  const [bulkCategory, setBulkCategory] = useState(categories[0] || 'Leggings');

  const [applyPrice, setApplyPrice] = useState(false);
  const [bulkPriceMode, setBulkPriceMode] = useState<'fixed' | 'discount_pct' | 'increase_pct' | 'adjust_fixed'>('discount_pct');
  const [bulkPriceValue, setBulkPriceValue] = useState('10');

  const [applyStock, setApplyStock] = useState(false);
  const [bulkStockMode, setBulkStockMode] = useState<'set' | 'add'>('set');
  const [bulkStockValue, setBulkStockValue] = useState('50');

  const [applyGender, setApplyGender] = useState(false);
  const [bulkGender, setBulkGender] = useState<'women' | 'men' | 'unisex'>('women');

  const [applyBadge, setApplyBadge] = useState(false);
  const [bulkBadge, setBulkBadge] = useState<'NEW' | 'BESTSELLER' | 'SALE' | 'LIMITED' | 'TRENDING' | 'NONE'>('SALE');

  // Category management local state
  const [newCatInput, setNewCatInput] = useState('');
  const [editingCatOldName, setEditingCatOldName] = useState<string | null>(null);
  const [editingCatNewName, setEditingCatNewName] = useState('');
  const [catError, setCatError] = useState<string | null>(null);

  // New product form state
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState(categories[0] || 'Leggings');
  const [newGender, setNewGender] = useState<'women' | 'men' | 'unisex'>('women');
  const [newStock, setNewStock] = useState('50');
  const [newImages, setNewImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800'
  ]);

  // Edit product form state
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editGender, setEditGender] = useState<'women' | 'men' | 'unisex'>('women');
  const [editStock, setEditStock] = useState('');
  const [editImages, setEditImages] = useState<string[]>([]);

  const tableBodyRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    if (tableBodyRef.current) {
      gsap.fromTo(
        tableBodyRef.current.children,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: 'power1.out' }
      );
    }
  }, [searchTerm, categoryFilter, products.length]);

  // Keep newCategory in sync if categories change
  useEffect(() => {
    if (categories.length > 0 && !categories.includes(newCategory)) {
      setNewCategory(categories[0]);
    }
    if (categories.length > 0 && !categories.includes(bulkCategory)) {
      setBulkCategory(categories[0]);
    }
  }, [categories, newCategory, bulkCategory]);

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Bulk Selection Handlers
  const isAllSelected = filtered.length > 0 && filtered.every(p => selectedIds.includes(p.id));
  const isPartiallySelected = selectedIds.length > 0 && !isAllSelected;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(p => p.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  // Bulk Edit Execution
  const handleBulkEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) return;

    bulkUpdateProducts(selectedIds, (product) => {
      const updates: Partial<Product> = {};

      if (applyCategory && bulkCategory) {
        updates.category = bulkCategory;
      }

      if (applyGender) {
        updates.gender = bulkGender;
      }

      if (applyBadge) {
        updates.badge = bulkBadge === 'NONE' ? undefined : bulkBadge;
      }

      if (applyPrice) {
        const val = parseFloat(bulkPriceValue) || 0;
        let newP = product.price;

        if (bulkPriceMode === 'fixed') {
          newP = Math.max(0.01, val);
        } else if (bulkPriceMode === 'discount_pct') {
          newP = Math.max(0.01, product.price * (1 - val / 100));
        } else if (bulkPriceMode === 'increase_pct') {
          newP = Math.max(0.01, product.price * (1 + val / 100));
        } else if (bulkPriceMode === 'adjust_fixed') {
          newP = Math.max(0.01, product.price + val);
        }
        updates.price = Math.round(newP * 100) / 100;
      }

      if (applyStock) {
        const val = parseInt(bulkStockValue) || 0;
        if (bulkStockMode === 'set') {
          updates.stock = Math.max(0, val);
        } else if (bulkStockMode === 'add') {
          updates.stock = Math.max(0, product.stock + val);
        }
      }

      return updates;
    });

    setBulkSuccessMsg(`Successfully updated ${selectedIds.length} products!`);
    setTimeout(() => setBulkSuccessMsg(null), 3000);
    setShowBulkEditModal(false);
    setSelectedIds([]);
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;

    if (window.confirm(`Are you sure you want to permanently delete ${selectedIds.length} selected products?`)) {
      bulkDeleteProducts(selectedIds);
      setBulkSuccessMsg(`Deleted ${selectedIds.length} products.`);
      setTimeout(() => setBulkSuccessMsg(null), 3000);
      setSelectedIds([]);
    }
  };

  // Single Product Create
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPrice) return;

    addProduct({
      name: newName.trim(),
      slug: newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: newCategory,
      gender: newGender,
      price: parseFloat(newPrice) || 0,
      stock: parseInt(newStock) || 50,
      images: newImages.length > 0 ? newImages : ['https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800'],
      colors: [{ name: 'Black', hex: '#000000' }],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      description: 'High performance athletic activewear engineered for maximum movement and peak support.',
      badge: 'NEW',
      fit: 'Regular'
    });

    setShowAddModal(false);
    setNewName('');
    setNewPrice('');
    setNewStock('50');
    setNewImages(['https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800']);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditPrice(product.price.toString());
    setEditCategory(product.category);
    setEditGender(product.gender);
    setEditStock(product.stock.toString());
    setEditImages(product.images || []);
  };

  const handleUpdateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editName.trim() || !editPrice) return;

    updateProduct(editingProduct.id, {
      name: editName.trim(),
      price: parseFloat(editPrice) || editingProduct.price,
      category: editCategory,
      gender: editGender,
      stock: parseInt(editStock) || editingProduct.stock,
      images: editImages.length > 0 ? editImages : editingProduct.images
    });

    setEditingProduct(null);
  };

  // Category Actions
  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatInput.trim();
    if (!trimmed) return;
    if (categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      setCatError('This category already exists!');
      return;
    }
    addCategory(trimmed);
    setNewCatInput('');
    setCatError(null);
  };

  const handleStartEditCat = (cat: string) => {
    setEditingCatOldName(cat);
    setEditingCatNewName(cat);
    setCatError(null);
  };

  const handleSaveEditCat = () => {
    if (!editingCatOldName) return;
    const trimmed = editingCatNewName.trim();
    if (!trimmed) return;
    if (categories.some(c => c.toLowerCase() === trimmed.toLowerCase() && c.toLowerCase() !== editingCatOldName.toLowerCase())) {
      setCatError('Another category already has this name!');
      return;
    }
    updateCategory(editingCatOldName, trimmed);
    setEditingCatOldName(null);
    setEditingCatNewName('');
    setCatError(null);
  };

  const handleDeleteCat = (cat: string) => {
    const count = products.filter(p => p.category === cat).length;
    const confirmMsg = count > 0
      ? `Are you sure you want to remove "${cat}"? ${count} product(s) in this category will be reassigned.`
      : `Remove category "${cat}"?`;
    
    if (window.confirm(confirmMsg)) {
      deleteCategory(cat);
      if (categoryFilter === cat) {
        setCategoryFilter('All');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-black flex items-center gap-2">
            <span>Product Catalog & Inventory</span>
          </h2>
          <p className="text-xs text-gray-500 font-semibold mt-0.5">
            Bulk edit pricing, stock levels, categories, direct image uploads, and collections
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Manage Categories Button */}
          <button 
            type="button"
            onClick={() => setShowCategoryModal(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-black text-xs font-extrabold px-3.5 py-2.5 rounded-lg transition-colors cursor-pointer border border-gray-200"
            title="Add, edit or delete categories"
          >
            <FolderPlus size={15} />
            <span>Manage Categories ({categories.length})</span>
          </button>

          {/* Add Product Button */}
          <button 
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-black text-white text-xs font-extrabold px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer shadow-md"
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Bulk Operation Success Toast */}
      {bulkSuccessMsg && (
        <div className="bg-emerald-500 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-md flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{bulkSuccessMsg}</span>
          </div>
          <button type="button" onClick={() => setBulkSuccessMsg(null)} className="cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by product name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:border-black"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={14} className="text-gray-400" />
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-200 px-3 py-2 rounded-lg text-xs font-bold focus:outline-none focus:border-black cursor-pointer bg-white"
          >
            <option value="All">All Categories ({products.length})</option>
            {categories.map((cat) => {
              const count = products.filter(p => p.category === cat).length;
              return (
                <option key={cat} value={cat}>
                  {cat} ({count})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Floating / Sticky Bulk Action Bar (When 1+ items selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-neutral-900 text-white p-3.5 px-5 rounded-xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-150 border border-neutral-800">
          <div className="flex items-center gap-3">
            <span className="bg-white text-black font-extrabold text-xs px-2.5 py-1 rounded-md font-mono">
              {selectedIds.length} Selected
            </span>
            <span className="text-xs text-neutral-300 font-semibold hidden md:inline">
              of {filtered.length} products
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            {/* Bulk Edit Button */}
            <button
              type="button"
              onClick={() => setShowBulkEditModal(true)}
              className="bg-white hover:bg-neutral-200 text-black text-xs font-extrabold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm transition-transform active:scale-95"
            >
              <SlidersHorizontal size={14} />
              <span>Bulk Edit ({selectedIds.length})</span>
            </button>

            {/* Quick 10% Off */}
            <button
              type="button"
              onClick={() => {
                bulkUpdateProducts(selectedIds, p => ({
                  price: Math.round(p.price * 0.9 * 100) / 100,
                  badge: 'SALE'
                }));
                setBulkSuccessMsg(`Applied 10% discount to ${selectedIds.length} products!`);
                setTimeout(() => setBulkSuccessMsg(null), 3000);
                setSelectedIds([]);
              }}
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              title="Apply 10% discount and SALE badge"
            >
              <Percent size={13} className="text-amber-400" />
              <span>Quick 10% Off</span>
            </button>

            {/* Bulk Delete Button */}
            <button
              type="button"
              onClick={handleBulkDelete}
              className="bg-red-600/90 hover:bg-red-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              title="Delete all selected products"
            >
              <Trash2 size={13} />
              <span>Delete Selected</span>
            </button>

            {/* Clear Selection */}
            <button
              type="button"
              onClick={handleClearSelection}
              className="text-neutral-400 hover:text-white p-1.5 rounded hover:bg-neutral-800 cursor-pointer transition-colors"
              title="Deselect all"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Product Table with Checkboxes */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase font-extrabold">
                <th className="py-3.5 px-4 w-10 text-center">
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className="p-1 rounded hover:bg-gray-200 text-gray-600 cursor-pointer inline-flex items-center justify-center transition-colors"
                    title={isAllSelected ? "Deselect all" : "Select all in view"}
                  >
                    {isAllSelected ? (
                      <CheckSquare size={16} className="text-black" />
                    ) : isPartiallySelected ? (
                      <MinusSquare size={16} className="text-black" />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Gender</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Badge</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody ref={tableBodyRef} className="divide-y divide-gray-100 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <p className="font-bold text-sm">No products found</p>
                    <p className="text-xs mt-1">Try selecting another category or add a new product</p>
                  </td>
                </tr>
              ) : (
                filtered.map((product) => {
                  const isSelected = selectedIds.includes(product.id);
                  const isLowStock = product.stock < 20;
                  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800';

                  return (
                    <tr 
                      key={product.id} 
                      className={`transition-colors ${
                        isSelected ? 'bg-neutral-50/90' : 'hover:bg-gray-50/80'
                      }`}
                    >
                      {/* Checkbox column */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleSelect(product.id)}
                          className="p-1 rounded text-gray-500 hover:text-black cursor-pointer inline-flex items-center justify-center transition-colors"
                        >
                          {isSelected ? (
                            <CheckSquare size={16} className="text-black" />
                          ) : (
                            <Square size={16} className="text-gray-400" />
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={mainImage} 
                            alt={product.name} 
                            className="w-10 h-12 object-cover rounded-md bg-gray-100 border border-gray-200 shrink-0" 
                          />
                          <div>
                            <p className="font-bold text-black text-xs line-clamp-1">{product.name}</p>
                            <span className="text-[10px] text-gray-400 font-mono">{product.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-block bg-gray-100 text-gray-800 text-[11px] font-bold px-2.5 py-1 rounded-md">
                          {product.category}
                        </span>
                      </td>

                      <td className="py-3 px-4 uppercase text-gray-500 font-bold text-[10px]">{product.gender}</td>

                      <td className="py-3 px-4 font-mono font-extrabold text-black">${product.price.toFixed(2)}</td>

                      <td className="py-3 px-4">
                        <span className={`font-mono font-extrabold px-2 py-0.5 rounded text-[10px] ${
                          isLowStock ? 'bg-amber-100 text-amber-900' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.stock} units
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {product.badge ? (
                          <span className="bg-black text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                            {product.badge}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-[10px]">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right space-x-1">
                        <button 
                          type="button"
                          onClick={() => openEditModal(product)}
                          className="p-1.5 text-gray-500 hover:text-black rounded hover:bg-gray-100 cursor-pointer inline-flex items-center justify-center transition-colors"
                          title="Edit product & images"
                        >
                          <Edit size={15} />
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete product "${product.name}"?`)) {
                              deleteProduct(product.id);
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-gray-100 cursor-pointer inline-flex items-center justify-center transition-colors"
                          title="Delete product"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= BULK EDIT MODAL ================= */}
      {showBulkEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <form onSubmit={handleBulkEditSubmit} className="bg-white max-w-lg w-full p-6 rounded-2xl shadow-2xl space-y-5 my-8 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-base text-black uppercase flex items-center gap-2">
                  <SlidersHorizontal size={18} />
                  <span>Bulk Edit Products</span>
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Updating <span className="font-bold text-black font-mono">{selectedIds.length}</span> selected product{selectedIds.length > 1 ? 's' : ''} simultaneously
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowBulkEditModal(false)} 
                className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-[11px] text-gray-400 font-semibold">
              Check the fields you want to update on all {selectedIds.length} selected items:
            </p>

            <div className="space-y-4 text-xs">
              {/* Field 1: Category */}
              <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={applyCategory}
                    onChange={(e) => setApplyCategory(e.target.checked)}
                    className="w-4 h-4 rounded text-black focus:ring-black"
                  />
                  <span className="uppercase text-[11px] tracking-wide">Change Category</span>
                </label>

                {applyCategory && (
                  <div className="pl-6 pt-1">
                    <select
                      value={bulkCategory}
                      onChange={(e) => setBulkCategory(e.target.value)}
                      className="w-full bg-white border border-gray-300 p-2 rounded-lg font-bold text-xs focus:outline-none focus:border-black"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Field 2: Pricing */}
              <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={applyPrice}
                    onChange={(e) => setApplyPrice(e.target.checked)}
                    className="w-4 h-4 rounded text-black focus:ring-black"
                  />
                  <span className="uppercase text-[11px] tracking-wide">Adjust Pricing</span>
                </label>

                {applyPrice && (
                  <div className="pl-6 pt-1 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={bulkPriceMode}
                        onChange={(e) => setBulkPriceMode(e.target.value as any)}
                        className="bg-white border border-gray-300 p-2 rounded-lg font-bold text-[11px] focus:outline-none focus:border-black"
                      >
                        <option value="discount_pct">Discount by Percentage (%)</option>
                        <option value="increase_pct">Increase by Percentage (%)</option>
                        <option value="fixed">Set Exact Price ($)</option>
                        <option value="adjust_fixed">Adjust by Fixed Amount ($)</option>
                      </select>

                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={bulkPriceValue}
                          onChange={(e) => setBulkPriceValue(e.target.value)}
                          placeholder="e.g. 15"
                          className="w-full bg-white border border-gray-300 p-2 rounded-lg font-mono font-bold text-xs focus:outline-none focus:border-black"
                        />
                        <span className="absolute right-2.5 top-2 text-gray-400 font-bold text-[11px]">
                          {bulkPriceMode.includes('pct') ? '%' : '$'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Field 3: Stock / Inventory */}
              <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={applyStock}
                    onChange={(e) => setApplyStock(e.target.checked)}
                    className="w-4 h-4 rounded text-black focus:ring-black"
                  />
                  <span className="uppercase text-[11px] tracking-wide">Adjust Stock / Inventory</span>
                </label>

                {applyStock && (
                  <div className="pl-6 pt-1 grid grid-cols-2 gap-2">
                    <select
                      value={bulkStockMode}
                      onChange={(e) => setBulkStockMode(e.target.value as any)}
                      className="bg-white border border-gray-300 p-2 rounded-lg font-bold text-[11px] focus:outline-none focus:border-black"
                    >
                      <option value="set">Set Stock to Exact Number</option>
                      <option value="add">Add Units to Current Stock</option>
                    </select>

                    <input
                      type="number"
                      required
                      value={bulkStockValue}
                      onChange={(e) => setBulkStockValue(e.target.value)}
                      placeholder="e.g. 50"
                      className="w-full bg-white border border-gray-300 p-2 rounded-lg font-mono font-bold text-xs focus:outline-none focus:border-black"
                    />
                  </div>
                )}
              </div>

              {/* Field 4: Gender */}
              <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={applyGender}
                    onChange={(e) => setApplyGender(e.target.checked)}
                    className="w-4 h-4 rounded text-black focus:ring-black"
                  />
                  <span className="uppercase text-[11px] tracking-wide">Set Gender Filter</span>
                </label>

                {applyGender && (
                  <div className="pl-6 pt-1">
                    <select
                      value={bulkGender}
                      onChange={(e) => setBulkGender(e.target.value as any)}
                      className="w-full bg-white border border-gray-300 p-2 rounded-lg font-bold text-xs uppercase focus:outline-none focus:border-black"
                    >
                      <option value="women">Women</option>
                      <option value="men">Men</option>
                      <option value="unisex">Unisex</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Field 5: Badge */}
              <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={applyBadge}
                    onChange={(e) => setApplyBadge(e.target.checked)}
                    className="w-4 h-4 rounded text-black focus:ring-black"
                  />
                  <span className="uppercase text-[11px] tracking-wide">Change Product Badge</span>
                </label>

                {applyBadge && (
                  <div className="pl-6 pt-1">
                    <select
                      value={bulkBadge}
                      onChange={(e) => setBulkBadge(e.target.value as any)}
                      className="w-full bg-white border border-gray-300 p-2 rounded-lg font-bold text-xs uppercase focus:outline-none focus:border-black"
                    >
                      <option value="NEW">NEW</option>
                      <option value="SALE">SALE</option>
                      <option value="BESTSELLER">BESTSELLER</option>
                      <option value="LIMITED">LIMITED</option>
                      <option value="TRENDING">TRENDING</option>
                      <option value="NONE">None (Clear Badge)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button 
                type="button" 
                onClick={() => setShowBulkEditModal(false)}
                className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-black cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={!applyCategory && !applyPrice && !applyStock && !applyGender && !applyBadge}
                className="bg-black text-white px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider hover:bg-gray-800 cursor-pointer shadow-md disabled:opacity-40"
              >
                Apply Changes to {selectedIds.length} Products
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= CATEGORY MANAGEMENT MODAL ================= */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full p-6 rounded-2xl shadow-2xl space-y-4 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
                  <Tag size={16} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-black uppercase">Category Management</h3>
                  <p className="text-[11px] text-gray-400 font-medium">Add, rename, or remove product categories</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setShowCategoryModal(false)} 
                className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Add New Category Form */}
            <form onSubmit={handleAddNewCategory} className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase">Create New Category</label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="e.g. Compression Wear, Swimwear"
                  value={newCatInput}
                  onChange={(e) => setNewCatInput(e.target.value)}
                  className="flex-1 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                />
                <button
                  type="submit"
                  disabled={!newCatInput.trim()}
                  className="bg-black text-white text-xs font-extrabold px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40 cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <Plus size={15} />
                  <span>Add</span>
                </button>
              </div>
              {catError && (
                <p className="text-[11px] text-red-600 font-semibold flex items-center gap-1">
                  <AlertCircle size={12} /> {catError}
                </p>
              )}
            </form>

            {/* Category List */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <span>Existing Categories ({categories.length})</span>
                <span>Products</span>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1 divide-y divide-gray-50">
                {categories.map((cat) => {
                  const productCount = products.filter(p => p.category === cat).length;
                  const isEditing = editingCatOldName === cat;

                  return (
                    <div 
                      key={cat}
                      className="pt-1.5 flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      {isEditing ? (
                        <div className="flex-1 flex items-center gap-1.5">
                          <input 
                            type="text"
                            value={editingCatNewName}
                            onChange={(e) => setEditingCatNewName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEditCat();
                              if (e.key === 'Escape') setEditingCatOldName(null);
                            }}
                            autoFocus
                            className="flex-1 border border-black px-2 py-1 rounded text-xs font-bold focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleSaveEditCat}
                            className="p-1 bg-black text-white rounded hover:bg-gray-800 cursor-pointer"
                            title="Save"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCatOldName(null)}
                            className="p-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 cursor-pointer"
                            title="Cancel"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-black">{cat}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              {productCount} items
                            </span>
                            <button
                              type="button"
                              onClick={() => handleStartEditCat(cat)}
                              className="p-1 text-gray-400 hover:text-black rounded hover:bg-gray-200 cursor-pointer transition-colors"
                              title="Rename category"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCat(cat)}
                              className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 cursor-pointer transition-colors"
                              title="Delete category"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="bg-black text-white text-xs font-extrabold px-5 py-2.5 rounded-xl hover:bg-gray-800 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD PRODUCT MODAL ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <form onSubmit={handleCreateProduct} className="bg-white max-w-lg w-full p-6 rounded-2xl shadow-2xl space-y-4 my-8 relative">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-black uppercase">Add New Store Product</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="p-1 cursor-pointer text-gray-400 hover:text-black">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Product Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Adapt Seamless Crop Top"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border border-gray-200 p-2.5 rounded-xl font-medium focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Price ($)</label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    placeholder="55.00"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full border border-gray-200 p-2.5 rounded-xl font-mono font-medium focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Initial Stock</label>
                  <input 
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full border border-gray-200 p-2.5 rounded-xl font-mono font-medium focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-gray-700 uppercase">Category</label>
                    <button
                      type="button"
                      onClick={() => setShowCategoryModal(true)}
                      className="text-[10px] text-blue-600 hover:underline font-bold"
                    >
                      + New
                    </button>
                  </div>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full border border-gray-200 p-2.5 rounded-xl font-bold focus:outline-none focus:border-black bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Gender</label>
                  <select 
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as any)}
                    className="w-full border border-gray-200 p-2.5 rounded-xl font-bold focus:outline-none focus:border-black uppercase bg-white"
                  >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>
              </div>

              {/* Direct Image Upload Dropzone */}
              <div className="pt-1">
                <ImageUploadDropzone 
                  value={newImages}
                  onChange={(imgs) => setNewImages(imgs)}
                  multiple={true}
                  label="Upload Product Images (Direct File Upload)"
                  helperText="Drop pictures from your computer or phone (Auto-compressed)"
                  aspectRatio="square"
                />
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
                className="bg-black text-white px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider cursor-pointer shadow-md hover:bg-gray-800"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= EDIT PRODUCT MODAL ================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <form onSubmit={handleUpdateProductSubmit} className="bg-white max-w-lg w-full p-6 rounded-2xl shadow-2xl space-y-4 my-8 relative">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-base text-black uppercase">Edit Product</h3>
                <p className="text-[11px] text-gray-400 font-mono">{editingProduct.id}</p>
              </div>
              <button 
                type="button" 
                onClick={() => setEditingProduct(null)} 
                className="p-1 cursor-pointer text-gray-400 hover:text-black"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Product Title</label>
                <input 
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-gray-200 p-2.5 rounded-xl font-medium focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Price ($)</label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full border border-gray-200 p-2.5 rounded-xl font-mono font-medium focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Stock Quantity</label>
                  <input 
                    type="number"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="w-full border border-gray-200 p-2.5 rounded-xl font-mono font-medium focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-gray-700 uppercase">Category</label>
                    <button
                      type="button"
                      onClick={() => setShowCategoryModal(true)}
                      className="text-[10px] text-blue-600 hover:underline font-bold"
                    >
                      + Manage
                    </button>
                  </div>
                  <select 
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full border border-gray-200 p-2.5 rounded-xl font-bold focus:outline-none focus:border-black bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Gender</label>
                  <select 
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value as any)}
                    className="w-full border border-gray-200 p-2.5 rounded-xl font-bold focus:outline-none focus:border-black uppercase bg-white"
                  >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>
              </div>

              {/* Direct Image Upload Dropzone */}
              <div className="pt-1">
                <ImageUploadDropzone 
                  value={editImages}
                  onChange={(imgs) => setEditImages(imgs)}
                  multiple={true}
                  label="Product Images (Upload / Replace from Device)"
                  helperText="Drop new pictures to add or replace"
                  aspectRatio="square"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button 
                type="button" 
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-black cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-black text-white px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider cursor-pointer shadow-md hover:bg-gray-800"
              >
                Update Product
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
