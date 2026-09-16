import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Palette, Check, RefreshCw } from 'lucide-react';

export const ThemeTab: React.FC = () => {
  const { themeSettings, updateThemeSettings } = useStore();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-black">Global Storefront Theme Customizer</h2>
          <p className="text-xs text-gray-500 font-semibold mt-0.5">Control global brand colors, typography fonts, and component borders</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs space-y-6">
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold text-black uppercase tracking-wider">Brand Palette Colors</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold">
            <div>
              <label className="block text-gray-500 mb-1">Primary Color</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={themeSettings.primaryColor}
                  onChange={(e) => updateThemeSettings({ primaryColor: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer border border-gray-200"
                />
                <span className="font-mono text-xs">{themeSettings.primaryColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-gray-500 mb-1">Accent Color</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={themeSettings.accentColor}
                  onChange={(e) => updateThemeSettings({ accentColor: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer border border-gray-200"
                />
                <span className="font-mono text-xs">{themeSettings.accentColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-gray-500 mb-1">Background Tone</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={themeSettings.backgroundColor}
                  onChange={(e) => updateThemeSettings({ backgroundColor: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer border border-gray-200"
                />
                <span className="font-mono text-xs">{themeSettings.backgroundColor}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 space-y-3">
          <h3 className="text-xs font-extrabold text-black uppercase tracking-wider">Typography & Style</h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Primary Font Family</label>
              <select 
                value={themeSettings.fontFamily}
                onChange={(e) => updateThemeSettings({ fontFamily: e.target.value })}
                className="w-full border border-gray-200 p-2.5 rounded font-bold focus:outline-none"
              >
                <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans & Space Grotesk (Modern Athletic)</option>
                <option value="Montserrat, sans-serif">Montserrat / Mono Bold (Gymshark Style)</option>
                <option value="Inter, sans-serif">Inter Clean</option>
                <option value="Roboto, sans-serif">Roboto Modern</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Button Corner Radius</label>
              <select 
                value={themeSettings.buttonRadius}
                onChange={(e) => updateThemeSettings({ buttonRadius: e.target.value as any })}
                className="w-full border border-gray-200 p-2.5 rounded font-bold focus:outline-none"
              >
                <option value="none">Square Sharp (0px - Gymshark Classic)</option>
                <option value="rounded">Subtle Rounded (4px)</option>
                <option value="pill">Pill Full (999px)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
