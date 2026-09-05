import React, { useState, useRef, useEffect } from 'react';
import { Eraser, Upload, Download, Sliders, RefreshCw, AlertCircle, Eye, Sparkles, Check } from 'lucide-react';

interface SelectedColor {
  r: number;
  g: number;
  b: number;
}

export default function BackgroundRemover() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalName, setOriginalName] = useState<string>('image.png');
  const [targetColor, setTargetColor] = useState<SelectedColor | null>({ r: 255, g: 255, b: 255 }); // Default white
  const [tolerance, setTolerance] = useState<number>(30);
  const [feather, setFeather] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const originalImgRef = useRef<HTMLImageElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadImage(file);
    }
  };

  const loadImage = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please choose a valid image file.');
      return;
    }

    setError(null);
    setLoading(true);
    setOriginalName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageSrc(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      originalImgRef.current = img;
      setLoading(false);
      applyChromaKey();
    };
    img.onerror = () => {
      setError('Failed to load image into canvas.');
      setLoading(false);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Run chroma key transparency algorithm in canvas
  const applyChromaKey = () => {
    const img = originalImgRef.current;
    if (!img) return;

    setProcessing(true);

    const canvasOrig = originalCanvasRef.current;
    const canvasOut = outputCanvasRef.current;
    if (!canvasOrig || !canvasOut) return;

    const ctxOrig = canvasOrig.getContext('2d');
    const ctxOut = canvasOut.getContext('2d');
    if (!ctxOrig || !ctxOut) return;

    // Maintain manageable preview boundaries
    const maxDimension = 800;
    let width = img.width;
    let height = img.height;

    if (width > maxDimension || height > maxDimension) {
      if (width > height) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }
    }

    canvasOrig.width = width;
    canvasOrig.height = height;
    canvasOut.width = width;
    canvasOut.height = height;

    ctxOrig.drawImage(img, 0, 0, width, height);

    const imgData = ctxOrig.getImageData(0, 0, width, height);
    const data = imgData.data;

    if (targetColor) {
      const tR = targetColor.r;
      const tG = targetColor.g;
      const tB = targetColor.b;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Euclidean distance metric in RGB space
        const distance = Math.sqrt(
          Math.pow(r - tR, 2) + Math.pow(g - tG, 2) + Math.pow(b - tB, 2)
        );

        if (distance < tolerance) {
          data[i + 3] = 0; // Transparent
        } else if (distance < tolerance + feather) {
          // Linear edge alpha blending
          const factor = (distance - tolerance) / feather;
          data[i + 3] = Math.round(data[i + 3] * factor);
        }
      }
    }

    ctxOut.putImageData(imgData, 0, 0);
    setProcessing(false);
  };

  // Run applyChromaKey when tolerance or feather change
  useEffect(() => {
    if (imageSrc) {
      applyChromaKey();
    }
  }, [tolerance, feather, targetColor]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = originalCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * canvas.height);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      setTargetColor({
        r: pixel[0],
        g: pixel[1],
        b: pixel[2],
      });
    } catch (err) {
      setError('Unable to pick color from canvas. Make sure image complies with canvas security bounds.');
    }
  };

  const handleDownload = () => {
    const canvas = outputCanvasRef.current;
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `transparent_${originalName.replace(/\.[^/.]+$/, "")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <Eraser size={12} />
            Optimization & Media
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Chroma Key Background Remover
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pick any solid backdrop color (White, Black, Green) directly from your canvas to make it beautifully transparent.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Workspace controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xs">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center hover:border-indigo-500 transition-all cursor-pointer flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-950/20"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <Upload size={20} className="text-slate-400 mb-2" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {imageSrc ? 'Replace Image' : 'Select Source Image'}
              </span>
            </div>

            {imageSrc && (
              <>
                {/* Color Display */}
                <div className="space-y-2 border-t border-slate-100 dark:border-slate-850 pt-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Target Background Color
                  </span>
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        backgroundColor: targetColor
                          ? `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})`
                          : 'transparent',
                      }}
                      className="h-10 w-10 rounded-lg border border-slate-200 shadow-xs shrink-0"
                    />
                    <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
                      {targetColor
                        ? `RGB(${targetColor.r}, ${targetColor.g}, ${targetColor.b})`
                        : 'No Target Selected'}
                      <span className="block text-[10px] text-slate-400 mt-0.5">
                        Click on the original preview to pick a different pixel color.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Preset Fast Selectors */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Preset Backdrops</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { r: 255, g: 255, b: 255, label: 'White' },
                      { r: 0, g: 0, b: 0, label: 'Black' },
                      { r: 0, g: 255, b: 0, label: 'Green Screen' },
                      { r: 0, g: 0, b: 255, label: 'Chroma Blue' },
                    ].map((p) => (
                      <button
                        key={p.label}
                        onClick={() => setTargetColor({ r: p.r, g: p.g, b: p.b })}
                        className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tolerance slider */}
                <div className="space-y-2 border-t border-slate-100 dark:border-slate-850 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Eraser Tolerance
                    </span>
                    <span className="text-xs font-mono font-bold text-indigo-600">{tolerance}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="150"
                    step="5"
                    value={tolerance}
                    onChange={(e) => setTolerance(parseInt(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                {/* Feather slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Edge Feather / Blur
                    </span>
                    <span className="text-xs font-mono font-bold text-indigo-600">{feather}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="2"
                    value={feather}
                    onChange={(e) => setFeather(parseInt(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <button
                  onClick={handleDownload}
                  disabled={processing}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-xs hover:bg-emerald-500"
                >
                  <Download size={16} />
                  Download Transparent PNG
                </button>
              </>
            )}
          </div>
        </div>

        {/* Live Canvas Workspace */}
        <div className="lg:col-span-8 space-y-6">
          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 dark:bg-rose-950/20 p-4 text-sm text-rose-800 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {imageSrc ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original pick canvas */}
              <div className="bg-slate-50 dark:bg-slate-950/40 rounded-2xl p-4 border border-slate-100 dark:border-slate-850 flex flex-col space-y-2">
                <span className="text-xs font-bold text-slate-500">Original (Click to Pick Color):</span>
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-200 flex items-center justify-center max-h-[400px]">
                  <canvas
                    ref={originalCanvasRef}
                    onClick={handleCanvasClick}
                    className="cursor-crosshair max-w-full max-h-[380px] object-contain"
                  />
                </div>
              </div>

              {/* Output Canvas */}
              <div className="bg-slate-50 dark:bg-slate-950/40 rounded-2xl p-4 border border-slate-100 dark:border-slate-850 flex flex-col space-y-2">
                <span className="text-xs font-bold text-slate-500">Transparent Output Preview:</span>
                {/* Standard checkerboard grid background */}
                <div
                  style={{
                    backgroundImage:
                      'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                  }}
                  className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white flex items-center justify-center max-h-[400px]"
                >
                  <canvas
                    ref={outputCanvasRef}
                    className="max-w-full max-h-[380px] object-contain animate-fade-in"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[350px] border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-slate-50/30 dark:bg-slate-950/10">
              <Eraser size={36} className="text-slate-300 dark:text-slate-700 animate-pulse mb-3" />
              <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                Awaiting Workspace Image
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mt-1">
                Upload your JPG, PNG, or WebP logo or photo to pick and key-out background backdrops instantly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
