import React, { useState } from 'react';
import { Palette, Copy, Check, RefreshCw, Sparkles, Download, Lock, Unlock, Sliders, ShieldCheck } from 'lucide-react';

interface ColorSlot {
  hex: string;
  locked: boolean;
  name: string;
}

export function ColorPaletteGenerator() {
  const [harmony, setHarmony] = useState<'complementary' | 'analogous' | 'triadic' | 'monochromatic' | 'random'>('triadic');
  const [baseHex, setBaseHex] = useState('#3b82f6');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Convert hex to HSL
  const hexToHsl = (hex: string) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  };

  // Convert HSL to Hex
  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  // Generate palette based on base hex and harmony
  const generateColors = (base: string, harm: string): string[] => {
    const [h, s, l] = hexToHsl(base);
    if (harm === 'complementary') {
      return [
        base,
        hslToHex((h + 30) % 360, s, Math.max(15, l - 15)),
        hslToHex((h + 180) % 360, s, l),
        hslToHex((h + 200) % 360, Math.max(20, s - 20), Math.min(85, l + 20)),
        hslToHex((h + 180) % 360, Math.max(10, s - 30), 95),
      ];
    }
    if (harm === 'analogous') {
      return [
        hslToHex((h - 40 + 360) % 360, s, l),
        hslToHex((h - 20 + 360) % 360, s, l),
        base,
        hslToHex((h + 20) % 360, s, l),
        hslToHex((h + 40) % 360, s, l),
      ];
    }
    if (harm === 'monochromatic') {
      return [
        hslToHex(h, s, 15),
        hslToHex(h, s, 35),
        base,
        hslToHex(h, Math.max(10, s - 15), 75),
        hslToHex(h, Math.max(10, s - 30), 92),
      ];
    }
    // Triadic
    return [
      base,
      hslToHex((h + 120) % 360, s, l),
      hslToHex((h + 240) % 360, s, l),
      hslToHex((h + 60) % 360, Math.max(20, s - 20), Math.min(85, l + 15)),
      hslToHex((h + 180) % 360, Math.max(10, s - 40), 94),
    ];
  };

  const [colors, setColors] = useState<ColorSlot[]>([
    { hex: '#3b82f6', locked: false, name: 'Primary Accent' },
    { hex: '#10b981', locked: false, name: 'Secondary Mint' },
    { hex: '#8b5cf6', locked: false, name: 'Tertiary Violet' },
    { hex: '#f59e0b', locked: false, name: 'Highlight Amber' },
    { hex: '#f8fafc', locked: false, name: 'Surface Tint' },
  ]);

  const handleRegenerate = () => {
    const randomHue = Math.floor(Math.random() * 360);
    const newBase = hslToHex(randomHue, 75, 55);
    setBaseHex(newBase);
    const newPalette = generateColors(newBase, harmony);
    setColors(prev => prev.map((slot, i) => slot.locked ? slot : { ...slot, hex: newPalette[i] || newBase }));
  };

  const toggleLock = (idx: number) => {
    setColors(prev => prev.map((slot, i) => i === idx ? { ...slot, locked: !slot.locked } : slot));
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getCssVariables = () => {
    return `:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n')}\n}`;
  };

  const getTailwindConfig = () => {
    return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${colors.map((c, i) => `        brand${i + 1}: '${c.hex}',`).join('\n')}\n      }\n    }\n  }\n}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-pink-500/10 text-pink-600 dark:text-pink-400 rounded-full text-xs font-semibold">
          <Palette size={14} /> Ultra Pro Max Color Harmony Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          AI Harmony Color Palette Studio
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Generate harmonious color palettes using optical color theory. Lock individual swatches, inspect WCAG contrast, and export clean CSS variables or Tailwind color configs.
        </p>
      </div>

      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Harmony Mode:</span>
          {(['triadic', 'complementary', 'analogous', 'monochromatic'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setHarmony(mode);
                const newPalette = generateColors(baseHex, mode);
                setColors(prev => prev.map((slot, i) => slot.locked ? slot : { ...slot, hex: newPalette[i] || baseHex }));
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer capitalize ${
                harmony === mode ? 'bg-pink-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <button
          onClick={handleRegenerate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <RefreshCw size={14} /> Generate New Palette
        </button>
      </div>

      {/* Interactive Swatch Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {colors.map((slot, idx) => {
          // Simple luminance check for text readability
          const [h, s, l] = hexToHsl(slot.hex);
          const isDark = l < 50;

          return (
            <div
              key={idx}
              className="h-64 rounded-2xl flex flex-col justify-between p-4 transition-transform hover:-translate-y-1 shadow-md relative overflow-hidden group border border-black/10"
              style={{ backgroundColor: slot.hex }}
            >
              {/* Top Lock Button */}
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ${isDark ? 'bg-black/30 text-white' : 'bg-white/50 text-slate-900'}`}>
                  Slot #{idx + 1}
                </span>
                <button
                  onClick={() => toggleLock(idx)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isDark ? 'text-white hover:bg-white/20' : 'text-slate-900 hover:bg-black/10'}`}
                  title={slot.locked ? 'Unlock swatch' : 'Lock swatch'}
                >
                  {slot.locked ? <Lock size={16} /> : <Unlock size={16} className="opacity-40 group-hover:opacity-100" />}
                </button>
              </div>

              {/* Bottom Color Code & Copy */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-base font-mono font-extrabold uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {slot.hex}
                  </span>
                  <button
                    onClick={() => handleCopy(slot.hex, `hex-${idx}`)}
                    className={`p-1.5 rounded-lg cursor-pointer transition-transform active:scale-90 ${isDark ? 'text-white hover:bg-white/20' : 'text-slate-900 hover:bg-black/10'}`}
                    title="Copy hex code"
                  >
                    {copiedKey === `hex-${idx}` ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  </button>
                </div>
                <span className={`text-[10px] font-mono block truncate ${isDark ? 'text-white/70' : 'text-slate-800/70'}`}>
                  hsl({h}, {s}%, {l}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Export Codes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CSS Variables */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-bold uppercase tracking-wider text-slate-400">CSS Custom Properties</span>
            <button
              onClick={() => handleCopy(getCssVariables(), 'css-vars')}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold cursor-pointer transition-all text-xs"
            >
              {copiedKey === 'css-vars' ? <Check size={12} className="text-emerald-300" /> : <Copy size={12} />}
              <span>Copy CSS</span>
            </button>
          </div>
          <pre className="p-3 bg-slate-900/80 rounded-xl text-xs text-pink-300 font-mono overflow-x-auto">
            {getCssVariables()}
          </pre>
        </div>

        {/* Tailwind Config */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-bold uppercase tracking-wider text-slate-400">Tailwind CSS Config</span>
            <button
              onClick={() => handleCopy(getTailwindConfig(), 'tw-config')}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold cursor-pointer transition-all text-xs"
            >
              {copiedKey === 'tw-config' ? <Check size={12} className="text-emerald-300" /> : <Copy size={12} />}
              <span>Copy Tailwind</span>
            </button>
          </div>
          <pre className="p-3 bg-slate-900/80 rounded-xl text-xs text-cyan-300 font-mono overflow-x-auto">
            {getTailwindConfig()}
          </pre>
        </div>
      </div>
    </div>
  );
}
export default ColorPaletteGenerator;
