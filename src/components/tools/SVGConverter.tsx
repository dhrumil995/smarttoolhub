import React, { useState, useEffect, useRef } from 'react';
import { Image, Copy, Check, Download, AlertCircle, Sparkles, Sliders } from 'lucide-react';
import AdSenseSlot from '../AdSenseSlot';

export default function SVGConverter() {
  const [svgCode, setSvgCode] = useState('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">\n  <circle cx="50" cy="50" r="40" fill="#4f46e5" />\n  <polygon points="50,25 35,65 65,65" fill="#f43f5e" />\n</svg>');
  const [scale, setScale] = useState(2); // 1x, 2x, 4x
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg'>('png');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setErrorMsg(null);
    if (!svgCode.trim()) return;

    if (!svgCode.includes('<svg') || !svgCode.includes('</svg>')) {
      setErrorMsg('Warning: Standard SVG tags <svg>...</svg> are missing or invalid.');
    }
  }, [svgCode]);

  const handleDownload = () => {
    if (!svgCode.trim()) return;

    try {
      // 1. Create native image
      const img = new window.Image();
      const svgBlob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        // 2. Set Canvas sizes based on natural SVG sizes and scale
        let width = img.naturalWidth || 500;
        let height = img.naturalHeight || 500;

        // Fallback for relative viewports
        if (width === 0 || height === 0) {
          width = 500;
          height = 500;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width * scale;
        canvas.height = height * scale;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // If JPEG, draw background color
        if (exportFormat === 'jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 3. Trigger download of data url
        const mime = exportFormat === 'png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mime, 0.95);

        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `smarttoolhub_vector.${exportFormat}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
      };

      img.onerror = () => {
        setErrorMsg('Render Error: Failed to parse SVG XML vector code.');
        URL.revokeObjectURL(url);
      };

      img.src = url;
    } catch (e: any) {
      setErrorMsg(e.message || 'Export error. Verify SVG syntax.');
    }
  };

  const handleCopySVG = () => {
    navigator.clipboard.writeText(svgCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <Image size={12} />
            Design & Style Utilities
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            SVG to Image Exporter
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Render raw SVG XML structures instantly on a canvas, and download them as high-resolution PNG or JPEG formats.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Pane */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                SVG XML Code Source
              </span>
              <button
                onClick={handleCopySVG}
                className="text-[10px] font-bold text-indigo-500 hover:underline"
              >
                {isCopied ? 'Copied' : 'Copy SVG'}
              </button>
            </div>

            <textarea
              value={svgCode}
              onChange={(e) => setSvgCode(e.target.value)}
              placeholder="Paste raw <svg> xml here..."
              rows={12}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-3 text-xs font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
            />

            {errorMsg && (
              <div className="flex items-start gap-2 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-500/5 p-3 rounded-xl border border-amber-500/15">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Configuration & Exporter Preview */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <Sliders size={18} className="text-slate-400" />
              <h3 className="font-semibold text-slate-850 dark:text-slate-220 text-xs uppercase tracking-wider">
                Export Settings
              </h3>
            </div>

            {/* Resolution scale multiplier */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Resolution Scale</span>
              <div className="flex gap-2">
                {([1, 2, 4] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setScale(s)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      scale === s
                        ? 'bg-pink-600 text-white'
                        : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {s}x {s === 1 ? '(Standard)' : s === 2 ? '(HD)' : '(Ultra HD)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Export Format selection */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Export Format</span>
              <div className="flex gap-2">
                {(['png', 'jpeg'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setExportFormat(fmt)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all uppercase ${
                      exportFormat === fmt
                        ? 'bg-pink-600 text-white'
                        : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {fmt} Format
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs transition-colors"
            >
              <Download size={14} />
              Export Vector Asset
            </button>
          </div>

          {/* SVG Vector Render box */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[180px] relative">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-4 block">
              Vector Design Live Render Preview
            </span>
            <div
              ref={previewRef}
              className="max-w-[150px] max-h-[150px] flex items-center justify-center select-none"
              dangerouslySetInnerHTML={{ __html: svgCode }}
            />
          </div>
        </div>
      </div>

      <AdSenseSlot slot="svg-converter-bottom" />
    </div>
  );
}
