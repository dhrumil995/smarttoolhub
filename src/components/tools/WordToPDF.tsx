import React, { useState, useRef } from 'react';
import { FileDown, FileText, Download, Printer, Settings, Eye, HelpCircle, FileCheck, RefreshCw, Check, Loader2 } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default function WordToPDF() {
  const [content, setContent] = useState(`MEETING NOTES & TECHNICAL SPECIFICATIONS

PROJECT: High-CTR SEO Tool Suite
DATE: 2026-07-12
LEAD: Enterprise SEO Specialist

=========================================
1. OPERATIONAL SCOPE
=========================================
Our suite aims to address fifteen specific SEO and media tools requested by the user base. By deploying these utilities on high-speed static structures coupled with a lazily-initialized Express gateway, we guarantee zero startup cold-runs and optimal loading speed.

=========================================
2. SECURITY PROTOCOLS
=========================================
All user-authored content, image compressors, and background key tools must run 100% in local browser memory. No external servers or telemetry crawlers should inspect pasted user keys or metadata.

=========================================
3. SITEMAP INDEXING
=========================================
All fifteen slugs have been registered inside /sitemap.xml and pointed directly inside Google Bot indexing paths. Daily crawl priorities ensure instant visibility of new additions.`);

  const [fontFamily, setFontFamily] = useState('sans-serif');
  const [accentColor, setAccentColor] = useState('#4f46e5'); // Indigo
  const [pageSize, setPageSize] = useState('A4');
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.txt') && !file.name.endsWith('.doc') && !file.name.endsWith('.docx')) {
        setError('Please upload a plain text (.txt) or Word draft document.');
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setContent(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleGeneratePDF = async () => {
    if (!content.trim()) {
      setError('Please type or paste some document text first.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const pdfDoc = await PDFDocument.create();
      
      const fontName =
        fontFamily === 'serif'
          ? StandardFonts.TimesRoman
          : fontFamily === 'monospace'
          ? StandardFonts.Courier
          : StandardFonts.Helvetica;

      const boldFontName =
        fontFamily === 'serif'
          ? StandardFonts.TimesRomanBold
          : fontFamily === 'monospace'
          ? StandardFonts.CourierBold
          : StandardFonts.HelveticaBold;

      const font = await pdfDoc.embedFont(fontName);
      const boldFont = await pdfDoc.embedFont(boldFontName);

      const pageWidth = pageSize === 'A4' ? 595.28 : 612;
      const pageHeight = pageSize === 'A4' ? 841.89 : 792;
      const margin = 50;
      const contentWidth = pageWidth - margin * 2;

      let page = pdfDoc.addPage([pageWidth, pageHeight]);
      let y = pageHeight - margin;

      // Hex to RGB
      const hexToRgbRatio = (hex: string) => {
        let clean = hex.replace('#', '');
        if (clean.length === 3) clean = clean.split('').map((c) => c + c).join('');
        const num = parseInt(clean, 16);
        return {
          r: ((num >> 16) & 255) / 255,
          g: ((num >> 8) & 255) / 255,
          b: (num & 255) / 255,
        };
      };

      const accentRgb = hexToRgbRatio(accentColor);

      const lines = content.split('\n');
      const fontSize = 11;
      const lineHeight = 16;

      for (const line of lines) {
        if (y < margin + 40) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }

        if (line.startsWith('===') || line.startsWith('---')) {
          page.drawLine({
            start: { x: margin, y: y },
            end: { x: pageWidth - margin, y: y },
            thickness: 1,
            color: rgb(0.8, 0.8, 0.8),
          });
          y -= 15;
          continue;
        }

        const isHeading =
          (line.toUpperCase() === line && line.length > 3 && line.length < 60) ||
          /^\d+\.\s+[A-Z\s]+$/.test(line);

        const currentFont = isHeading ? boldFont : font;
        const currentFontSize = isHeading ? fontSize + 2 : fontSize;
        const textColor = isHeading
          ? rgb(accentRgb.r, accentRgb.g, accentRgb.b)
          : rgb(0.12, 0.16, 0.23);

        const words = line.split(' ');
        let currentLine = '';

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const width = currentFont.widthOfTextAtSize(testLine, currentFontSize);

          if (width > contentWidth && currentLine) {
            page.drawText(currentLine, {
              x: margin,
              y,
              size: currentFontSize,
              font: currentFont,
              color: textColor,
            });
            y -= lineHeight;
            currentLine = word;

            if (y < margin + 40) {
              page = pdfDoc.addPage([pageWidth, pageHeight]);
              y = pageHeight - margin;
            }
          } else {
            currentLine = testLine;
          }
        }

        if (currentLine) {
          page.drawText(currentLine, {
            x: margin,
            y,
            size: currentFontSize,
            font: currentFont,
            color: textColor,
          });
          y -= isHeading ? lineHeight + 4 : lineHeight;
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Document_${pageSize}_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (err: any) {
      console.error('PDF Generation Error:', err);
      setError(err.message || 'Failed to generate PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document_draft.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <FileDown size={12} />
            Document Changers
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Word to PDF Document Builder
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compose rich document outlines, format layouts, and compile clean PDF files directly through your browser.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Composer and File Import */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <FileText size={18} className="text-indigo-500" />
                Document Composer Draft
              </span>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".txt,.doc,.docx"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                >
                  Import TXT/Draft
                </button>
              </div>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start drafting your document copy..."
              rows={14}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-4 text-xs font-mono text-slate-950 dark:text-slate-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-xs cursor-pointer transition-all ${
                  pdfSuccess
                    ? 'bg-emerald-600'
                    : 'bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50'
                }`}
              >
                {isGenerating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : pdfSuccess ? (
                  <Check size={16} />
                ) : (
                  <Download size={16} />
                )}
                <span>
                  {isGenerating
                    ? 'Generating PDF...'
                    : pdfSuccess
                    ? 'PDF Downloaded!'
                    : 'Compile & Download PDF'}
                </span>
              </button>
              <button
                onClick={handleDownloadTxt}
                className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-950 cursor-pointer"
              >
                <FileText size={16} />
                Save Draft TXT
              </button>
            </div>
          </div>
        </div>

        {/* Layout Preferences */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Settings size={18} className="text-slate-400" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                Layout Preferences
              </h3>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/20 p-4 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                <FileCheck size={14} className="shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}

            {/* Typography selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Primary Typography
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'sans-serif', label: 'Clean Sans' },
                  { id: 'serif', label: 'Classic Serif' },
                  { id: 'monospace', label: 'Tech Mono' },
                ].map((font) => (
                  <button
                    key={font.id}
                    onClick={() => setFontFamily(font.id)}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      fontFamily === font.id
                        ? 'border-indigo-500 bg-indigo-500/5 text-indigo-600'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Page Size selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Page Dimensions
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'A4', label: 'A4 Standard (210 x 297mm)' },
                  { id: 'Letter', label: 'US Letter (8.5 x 11in)' },
                ].map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setPageSize(size.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      pageSize === size.id
                        ? 'border-indigo-500 bg-indigo-500/5 text-indigo-600'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs font-bold block">{size.id} Format</span>
                    <span className="text-[10px] opacity-75">{size.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Theme Colors */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Accent Branding Color
              </label>
              <div className="flex items-center gap-3">
                {[
                  { hex: '#4f46e5', label: 'Indigo' },
                  { hex: '#059669', label: 'Emerald' },
                  { hex: '#dc2626', label: 'Rose' },
                  { hex: '#2563eb', label: 'Blue' },
                  { hex: '#d97706', label: 'Amber' },
                ].map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => setAccentColor(color.hex)}
                    style={{ backgroundColor: color.hex }}
                    className={`h-7 w-7 rounded-full border-2 transition-all shrink-0 cursor-pointer ${
                      accentColor === color.hex ? 'border-slate-950 dark:border-white scale-110' : 'border-transparent'
                    }`}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-4 border border-slate-100 dark:border-slate-900 flex items-start gap-2">
              <Eye size={16} className="text-indigo-500 mt-0.5 shrink-0" />
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Clicking <strong>Compile & Download PDF</strong> compiles your text, headers, and paragraph layout into a clean vector PDF file with custom margins and typography.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
