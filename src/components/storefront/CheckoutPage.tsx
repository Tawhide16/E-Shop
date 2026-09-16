import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { PaymentIcons } from '../common/PaymentIcons';
import { 
  BkashLogo, 
  NagadLogo, 
  RocketLogo, 
  VisaLogo, 
  MastercardLogo, 
  AmexLogo, 
  CodLogo 
} from '../common/PaymentLogos';
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  ArrowLeft, 
  ShoppingBag, 
  ChevronRight,
  Sparkles,
  Check,
  AlertCircle
} from 'lucide-react';
import gsap from 'gsap';

export const CheckoutPage: React.FC = () => {
  const { cart, setActiveStorefrontPage, placeOrder, navigateToProduct } = useStore();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const paymentDetailsRef = useRef<HTMLDivElement>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [postalCode, setPostalCode] = useState('1207');
  const [country, setCountry] = useState('Bangladesh');
  const [phone, setPhone] = useState('01700000000');
  
  // Payment options: 'bkash' | 'nagad' | 'rocket' | 'cod'
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'cod'>('bkash');
  
  // MFS details
  const [senderNumber, setSenderNumber] = useState('01712345678');
  const [trxId, setTrxId] = useState('9J2K8M4X');

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Delivery options
  const [deliveryOption, setDeliveryOption] = useState<'standard' | 'express'>('standard');

  // Checkout process state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState<any | null>(null);

  // GSAP Entrance Animation
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.querySelectorAll('.gsap-fade-up'),
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, [orderCompleted]);

  // GSAP Animation when switching payment methods
  useEffect(() => {
    if (paymentDetailsRef.current) {
      gsap.fromTo(
        paymentDetailsRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [paymentMethod]);

  const USD_TO_BDT = 120; // 1 USD = 120 BDT
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingCost = deliveryOption === 'express' ? 12 : subtotal >= 100 || subtotal === 0 ? 0 : 5;
  const estimatedTax = subtotal * 0.05;
  const grandTotalUSD = subtotal + shippingCost + estimatedTax;
  const grandTotalBDT = Math.round(grandTotalUSD * USD_TO_BDT);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName || !lastName || !address || !city) {
      alert('Please fill out all required shipping fields.');
      return;
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket') && (!senderNumber || !trxId)) {
      alert(`Please enter your ${paymentMethod.toUpperCase()} Sender Mobile Number and Transaction ID.`);
      return;
    }

    setIsSubmitting(true);

    // Simulate payment processing through MFS Gateway
    setTimeout(() => {
      const placed = placeOrder({
        customerName: `${firstName} ${lastName}`,
        customerEmail: email,
        totalAmount: grandTotalUSD,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        fulfillmentStatus: 'pending',
        shippingAddress: `${address}, ${city}, ${postalCode}, ${country} (Phone: ${phone})`,
        items: cart.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.images[0],
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          price: item.product.price
        }))
      });

      setIsSubmitting(false);
      setOrderCompleted({
        orderNumber: placed.orderNumber,
        customerName: `${firstName} ${lastName}`,
        customerEmail: email,
        phone,
        totalUSD: grandTotalUSD,
        totalBDT: grandTotalBDT,
        date: placed.date,
        address: `${address}, ${city}, ${postalCode}, ${country}`,
        paymentMethodName: paymentMethod === 'bkash' ? 'bKash Merchant Pay' :
                           paymentMethod === 'nagad' ? 'Nagad Payment' :
                           paymentMethod === 'rocket' ? 'Rocket DBBL Pay' :
                           paymentMethod === 'cod' ? 'Cash on Delivery (Bangladesh)' : 'Debit/Credit Card',
        trxId: (paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket') ? trxId : 'N/A'
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  // If order is completed, display receipt/confirmation screen
  if (orderCompleted) {
    return (
      <div ref={containerRef} className="w-full min-h-[80vh] py-12 px-4 sm:px-8 lg:px-12 flex items-center justify-center font-sans bg-gray-50">
        <div className="max-w-2xl w-full bg-white p-6 sm:p-10 rounded-2xl border border-gray-100 shadow-xl space-y-6 text-center gsap-fade-up">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 size={48} className="animate-bounce" />
          </div>

          <div className="space-y-2">
            <span className="bg-emerald-600 text-white font-mono text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
              ORDER CONFIRMED (BANGLADESH)
            </span>
            <h1 className="text-2xl sm:text-4xl font-black uppercase text-black font-mono">
              ধন্যবাদ! THANK YOU FOR YOUR ORDER
            </h1>
            <p className="text-xs text-gray-500 font-semibold">
              Order <strong className="text-black font-mono font-bold">#{orderCompleted.orderNumber}</strong> has been received and is being prepared for fast delivery across Bangladesh.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-left text-xs space-y-3">
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-bold uppercase">Customer</span>
              <span className="font-extrabold text-black">{orderCompleted.customerName} ({orderCompleted.phone})</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-bold uppercase">Shipping Address</span>
              <span className="font-extrabold text-black text-right max-w-xs">{orderCompleted.address}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-bold uppercase">Payment Gateway</span>
              <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {orderCompleted.paymentMethodName}
              </span>
            </div>
            {orderCompleted.trxId !== 'N/A' && (
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500 font-bold uppercase">Transaction ID</span>
                <span className="font-mono font-black text-black">{orderCompleted.trxId}</span>
              </div>
            )}
            <div className="flex justify-between text-sm pt-1">
              <span className="font-extrabold text-black uppercase">TOTAL AMOUNT</span>
              <div className="text-right">
                <span className="font-black text-emerald-700 text-lg font-mono">৳{orderCompleted.totalBDT.toLocaleString()} BDT</span>
                <span className="block text-[10px] text-gray-400 font-bold">(${orderCompleted.totalUSD.toFixed(2)} USD)</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setActiveStorefrontPage('home')}
              className="flex-1 bg-black text-white py-3.5 font-extrabold text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors cursor-pointer rounded-lg shadow-md"
            >
              Back to Gymshark Storefront
            </button>
            <button
              onClick={() => window.print()}
              className="bg-gray-100 hover:bg-gray-200 text-black py-3.5 px-6 font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer rounded-lg"
            >
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (cart.length === 0) {
    return (
      <div className="w-full py-20 px-4 text-center font-sans space-y-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
          <ShoppingBag size={32} />
        </div>
        <h2 className="text-2xl font-black text-black uppercase font-mono">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-gray-500 font-medium max-w-md mx-auto">
          Add some gym gear to your cart to proceed with checkout via bKash, Nagad, Rocket, or Cash on Delivery.
        </p>
        <button
          onClick={() => setActiveStorefrontPage('home')}
          className="bg-black text-white text-xs font-extrabold px-8 py-3.5 uppercase tracking-widest hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full py-8 px-4 sm:px-8 lg:px-12 font-sans bg-white">
      {/* Checkout Header Breadcrumb */}
      <div className="mb-8 border-b border-gray-100 pb-4 flex items-center justify-between gsap-fade-up">
        <button 
          onClick={() => setActiveStorefrontPage('home')}
          className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Storefront</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono font-extrabold text-black">
          <Lock size={14} className="text-emerald-600" />
          <span>SECURE BANGLADESH PAYMENT GATEWAY</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Form & Payment (Span 7) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Express Bangladeshi Mobile Banking Fast Options */}
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white p-6 rounded-2xl border border-gray-800 space-y-4 gsap-fade-up shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider font-mono flex items-center gap-2">
                <Sparkles size={16} className="text-amber-400" />
                1-CLICK BANGLADESHI MFS FAST PAY
              </span>
              <span className="bg-amber-400 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase font-mono">
                INSTANT AUTO-VERIFY
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {/* bKash Fast Button */}
              <button
                type="button"
                onClick={() => setPaymentMethod('bkash')}
                className={`py-3 px-3 rounded-xl border text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                  paymentMethod === 'bkash' 
                    ? 'bg-[#E2136E] text-white border-white ring-2 ring-white/80' 
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-white text-[#E2136E] flex items-center justify-center font-black text-[9px]">
                  ব
                </div>
                <span>bKash</span>
              </button>

              {/* Nagad Fast Button */}
              <button
                type="button"
                onClick={() => setPaymentMethod('nagad')}
                className={`py-3 px-3 rounded-xl border text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                  paymentMethod === 'nagad' 
                    ? 'bg-[#F7921E] text-white border-white ring-2 ring-white/80' 
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-white text-[#F7921E] flex items-center justify-center font-black text-[9px]">
                  ন
                </div>
                <span>Nagad</span>
              </button>

              {/* Rocket Fast Button */}
              <button
                type="button"
                onClick={() => setPaymentMethod('rocket')}
                className={`py-3 px-3 rounded-xl border text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                  paymentMethod === 'rocket' 
                    ? 'bg-[#8C208C] text-white border-white ring-2 ring-white/80' 
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-white text-[#8C208C] flex items-center justify-center font-black text-[9px]">
                  র
                </div>
                <span>Rocket</span>
              </button>
            </div>

            <PaymentIcons showSecurityLabel={false} size="sm" />
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-8">
            {/* Contact Information */}
            <div className="space-y-4 gsap-fade-up">
              <h2 className="text-base font-black uppercase text-black font-mono border-b border-gray-100 pb-2">
                1. Customer Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Email Address *
                  </label>
                  <input 
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-200 p-3 rounded-lg text-xs font-medium focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Mobile Phone (for delivery SMS) *
                  </label>
                  <input 
                    type="tel"
                    required
                    placeholder="01712345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-200 p-3 rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address in Bangladesh */}
            <div className="space-y-4 gsap-fade-up">
              <h2 className="text-base font-black uppercase text-black font-mono border-b border-gray-100 pb-2">
                2. Bangladesh Shipping Address
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">First Name *</label>
                  <input 
                    type="text"
                    required
                    placeholder="Tawhid"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border border-gray-200 p-3 rounded-lg text-xs font-medium focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Last Name *</label>
                  <input 
                    type="text"
                    required
                    placeholder="Hassan"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full border border-gray-200 p-3 rounded-lg text-xs font-medium focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Street / House / Area Address *</label>
                <input 
                  type="text"
                  required
                  placeholder="House 42, Road 11, Banani / Dhanmondi"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-gray-200 p-3 rounded-lg text-xs font-medium focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">City / District *</label>
                  <select 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-gray-200 p-3 rounded-lg text-xs font-bold focus:outline-none focus:border-black"
                  >
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Barisal">Barisal</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                    <option value="Cox's Bazar">Cox's Bazar</option>
                    <option value="Gazipur">Gazipur</option>
                    <option value="Narayanganj">Narayanganj</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Postal Code</label>
                  <input 
                    type="text"
                    placeholder="1207"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full border border-gray-200 p-3 rounded-lg text-xs font-medium focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Country</label>
                  <input 
                    type="text"
                    disabled
                    value="Bangladesh"
                    className="w-full border border-gray-200 bg-gray-50 p-3 rounded-lg text-xs font-bold text-black cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="space-y-4 gsap-fade-up">
              <h2 className="text-base font-black uppercase text-black font-mono border-b border-gray-100 pb-2">
                3. Delivery Options (Bangladesh)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label 
                  onClick={() => setDeliveryOption('standard')}
                  className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    deliveryOption === 'standard' ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Truck size={20} className={deliveryOption === 'standard' ? 'text-black' : 'text-gray-400'} />
                    <div>
                      <p className="font-extrabold text-xs text-black uppercase">Dhaka & Nearby Standard</p>
                      <p className="text-[10px] text-gray-500 font-medium">24 - 48 Hours Delivery</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-xs text-black">
                    {subtotal >= 100 ? 'FREE' : '৳60 (FREE > $100)'}
                  </span>
                </label>

                <label 
                  onClick={() => setDeliveryOption('express')}
                  className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    deliveryOption === 'express' ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles size={20} className={deliveryOption === 'express' ? 'text-amber-500' : 'text-gray-400'} />
                    <div>
                      <p className="font-extrabold text-xs text-black uppercase">Outside Dhaka Express Courier</p>
                      <p className="text-[10px] text-gray-500 font-medium">1 - 3 Days Steadfast/Sundarban</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-xs text-black">৳120 BDT</span>
                </label>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-4 gsap-fade-up">
              <h2 className="text-base font-black uppercase text-black font-mono border-b border-gray-100 pb-2">
                4. Select Payment Gateway
              </h2>

              <div className="space-y-3">
                {/* bKash Option */}
                <div 
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    paymentMethod === 'bkash' 
                      ? 'border-[#E2136E] bg-pink-50/60 ring-2 ring-[#E2136E]' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white border border-gray-200 px-2 py-1 rounded-md shadow-2xs shrink-0 flex items-center justify-center">
                        <BkashLogo height={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-xs text-black uppercase font-mono">bKash Merchant Pay</span>
                          <span className="bg-[#E2136E] text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase">MOST POPULAR IN BD</span>
                        </div>
                        <p className="text-[11px] text-gray-500 font-semibold">
                          Pay to bKash Merchant No: <strong className="text-black font-mono">01700-889900</strong>
                        </p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'bkash' ? 'border-[#E2136E] bg-[#E2136E] text-white' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'bkash' && <Check size={10} />}
                    </div>
                  </div>
                </div>

                {/* Nagad Option */}
                <div 
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    paymentMethod === 'nagad' 
                      ? 'border-[#F7921E] bg-amber-50/60 ring-2 ring-[#F7921E]' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white border border-gray-200 px-2 py-1 rounded-md shadow-2xs shrink-0 flex items-center justify-center">
                        <NagadLogo height={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-xs text-black uppercase font-mono">Nagad Merchant Pay</span>
                          <span className="bg-[#F7921E] text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase">INSTANT</span>
                        </div>
                        <p className="text-[11px] text-gray-500 font-semibold">
                          Pay to Nagad Merchant No: <strong className="text-black font-mono">01800-889900</strong>
                        </p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'nagad' ? 'border-[#F7921E] bg-[#F7921E] text-white' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'nagad' && <Check size={10} />}
                    </div>
                  </div>
                </div>

                {/* Rocket Option */}
                <div 
                  onClick={() => setPaymentMethod('rocket')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    paymentMethod === 'rocket' 
                      ? 'border-[#8C208C] bg-purple-50/60 ring-2 ring-[#8C208C]' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white border border-gray-200 px-2 py-1 rounded-md shadow-2xs shrink-0 flex items-center justify-center">
                        <RocketLogo height={24} />
                      </div>
                      <div>
                        <span className="font-black text-xs text-black uppercase font-mono">Rocket (DBBL Mobile Banking)</span>
                        <p className="text-[11px] text-gray-500 font-semibold">
                          Pay to Rocket Biller ID: <strong className="text-black font-mono">3182</strong>
                        </p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'rocket' ? 'border-[#8C208C] bg-[#8C208C] text-white' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'rocket' && <Check size={10} />}
                    </div>
                  </div>
                </div>


                {/* Cash on Delivery Option */}
                <div 
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    paymentMethod === 'cod' 
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-900 border border-emerald-900 px-2 py-1 rounded-md shadow-2xs shrink-0 flex items-center justify-center">
                        <CodLogo height={24} />
                      </div>
                      <div>
                        <span className="font-black text-xs text-black uppercase font-mono">Cash on Delivery (COD Bangladesh)</span>
                        <p className="text-[11px] text-gray-500 font-semibold">
                          Pay cash to delivery rider upon receiving parcel
                        </p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'cod' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'cod' && <Check size={10} />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic MFS Details Field (bKash / Nagad / Rocket) */}
              <div ref={paymentDetailsRef}>
                {(paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket') && (
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-3 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-black font-mono">
                        Enter {paymentMethod.toUpperCase()} Payment Information
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSenderNumber('01712345678');
                          setTrxId(`BK${Math.floor(1000000 + Math.random() * 9000000)}`);
                        }}
                        className="text-[10px] bg-black text-amber-300 font-extrabold px-2 py-1 rounded hover:bg-gray-800 cursor-pointer"
                      >
                        Auto-Fill Test TrxID
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-extrabold text-gray-700 uppercase mb-1">
                          Sender Mobile Number *
                        </label>
                        <input 
                          type="text"
                          required
                          placeholder="017XXXXXXXX"
                          value={senderNumber}
                          onChange={(e) => setSenderNumber(e.target.value)}
                          className="w-full border border-gray-200 bg-white p-2.5 rounded text-xs font-mono font-bold focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-gray-700 uppercase mb-1">
                          Transaction ID (TrxID) *
                        </label>
                        <input 
                          type="text"
                          required
                          placeholder="e.g. 9J2K8M4X"
                          value={trxId}
                          onChange={(e) => setTrxId(e.target.value)}
                          className="w-full border border-gray-200 bg-white p-2.5 rounded text-xs font-mono font-bold focus:outline-none focus:border-black uppercase"
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium">
                      Send <strong>৳{grandTotalBDT.toLocaleString()} BDT</strong> to Merchant Number <strong>01700-889900</strong> and enter the Transaction ID received via SMS.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Order Button */}
            <div className="pt-4 gsap-fade-up">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black hover:bg-gray-900 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>VERIFYING VIA BANGLADESH GATEWAY...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} className="text-amber-300" />
                    <span>PAY ৳{grandTotalBDT.toLocaleString()} BDT (${grandTotalUSD.toFixed(2)})</span>
                  </>
                )}
              </button>

              <div className="mt-4 text-center">
                <PaymentIcons showSecurityLabel={true} size="sm" />
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary Sidebar (Span 5) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-6 gsap-fade-up">
            <h3 className="font-black text-base uppercase text-black font-mono border-b border-gray-200 pb-3 flex items-center justify-between">
              <span>Order Summary ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
              <span className="text-xs bg-black text-amber-300 px-2 py-0.5 rounded font-bold">BDT (৳)</span>
            </h3>

            {/* Line Items */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1 divide-y divide-gray-200/60">
              {cart.map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex gap-3">
                  <div className="relative shrink-0">
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name}
                      className="w-16 h-20 object-cover rounded-md border border-gray-200"
                    />
                    <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>

                  <div className="flex-1 text-xs">
                    <h4 className="font-extrabold text-black line-clamp-1">{item.product.name}</h4>
                    <p className="text-gray-500 font-medium text-[11px] mt-0.5">
                      {item.color} / <strong className="text-black">{item.size}</strong>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="font-black text-black text-xs">
                        ৳{Math.round(item.product.price * item.quantity * USD_TO_BDT).toLocaleString()} BDT
                      </p>
                      <span className="text-[10px] text-gray-400 font-bold">
                        (${(item.product.price * item.quantity).toFixed(2)})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Breakdown in BDT & USD */}
            <div className="space-y-2 text-xs border-t border-gray-200 pt-4 text-gray-600 font-semibold">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-black">৳{Math.round(subtotal * USD_TO_BDT).toLocaleString()} BDT</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery (Bangladesh)</span>
                <span className="font-bold text-black">
                  {shippingCost === 0 ? 'FREE' : `৳${Math.round(shippingCost * USD_TO_BDT)} BDT`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>VAT / Tax (5%)</span>
                <span className="font-bold text-black">৳{Math.round(estimatedTax * USD_TO_BDT).toLocaleString()} BDT</span>
              </div>
              <div className="flex justify-between items-baseline text-base font-black text-black pt-3 border-t border-gray-200 font-mono">
                <span>TOTAL DUE</span>
                <div className="text-right">
                  <span className="text-lg font-extrabold text-emerald-700">৳{grandTotalBDT.toLocaleString()} BDT</span>
                  <span className="block text-[11px] text-gray-400 font-sans font-bold">(${grandTotalUSD.toFixed(2)} USD)</span>
                </div>
              </div>
            </div>

            {/* Trust Guarantee Box */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 text-[11px] space-y-1.5">
              <p className="font-extrabold text-black flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600" />
                Bangladesh Express Guarantee
              </p>
              <p className="text-gray-500 leading-relaxed font-medium">
                100% authentic Gymshark merchandise with fast delivery and instant bKash / Nagad payment verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
