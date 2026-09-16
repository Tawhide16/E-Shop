import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types/cms';
import gsap from 'gsap';
import { Plus, Search, Filter, Edit, Trash2, Tag, AlertTriangle, CheckCircle, X } from 'lucide-react';

export const ProductsTab: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

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

  // New product form state
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Leggings');
  const [newGender, setNewGender] = useState<'women' | 'men' | 'unisex'>('women');
  const [newStock, setNewStock] = useState('50');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800');

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice) return;

    addProduct({
      name: newName,
      slug: newName.toLowerCase().replace(/\s+/g, '-'),
      category: newCategory,
      gender: newGender,
      price: parseFloat(newPrice),
      stock: parseInt(newStock) || 50,
      images: [newImage],
      colors: [{ name: 'Black', hex: '#000000' }],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      description: 'High performance activewear designed for peak training.',
      badge: 'NEW',
      fit: 'Regular'
    });

    setShowAddModal(false);
    setNewName('');
    setNewPrice('');
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-black">Product Catalog Management</h2>
          <p className="text-xs text-gray-500 font-semibold mt-0.5">Manage products, inventory levels, pricing, and collections</p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-black text-white text-xs font-extrabold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer shadow-md"
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by product name..."
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
            className="border border-gray-200 px-3 py-2 rounded-lg text-xs font-bold focus:outline-none focus:border-black cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Leggings">Leggings</option>
            <option value="Shorts">Shorts</option>
            <option value="Hoodies">Hoodies</option>
            <option value="Sports Bras">Sports Bras</option>
            <option value="Tops">Tops</option>
            <option value="Joggers">Joggers</option>
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase font-extrabold">
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Gender</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody ref={tableBodyRef} className="divide-y divide-gray-100 font-medium">
              {filtered.map((product) => {
                const isLowStock = product.stock < 20;
                return (
                  <tr key={product.id} className="hover:bg-gray-50/80">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={product.images[0]} alt={product.name} className="w-10 h-12 object-cover rounded-md bg-gray-100" />
                        <div>
                          <p className="font-bold text-black text-xs line-clamp-1">{product.name}</p>
                          <span className="text-[10px] text-gray-400 font-mono">{product.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-700">{product.category}</td>
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
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button 
                        onClick={() => deleteProduct(product.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-gray-100 cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form onSubmit={handleCreateProduct} className="bg-white max-w-lg w-full p-6 rounded-xl shadow-2xl space-y-4 relative">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-black uppercase">Add New Store Product</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="p-1 cursor-pointer text-gray-400 hover:text-black">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Product Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Adapt Seamless Crop Top"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border border-gray-200 p-2.5 rounded font-medium focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Price ($)</label>
                  <input 
                    type="number"
                    required
                    placeholder="55.00"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full border border-gray-200 p-2.5 rounded font-mono font-medium focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Initial Stock</label>
                  <input 
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full border border-gray-200 p-2.5 rounded font-mono font-medium focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full border border-gray-200 p-2.5 rounded font-bold focus:outline-none focus:border-black"
                  >
                    <option value="Leggings">Leggings</option>
                    <option value="Shorts">Shorts</option>
                    <option value="Hoodies">Hoodies</option>
                    <option value="Sports Bras">Sports Bras</option>
                    <option value="Tops">Tops</option>
                    <option value="Joggers">Joggers</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Gender</label>
                  <select 
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as any)}
                    className="w-full border border-gray-200 p-2.5 rounded font-bold focus:outline-none focus:border-black uppercase"
                  >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Image URL</label>
                <input 
                  type="text"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full border border-gray-200 p-2.5 rounded font-mono text-[11px] focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-black cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-black text-white px-5 py-2 rounded text-xs font-extrabold uppercase tracking-wider cursor-pointer"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
