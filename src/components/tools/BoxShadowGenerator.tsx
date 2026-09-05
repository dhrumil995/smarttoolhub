import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Box, Sliders, Code } from 'lucide-react';

export const BoxShadowGenerator: React.FC = () => {
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(10);
  const [blur, setBlur] = useState<number>(25);
  const [spread, setSpread] = useState<number>(-3);
  const [color, setColor] = useState<string>('#000000');
  const [opacity, setOpacity] = useState<number>(0.15);
  const [inset, setInset] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const boxShadowCss = `${inset ? 'inset ' : ''}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${hexToRgba(
    color,
    opacity
  )}`;

  const copyCss = () => {
    navigator.clipboard.writeText(`box-shadow: ${boxShadowCss};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders size={16} className="text-blue-500" />
              Shadow Controls
            </h2>
            <button
              onClick={() => {
                setOffsetX(0);
                setOffsetY(10);
                setBlur(25);
                setSpread(-3);
                setColor('#000000');
                setOpacity(0.15);
                setInset(false);
              }}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Horizontal Offset (X)</span>
                <span>{offsetX}px</span>
              </div>
              <input
                type="range"
                min={-50}
                max={50}
                value={offsetX}
                onChange={(e) => setOffsetX(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Vertical Offset (Y)</span>
                <span>{offsetY}px</span>
              </div>
              <input
                type="range"
                min={-50}
                max={50}
                value={offsetY}
                onChange={(e) => setOffsetY(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Blur Radius</span>
                <span>{blur}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Spread Radius</span>
                <span>{spread}px</span>
              </div>
              <input
                type="range"
                min={-50}
                max={50}
                value={spread}
                onChange={(e) => setSpread(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Shadow Opacity</span>
                <span>{Math.round(opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="font-bold text-slate-700 dark:text-slate-300">Shadow Color</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-8 w-12 rounded-lg cursor-pointer border-0"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="font-bold text-slate-700 dark:text-slate-300">Inset Shadow</label>
              <input
                type="checkbox"
                checked={inset}
                onChange={(e) => setInset(e.target.checked)}
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Preview & CSS Output */}
        <div className="lg:col-span-7 space-y-5 flex flex-col justify-between">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex-1 flex flex-col">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
              Live Shadow Sandbox
            </h3>

            <div className="flex-1 min-h-[220px] bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center p-8">
              <div
                style={{
                  boxShadow: boxShadowCss,
                }}
                className="w-48 h-32 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center font-black text-sm text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-800"
              >
                Box Element
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3 font-mono text-xs shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-blue-400 flex items-center gap-1.5 text-[11px]">
                <Code size={14} /> CSS Output
              </span>
              <button
                onClick={copyCss}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer text-[10px]"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy CSS'}
              </button>
            </div>
            <code className="text-emerald-400 block break-all font-mono">
              box-shadow: {boxShadowCss};
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};
