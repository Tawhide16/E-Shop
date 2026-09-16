import React from 'react';

// 1. bKash Logo matching exact Bengali typography 'বিকাশ' and origami bird
export const BkashLogo: React.FC<{ className?: string; height?: number }> = ({ className = "h-6", height = 24 }) => (
  <svg viewBox="0 0 140 46" className={className} style={{ height }} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="140" height="46" rx="6" fill="#E2136E" />
    {/* Bengali 'বিকাশ' text */}
    <text x="14" y="31" fontFamily="Arial, 'Kohinoor Bangla', sans-serif" fontWeight="900" fontSize="26" fill="#FFFFFF">বিকাশ</text>
    {/* Origami Bird */}
    <g transform="translate(86, 6) scale(0.75)">
      <polygon points="12,18 42,6 34,34 20,38" fill="#FFFFFF" opacity="0.95" />
      <polygon points="42,6 56,22 34,34" fill="#FFFFFF" opacity="0.8" />
      <polygon points="42,6 48,36 34,34" fill="#E2136E" opacity="0.2" />
      <polygon points="56,22 64,24 50,32" fill="#FFFFFF" opacity="0.9" />
    </g>
  </svg>
);

// 2. Nagad Logo matching exact swirl logo and Bengali 'নগদ' typography
export const NagadLogo: React.FC<{ className?: string; height?: number }> = ({ className = "h-6", height = 24 }) => (
  <svg viewBox="0 0 120 46" className={className} style={{ height }} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="46" rx="6" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
    {/* Swirl emblem */}
    <g transform="translate(10, 7) scale(0.65)">
      <path d="M22 4C12 4 4 12 4 22C4 32 12 40 22 40C28 40 34 37 37 32C33 35 27 36 22 36C14 36 8 30 8 22C8 14 14 8 22 8C27 8 32 10 35 14C32 11 27 9 22 9Z" fill="#F7921E" />
      <path d="M22 9C29 9 35 14 36 21C34 16 29 13 22 13C17 13 13 17 13 22C13 26 15 29 19 31C16 29 14 26 14 22C14 17 18 13 22 13Z" fill="#D32F2F" />
      <path d="M26 15C32 17 36 23 35 29C34 25 31 21 26 19C23 18 20 19 18 21C20 19 23 17 26 17Z" fill="#FFC107" />
    </g>
    {/* Bengali 'নগদ' text */}
    <text x="42" y="31" fontFamily="Arial, 'Kohinoor Bangla', sans-serif" fontWeight="900" fontSize="23" fill="#ED1C24">নগদ</text>
  </svg>
);

// 3. Rocket Logo matching exact paper plane, 'ROCKET', Bengali 'রকেট' & DBBL subtext
export const RocketLogo: React.FC<{ className?: string; height?: number }> = ({ className = "h-6", height = 24 }) => (
  <svg viewBox="0 0 150 46" className={className} style={{ height }} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="150" height="46" rx="6" fill="#8C208C" />
    {/* Paper Plane */}
    <g transform="translate(10, 6) scale(0.65)">
      <polygon points="5,24 45,5 30,42 22,28" fill="#FFFFFF" />
      <polygon points="45,5 22,28 15,22" fill="#E5D0E5" />
    </g>
    {/* English ROCKET */}
    <text x="44" y="16" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="12" fill="#FFFFFF" letterSpacing="1">ROCKET</text>
    {/* Bengali 'রকেট' */}
    <text x="44" y="33" fontFamily="Arial, 'Kohinoor Bangla', sans-serif" fontWeight="900" fontSize="18" fill="#FFFFFF">রকেট</text>
    {/* DBBL Tag */}
    <text x="96" y="32" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="8" fill="#FFD700">DBBL</text>
  </svg>
);

