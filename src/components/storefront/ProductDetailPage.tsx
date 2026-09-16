import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PaymentIcons } from '../common/PaymentIcons';
import { 
  Star, 
  Heart, 
  Share2, 
  Flame, 
  Ruler, 
  CheckCircle2, 
  Truck, 
  Sparkles, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Wind, 
  Droplets, 
  Layers, 
  ThumbsUp, 
  Search, 
  SlidersHorizontal,
  Zap,
  Lock
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { selectedProductId, products, addToCart, toggleWishlist, wishlist, navigateToProduct, navigateToShop, setActiveStorefrontPage } = useStore();

  const product = products.find(p => p.id === selectedProductId) || products[0];

  const [selectedImage, setSelectedImage] = useState<string>(product.images[0]);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || 'Electric Pink / Sorbet Yellow');
  const [selectedSize, setSelectedSize] = useState<string>('S');
  const [deliveryAccordionOpen, setDeliveryAccordionOpen] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('All');

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, 1);
  };

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans pb-20">
      {/* Breadcrumb Navigation */}
      <div className="w-full px-4 sm:px-8 lg:px-12 py-3 border-b border-gray-100 bg-gray-50/60 text-xs font-semibold text-gray-500 flex items-center gap-2 overflow-x-auto">
        <button onClick={() => setActiveStorefrontPage('home')} className="hover:text-black cursor-pointer">
          Home
        </button>
        <span>/</span>
        <button onClick={() => navigateToShop({})} className="hover:text-black cursor-pointer">
          Shop
        </button>
        {product.collection && (
          <>
            <span>/</span>
            <button 
              onClick={() => navigateToShop({ collection: product.collection })} 
              className="hover:text-black cursor-pointer uppercase text-pink-600"
            >
              {product.collection}
            </button>
          </>
        )}
        <span>/</span>
        <button 
          onClick={() => navigateToShop({ category: product.category })} 
          className="hover:text-black cursor-pointer"
        >
          {product.category}
        </button>
        <span>/</span>
        <span className="text-gray-900 font-bold truncate max-w-[200px]">{product.name}</span>
      </div>

      {/* High Demand Notification Banner */}
      <div className="bg-orange-50 border-b border-orange-100 py-2 px-4 text-center text-xs font-bold text-orange-900 flex items-center justify-center gap-1.5">
        <Flame size={14} className="text-orange-600 animate-pulse fill-orange-600" />
        <span><strong className="font-extrabold">{product.viewCount24h || 826} people</strong> viewed this in the last 24 hours</span>
      </div>

      {/* Main Product Details Layout */}
      <div className="w-full px-4 sm:px-8 lg:px-12 pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Image Gallery (Span 7) */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row-reverse gap-4">
            {/* Main Main Image */}
            <div className="flex-1 relative aspect-3/4 bg-gray-100 overflow-hidden rounded-xs group">
              <img 
                src={selectedImage || product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <button 
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-800 hover:text-black shadow-md cursor-pointer"
                title="Save to Wishlist"
              >
                <Heart size={20} className={isWishlisted ? "fill-pink-600 text-pink-600" : ""} />
              </button>
            </div>

            {/* Thumbnail Selectors */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-24 shrink-0 pb-2 sm:pb-0">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-24 sm:w-full sm:h-28 rounded-xs overflow-hidden border-2 cursor-pointer transition-all shrink-0 ${
                    selectedImage === img ? 'border-black opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Buying Options (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">
                  {product.fit || 'Regular'} Fit
                </span>
                <div className="flex items-center gap-2">
                  <button className="text-gray-400 hover:text-black p-1 cursor-pointer" title="Share Product">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mt-1 font-mono leading-tight">
                {product.name}
              </h1>

              {/* Price & Reviews */}
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xl font-extrabold text-black">
                  US${product.price}
                </span>

                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                  <Star size={14} className="fill-black text-black" />
                  <span>{product.rating}</span>
                  <span className="text-gray-400 font-normal">({product.reviewCount})</span>
                </div>
              </div>
            </div>

            {/* Description intro */}
            <p className="text-xs font-medium text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Color Swatch Picker */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="uppercase text-gray-500">COLOR:</span>
                <span className="text-black">{selectedColor}</span>
              </div>
              <div className="flex items-center gap-2.5">
                {product.colors.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-9 h-9 rounded-full border-2 p-0.5 cursor-pointer transition-transform ${
                      selectedColor === c.name ? 'border-black scale-110' : 'border-gray-200 hover:border-gray-400'
                    }`}
                    title={c.name}
                  >
                    <span 
                      className="block w-full h-full rounded-full shadow-inner" 
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="uppercase text-gray-500">SELECT A SIZE:</span>
                <button 
                  onClick={() => setShowSizeGuide(true)}
                  className="text-black hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Ruler size={14} /> Size Guide
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`py-3 text-xs font-extrabold uppercase border cursor-pointer transition-all ${
                      selectedSize === s 
                        ? 'bg-black text-white border-black shadow-xs' 
                        : 'bg-white text-gray-900 border-gray-200 hover:border-black'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <p className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 pt-1">
                <CheckCircle2 size={13} /> Customers say it fits <strong className="underline">true to size</strong>
              </p>
            </div>

            {/* Add to Bag & Express Buy Now CTAs */}
            <div className="space-y-2.5">
              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-4 font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all cursor-pointer shadow-xl active:scale-98 flex items-center justify-center gap-2"
              >
                ADD TO BAG
              </button>

              <button
                onClick={() => {
                  if (product) {
                    addToCart(product, selectedColor, selectedSize, 1);
                    setActiveStorefrontPage('checkout');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="w-full relative group overflow-hidden bg-neutral-950 hover:bg-black text-white py-3.5 px-5 rounded-lg font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer border border-neutral-800 hover:border-neutral-700 shadow-md hover:shadow-lg active:scale-[0.99] flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center font-black text-[11px] shadow-xs shrink-0 group-hover:scale-110 transition-transform">
                    <Zap size={11} className="fill-black text-black" />
                  </div>
                  <span className="text-white font-extrabold tracking-wide text-xs">
                    BUY NOW • EXPRESS CHECKOUT
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest hidden sm:inline">Instant Pay</span>
                  <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded border border-white/10 text-[10px] font-mono font-bold text-amber-300">
                    <Lock size={10} className="text-amber-300" />
                    <span>1-CLICK</span>
                  </div>
                </div>
              </button>

              <div className="pt-2">
                <PaymentIcons size="sm" showSecurityLabel={true} />
              </div>
            </div>

            {/* Value Propositions List */}
            <div className="space-y-2.5 pt-3 border-t border-gray-100 text-xs font-semibold text-gray-700">
              <div className="flex items-center gap-2.5">
                <Sparkles size={16} className="text-pink-600 shrink-0" />
                <span><strong>Unlock Access to Exclusive Rewards & Benefits</strong> (Earns 560XP)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck size={16} className="text-gray-800 shrink-0" />
                <span>Express Delivery Available. Free Shipping over $100</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                <span>Hassle-Free 30-Day Free Returns</span>
              </div>
            </div>

            {/* Delivery & Returns Accordion */}
            <div className="border-t border-b border-gray-200 py-3">
              <button 
                onClick={() => setDeliveryAccordionOpen(!deliveryAccordionOpen)}
                className="w-full flex items-center justify-between text-xs font-black uppercase tracking-wider text-black cursor-pointer py-1"
              >
                <span>DELIVERY & RETURNS</span>
                {deliveryAccordionOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {deliveryAccordionOpen && (
                <div className="pt-3 text-xs text-gray-600 space-y-2 leading-relaxed font-medium">
                  <p>Standard Shipping (3-5 business days): $10.00 or FREE on orders over $100.</p>
                  <p>Express Shipping (1-2 business days): $18.00.</p>
                  <p>You have 30 days from shipping date to return your order for a full refund.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* "Designed For" Showcase Section */}
      <div className="w-full px-4 sm:px-8 lg:px-12 pt-16">
        <div className="bg-gray-50 border border-gray-100 p-8 sm:p-12 rounded-xs grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">Designed For</span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black font-mono leading-snug">
              Designed for lifting. These leggings are high-waisted and made from durable, supportive, stretchy seamless fabric.
            </h2>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                  <Layers size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-black uppercase">New More Supportive Waistband</h4>
                  <p className="text-xs text-gray-600 mt-0.5">Extra ribbing on the lower stomach gives you even more support.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                  <Wind size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-black uppercase">Breathable</h4>
                  <p className="text-xs text-gray-600 mt-0.5">Air and moisture flow through the fabric, allowing your body to breathe so you don't overheat.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                  <Droplets size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-black uppercase">Sweat-wicking</h4>
                  <p className="text-xs text-gray-600 mt-0.5">Sweat-wicking tech moves sweat away from your body, keeping you cool, dry and focused.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="aspect-4/5 w-full bg-gray-200 overflow-hidden rounded-xs shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=1000" 
              alt="Designed For Model"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Full-width Video/Banner */}
      <div className="w-full px-4 sm:px-8 lg:px-12 pt-12">
        <div className="relative w-full h-[380px] bg-black rounded-xs overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1600" 
            alt="Whitney Adapt Collection"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-end text-white max-w-lg space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-tight">
              Explore the Whitney x Adapt Animal Collection
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-gray-200">
              Sculpting. Supportive. So. Damn. Good.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Reviews Section */}
      <div className="w-full px-4 sm:px-8 lg:px-12 pt-16">
        <h2 className="text-2xl font-black uppercase tracking-tight text-black font-mono mb-8">
          REVIEWS
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-10 border-b border-gray-200">
          {/* Summary Ratings Left (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-black text-black font-mono">3.3</span>
              <div className="space-y-1">
                <div className="flex text-black">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={18} className={star <= 3 ? "fill-black text-black" : "text-gray-300"} />
                  ))}
                </div>
                <p className="text-xs font-semibold text-gray-500">Based on 59 reviews</p>
              </div>
            </div>

            <p className="text-xs font-extrabold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 size={16} /> 52% of customers would recommend this
            </p>

            {/* Rating Breakdown Bars */}
            <div className="space-y-1.5 text-xs font-semibold text-gray-600">
              {[
                { stars: 5, count: 22, pct: 37 },
                { stars: 4, count: 5, pct: 8 },
                { stars: 3, count: 10, pct: 17 },
                { stars: 2, count: 13, pct: 22 },
                { stars: 1, count: 9, pct: 16 }
              ].map(item => (
                <div key={item.stars} className="flex items-center gap-3">
                  <span className="w-8">{item.stars} ★</span>
                  <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-black h-full" style={{ width: `${item.pct}%` }} />
                  </div>
                  <span className="w-8 text-right text-gray-400">({item.count})</span>
                </div>
              ))}
            </div>

            {/* Average Ratings Attributes Sliders */}
            <div className="pt-4 border-t border-gray-100 space-y-3 text-xs font-bold">
              <p className="uppercase text-gray-400">AVERAGE RATINGS</p>

              <div>
                <div className="flex justify-between text-gray-700 mb-1">
                  <span>Sizing</span>
                  <span>True to size</span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full relative">
                  <div className="absolute left-[50%] -translate-x-1/2 top-1/2 -translate-y-1/2 w-3 h-3 bg-black rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-gray-700 mb-1">
                  <span>Comfort</span>
                  <span>Excellent</span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full relative">
                  <div className="absolute left-[80%] -translate-x-1/2 top-1/2 -translate-y-1/2 w-3 h-3 bg-black rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews List Right (Span 7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-gray-50 p-4 rounded-xs border border-gray-100 text-xs font-medium text-gray-700 space-y-1">
              <p className="font-extrabold uppercase text-black flex items-center gap-1">
                <Sparkles size={14} className="text-pink-600" /> Reviews Summary
              </p>
              <p>
                Customers are sharply divided on these leggings. Many praise the soft fabric, beautiful colors, and comfortable fit, while an equal number report serious issues with the redesigned waistband rolling down and lacking compression.
              </p>
            </div>

            {/* Review Cards */}
            <div className="space-y-4 divide-y divide-gray-100">
              <div className="pt-4 first:pt-0 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-black">Angel</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                        ✔ Verified buyer
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400">Height: 5ft4-5ft7 | Body Type: Rounded Torso | Size: L</p>
                  </div>
                  <span className="text-[10px] text-gray-400">15 days ago</span>
                </div>

                <div className="flex text-black text-xs">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} className="fill-black text-black" />)}
                </div>

                <h4 className="font-extrabold text-xs text-black">Hood quality</h4>
                <p className="text-xs text-gray-600 font-medium">
                  Good quality, good fit, good colour, would order again!
                </p>

                <div className="flex items-center gap-2 text-[10px] text-gray-400 pt-1">
                  <button className="flex items-center gap-1 hover:text-black cursor-pointer">
                    <ThumbsUp size={12} /> Helpful (0)
                  </button>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-black">Bri</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                        ✔ Verified buyer
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400">Height: 5ft4-5ft7 | Body Type: Hourglass | Size: XXL</p>
                  </div>
                  <span className="text-[10px] text-gray-400">20 days ago</span>
                </div>

                <div className="flex text-black text-xs">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} className={s <= 2 ? "fill-black text-black" : "text-gray-300"} />)}
                </div>

                <h4 className="font-extrabold text-xs text-black">They ripped...</h4>
                <p className="text-xs text-gray-600 font-medium">
                  I've had these pants since Feb and maybe wore them once a week and they just ripped in the middle of my squat set... Mind you it's only mid-July, what the heck!
                </p>

                <div className="flex items-center gap-2 text-[10px] text-gray-400 pt-1">
                  <button className="flex items-center gap-1 hover:text-black cursor-pointer">
                    <ThumbsUp size={12} /> Helpful (1)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-lg w-full p-6 rounded-lg shadow-2xl relative space-y-4">
            <button 
              onClick={() => setShowSizeGuide(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black cursor-pointer font-bold"
            >
              ✕
            </button>
            <h3 className="text-lg font-black uppercase text-black font-mono">Size Guide - Women's Leggings</h3>
            <div className="text-xs font-semibold text-gray-600 space-y-2">
              <p>Measurements are in inches (in) and centimeters (cm).</p>
              <table className="w-full text-left border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 text-black">
                    <th className="p-2 border">Size</th>
                    <th className="p-2 border">Waist</th>
                    <th className="p-2 border">Hips</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="p-2 border font-bold">XS</td><td className="p-2 border">24 - 26"</td><td className="p-2 border">34 - 36"</td></tr>
                  <tr><td className="p-2 border font-bold">S</td><td className="p-2 border">26 - 28"</td><td className="p-2 border">36 - 38"</td></tr>
                  <tr><td className="p-2 border font-bold">M</td><td className="p-2 border">28 - 30"</td><td className="p-2 border">38 - 40"</td></tr>
                  <tr><td className="p-2 border font-bold">L</td><td className="p-2 border">30 - 33"</td><td className="p-2 border">40 - 43"</td></tr>
                  <tr><td className="p-2 border font-bold">XL</td><td className="p-2 border">33 - 36"</td><td className="p-2 border">43 - 46"</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
