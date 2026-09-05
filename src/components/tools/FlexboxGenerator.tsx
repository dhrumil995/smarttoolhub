import React, { useState } from 'react';
import { Copy, Check, RotateCcw, LayoutGrid, Sliders, Code } from 'lucide-react';

export const FlexboxGenerator: React.FC = () => {
  const [flexDirection, setFlexDirection] = useState<'row' | 'row-reverse' | 'column' | 'column-reverse'>('row');
  const [justifyContent, setJustifyContent] = useState<'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'>('center');
  const [alignItems, setAlignItems] = useState<'stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline'>('center');
  const [flexWrap, setFlexWrap] = useState<'nowrap' | 'wrap' | 'wrap-reverse'>('wrap');
  const [gap, setGap] = useState<number>(16);
  const [itemCount, setItemCount] = useState<number>(4);
  const [copied, setCopied] = useState<boolean>(false);

  const cssCode = `/* CSS Flexbox Container */
.flex-container {
  display: flex;
  flex-direction: ${flexDirection};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  flex-wrap: ${flexWrap};
  gap: ${gap}px;
}

/* Flexbox Child Items */
.flex-item {
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
}`;

  const tailwindCode = `flex flex-${flexDirection} justify-${
    justifyContent === 'flex-start' ? 'start' : justifyContent === 'flex-end' ? 'end' : justifyContent === 'space-between' ? 'between' : justifyContent === 'space-around' ? 'around' : justifyContent === 'space-evenly' ? 'evenly' : 'center'
  } items-${
    alignItems === 'flex-start' ? 'start' : alignItems === 'flex-end' ? 'end' : alignItems
  } ${flexWrap === 'wrap' ? 'flex-wrap' : flexWrap === 'wrap-reverse' ? 'flex-wrap-reverse' : 'flex-nowrap'} gap-[${gap}px]`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetControls = () => {
    setFlexDirection('row');
    setJustifyContent('center');
    setAlignItems('center');
    setFlexWrap('wrap');
    setGap(16);
    setItemCount(4);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Controls */}
        <div className="lg:col-span-5 space-y-5 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders size={16} className="text-blue-500" />
              Flexbox Properties
            </h2>
            <button
              onClick={resetControls}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Direction */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">flex-direction</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['row', 'row-reverse', 'column', 'column-reverse'] as const).map((dir) => (
                  <button
                    key={dir}
                    onClick={() => setFlexDirection(dir)}
                    className={`py-1.5 px-2 rounded-lg font-mono text-[11px] font-bold border transition-all cursor-pointer ${
                      flexDirection === dir
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {dir}
                  </button>
                ))}
              </div>
            </div>

            {/* Justify Content */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">justify-content</label>
              <select
                value={justifyContent}
                onChange={(e) => setJustifyContent(e.target.value as any)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="flex-start">flex-start</option>
                <option value="center">center</option>
                <option value="flex-end">flex-end</option>
                <option value="space-between">space-between</option>
                <option value="space-around">space-around</option>
                <option value="space-evenly">space-evenly</option>
              </select>
            </div>

            {/* Align Items */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">align-items</label>
              <select
                value={alignItems}
                onChange={(e) => setAlignItems(e.target.value as any)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="stretch">stretch</option>
                <option value="flex-start">flex-start</option>
                <option value="center">center</option>
                <option value="flex-end">flex-end</option>
                <option value="baseline">baseline</option>
              </select>
            </div>

            {/* Flex Wrap */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">flex-wrap</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['nowrap', 'wrap', 'wrap-reverse'] as const).map((wr) => (
                  <button
                    key={wr}
                    onClick={() => setFlexWrap(wr)}
                    className={`py-1.5 px-1.5 rounded-lg font-mono text-[10px] font-bold border transition-all cursor-pointer ${
                      flexWrap === wr
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {wr}
                  </button>
                ))}
              </div>
            </div>

            {/* Gap slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-700 dark:text-slate-300">gap: {gap}px</label>
              </div>
              <input
                type="range"
                min={0}
                max={48}
                value={gap}
                onChange={(e) => setGap(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Item Count */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-700 dark:text-slate-300">Items Count: {itemCount}</label>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setItemCount(Math.max(1, itemCount - 1))}
                  className="px-3 py-1 bg-slate-200 dark:bg-slate-800 font-bold rounded-lg text-slate-700 dark:text-slate-300"
                >
                  -
                </button>
                <button
                  onClick={() => setItemCount(Math.min(12, itemCount + 1))}
                  className="px-3 py-1 bg-slate-200 dark:bg-slate-800 font-bold rounded-lg text-slate-700 dark:text-slate-300"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Sandbox & Output */}
        <div className="lg:col-span-7 space-y-5 flex flex-col justify-between">
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <LayoutGrid size={14} className="text-emerald-500" />
                Live Container Preview
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Interactive Canvas</span>
            </div>

            {/* Interactive Stage */}
            <div className="flex-1 min-h-[260px] bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-4 overflow-auto">
              <div
                style={{
                  display: 'flex',
                  flexDirection: flexDirection,
                  justifyContent: justifyContent,
                  alignItems: alignItems,
                  flexWrap: flexWrap,
                  gap: `${gap}px`,
                  minHeight: '100%',
                }}
              >
                {Array.from({ length: itemCount }).map((_, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-sm shadow-md flex items-center justify-center min-w-[60px] min-h-[60px]"
                  >
                    Box {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Generated Code Output */}
          <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl space-y-3 font-mono text-xs shadow-md relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-blue-400 flex items-center gap-1.5 text-[11px]">
                <Code size={14} /> Generated CSS & Tailwind
              </span>
              <button
                onClick={() => copyToClipboard(cssCode + '\n\n/* Tailwind Utility */\n' + tailwindCode)}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer text-[10px]"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied Code!' : 'Copy Code'}
              </button>
            </div>
            <pre className="text-slate-300 overflow-x-auto p-1 leading-relaxed">{cssCode}</pre>
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[10px] text-slate-400 block font-sans font-semibold mb-1">Tailwind Class Equivalents:</span>
              <code className="bg-slate-950 p-2 rounded-lg text-emerald-400 block break-all font-mono text-[11px]">
                {tailwindCode}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
