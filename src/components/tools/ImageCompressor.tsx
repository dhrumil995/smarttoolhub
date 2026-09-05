import React, { useState, useRef } from 'react';
import { Shrink, Image, Upload, Download, Sliders, RefreshCw, AlertCircle, Sparkles, Check } from 'lucide-react';

interface ImageDetails {
  name: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  file: File;
  previewUrl: string;
}

export default function ImageCompressor() {
  const [image, setImage] = useState<ImageDetails | null>(null);
  const [quality, setQuality] = useState<number>(0.75);
  const [maxWidth, setMaxWidth] = useState<number>(1920);
  const [compressing, setCompressing] = useState<boolean>(false);
  const [compressedDetails, setCompressedDetails] = useState<{
    size: number;
    width: number;
    height: number;
    url: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadImage(file);
    }
  };

  const loadImage = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    setError(null);
    setCompressedDetails(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        setImage({
          name: file.name,
          originalSize: file.size,
          originalWidth: img.width,
          originalHeight: img.height,
          file,
          previewUrl: event.target?.result as string,
        });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleCompress = () => {
    if (!image) return;

    setCompressing(true);
    setError(null);

    const img = new window.Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        // Calculate dynamic dimensions inside boundary
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to data URL with requested quality
        const mimeType = image.file.type === 'image/png' ? 'image/jpeg' : image.file.type; // Force compress PNGs to JPEGs for massive savings
        const compressedDataUrl = canvas.toDataURL(mimeType, quality);

        // Calculate size from base64
        const stringLength = compressedDataUrl.length - 'data:image/jpeg;base64,'.length;
        const sizeInBytes = Math.round(stringLength * (3 / 4));

        setCompressedDetails({
          size: sizeInBytes,
          width,
          height,
          url: compressedDataUrl,
        });
      } catch (err: any) {
        console.error(err);
        setError('An error occurred while compressing the image.');
      } finally {
        setCompressing(false);
      }
    };
    img.src = image.previewUrl;
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(2)} MB`;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      loadImage(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <Shrink size={12} />
            Optimization & Media
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Smart Image Compressor
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compress and resize PNG, JPG, and WebP files entirely inside your browser for rapid page speeds and SEO performance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings and Drop Area */}
        <div className="lg:col-span-6 space-y-6">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={triggerSelect}
            className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center bg-slate-50/50 dark:bg-slate-950/20 hover:border-indigo-500 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[220px]"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className="h-12 w-12 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-3">
              <Upload size={24} />
            </div>
            {image ? (
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white max-w-xs truncate">
                  {image.name}
                </p>
                <p className="text-xs text-slate-500">
                  {image.originalWidth}x{image.originalHeight}px • {formatSize(image.originalSize)}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Drag & Drop Image or Click to Browse
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
                  Supports JPEG, PNG, and WebP. 100% private client-side processing.
                </p>
              </div>
            )}
          </div>

          {image && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <Sliders size={18} className="text-slate-400" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                  Compression Settings
                </h3>
              </div>

              {/* Quality slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Image Quality
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {Math.round(quality * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={quality}
                  onChange={(e) => {
                    setQuality(parseFloat(e.target.value));
                    setCompressedDetails(null);
                  }}
                  className="w-full accent-indigo-600"
                />
              </div>

              {/* Max width slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Max Boundary Width
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {maxWidth}px
                  </span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="3840"
                  step="80"
                  value={maxWidth}
                  onChange={(e) => {
                    setMaxWidth(parseInt(e.target.value));
                    setCompressedDetails(null);
                  }}
                  className="w-full accent-indigo-600"
                />
              </div>

              <button
                onClick={handleCompress}
                disabled={compressing}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 disabled:opacity-50"
              >
                {compressing ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Optimizing file...
                  </>
                ) : (
                  <>
                    <Shrink size={16} />
                    Compress Image Now
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Output Compare Column */}
        <div className="lg:col-span-6 space-y-6">
          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 dark:bg-rose-950/20 p-4 text-sm text-rose-800 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {compressedDetails ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
              <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 px-6 py-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Compressed Comparison
                </span>
                <a
                  href={compressedDetails.url}
                  download={`compressed_${quality}_${image?.name || 'image.jpg'}`}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500"
                >
                  <Download size={14} />
                  Download File
                </a>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-950/40 rounded-xl p-4 border border-slate-100 dark:border-slate-850">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Original</span>
                    <span className="text-base font-bold text-slate-800 dark:text-slate-200">
                      {image && formatSize(image.originalSize)}
                    </span>
                  </div>
                  <div className="bg-indigo-500/5 dark:bg-indigo-500/10 rounded-xl p-4 border border-indigo-100 dark:border-indigo-950">
                    <span className="block text-[10px] uppercase font-bold text-indigo-400">Optimized</span>
                    <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                      {formatSize(compressedDetails.size)}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-emerald-500/5 border border-emerald-100 dark:border-emerald-950/40 p-4 flex items-center justify-between text-sm">
                  <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                    File Size Reduced By:
                  </span>
                  <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                    {image ? (100 - (compressedDetails.size / image.originalSize) * 100).toFixed(1) : 0}%
                  </span>
                </div>

                {/* Live Preview Comparison */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500">Optimized Image Preview:</span>
                  <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-100/50 dark:bg-slate-950 max-h-[300px] flex items-center justify-center">
                    <img
                      src={compressedDetails.url}
                      alt="Compressed Preview"
                      className="max-h-[290px] object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-slate-50/30 dark:bg-slate-950/10">
              <Image size={36} className="text-slate-300 dark:text-slate-700 animate-pulse mb-3" />
              <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                Awaiting Compression Trigger
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mt-1">
                Your compressed comparison details, savings metrics, and secure download path will appear right here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
