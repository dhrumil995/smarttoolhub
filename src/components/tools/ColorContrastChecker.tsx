import React, { useState } from 'react';
import { Eye, Check, X, Sparkles, RefreshCw, Layers } from 'lucide-react';
import AdSenseSlot from '../AdSenseSlot';

export default function ColorContrastChecker() {
  const [textColor, setTextColor] = useState('#1E293B');
  const [bgColor, setBgColor] = useState('#F8FAFC');

  // Convert Hex to RGB
  const hexToRgb = (hex: string) => {
    let clean = hex.replace('#', '');
    if (clean.length === 3) clean = clean.split('').map((c) => c + c).join('');
    const num = parseInt(clean, 16);
    return isNaN(num)
      ? { r: 0, g: 0, b: 0 }
      : { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  };

  // Calculate Luminance
  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const rgb1 = hexToRgb(textColor);
  const rgb2 = hexToRgb(bgColor);

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
  const ratioFixed = ratio.toFixed(2);

  const passAANormal = ratio >= 4.5;
  const passAALarge = ratio >= 3.0;
  const passAAANormal = ratio >= 7.0;
  const passAAALarge = ratio >= 4.5;

  const swapColors = () => {
    const temp = textColor;
    setTextColor(bgColor);
    setBgColor(temp);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 text-violet-500 rounded-full text-xs font-extrabold uppercase tracking-widest border border-violet-500/20">
          <Eye size={14} /> UI/UX Accessibility Tool
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Color Contrast & WCAG Accessibility Checker
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Test color contrast ratios between text and background colors against WCAG 2.1 AA & AAA accessibility compliance standards.
        </p>
      </div>

      <AdSenseSlot slot="color-contrast-top" />

      {/* Main Interactive Checker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Color Inputs */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Color Palette Selection
            </h3>
            <button
              onClick={swapColors}
              className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
              title="Swap Colors"
            >
              <RefreshCw size={14} /> Swap
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Text / Foreground Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700 p-1"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700 p-1"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Font Sample Preview */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4" style={{ backgroundColor: bgColor, color: textColor }}>
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest opacity-70">
              Live Text Preview
            </span>
            <h2 className="text-xl sm:text-2xl font-black">
              Accessible Design First
            </h2>
            <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-90">
              Good contrast ensures your website copy is readable for people with visual impairments or on low-brightness displays.
            </p>
          </div>

          <div className="pt-2 border-t border-current/10 flex items-center justify-between">
            <span className="text-xs font-bold font-mono">Contrast Ratio:</span>
            <span className="text-2xl font-black font-mono">{ratioFixed}:1</span>
          </div>
        </div>
      </div>

      {/* WCAG Compliance Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'AA Normal Text (16px+)', pass: passAANormal, req: '4.5:1' },
          { label: 'AA Large Text (18px+ bold)', pass: passAALarge, req: '3.0:1' },
          { label: 'AAA Normal Text', pass: passAAANormal, req: '7.0:1' },
          { label: 'AAA Large Text', pass: passAAALarge, req: '4.5:1' },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border flex flex-col justify-between space-y-2 ${
              item.pass
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase">{item.req}</span>
              {item.pass ? <Check size={16} /> : <X size={16} />}
            </div>
            <div>
              <p className="text-xs font-bold">{item.label}</p>
              <span className="text-[10px] font-mono uppercase font-bold">
                {item.pass ? 'PASS' : 'FAIL'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
