import React, { useState, useRef, useEffect } from 'react';
import { Shrink, Upload, Download, RefreshCw, Layout, Paintbrush, Info } from 'lucide-react';

const ASPECT_RATIOS = [
  { id: '1:1', name: '1:1 Square Feed', desc: '1080 x 1080 px (Standard post)', width: 1080, height: 1080, ratio: 1 },
  { id: '4:5', name: '4:5 Portrait Feed', desc: '1080 x 1350 px (Max vertical reach)', width: 1080, height: 1350, ratio: 0.8 },
  { id: '16:9', name: '16:9 Story / Reel', desc: '1080 x 1920 px (Full screen format)', width: 1080, height: 1920, ratio: 0.5625 }
];

const BACKGROUNDS = [
  { id: 'white', name: 'White Fill', value: '#ffffff' },
  { id: 'black', name: 'Black Fill', value: '#000000' },
  { id: 'slate', name: 'Slate Gray', value: '#1e293b' },
  { id: 'pink', name: 'Rose Soft', value: '#fdf2f8' }
];

export default function IGPhotoResizer() {
  const [selectedRatio, setSelectedRatio] = useState('1:1');
  const [selectedBg, setSelectedBg] = useState('white');
  const [paddingSize, setPaddingSize] = useState(10); // percentage padding
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle file import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag-and-drop triggers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Redraw canvas with high-fidelity output
  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const activeRatio = ASPECT_RATIOS.find(r => r.id === selectedRatio) || ASPECT_RATIOS[0];
      
      // Set high-res canvas coordinates
      canvas.width = activeRatio.width;
      canvas.height = activeRatio.height;

      // 1. Draw solid background
      const bgColorObj = BACKGROUNDS.find(bg => bg.id === selectedBg) || BACKGROUNDS[0];
      ctx.fillStyle = bgColorObj.value;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Compute fitting bounds
      const padFactor = 1 - (paddingSize / 100);
      const targetMaxWidth = canvas.width * padFactor;
      const targetMaxHeight = canvas.height * padFactor;

      const imgWidth = img.naturalWidth || img.width;
      const imgHeight = img.naturalHeight || img.height;

      // Find best fitting scale
      const scale = Math.min(targetMaxWidth / imgWidth, targetMaxHeight / imgHeight);
      const drawWidth = imgWidth * scale;
      const drawHeight = imgHeight * scale;

      // Center the drawn image
      const drawX = (canvas.width - drawWidth) / 2;
      const drawY = (canvas.height - drawHeight) / 2;

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    };
  }, [imageSrc, selectedRatio, selectedBg, paddingSize]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setDownloading(true);
    setTimeout(() => {
      try {
        const link = document.createElement('a');
        link.download = `smarttoolhub_ig_${selectedRatio.replace(':', '_')}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.95);
        link.click();
      } catch (err) {
        console.error('Failed to export high-res canvas', err);
      } finally {
        setDownloading(false);
      }
    }, 500);
  };

  const handleReset = () => {
    setImageSrc(null);
    setSelectedRatio('1:1');
    setSelectedBg('white');
    setPaddingSize(10);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <Shrink size={12} />
            Instagram Growth Tools
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Instagram Photo Resizer & Square Cropper
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Fit any landscape or portrait photo perfectly into Instagram without cropping out critical content details.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings panels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
              <div className="flex items-center gap-2">
                <Layout size={18} className="text-fuchsia-500" />
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  Layout Controls
                </h3>
              </div>
              {imageSrc && (
                <button
                  onClick={handleReset}
                  className="text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Reset Tool
                </button>
              )}
            </div>

            {/* Upload form / drag & drop box */}
            {!imageSrc ? (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200/80 dark:border-slate-800 hover:border-fuchsia-500/60 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-950/40 group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                  <Upload size={20} />
                </div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                  Drag & Drop Local Photo
                </h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                  Supports JPG, PNG, or WebP. Processed entirely in client memory.
                </p>
                <button className="mt-4 px-4 py-2 bg-slate-850 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-[10px] uppercase rounded-lg transition-all shadow-xs">
                  Browse Files
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Ratio parameters */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Instagram Aspect Ratio
                  </label>
                  <div className="space-y-1.5">
                    {ASPECT_RATIOS.map((ratio) => (
                      <button
                        key={ratio.id}
                        onClick={() => setSelectedRatio(ratio.id)}
                        className={`w-full p-2.5 text-left rounded-xl border flex flex-col transition-all ${
                          selectedRatio === ratio.id
                            ? 'bg-fuchsia-500/10 border-fuchsia-500 text-fuchsia-700 dark:text-fuchsia-400'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                        }`}
                      >
                        <span className="text-[11px] font-bold uppercase">{ratio.name}</span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500">{ratio.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background color selection */}
                <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-850 pt-3">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                    <Paintbrush size={12} />
                    Outer Background Padding Color
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {BACKGROUNDS.map((bg) => (
                      <button
                        key={bg.id}
                        onClick={() => setSelectedBg(bg.id)}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                          selectedBg === bg.id
                            ? 'border-fuchsia-500 bg-fuchsia-500/5 text-fuchsia-600 dark:text-fuchsia-400'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-slate-350 dark:border-slate-700"
                          style={{ backgroundColor: bg.value }}
                        />
                        <span className="text-[9px] font-bold">{bg.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Padding slider */}
                <div className="space-y-2 border-t border-slate-100 dark:border-slate-850 pt-3">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <span>Background Padding Factor</span>
                    <span className="font-mono text-fuchsia-600 dark:text-fuchsia-400">{paddingSize}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={paddingSize}
                    onChange={(e) => setPaddingSize(Number(e.target.value))}
                    className="w-full accent-fuchsia-500"
                  />
                </div>

                {/* Quick actions */}
                <div className="flex gap-2 border-t border-slate-100 dark:border-slate-850 pt-3">
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="w-full py-3 bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all"
                  >
                    {downloading ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <Download size={14} />
                    )}
                    <span>{downloading ? 'Processing Export...' : 'Download Finished Image'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic canvas preview */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-center">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xs">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm border-b border-slate-100 dark:border-slate-850 pb-3">
              Fidelity Output Preview
            </h3>

            {imageSrc ? (
              <div className="flex justify-center items-center bg-slate-100/50 dark:bg-slate-950/60 p-4 rounded-xl min-h-[350px]">
                {/* Styled container mimicking the output aspect ratio bounds */}
                <div className="max-w-full max-h-[420px] shadow-lg border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden flex">
                  <canvas
                    ref={canvasRef}
                    className="max-w-full max-h-[400px] object-contain mx-auto"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-950/20 p-8 rounded-xl border border-dashed border-slate-200/40 dark:border-slate-800/40 text-center min-h-[350px]">
                <Shrink size={36} className="text-slate-300 dark:text-slate-700 mb-2" />
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  No Image Loaded Yet
                </h4>
                <p className="text-[10px] text-slate-400 max-w-xs mt-1">
                  Upload an image on the left to unlock instant aspect ratio alignment controls.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Educational Block */}
      <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <h4 className="font-display font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
          <Info size={16} className="text-fuchsia-500" />
          Pro-Design Advice: Aspect Ratio Sizing Guidelines
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
          <p>
            When publishing to Instagram feeds, **vertical portraits (4:5 ratio)** occupy up to 30% more screen space compared to standard **1:1 square photos**. This significantly increases the time users spend scrolling over your post, translating directly to higher organic engagement and algorithm push.
          </p>
          <p>
            However, landscapes often get cropped automatically. Using a padding cushion allows you to preserve the full width of your horizontal photography inside a 1:1 square frame. Our resizer converts photos client-side, keeping your private assets secure and off external servers.
          </p>
        </div>
      </div>
    </div>
  );
}
