import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import gsap from 'gsap';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowLeft, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  Database
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, setActiveView, setActiveStorefrontPage, themeSettings, dbStatus } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 25, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.4)' }
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await loginAdmin(email, password);
      if (!res.success) {
        setError(res.message || 'Invalid email or password');
        if (cardRef.current) {
          gsap.fromTo(
            cardRef.current,
            { x: -8 },
            { x: 8, duration: 0.08, repeat: 3, yoyo: true, ease: 'power1.inOut' }
          );
        }
      }
    } catch {
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (fillEmail: string, fillPass: string) => {
    setEmail(fillEmail);
    setPassword(fillPass);
    setError(null);
  };

  const handleBackToShop = () => {
    setActiveView('storefront');
    setActiveStorefrontPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans select-none">
      {/* Background Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Return Button */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={handleBackToShop}
          className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-full border border-white/10 backdrop-blur-md cursor-pointer active:scale-95"
        >
          <ArrowLeft size={14} />
          <span>Back to Storefront</span>
        </button>
      </div>

      {/* Database Status Pill */}
      <div className="absolute top-6 right-6 z-10">
        <div 
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md ${
            dbStatus === 'connected'
              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
              : 'bg-amber-950/60 text-amber-400 border-amber-500/30'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${dbStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <Database size={13} />
          <span>{dbStatus === 'connected' ? 'MongoDB: Connected' : 'DB: Offline Mode'}</span>
        </div>
      </div>

      {/* Login Card */}
      <div 
        ref={cardRef}
        className="w-full max-w-md bg-neutral-900/90 border border-neutral-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white text-black font-black text-xl mb-4 shadow-lg shadow-white/10">
            {themeSettings?.logoUrl ? (
              <img src={themeSettings.logoUrl} alt="Store Logo" className="h-8 w-auto object-contain" />
            ) : (
              'GS'
            )}
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white flex items-center justify-center gap-2 font-mono">
            ADMIN CMS LOGIN <Sparkles size={18} className="text-pink-500 animate-pulse" />
          </h1>
          <p className="text-xs text-gray-400 mt-1.5">
            Authenticate to access the store management dashboard.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-950/60 border border-red-800/80 text-red-200 text-xs rounded-xl p-3.5 flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold">{error}</span>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@eshop.com"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-white focus:outline-none text-white text-sm rounded-xl pl-10 pr-4 py-3 placeholder:text-gray-600 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-white focus:outline-none text-white text-sm rounded-xl pl-10 pr-11 py-3 placeholder:text-gray-600 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-white hover:bg-gray-200 text-black font-extrabold uppercase text-xs tracking-wider py-3.5 px-4 rounded-xl cursor-pointer transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck size={16} />
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials Box */}
        <div className="mt-8 pt-6 border-t border-neutral-800">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 mb-2.5 flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-400" /> Quick Demo Fill:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@eshop.com', 'admin123')}
              className="bg-neutral-800/80 hover:bg-neutral-700/80 text-left p-2.5 rounded-lg border border-neutral-700/50 cursor-pointer transition-all active:scale-95"
            >
              <div className="text-xs font-bold text-white leading-none">Super Admin</div>
              <div className="text-[10px] text-gray-400 mt-1 font-mono">admin@eshop.com</div>
              <div className="text-[9px] text-emerald-400 font-mono mt-0.5">pass: admin123</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('tawhideh.b10@gmail.com', 'admin123')}
              className="bg-neutral-800/80 hover:bg-neutral-700/80 text-left p-2.5 rounded-lg border border-neutral-700/50 cursor-pointer transition-all active:scale-95"
            >
              <div className="text-xs font-bold text-white leading-none">Tawhid Ehsan</div>
              <div className="text-[10px] text-gray-400 mt-1 font-mono truncate">tawhideh...</div>
              <div className="text-[9px] text-emerald-400 font-mono mt-0.5">pass: admin123</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
