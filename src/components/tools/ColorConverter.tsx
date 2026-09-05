import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, Sparkles } from 'lucide-react';

export default function ColorConverter() {
  const [hex, setHex] = useState('#6366F1'); // Default Indigo
  const [copiedHex, setCopiedHex] = useState(false);
  const [copiedRgb, setCopiedRgb] = useState(false);
  const [copiedHsl, setCopiedHsl] = useState(false);

  // Parse HEX to RGB
  const hexToRgb = (hexStr: string) => {
    const cleanHex = hexStr.replace('#', '');
    if (cleanHex.length !== 6 && cleanHex.length !== 3) return { r: 99, g: 102, b: 241 };
    
    let r = 0, g = 0, b = 0;
    if (cleanHex.length === 6) {
      r = parseInt(cleanHex.substring(0, 2), 16);
      g = parseInt(cleanHex.substring(2, 4), 16);
      b = parseInt(cleanHex.substring(4, 6), 16);
    } else {
      r = parseInt(cleanHex.charAt(0) + cleanHex.charAt(0), 16);
      g = parseInt(cleanHex.charAt(1) + cleanHex.charAt(1), 16);
      b = parseInt(cleanHex.charAt(2) + cleanHex.charAt(2), 16);
    }
    return { r, g, b };
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  // RGB components
  const { r, g, b } = hexToRgb(hex);
  const rgbString = `rgb(${r}, ${g}, ${b})`;

  // HSL components
  const { h, s, l } = rgbToHsl(r, g, b);
  const hslString = `hsl(${h}, ${s}%, ${l}%)`;

  const generateRandom = () => {
    const chars = '0123456789ABCDEF';
    let randomColor = '#';
    for (let i = 0; i < 6; i++) {
      randomColor += chars[Math.floor(Math.random() * 16)];
    }
    setHex(randomColor);
  };

  // Helper for copies
  const handleCopy = async (text: string, setCopied: React.Dispatch<React.SetStateAction<boolean>>) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // Palette schemes computation
  // 1. Complementary
  const complementaryH = (h + 180) % 360;
  const complementaryHex = `hsl(${complementaryH}, ${s}%, ${l}%)`;

  // 2. Analogous
  const analogousL = `hsl(${(h + 330) % 360}, ${s}%, ${l}%)`;
  const analogousR = `hsl(${(h + 30) % 360}, ${s}%, ${l}%)`;

  // 3. Monochromatic tints & shades
  const monoTint = `hsl(${h}, ${s}%, ${Math.min(100, l + 20)}%)`;
  const monoShade = `hsl(${h}, ${s}%, ${Math.max(0, l - 20)}%)`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Selection Column */}
      <div className="lg:col-span-5 flex flex-col items-center justify-center">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl w-full max-w-[340px] text-center space-y-5">
          <span className="text-xs font-bold font-mono tracking-widest uppercase text-indigo-500 block">
            INTERACTIVE PICKER
          </span>

          {/* Large Color Circle preview */}
          <div
            className="w-full h-40 rounded-xl shadow-xs transition-transform duration-300 hover:scale-102 flex items-end p-4 text-white font-bold font-mono text-sm relative overflow-hidden"
            style={{ backgroundColor: hex }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <span className="relative z-10">{hex.toUpperCase()}</span>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Color Wheel</span>
              <input
                type="color"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                className="w-full h-11 p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer bg-white dark:bg-gray-850"
              />
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Auto Hex</span>
              <input
                type="text"
                value={hex.toUpperCase()}
                onChange={(e) => {
                  let val = e.target.value;
                  if (!val.startsWith('#')) val = '#' + val;
                  if (val.length <= 7) setHex(val);
                }}
                maxLength={7}
                className="w-full h-11 text-center font-mono text-sm font-semibold bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={generateRandom}
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <RefreshCw size={13} />
            Generate Random Color
          </button>
        </div>
      </div>

      {/* Right Outputs and Palettes Column */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 space-y-5">
          <span className="text-xs font-bold font-mono tracking-widest text-indigo-500 block uppercase">
            COLOR CONVERSIONS
          </span>

          <div className="space-y-3.5">
            {/* Hex Row */}
            <div className="flex items-center justify-between gap-4 p-3 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800/60 rounded-xl">
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">HEX Code</span>
                <span className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-200">{hex.toUpperCase()}</span>
              </div>
              <button
                onClick={() => handleCopy(hex.toUpperCase(), setCopiedHex)}
                className="px-3 py-1.5 bg-white dark:bg-gray-950 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-1"
              >
                {copiedHex ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                {copiedHex ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* RGB Row */}
            <div className="flex items-center justify-between gap-4 p-3 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800/60 rounded-xl">
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">RGB Code</span>
                <span className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-200">{rgbString}</span>
              </div>
              <button
                onClick={() => handleCopy(rgbString, setCopiedRgb)}
                className="px-3 py-1.5 bg-white dark:bg-gray-950 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-1"
              >
                {copiedRgb ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                {copiedRgb ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* HSL Row */}
            <div className="flex items-center justify-between gap-4 p-3 bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800/60 rounded-xl">
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">HSL Code</span>
                <span className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-200">{hslString}</span>
              </div>
              <button
                onClick={() => handleCopy(hslString, setCopiedHsl)}
                className="px-3 py-1.5 bg-white dark:bg-gray-950 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-1"
              >
                {copiedHsl ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                {copiedHsl ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Palettes Panel */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4">
          <span className="text-xs font-bold font-mono tracking-widest text-indigo-500 block uppercase flex items-center gap-1">
            <Sparkles size={14} />
            HARMONIOUS PALETTES
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Complementary */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Complementary</span>
              <div className="flex gap-1.5">
                <div
                  className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-800 cursor-pointer"
                  style={{ backgroundColor: hex }}
                  title="Original Color"
                />
                <div
                  className="flex-1 h-10 rounded-lg border border-gray-200 dark:border-gray-800 cursor-pointer text-[10px] font-semibold text-white flex items-end p-1.5 select-all"
                  style={{ backgroundColor: complementaryHex }}
                  title="Complementary Color"
                >
                  {complementaryHex.length > 15 ? 'Alt Color' : complementaryHex}
                </div>
              </div>
            </div>

            {/* Analogous */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Analogous</span>
              <div className="flex gap-1.5">
                <div
                  className="flex-1 h-10 rounded-lg border border-gray-200 dark:border-gray-800"
                  style={{ backgroundColor: analogousL }}
                  title="Analogous Left"
                />
                <div
                  className="flex-1 h-10 rounded-lg border border-gray-200 dark:border-gray-800"
                  style={{ backgroundColor: hex }}
                  title="Original Color"
                />
                <div
                  className="flex-1 h-10 rounded-lg border border-gray-200 dark:border-gray-800"
                  style={{ backgroundColor: analogousR }}
                  title="Analogous Right"
                />
              </div>
            </div>

            {/* Monochromatic */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Monochromatic</span>
              <div className="flex gap-1.5">
                <div
                  className="flex-1 h-10 rounded-lg border border-gray-200 dark:border-gray-800"
                  style={{ backgroundColor: monoShade }}
                  title="Shade (-20% lightness)"
                />
                <div
                  className="flex-1 h-10 rounded-lg border border-gray-200 dark:border-gray-800"
                  style={{ backgroundColor: hex }}
                  title="Original Color"
                />
                <div
                  className="flex-1 h-10 rounded-lg border border-gray-200 dark:border-gray-800"
                  style={{ backgroundColor: monoTint }}
                  title="Tint (+20% lightness)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
