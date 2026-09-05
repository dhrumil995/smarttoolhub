import React, { useState, useRef } from 'react';
import { 
  Image as ImageIcon, Download, Upload, RefreshCw, Sliders, Check, Maximize2, FileImage
} from 'lucide-react';

export function ImageResizer() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);

  const [targetWidth, setTargetWidth] = useState(800);
  const [targetHeight, setTargetHeight] = useState(600);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [quality, setQuality] = useState(90);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setTargetWidth(img.width);
        setTargetHeight(img.height);
        setImageSrc(event.target?.result as string);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (w: number) => {
    setTargetWidth(w);
    if (keepAspectRatio && originalWidth > 0) {
      const ratio = originalHeight / originalWidth;
      setTargetHeight(Math.round(w * ratio));
    }
  };

  const handleHeightChange = (h: number) => {
    setTargetHeight(h);
    if (keepAspectRatio && originalHeight > 0) {
      const ratio = originalWidth / originalHeight;
      setTargetWidth(Math.round(h * ratio));
    }
  };

  const handlePresetRatio = (ratioW: number, ratioH: number) => {
    if (originalWidth === 0) return;
    const newH = Math.round((targetWidth * ratioH) / ratioW);
    setTargetHeight(newH);
  };

  const handleDownloadResized = () => {
    if (!imageSrc) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const mimeType = `image/${format}`;
      const dataUrl = canvas.toDataURL(mimeType, quality / 100);

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `resized_image_${targetWidth}x${targetHeight}.${format}`;
      link.click();
    };
    img.src = imageSrc;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-rose-500/20">
            <ImageIcon size={12} className="text-rose-500" />
            Client-Side Media Utilities
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Image Resizer & Aspect Ratio Crop
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Resize images to custom dimensions or standard aspect ratios (16:9, 4:3, 1:1) entirely client-side without server uploads.
          </p>
        </div>

        {imageSrc && (
          <button
            onClick={handleDownloadResized}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} />
            <span>Download Resized Image</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Canvas Upload Area */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            {!imageSrc ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-rose-500 dark:hover:border-rose-500 rounded-2xl p-12 text-center space-y-3 cursor-pointer transition-all bg-slate-50 dark:bg-slate-950"
              >
                <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center">
                  <Upload size={24} />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    Click or drag image to upload
                  </p>
                  <p className="text-xs text-slate-400">Supports PNG, JPG, WEBP, GIF</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="text-xs font-mono font-bold text-slate-500">
                    Original: {originalWidth}px × {originalHeight}px
                  </span>
                  <button
                    onClick={() => setImageSrc(null)}
                    className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Change Image
                  </button>
                </div>

                <div className="flex justify-center bg-slate-950/80 p-4 rounded-xl border border-slate-800 max-h-96 overflow-hidden">
                  <img
                    src={imageSrc}
                    alt="Preview"
                    className="max-h-80 object-contain rounded-lg"
                  />
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-xs">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Sliders size={14} className="text-rose-500" /> Dimension Controls
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Width (px)</label>
                <input
                  type="number"
                  value={targetWidth}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Height (px)</label>
                <input
                  type="number"
                  value={targetHeight}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={keepAspectRatio}
                onChange={(e) => setKeepAspectRatio(e.target.checked)}
                className="rounded text-rose-600"
              />
              <span>Maintain Aspect Ratio</span>
            </label>

            {/* Presets */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Standard Aspect Ratios</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: '16:9', w: 16, h: 9 },
                  { label: '4:3', w: 4, h: 3 },
                  { label: '1:1', w: 1, h: 1 },
                  { label: '9:16', w: 9, h: 16 },
                ].map((r) => (
                  <button
                    key={r.label}
                    type="button"
                    onClick={() => handlePresetRatio(r.w, r.h)}
                    className="py-1.5 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-rose-500 cursor-pointer"
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Format selector */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Output Format</label>
              <div className="grid grid-cols-3 gap-2">
                {(['png', 'jpeg', 'webp'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFormat(f)}
                    className={`py-1.5 text-xs font-mono font-bold uppercase rounded-xl border transition-all cursor-pointer ${
                      format === f ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageResizer;
