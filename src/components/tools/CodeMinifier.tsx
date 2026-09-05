import React, { useState } from 'react';
import { 
  Zap, Copy, Download, RefreshCw, Check, Code2, Sliders, ArrowLeftRight, BarChart2
} from 'lucide-react';

export function CodeMinifier() {
  const [lang, setLang] = useState<'js' | 'css' | 'html'>('js');

  const SAMPLE_JS = `// Calculate total user revenue and return summary
function calculateUserRevenue(transactions, taxRate) {
  let subtotal = 0;
  for (let i = 0; i < transactions.length; i++) {
    subtotal += transactions[i].amount;
  }
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return {
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    total: total.toFixed(2)
  };
}`;

  const SAMPLE_CSS = `/* Primary Navigation Styling */
.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}

.main-header .logo {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
}`;

  const SAMPLE_HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>SmartToolHub App</title>
  </head>
  <body>
    <!-- Main Application Canvas -->
    <div id="root">
      <h1>Welcome to SmartToolHub</h1>
    </div>
  </body>
</html>`;

  const [inputCode, setInputCode] = useState(SAMPLE_JS);
  const [copied, setCopied] = useState(false);

  const handleLanguageChange = (l: 'js' | 'css' | 'html') => {
    setLang(l);
    if (l === 'js') setInputCode(SAMPLE_JS);
    else if (l === 'css') setInputCode(SAMPLE_CSS);
    else setInputCode(SAMPLE_HTML);
  };

  const minifyCode = (code: string, mode: 'js' | 'css' | 'html') => {
    if (!code) return '';
    let result = code;

    if (mode === 'js') {
      // Remove single line comments
      result = result.replace(/\/\/.*/g, '');
      // Remove multi line comments
      result = result.replace(/\/\*[\s\S]*?\*\//g, '');
      // Remove extra whitespace & newlines
      result = result.replace(/\s+/g, ' ');
      result = result.replace(/\s*([{}();,=+-])\s*/g, '$1');
    } else if (mode === 'css') {
      // Remove CSS comments
      result = result.replace(/\/\*[\s\S]*?\*\//g, '');
      // Remove extra whitespace & newlines
      result = result.replace(/\s+/g, ' ');
      result = result.replace(/\s*([{}::;,])\s*/g, '$1');
    } else {
      // HTML
      // Remove HTML comments
      result = result.replace(/<!--[\s\S]*?-->/g, '');
      // Remove whitespace between tags
      result = result.replace(/>\s+</g, '><');
      result = result.replace(/\s+/g, ' ');
    }

    return result.trim();
  };

  const minifiedOutput = minifyCode(inputCode, lang);

  const originalBytes = new Blob([inputCode]).size;
  const minifiedBytes = new Blob([minifiedOutput]).size;
  const savingsBytes = Math.max(0, originalBytes - minifiedBytes);
  const savingsPercent = originalBytes > 0 ? ((savingsBytes / originalBytes) * 100).toFixed(1) : '0.0';

  const handleCopy = () => {
    navigator.clipboard.writeText(minifiedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = lang;
    const blob = new Blob([minifiedOutput], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `minified_code.${ext}`;
    link.click();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20">
            <Zap size={12} className="text-indigo-500" />
            Performance & Compression Engine
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            HTML, CSS & JavaScript Minifier
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Minify client-side code by stripping comments, redundant spaces, and newlines to accelerate web page loading speed.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            <span>{copied ? 'Copied Minified Code' : 'Copy Code'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} />
            <span>Download .{lang}</span>
          </button>
        </div>
      </div>

      {/* Language Tabs */}
      <div className="flex gap-2">
        {(['js', 'css', 'html'] as const).map((l) => (
          <button
            key={l}
            onClick={() => handleLanguageChange(l)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
              lang === l
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Original Size</span>
          <div className="font-mono text-2xl font-extrabold text-slate-900 dark:text-white">{originalBytes} B</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Minified Size</span>
          <div className="font-mono text-2xl font-extrabold text-emerald-500">{minifiedBytes} B</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Savings</span>
          <div className="font-mono text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">-{savingsPercent}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Unminified Input */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 block border-b border-slate-100 dark:border-slate-800 pb-3">
              Uncompressed Source Code
            </span>
            <textarea
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              rows={14}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 font-mono text-xs leading-relaxed text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
        </div>

        {/* Minified Output */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-500 block border-b border-slate-100 dark:border-slate-800 pb-3">
              Minified Production Code
            </span>
            <textarea
              readOnly
              value={minifiedOutput}
              rows={14}
              className="w-full bg-slate-900 text-emerald-400 border border-slate-800 rounded-xl p-4 font-mono text-xs leading-relaxed focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeMinifier;
