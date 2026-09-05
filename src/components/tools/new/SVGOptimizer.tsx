import React, { useState } from 'react';
import { Sparkles, Copy, Check, Download, RefreshCw, FileCode, Layers, Zap, Eye, CheckCircle2 } from 'lucide-react';

export function SVGOptimizer() {
  const defaultSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <!-- Generator: Adobe Illustrator 28.0, SVG Export Plug-In -->
  <g id="Layer_1" data-name="Layer 1">
    <circle cx="50" cy="50" r="45" fill="#3b82f6" stroke="#1d4ed8" stroke-width="4"/>
    <path d="M30,50 L45,65 L70,35" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`;

  const [inputSvg, setInputSvg] = useState(defaultSvg);
  const [removeComments, setRemoveComments] = useState(true);
  const [removeMetadata, setRemoveMetadata] = useState(true);
  const [collapseWhitespace, setCollapseWhitespace] = useState(true);
  const [roundDecimals, setRoundDecimals] = useState(true);
  const [exportFormat, setExportFormat] = useState<'svg' | 'jsx' | 'datauri'>('svg');
  const [copied, setCopied] = useState(false);

  // Clean and optimize SVG
  const getOptimizedSvg = () => {
    let result = inputSvg;
    if (removeComments) {
      result = result.replace(/<!--[\s\S]*?-->/g, '');
    }
    if (removeMetadata) {
      result = result.replace(/<metadata[\s\S]*?<\/metadata>/gi, '');
      result = result.replace(/\s*(id|data-name)="[^"]*"/gi, '');
      result = result.replace(/xmlns:xlink="[^"]*"/gi, '');
    }
    if (roundDecimals) {
      result = result.replace(/(\d+\.\d{3,})/g, (match) => parseFloat(match).toFixed(2));
    }
    if (collapseWhitespace) {
      result = result.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
    }
    return result;
  };

  const optimizedSvg = getOptimizedSvg();
  const rawBytes = new Blob([inputSvg]).size;
  const optBytes = new Blob([optimizedSvg]).size;
  const savingsPct = rawBytes > 0 ? Math.max(0, Math.round(((rawBytes - optBytes) / rawBytes) * 100)) : 0;

  const getExportOutput = () => {
    if (exportFormat === 'svg') return optimizedSvg;
    if (exportFormat === 'datauri') {
      const encoded = encodeURIComponent(optimizedSvg).replace(/'/g, '%27').replace(/"/g, '%22');
      return `data:image/svg+xml;utf8,${encoded}`;
    }
    // React JSX Output
    let jsx = optimizedSvg
      .replace(/class=/g, 'className=')
      .replace(/stroke-width=/g, 'strokeWidth=')
      .replace(/stroke-linecap=/g, 'strokeLinecap=')
      .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
      .replace(/fill-rule=/g, 'fillRule=')
      .replace(/clip-rule=/g, 'clipRule=')
      .replace(/clip-path=/g, 'clipPath=');
    return `export default function CustomIcon(props: React.SVGProps<SVGSVGElement>) {\n  return (\n    ${jsx.replace('<svg', '<svg {...props}')}\n  );\n}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getExportOutput());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([optimizedSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized-vector.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full text-xs font-semibold">
          <Zap size={14} /> Ultra Pro Max Vector Minifier
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          SVG Optimizer & React JSX Vector Studio
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Compress SVG icons, strip redundant XML metadata & comments, preview live vector graphics, and export cleanly into React JSX or CSS Data-URIs.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center">
          <span className="text-xs text-slate-500 font-medium">Original Size</span>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">{rawBytes} B</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center">
          <span className="text-xs text-slate-500 font-medium">Optimized Size</span>
          <p className="text-xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono mt-1">{optBytes} B</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center">
          <span className="text-xs text-slate-500 font-medium">Size Reduction</span>
          <p className="text-xl font-extrabold text-emerald-500 font-mono mt-1">-{savingsPct}%</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center">
          <span className="text-xs text-slate-500 font-medium">Format Output</span>
          <p className="text-xl font-extrabold text-purple-500 font-mono mt-1 uppercase">{exportFormat}</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Column */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCode size={18} className="text-blue-500" /> Input SVG Code
            </h2>
            <button
              onClick={() => setInputSvg(defaultSvg)}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Reset Sample
            </button>
          </div>

          <textarea
            rows={10}
            value={inputSvg}
            onChange={(e) => setInputSvg(e.target.value)}
            className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed resize-none"
            placeholder="Paste your raw <svg> code here..."
          />

          {/* Optimization Flags */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Optimization Passes</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={removeComments}
                  onChange={(e) => setRemoveComments(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Strip Comments</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={removeMetadata}
                  onChange={(e) => setRemoveMetadata(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Clean Metadata/IDs</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={collapseWhitespace}
                  onChange={(e) => setCollapseWhitespace(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Minify Whitespace</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={roundDecimals}
                  onChange={(e) => setRoundDecimals(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Round Precision (2-dec)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Output & Preview Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Live Preview Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Eye size={18} className="text-emerald-500" /> Live Vector Preview
              </h3>
              <span className="text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                Active Render
              </span>
            </div>

            <div className="h-44 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 overflow-hidden">
              <div
                className="max-h-full max-w-full flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: optimizedSvg }}
              />
            </div>
          </div>

          {/* Export Code Box */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Output format switcher */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
                <button
                  onClick={() => setExportFormat('svg')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    exportFormat === 'svg' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Clean SVG
                </button>
                <button
                  onClick={() => setExportFormat('jsx')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    exportFormat === 'jsx' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  React TSX/JSX
                </button>
                <button
                  onClick={() => setExportFormat('datauri')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    exportFormat === 'datauri' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  CSS Data-URI
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95 border border-slate-700"
                >
                  <Download size={14} /> Download
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95 shadow-xs"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy Output</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <pre className="p-3 bg-slate-900/90 rounded-xl text-xs text-cyan-300 font-mono overflow-x-auto max-h-48 scrollbar-thin">
              {getExportOutput()}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SVGOptimizer;
