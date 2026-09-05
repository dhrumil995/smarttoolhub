import React, { useState, useEffect } from 'react';
import { Layers, Copy, Check, Sliders, RefreshCw } from 'lucide-react';
import AdSenseSlot from '../AdSenseSlot';

export default function GlassmorphismGenerator() {
  const [blur, setBlur] = useState(12);
  const [transparency, setTransparency] = useState(0.25);
  const [color, setColor] = useState('#ffffff');
  const [borderColor, setBorderColor] = useState('#ffffff');
  const [borderWidth, setBorderWidth] = useState(1);
  const [borderOpacity, setBorderOpacity] = useState(0.2);
  const [shadow, setShadow] = useState(15);
  const [shadowOpacity, setShadowOpacity] = useState(0.1);

  const [cssCode, setCssCode] = useState('');
  const [copied, setCopied] = useState(false);

  // Convert hex color to RGB
  const hexToRgb = (hex: string) => {
    let c = hex.replace('#', '');
    if (c.length === 3) {
      c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    }
    const num = parseInt(c, 16);
    return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
  };

  useEffect(() => {
    const rgbBg = hexToRgb(color);
    const rgbBorder = hexToRgb(borderColor);

    const generated = `/* Glassmorphism CSS styling */
background: rgba(${rgbBg}, ${transparency});
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border: ${borderWidth}px solid rgba(${rgbBorder}, ${borderOpacity});
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, ${shadowOpacity});
border-radius: 16px;`;

    setCssCode(generated);
  }, [blur, transparency, color, borderColor, borderWidth, borderOpacity, shadow, shadowOpacity]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setBlur(12);
    setTransparency(0.25);
    setColor('#ffffff');
    setBorderColor('#ffffff');
    setBorderWidth(1);
    setBorderOpacity(0.2);
    setShadow(15);
    setShadowOpacity(0.1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <Layers size={12} />
            Design & Style Utilities
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            CSS Glassmorphism UI Generator
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Design stunning glassmorphic cards and containers. Live preview control panel with immediate CSS code extraction.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders Container */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
              <div className="flex items-center gap-2">
                <Sliders size={16} className="text-slate-400" />
                <h3 className="font-semibold text-slate-850 dark:text-slate-250 text-xs uppercase tracking-wider">
                  Visual Settings
                </h3>
              </div>
              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                title="Reset values"
              >
                <RefreshCw size={12} />
              </button>
            </div>

            {/* Backdrop Blur */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                <span>Backdrop Blur</span>
                <span className="font-mono text-[11px] text-pink-600 dark:text-pink-400">{blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="w-full accent-pink-500 h-1 bg-slate-100 dark:bg-slate-850 rounded-lg cursor-pointer"
              />
            </div>

            {/* Transparency / Opacity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                <span>Background Opacity</span>
                <span className="font-mono text-[11px] text-pink-600 dark:text-pink-400">{transparency.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={transparency * 100}
                onChange={(e) => setTransparency(Number(e.target.value) / 100)}
                className="w-full accent-pink-500 h-1 bg-slate-100 dark:bg-slate-850 rounded-lg cursor-pointer"
              />
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Glass Color</span>
                <div className="flex items-center gap-2 border border-slate-150 dark:border-slate-800 rounded-xl p-1.5 bg-slate-50 dark:bg-slate-950">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent shrink-0"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full font-mono text-[10px] bg-transparent text-slate-850 dark:text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Border Color</span>
                <div className="flex items-center gap-2 border border-slate-150 dark:border-slate-800 rounded-xl p-1.5 bg-slate-50 dark:bg-slate-950">
                  <input
                    type="color"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent shrink-0"
                  />
                  <input
                    type="text"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="w-full font-mono text-[10px] bg-transparent text-slate-850 dark:text-slate-200 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Border Opacity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                <span>Border Opacity</span>
                <span className="font-mono text-[11px] text-pink-600 dark:text-pink-400">{borderOpacity.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={borderOpacity * 100}
                onChange={(e) => setBorderOpacity(Number(e.target.value) / 100)}
                className="w-full accent-pink-500 h-1 bg-slate-100 dark:bg-slate-850 rounded-lg cursor-pointer"
              />
            </div>

            {/* Border Width */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                <span>Border Thickness</span>
                <span className="font-mono text-[11px] text-pink-600 dark:text-pink-400">{borderWidth}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={borderWidth}
                onChange={(e) => setBorderWidth(Number(e.target.value))}
                className="w-full accent-pink-500 h-1 bg-slate-100 dark:bg-slate-850 rounded-lg cursor-pointer"
              />
            </div>

            {/* Shadow Opacity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                <span>Shadow Opacity</span>
                <span className="font-mono text-[11px] text-pink-600 dark:text-pink-400">{shadowOpacity.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="2"
                value={shadowOpacity * 100}
                onChange={(e) => setShadowOpacity(Number(e.target.value) / 100)}
                className="w-full accent-pink-500 h-1 bg-slate-100 dark:bg-slate-850 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Live Preview Container & Output Code */}
        <div className="lg:col-span-7 space-y-6">
          {/* Backdrop Glass box container */}
          <div className="relative bg-linear-to-tr from-pink-500 via-purple-600 to-indigo-600 rounded-2xl h-64 w-full flex items-center justify-center p-8 overflow-hidden shadow-md">
            {/* Background elements to highlight backdrop blur */}
            <div className="absolute w-24 h-24 bg-yellow-400 rounded-full top-6 left-12 animate-pulse" />
            <div className="absolute w-32 h-32 bg-cyan-400 rounded-full bottom-6 right-12 animate-bounce" style={{ animationDuration: '6s' }} />

            {/* Glassmorphic card */}
            <div
              style={{
                background: `rgba(${hexToRgb(color)}, ${transparency})`,
                backdropFilter: `blur(${blur}px)`,
                WebkitBackdropFilter: `blur(${blur}px)`,
                border: `${borderWidth}px solid rgba(${hexToRgb(borderColor)}, ${borderOpacity})`,
                boxShadow: `0 8px 32px 0 rgba(0, 0, 0, ${shadowOpacity})`,
                borderRadius: '16px',
              }}
              className="w-full max-w-sm p-6 text-white text-center space-y-2 select-none relative z-10"
            >
              <h4 className="font-display font-black text-lg tracking-wide">Glassmorphism Card</h4>
              <p className="text-[11px] opacity-90 leading-relaxed font-sans">
                Notice how the background elements blur beautifully under this dynamic container card. Customize values on the left panel!
              </p>
              <div className="pt-2 text-[10px] font-mono tracking-widest uppercase opacity-75">
                SmartToolHub Design Studio
              </div>
            </div>
          </div>

          {/* Generated Code */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                CSS Snippet Output
              </span>
              <button
                onClick={handleCopy}
                className="p-1 px-3 rounded-lg text-[10px] font-bold bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 flex items-center gap-1 transition-colors border border-slate-200/40 dark:border-slate-800/60"
              >
                {copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                {copied ? 'Copied CSS' : 'Copy CSS'}
              </button>
            </div>

            <pre className="w-full rounded-xl bg-slate-950 p-4 text-xs font-mono text-emerald-400 overflow-x-auto select-all leading-relaxed border border-slate-850">
              {cssCode}
            </pre>
          </div>
        </div>
      </div>

      <AdSenseSlot slot="glassmorphism-bottom" />
    </div>
  );
}
