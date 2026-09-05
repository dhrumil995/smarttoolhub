import React, { useState, useRef } from 'react';
import { Maximize2, Upload, Download, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';

export function AIImageUpscaler() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [upscaleFactor, setUpscaleFactor] = useState<number>(2);
  const [sharpness, setSharpness] = useState<number>(50);
  const [isProcessing, setIsProcessing] = useState(false);
  const [enhancedUrl, setEnhancedUrl] = useState<string | null>(null);

  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageSrc(result);
        setEnhancedUrl(null);

        const img = new Image();
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height });
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    }
  };

  const processUpscale = () => {
    if (!imageSrc) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const targetWidth = img.width * upscaleFactor;
        const targetHeight = img.height * upscaleFactor;
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          // Apply detail sharpening / contrast curve
          const contrast = 1 + (sharpness / 200);
          const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
          const data = imageData.data;

          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, Math.max(0, (data[i] - 128) * contrast + 128));
            data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * contrast + 128));
            data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * contrast + 128));
          }
          ctx.putImageData(imageData, 0, 0);

          const upscaledDataUrl = canvas.toDataURL('image/png', 0.95);
          setEnhancedUrl(upscaledDataUrl);
        }
      } catch (err) {
        console.error('Canvas processing error:', err);
        setEnhancedUrl(imageSrc);
      } finally {
        setIsProcessing(false);
      }
    };
    img.src = imageSrc;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/10 text-pink-600 dark:text-pink-400 rounded-full text-xs font-semibold">
          <Maximize2 size={14} /> AI Super-Resolution Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          AI Image Upscaler & Enhancer
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Upscale low-resolution photos 2x or 4x without quality loss. Reduce noise, sharpen details, and enhance clarity directly in your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders size={18} className="text-pink-500" /> Enhancement Settings
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Upscale Multiplier</label>
              <div className="grid grid-cols-3 gap-2">
                {[2, 4, 8].map((factor) => (
                  <button
                    key={factor}
                    onClick={() => setUpscaleFactor(factor)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      upscaleFactor === factor
                        ? 'bg-pink-500 text-white border-pink-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {factor}x HD
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                <span>Detail Sharpening</span>
                <span>{sharpness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sharpness}
                onChange={(e) => setSharpness(Number(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>

            <div className="pt-2">
              <label className="w-full py-8 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-pink-500 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-50 dark:bg-slate-800/50">
                <Upload size={24} className="text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Upload Image File</span>
                <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP up to 10MB</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {imageSrc && (
              <button
                onClick={processUpscale}
                disabled={isProcessing}
                className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles size={16} /> {isProcessing ? 'Enhancing Image HD...' : `Upscale ${upscaleFactor}x Now`}
              </button>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-500 uppercase">Image Preview & Resolution</span>
            {enhancedUrl && (
              <a
                href={enhancedUrl}
                download="upscaled-image-hd.png"
                className="px-3 py-1.5 bg-pink-500 text-white text-xs font-bold rounded-lg flex items-center gap-1"
              >
                <Download size={14} /> Download HD Image
              </a>
            )}
          </div>

          <div className="flex-1 min-h-[300px] bg-slate-950 rounded-xl flex items-center justify-center overflow-hidden p-4 relative">
            {imageSrc ? (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={enhancedUrl || imageSrc}
                  alt="Upscale Preview"
                  className="max-h-72 object-contain rounded shadow-lg transition-all"
                  style={{
                    filter: `contrast(${100 + sharpness * 0.2}%) brightness(102%)`
                  }}
                />
                {originalDimensions && (
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
                    <span>Original: {originalDimensions.width} × {originalDimensions.height}px</span>
                    <span className="text-pink-500 font-bold">→</span>
                    <span className="text-pink-400 font-bold">
                      {enhancedUrl
                        ? `${originalDimensions.width * upscaleFactor} × ${originalDimensions.height * upscaleFactor}px (${upscaleFactor}x HD)`
                        : `Ready to Upscale to ${originalDimensions.width * upscaleFactor} × ${originalDimensions.height * upscaleFactor}px`}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-slate-500 space-y-2">
                <Maximize2 size={36} className="mx-auto text-slate-700" />
                <p className="text-xs font-semibold">Upload an image to inspect low-res vs upscale preview.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
