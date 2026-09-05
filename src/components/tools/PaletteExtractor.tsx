import React, { useState, useRef } from 'react';
import { Upload, Copy, Check, Pipette, Sparkles, Image as ImageIcon } from 'lucide-react';

export const PaletteExtractor: React.FC = () => {
  const [colors, setColors] = useState<string[]>([
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'
  ]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        setSelectedImage(src);
        extractColorsFromImage(src);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractColorsFromImage = (imageSrc: string) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageSrc;
    img.onload = () => {
      const canvas = canvasRef.current || document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 100;
      canvas.height = 100;
      ctx.drawImage(img, 0, 0, 100, 100);

      const imageData = ctx.getImageData(0, 0, 100, 100).data;
      const colorCounts: { [key: string]: number } = {};

      for (let i = 0; i < imageData.length; i += 16) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
        colorCounts[hex] = (colorCounts[hex] || 0) + 1;
      }

      const sorted = Object.keys(colorCounts).sort((a, b) => colorCounts[b] - colorCounts[a]);
      const dominant = sorted.slice(0, 6);
      if (dominant.length > 0) {
        setColors(dominant);
      }
    };
  };

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} className="hidden" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Box */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ImageIcon size={18} className="text-blue-500" />
            Upload Image to Extract Colors
          </h2>

          <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 transition-colors rounded-2xl p-8 text-center space-y-3 cursor-pointer relative bg-slate-50/50 dark:bg-slate-950/50">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <Upload size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Click or drag an image here
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Supports PNG, JPG, WebP, SVG (100% Client-Side Safe)
              </p>
            </div>
          </div>

          {selectedImage && (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-48 flex items-center justify-center bg-slate-950">
              <img src={selectedImage} alt="Uploaded preview" className="object-contain max-h-48" />
            </div>
          )}
        </div>

        {/* Extracted Swatches */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Pipette size={18} className="text-emerald-500" />
                Dominant Color Swatches
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Click hex to copy</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {colors.map((hex, index) => (
                <div
                  key={index}
                  onClick={() => copyColor(hex)}
                  className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 cursor-pointer group hover:scale-[1.02] transition-all"
                >
                  <div
                    style={{ backgroundColor: hex }}
                    className="h-16 rounded-lg shadow-inner border border-black/10 flex items-end justify-end p-1.5"
                  >
                    {copiedColor === hex && (
                      <span className="p-1 bg-black/70 text-emerald-400 rounded-md">
                        <Check size={12} />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span>{hex}</span>
                    <Copy size={12} className="text-slate-400 group-hover:text-blue-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-700 dark:text-blue-300 text-xs flex items-center gap-2 font-medium">
            <Sparkles size={16} className="shrink-0" />
            <span>Extracted colors are completely generated inside your local browser memory.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