// 4. Visa Logo matching exact blue and yellow swoosh
export const VisaLogo: React.FC<{ className?: string; height?: number }> = ({ className = "h-6", height = 24 }) => (
  <svg viewBox="0 0 100 46" className={className} style={{ height }} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="46" rx="6" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
    <g transform="translate(10, 10) scale(0.9)">
      <path d="M30.8 2.5L20.2 23.5H13.6L8.3 5.1C8 3.8 7.2 3.3 6.1 2.7C4.3 1.7 1.4 0.8 0 0.5L0.2 0.1H11C12.4 0.1 13.6 1.1 13.9 2.6L16.6 16.3L23.4 0.1H30.8ZM57.6 16C57.7 9.9 49.1 9.5 49.2 6.8C49.3 6 50.1 5.1 51.9 4.9C52.8 4.8 55.4 4.7 58.4 6.1L59.6 0.9C58 0.3 55.9 0 53.3 0C46.8 0 42.2 3.5 42.1 8.4C42 12.1 45.4 14.1 47.9 15.3C50.5 16.6 51.4 17.4 51.3 18.5C51.2 20.2 49.2 20.9 47.3 21C44 21.1 42.1 20.1 40.6 19.4L39.3 24.8C40.9 25.5 43.8 26 46.8 26.1C53.7 26.1 58.2 22.7 58.3 17.4M75.3 23.5H80L75.9 0.1H71.6C70.6 0.1 69.8 0.7 69.4 1.6L59.3 23.5H66.2L67.6 19.7H76.1L75.3 23.5ZM69.5 14.6L72.9 5.3L74.8 14.6H69.5ZM40.9 0.1L35.6 23.5H29.1L34.4 0.1H40.9Z" fill="#1A1F71"/>
      <path d="M13.9 2.6C13.6 1.1 12.4 0.1 11 0.1H0L0.2 0.5C1.4 0.8 4.3 1.7 6.1 2.7C7.2 3.3 8 3.8 8.3 5.1L13.6 23.5H16.6L20.2 23.5L30.8 0.1H23.4L16.6 16.3L13.9 2.6Z" fill="#F7B600"/>
    </g>
  </svg>
);

// 5. Upay Logo matching exact yellow badge, smile emblem & Bengali 'উপায়'
export const UpayLogo: React.FC<{ className?: string; height?: number }> = ({ className = "h-6", height = 24 }) => (
  <svg viewBox="0 0 120 46" className={className} style={{ height }} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="46" rx="6" fill="#FFCC00" />
    <g transform="translate(10, 5) scale(0.7)">
      {/* Yellow & Blue U Smile */}
      <path d="M12 10C12 22 22 30 32 30C42 30 52 22 52 10" stroke="#003366" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M12 10C12 22 22 30 32 30" stroke="#FF9900" strokeWidth="8" strokeLinecap="round" fill="none" />
      <circle cx="12" cy="5" r="4" fill="#FF9900" />
      <circle cx="52" cy="5" r="4" fill="#003366" />
    </g>
    {/* Bengali 'উপায়' */}
    <text x="52" y="32" fontFamily="Arial, 'Kohinoor Bangla', sans-serif" fontWeight="900" fontSize="22" fill="#333333">উপায়</text>
  </svg>
);

// 6. Google Pay Logo matching exact G and Pay
export const GooglePayLogo: React.FC<{ className?: string; height?: number }> = ({ className = "h-6", height = 24 }) => (
  <svg viewBox="0 0 110 46" className={className} style={{ height }} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="110" height="46" rx="6" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
    <g transform="translate(12, 11) scale(1)">
      <path d="M15 12V8.5H23.5C23.6 9.1 23.7 9.8 23.7 10.7C23.7 15.5 20.5 19 15 19C9.5 19 5 14.5 5 9C5 3.5 9.5 -1 15 -1C17.7 -1 20 0 21.7 1.6L19.2 4.1C18.3 3.2 16.9 2.5 15 2.5C11.4 2.5 8.5 5.4 8.5 9C8.5 12.6 11.4 15.5 15 15.5C19.1 15.5 20.7 12.6 21 10.8H15Z" fill="#4285F4"/>
      <path d="M15 12H21" stroke="#4285F4" strokeWidth="2" />
      <text x="28" y="16" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="18" fill="#5F6368">Pay</text>
    </g>
  </svg>
);

// 7. Mastercard Logo matching exact red & orange overlapping circles
export const MastercardLogo: React.FC<{ className?: string; height?: number }> = ({ className = "h-6", height = 24 }) => (
  <svg viewBox="0 0 90 46" className={className} style={{ height }} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="90" height="46" rx="6" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
    <circle cx="34" cy="23" r="14" fill="#EB001B" />
    <circle cx="56" cy="23" r="14" fill="#F79E1B" fillOpacity="0.92" />
    <path d="M45 11.8A13.9 13.9 0 0 0 39.7 23A13.9 13.9 0 0 0 45 34.2A13.9 13.9 0 0 0 50.3 23A13.9 13.9 0 0 0 45 11.8Z" fill="#FF5F00" />
  </svg>
);

