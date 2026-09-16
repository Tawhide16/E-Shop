import React from 'react';
import { useStore } from '../../context/StoreContext';
import { PaymentIcons } from './PaymentIcons';
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  Twitter, 
  Send, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  Globe 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { sections, navigateToProduct, products } = useStore();
  const footerSec = sections.find(s => s.type === 'footer' && s.enabled);

  if (!footerSec) return null;

  return (
    <footer className="bg-white border-t border-gray-200 text-gray-900 pt-12 pb-8 font-sans w-full">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-12 border-b border-gray-200 text-xs">
          {/* Column 1: HELP */}
          <div>
            <h4 className="font-extrabold uppercase tracking-wider text-black mb-4 text-xs">HELP</h4>
            <ul className="space-y-2.5 font-semibold text-gray-600">
              <li><a href="#faq" className="hover:text-black">FAQ</a></li>
              <li><a href="#track" className="hover:text-black">Track Your Order</a></li>
              <li><a href="#delivery" className="hover:text-black">Delivery Information</a></li>
              <li><a href="#returns" className="hover:text-black">Returns Policy</a></li>
              <li><a href="#return" className="hover:text-black">Make A Return</a></li>
              <li><a href="#orders" className="hover:text-black">Orders</a></li>
              <li><a href="#fake" className="hover:text-black">Submit A Fake</a></li>
            </ul>
          </div>

          {/* Column 2: MY ACCOUNT */}
          <div>
            <h4 className="font-extrabold uppercase tracking-wider text-black mb-4 text-xs">MY ACCOUNT</h4>
            <ul className="space-y-2.5 font-semibold text-gray-600">
              <li><a href="#login" className="hover:text-black">Login</a></li>
              <li><a href="#register" className="hover:text-black">Register</a></li>
            </ul>
          </div>

          {/* Column 3: PAGES */}
          <div>
            <h4 className="font-extrabold uppercase tracking-wider text-black mb-4 text-xs">PAGES</h4>
            <ul className="space-y-2.5 font-semibold text-gray-600">
              <li><a href="#central" className="hover:text-black">Gymshark Central</a></li>
              <li><a href="#loyalty" className="hover:text-black">Gymshark Loyalty</a></li>
              <li><a href="#careers" className="hover:text-black">Careers</a></li>
              <li><a href="#about" className="hover:text-black">About Us</a></li>
              <li><a href="#student" className="hover:text-black">Student Discount</a></li>
              <li><a href="#factory" className="hover:text-black">Factory List</a></li>
            </ul>
          </div>

          {/* Column 4: MORE ABOUT GYMSHARK */}
          <div className="col-span-2 lg:col-span-2">
            <h4 className="font-extrabold uppercase tracking-wider text-black mb-4 text-xs">MORE ABOUT GYMSHARK</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-gray-100 p-4 font-bold text-center flex flex-col justify-between h-28 cursor-pointer hover:bg-gray-200 transition-colors">
                <span className="font-black text-sm tracking-tight text-black">GYMSHARK</span>
                <span className="text-[10px] text-gray-600 uppercase font-extrabold">BLOG</span>
              </div>
              <div className="bg-gray-100 p-4 font-bold text-center flex flex-col justify-between h-28 cursor-pointer hover:bg-gray-200 transition-colors">
                <span className="font-black text-sm tracking-tight text-black">STUDENTS</span>
                <span className="text-[10px] text-gray-600 uppercase font-extrabold">GET EXTRA 15% OFF</span>
              </div>
              <div className="bg-gray-100 p-4 font-bold text-center flex flex-col justify-between h-28 cursor-pointer hover:bg-gray-200 transition-colors">
                <span className="font-black text-sm tracking-tight text-black">EMAIL SIGN UP</span>
                <span className="text-[10px] text-gray-600 uppercase font-extrabold">GET 10% OFF</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods & Social Links */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-100">
          {/* Payment Badges */}
          <div>
            <PaymentIcons size="sm" showSecurityLabel={true} />
          </div>

          {/* Social Media */}
          <div className="flex items-center gap-4 text-gray-800">
            <a href="#discord" className="hover:text-black transition-colors" title="Discord"><Globe size={18} /></a>
            <a href="#facebook" className="hover:text-black transition-colors" title="Facebook"><Facebook size={18} /></a>
            <a href="#pinterest" className="hover:text-black transition-colors" title="Pinterest"><Instagram size={18} /></a>
            <a href="#youtube" className="hover:text-black transition-colors" title="YouTube"><Youtube size={18} /></a>
            <a href="#twitter" className="hover:text-black transition-colors" title="X"><Twitter size={18} /></a>
          </div>
        </div>

        {/* Copyright & Legal */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500 font-medium">
          <p>© 2026 Gymshark Limited. All Rights Reserved. Dynamic Admin CMS Power Engine.</p>
          <div className="flex items-center gap-4 flex-wrap">
            <a href="#terms" className="hover:text-black">Terms and Conditions</a>
            <a href="#terms-use" className="hover:text-black">Terms of Use</a>
            <a href="#privacy" className="hover:text-black">Privacy Notice</a>
            <a href="#cookies" className="hover:text-black">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
