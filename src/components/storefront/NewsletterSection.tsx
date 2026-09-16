import React, { useState } from 'react';
import { SectionConfig } from '../../types/cms';
import { Check } from 'lucide-react';

export const NewsletterSection: React.FC<{ section: SectionConfig }> = ({ section }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <section className="bg-gray-100 py-16 px-4 sm:px-8 lg:px-12 text-center font-sans border-t border-gray-200 w-full">
      <div className="w-full max-w-2xl mx-auto space-y-4">
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black font-mono">
          {section.title || 'GET 10% OFF YOUR FIRST ORDER'}
        </h2>
        <p className="text-xs sm:text-sm font-medium text-gray-600">
          {section.subtitle || 'Sign up for exclusive drops, training tips and offers.'}
        </p>

        {subscribed ? (
          <div className="bg-emerald-100 text-emerald-800 p-4 rounded text-xs font-bold flex items-center justify-center gap-2 max-w-md mx-auto">
            <Check size={16} /> Thank you for subscribing! Check your inbox for your 10% discount code.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
            <input 
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white border border-gray-300 px-4 py-3 text-xs font-medium focus:outline-none focus:border-black"
            />
            <button 
              type="submit"
              className="bg-black text-white font-extrabold text-xs uppercase px-8 py-3 tracking-widest hover:bg-gray-800 transition-colors cursor-pointer shrink-0"
            >
              {section.settings.primaryBtnText || 'SIGN UP'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