// 8. DBBL / Sail Bank Logo (from uploaded image 9)
export const DbblSailLogo: React.FC<{ className?: string; height?: number }> = ({ className = "h-6", height = 24 }) => (
  <svg viewBox="0 0 100 46" className={className} style={{ height }} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="46" rx="6" fill="#4C1D95" />
    <g transform="translate(25, 7) scale(0.7)">
      <path d="M10 38C10 38 18 20 28 8C20 18 16 30 10 38Z" fill="#FFFFFF" />
      <path d="M22 38C22 38 32 16 44 4C34 16 28 28 22 38Z" fill="#FFFFFF" opacity="0.9" />
      <path d="M34 38C34 38 48 12 62 2C50 14 42 26 34 38Z" fill="#FFFFFF" />
    </g>
  </svg>
);

// 9. AMEX Logo
export const AmexLogo: React.FC<{ className?: string; height?: number }> = ({ className = "h-6", height = 24 }) => (
  <svg viewBox="0 0 90 46" className={className} style={{ height }} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="90" height="46" rx="6" fill="#006FCF" />
    <text x="45" y="28" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="16" fill="#FFFFFF" textAnchor="middle" letterSpacing="1">AMEX</text>
  </svg>
);

// 10. Apple Pay Logo
export const ApplePayLogo: React.FC<{ className?: string; height?: number }> = ({ className = "h-6", height = 24 }) => (
  <svg viewBox="0 0 100 46" className={className} style={{ height }} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="46" rx="6" fill="#000000" />
    <g transform="translate(18, 11)">
      <path d="M12.5 13.8C12.5 12.3 13.6 11.4 15.1 10.5C14.3 9.3 12.9 8.6 11.6 8.5C9.9 8.3 8.2 9.5 7.3 9.5C6.4 9.5 5.1 8.5 3.6 8.5C1.7 8.5 -0.1 9.6 -1 11.2C-3 14.6 -1.5 19.6 0.4 22.4C1.4 23.7 2.5 25.2 4 25.1C5.4 25 6 24.2 7.6 24.2C9.2 24.2 9.7 25.1 11.1 25.1C12.6 25.1 13.6 23.8 14.5 22.5C15.6 21 16 19.5 16.1 19.4C16 19.3 12.5 18 12.5 13.8Z" fill="#FFFFFF"/>
      <path d="M10.2 6.8C10.9 5.9 11.4 4.7 11.2 3.5C10.1 3.6 8.8 4.3 8.1 5.1C7.4 5.9 6.9 7.1 7.1 8.3C8.3 8.4 9.5 7.6 10.2 6.8Z" fill="#FFFFFF"/>
      <text x="24" y="21" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="18" fill="#FFFFFF">Pay</text>
    </g>
  </svg>
);

// 11. CellFin Logo
export const CellFinLogo: React.FC<{ className?: string; height?: number }> = ({ className = "h-6", height = 24 }) => (
  <svg viewBox="0 0 110 46" className={className} style={{ height }} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="110" height="46" rx="6" fill="#006837" />
    <circle cx="22" cy="23" r="11" fill="#FFFFFF" fillOpacity="0.25" />
    <path d="M16 23L21 28L29 17" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <text x="68" y="29" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="18" fill="#FFFFFF" textAnchor="middle">CellFin</text>
  </svg>
);

// 12. Bagelshe Pay Logo
export const BagelshePayLogo: React.FC<{ className?: string; height?: number }> = ({ className = "h-6", height = 24 }) => (
  <svg viewBox="0 0 140 46" className={className} style={{ height }} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="140" height="46" rx="6" fill="#000000" stroke="#F59E0B" strokeWidth="1" />
    <path d="M20 12L28 23L20 34L12 23Z" fill="#F59E0B" />
    <text x="20" y="27" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="13" fill="#000000" textAnchor="middle">B</text>
    <text x="36" y="29" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="16" fill="#FBBF24" letterSpacing="-0.5">BAGELSHE</text>
    <text x="116" y="29" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="13" fill="#FFFFFF">PAY</text>
  </svg>
);

// 13. Cash On Delivery Logo
export const CodLogo: React.FC<{ className?: string; height?: number }> = ({ className = "h-6", height = 24 }) => (
  <svg viewBox="0 0 120 46" className={className} style={{ height }} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="46" rx="6" fill="#064E3B" />
    <rect x="14" y="15" width="16" height="16" rx="2" fill="#10B981" />
    <circle cx="22" cy="23" r="3.5" fill="#ECFDF5" />
    <text x="72" y="29" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="17" fill="#FFFFFF" textAnchor="middle">C O D</text>
  </svg>
);

