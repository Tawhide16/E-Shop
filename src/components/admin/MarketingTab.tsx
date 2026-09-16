import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import gsap from 'gsap';
import { Plus, Tag, Percent, Sparkles, Trash2, X } from 'lucide-react';

export const MarketingTab: React.FC = () => {
  const { coupons, addCoupon } = useStore();
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [code, setCode] = useState('');
  const [discountPct, setDiscountPct] = useState('15');

  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 15, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.08, ease: 'back.out(1.2)' }
      );
    }
  }, [coupons.length]);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    addCoupon({
      code: code.toUpperCase(),
      discountPercentage: parseInt(discountPct) || 15,
      validUntil: '2026-12-31'
    });
    setShowCouponModal(false);
    setCode('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-black">Marketing & Promotional Coupons</h2>
          <p className="text-xs text-gray-500 font-semibold mt-0.5">Manage discount codes, referral rewards, and banner campaigns</p>
        </div>

        <button 
          onClick={() => setShowCouponModal(true)}
          className="flex items-center gap-1.5 bg-black text-white text-xs font-extrabold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer shadow-md"
        >
          <Plus size={16} />
          <span>Create Coupon Code</span>
        </button>
      </div>

      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <div key={coupon.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="bg-black text-white text-xs font-mono font-black px-2.5 py-1 rounded">
                {coupon.code}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                Active
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-xl font-black text-black font-mono">{coupon.discountPercentage}% OFF</p>
              <p className="text-xs text-gray-500 font-medium">Valid until {coupon.validUntil}</p>
            </div>

            <div className="pt-2 border-t border-gray-100 flex justify-between text-xs font-extrabold text-gray-400">
              <span>Used {coupon.timesUsed} times</span>
              <span className="text-black font-mono">{coupon.id}</span>
            </div>
          </div>
        ))}
      </div>

      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form onSubmit={handleCreateCoupon} className="bg-white max-w-md w-full p-6 rounded-xl shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-black uppercase">Create Discount Code</h3>
              <button type="button" onClick={() => setShowCouponModal(false)} className="p-1 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Coupon Code</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. SUMMER20"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full border border-gray-200 p-2.5 rounded font-mono font-bold uppercase focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Discount Percentage (%)</label>
                <input 
                  type="number"
                  required
                  placeholder="20"
                  value={discountPct}
                  onChange={(e) => setDiscountPct(e.target.value)}
                  className="w-full border border-gray-200 p-2.5 rounded font-mono font-bold focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button 
                type="button" 
                onClick={() => setShowCouponModal(false)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-black cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-black text-white px-5 py-2 rounded text-xs font-extrabold uppercase tracking-wider cursor-pointer"
              >
                Save Coupon
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
