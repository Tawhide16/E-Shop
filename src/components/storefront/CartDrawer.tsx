import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, ShieldCheck, Tag, Check } from 'lucide-react';
import gsap from 'gsap';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateCartQuantity, navigateToProduct, setActiveStorefrontPage } = useStore();
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [discountMsg, setDiscountMsg] = useState('');

  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCartOpen) {
      if (backdropRef.current) {
        gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      }
      if (drawerRef.current) {
        gsap.fromTo(drawerRef.current, { x: '100%' }, { x: '0%', duration: 0.35, ease: 'power3.out' });
      }
    }
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const USD_TO_BDT = 120;
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const shipping = subtotal >= 100 || subtotal === 0 ? 0 : 5;
  const grandTotalUSD = Math.max(0, subtotal - discountAmount + shipping);
  const grandTotalBDT = Math.round(grandTotalUSD * USD_TO_BDT);
  const freeShippingNeeded = Math.max(0, 100 - subtotal);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'WELCOME10') {
      setAppliedDiscount(10);
      setDiscountMsg('10% OFF Welcome Coupon Applied!');
    } else if (couponCode.toUpperCase() === 'STUDENT15') {
      setAppliedDiscount(15);
      setDiscountMsg('15% OFF Student Discount Applied!');
    } else {
      setDiscountMsg('Invalid coupon code. Try WELCOME10 or STUDENT15');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        ref={backdropRef}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={() => setIsCartOpen(false)} 
      />

      {/* Cart Container */}
      <div ref={drawerRef} className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 gsap-reveal">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-black" />
            <h2 className="font-extrabold text-base uppercase tracking-tight text-black font-mono">
              Your Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
            </h2>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-1 text-gray-500 hover:text-black cursor-pointer rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-gray-50 p-3 px-6 text-xs font-semibold text-center border-b border-gray-100">
          {freeShippingNeeded > 0 ? (
            <p className="text-gray-700">
              Add <span className="font-extrabold text-black">৳{Math.round(freeShippingNeeded * USD_TO_BDT).toLocaleString()} BDT (${freeShippingNeeded.toFixed(2)})</span> more for <span className="font-extrabold text-emerald-600">FREE Bangladesh Delivery</span>
            </p>
          ) : (
            <p className="text-emerald-700 font-extrabold flex items-center justify-center gap-1">
              <Check size={14} /> You've unlocked FREE Standard Shipping in BD!
            </p>
          )}
          <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-black h-full transition-all duration-300"
              style={{ width: `${Math.min(100, (subtotal / 100) * 100)}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 divide-y divide-gray-100">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                <ShoppingBag size={28} />
              </div>
              <p className="font-bold text-gray-900 text-base">Your shopping bag is empty</p>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Explore our gymwear catalog and upgrade your performance style today.
              </p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-4 bg-black text-white font-extrabold text-xs px-6 py-3 uppercase tracking-wider hover:bg-gray-800 transition-colors cursor-pointer rounded-md shadow-md"
              >
                Shop Gymwear
              </button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="pt-4 first:pt-0 flex gap-4">
                <img 
                  src={item.product.images[0]} 
                  alt={item.product.name}
                  onClick={() => { setIsCartOpen(false); navigateToProduct(item.product.id); }}
                  className="w-20 h-24 object-cover rounded-md cursor-pointer hover:opacity-90 border border-gray-100"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 
                        onClick={() => { setIsCartOpen(false); navigateToProduct(item.product.id); }}
                        className="font-bold text-xs text-gray-900 line-clamp-1 hover:underline cursor-pointer"
                      >
                        {item.product.name}
                      </h4>
                      <button 
                        onClick={() => removeFromCart(idx)}
                        className="text-gray-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-[11px] font-medium text-gray-500 mt-0.5">
                      Color: {item.color} | Size: <span className="font-bold text-black">{item.size}</span>
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="font-extrabold text-xs text-emerald-700 font-mono">
                        ৳{Math.round(item.product.price * item.quantity * USD_TO_BDT).toLocaleString()} BDT
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold">
                        (${(item.product.price * item.quantity).toFixed(2)})
                      </span>
                    </div>
                  </div>

                  {/* Quantity Controller */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-gray-200 rounded text-xs font-bold">
                      <button 
                        onClick={() => updateCartQuantity(idx, item.quantity - 1)}
                        className="p-1 px-2 text-gray-600 hover:text-black cursor-pointer"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-2 font-mono text-xs">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(idx, item.quantity + 1)}
                        className="p-1 px-2 text-gray-600 hover:text-black cursor-pointer"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-gray-200 bg-white space-y-4">
            {/* Coupon Promo Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag size={14} className="absolute left-3 top-2.5 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Promo Code (WELCOME10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded text-xs font-medium focus:outline-none focus:border-black uppercase"
                />
              </div>
              <button 
                onClick={handleApplyCoupon}
                className="bg-gray-100 hover:bg-black hover:text-white text-xs font-bold px-3 py-1.5 rounded transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>
            {discountMsg && (
              <p className={`text-[11px] font-bold ${appliedDiscount > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {discountMsg}
              </p>
            )}

            {/* Calculations */}
            <div className="space-y-1.5 text-xs font-semibold text-gray-600 border-t border-gray-100 pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-black">৳{Math.round(subtotal * USD_TO_BDT).toLocaleString()} BDT (${subtotal.toFixed(2)})</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount ({appliedDiscount}%)</span>
                  <span>-৳{Math.round(discountAmount * USD_TO_BDT).toLocaleString()} BDT</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping (BD)</span>
                <span className="font-bold text-black">{shipping === 0 ? 'FREE' : `৳${Math.round(shipping * USD_TO_BDT)} BDT`}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-black pt-2 border-t border-gray-100 font-mono">
                <span>TOTAL DUE</span>
                <span className="text-emerald-700">৳{grandTotalBDT.toLocaleString()} BDT (${grandTotalUSD.toFixed(2)})</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button 
              onClick={() => {
                setIsCartOpen(false);
                setActiveStorefrontPage('checkout');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full bg-black text-white py-3.5 font-extrabold text-xs uppercase tracking-widest hover:bg-gray-900 transition-all cursor-pointer shadow-lg rounded-xl flex items-center justify-center gap-2"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
