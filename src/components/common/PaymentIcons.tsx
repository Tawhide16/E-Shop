import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { 
  BkashLogo, 
  NagadLogo, 
  RocketLogo, 
  VisaLogo, 
  MastercardLogo, 
  AmexLogo, 
  ApplePayLogo, 
  GooglePayLogo, 
  UpayLogo, 
  CellFinLogo, 
  DbblSailLogo,
  CodLogo 
} from './PaymentLogos';

interface PaymentIconsProps {
  size?: 'sm' | 'md' | 'lg';
  showSecurityLabel?: boolean;
}

export const PaymentIcons: React.FC<PaymentIconsProps> = ({ size = 'sm', showSecurityLabel = true }) => {
  const height = size === 'sm' ? 18 : size === 'lg' ? 24 : 20;

  return (
    <div className="space-y-2">
      {showSecurityLabel && (
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500">
          <ShieldCheck className="text-emerald-600 shrink-0" size={14} />
          <span>Guaranteed Instant Checkout via <strong className="text-black font-black">bKash, Nagad, Rocket & Cards</strong></span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {/* bKash */}
        <div className="bg-white border border-gray-200 px-2.5 py-1 rounded-md shadow-2xs hover:border-pink-500 hover:scale-105 transition-all cursor-pointer flex items-center justify-center">
          <BkashLogo height={height} />
        </div>

        {/* Nagad */}
        <div className="bg-white border border-gray-200 px-2.5 py-1 rounded-md shadow-2xs hover:border-amber-500 hover:scale-105 transition-all cursor-pointer flex items-center justify-center">
          <NagadLogo height={height} />
        </div>

        {/* Rocket */}
        <div className="bg-white border border-gray-200 px-2.5 py-1 rounded-md shadow-2xs hover:border-purple-500 hover:scale-105 transition-all cursor-pointer flex items-center justify-center">
          <RocketLogo height={height} />
        </div>

        {/* DBBL Sail Bank */}
        <div className="bg-white border border-gray-200 px-2.5 py-1 rounded-md shadow-2xs hover:border-purple-700 hover:scale-105 transition-all cursor-pointer flex items-center justify-center">
          <DbblSailLogo height={height} />
        </div>

        {/* Upay */}
        <div className="bg-[#FFCC00] border border-[#FFCC00] px-2 py-1 rounded-md shadow-2xs hover:scale-105 transition-all cursor-pointer flex items-center justify-center">
          <UpayLogo height={height} />
        </div>

        {/* Visa */}
        <div className="bg-white border border-gray-200 px-2 py-1 rounded-md shadow-2xs hover:border-blue-700 hover:scale-105 transition-all cursor-pointer flex items-center justify-center">
          <VisaLogo height={height} />
        </div>

        {/* Mastercard */}
        <div className="bg-white border border-gray-200 px-2 py-1 rounded-md shadow-2xs hover:border-red-500 hover:scale-105 transition-all cursor-pointer flex items-center justify-center">
          <MastercardLogo height={height} />
        </div>

        {/* Google Pay */}
        <div className="bg-white border border-gray-200 px-2 py-1 rounded-md shadow-2xs hover:border-blue-400 hover:scale-105 transition-all cursor-pointer flex items-center justify-center">
          <GooglePayLogo height={height} />
        </div>

        {/* CellFin */}
        <div className="bg-[#006837] border border-[#006837] px-2 py-1 rounded-md shadow-2xs hover:scale-105 transition-all cursor-pointer flex items-center justify-center">
          <CellFinLogo height={height} />
        </div>

        {/* Cash On Delivery (COD) */}
        <div className="bg-emerald-900 border border-emerald-900 px-2 py-1 rounded-md shadow-2xs hover:scale-105 transition-all cursor-pointer flex items-center justify-center">
          <CodLogo height={height} />
        </div>
      </div>
    </div>
  );
};


