import React, { useState, useRef } from 'react';
import { Upload, Download, Copy, Check, Sparkles, Image as ImageIcon, Code } from 'lucide-react';

export const FaviconGenerator: React.FC = () => {
  const [textLogo, setTextLogo] = useState<string>('SH');
  const [bgColor, setBgColor] = useState<string>('#3B82F6');
  const [textColor, setTextColor] = useState<string>('#FFFFFF');
  const [borderRadius, setBorderRadius] = useState<number>(24);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const htmlHeadSnippet = `<!-- Standard Favicons -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadIcon = (size: number, filename: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (uploadedImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, size, size);
        triggerDownload(canvas.toDataURL('image/png'), filename);
      };
      img.src = uploadedImage;
    } else {
      // Draw background
      ctx.fillStyle = bgColor;
      const radius = (size * borderRadius) / 100;
      ctx.beginPath();
      ctx.roundRect(0, 0, size, size, radius);
      ctx.fill();

      // Draw text
      ctx.fillStyle = textColor;
      ctx.font = `bold ${size * 0.45}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(textLogo, size / 2, size / 2);

      triggerDownload(canvas.toDataURL('image/png'), filename);
    }
  };

  const triggerDownload = (dataUrl: string, filename: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.click();
  };

  const copySnippet = () => {
    navigator.clipboard.writeText(htmlHeadSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Box */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Sparkles size={18} className="text-blue-500" />
            Favicon Design Settings
          </h2>

          <div className="space-y-4 text-xs">
            {/* Image upload mode */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-950/50 space-y-2">
              <label className="font-bold text-slate-800 dark:text-slate-200 block">
                Option A: Upload Custom Logo Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-bold cursor-pointer"
              />
              {uploadedImage && (
                <button
                  onClick={() => setUploadedImage(null)}
                  className="text-[10px] text-red-500 hover:underline font-bold block"
                >
                  Clear uploaded image (Use text icon instead)
                </button>
              )}
            </div>

            {/* Text logo mode */}
            {!uploadedImage && (
              <div className="space-y-3">
                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    Icon Text / Monogram (1-3 chars)
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={textLogo}
                    onChange={(e) => setTextLogo(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      Background Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="h-8 w-12 rounded-lg cursor-pointer border-0"
                      />
                      <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">{bgColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      Text Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="h-8 w-12 rounded-lg cursor-pointer border-0"
                      />
                      <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">{textColor}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    Border Radius: {borderRadius}%
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview & Downloads */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Favicon Live Preview
            </h3>

            {/* Preview Box */}
            <div className="flex items-center justify-center p-8 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              {uploadedImage ? (
                <img src={uploadedImage} alt="Favicon preview" className="w-24 h-24 object-contain rounded-2xl shadow-md" />
              ) : (
                <div
                  style={{
                    backgroundColor: bgColor,
                    color: textColor,
                    borderRadius: `${borderRadius}%`,
                  }}
                  className="w-24 h-24 font-black text-3xl flex items-center justify-center shadow-lg"
                >
                  {textLogo}
                </div>
              )}
            </div>

            {/* Download Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => downloadIcon(32, 'favicon-32x32.png')}
                className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download size={14} /> 32x32 PNG
              </button>
              <button
                onClick={() => downloadIcon(180, 'apple-touch-icon.png')}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download size={14} /> 180x180 Apple Icon
              </button>
            </div>
          </div>

          {/* HTML Snippet */}
          <div className="bg-slate-900 p-4 rounded-xl text-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-blue-400 font-bold flex items-center gap-1">
                <Code size={12} /> HTML Head Tags
              </span>
              <button
                onClick={copySnippet}
                className="text-[10px] font-bold text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedSnippet ? <Check size={12} /> : <Copy size={12} />}
                {copiedSnippet ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="text-[10px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
              {htmlHeadSnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
