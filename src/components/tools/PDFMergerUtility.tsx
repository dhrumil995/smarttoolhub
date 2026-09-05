import React, { useState } from 'react';
import { FileText, Upload, Download, Trash2, ArrowUp, ArrowDown, FilePlus, Sparkles, Check, Loader2, AlertCircle } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import AdSenseSlot from '../AdSenseSlot';

interface PDFFileItem {
  id: string;
  file: File;
  name: string;
  size: string;
  pages: number;
  buffer: ArrayBuffer;
}

export default function PDFMergerUtility() {
  const [files, setFiles] = useState<PDFFileItem[]>([]);
  const [merging, setMerging] = useState(false);
  const [mergedSuccess, setMergedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setError(null);

    const uploadedFiles = Array.from(e.target.files).filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );

    if (uploadedFiles.length === 0) {
      setError('Please select valid PDF files (.pdf)');
      return;
    }

    const newItems: PDFFileItem[] = [];

    for (const f of uploadedFiles) {
      try {
        const buffer = await f.arrayBuffer();
        const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const pageCount = pdfDoc.getPageCount();

        newItems.push({
          id: Math.random().toString(36).substring(2, 9),
          file: f,
          name: f.name,
          size: formatSize(f.size),
          pages: pageCount,
          buffer: buffer,
        });
      } catch (err: any) {
        console.error('Error reading PDF file:', err);
        setError(`Failed to parse "${f.name}". Ensure it is a valid, unencrypted PDF.`);
      }
    }

    setFiles((prev) => [...prev, ...newItems]);
    // Reset file input value so same file can be re-uploaded if needed
    e.target.value = '';
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx >= 0 && targetIdx < newFiles.length) {
      const temp = newFiles[index];
      newFiles[index] = newFiles[targetIdx];
      newFiles[targetIdx] = temp;
      setFiles(newFiles);
    }
  };

  const handleMerge = async () => {
    if (files.length === 0) return;
    setMerging(true);
    setError(null);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        const pdf = await PDFDocument.load(item.buffer, { ignoreEncryption: true });
        const pageIndices = pdf.getPageIndices();
        const copiedPages = await mergedPdf.copyPages(pdf, pageIndices);
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();

      // Trigger download
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Merged_Document_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMergedSuccess(true);
      setTimeout(() => setMergedSuccess(false), 3000);
    } catch (err: any) {
      console.error('PDF Merge Error:', err);
      setError(err.message || 'An error occurred while merging the PDF files.');
    } finally {
      setMerging(false);
    }
  };

  const totalPages = files.reduce((acc, curr) => acc + curr.pages, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-extrabold uppercase tracking-widest border border-red-500/20">
          <FileText size={14} /> Document Utility
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          PDF Merger & Page Order Organizer
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Combine multiple PDF files into a single structured document, reorder pages, and export securely right inside your browser.
        </p>
      </div>

      <AdSenseSlot slot="pdf-merger-top" />

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-2 text-xs font-bold text-rose-500">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* File Drag / Drop Upload Zone */}
      <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-red-500 dark:hover:border-red-500 bg-white dark:bg-slate-900 rounded-2xl text-center space-y-3 transition-colors relative cursor-pointer group">
        <input
          type="file"
          multiple
          accept=".pdf,application/pdf"
          onChange={handleFileUpload}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
          <Upload size={24} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Click to upload or drag & drop PDF files
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fast 100% client-side merge. Your files never leave your device.
          </p>
        </div>
      </div>

      {/* PDF List */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Selected PDF Documents ({files.length})
            </h3>
            {files.length > 0 && (
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 rounded-md">
                Total {totalPages} Pages
              </span>
            )}
          </div>
          {files.length > 0 && (
            <button
              onClick={() => setFiles([])}
              className="text-xs text-red-500 hover:underline font-bold cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>

        {files.length > 0 ? (
          <div className="space-y-2">
            {files.map((file, idx) => (
              <div
                key={file.id}
                className="p-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 text-center text-xs font-mono font-bold text-slate-400">
                    #{idx + 1}
                  </span>
                  <div className="p-2 bg-red-500/10 text-red-500 rounded-lg shrink-0">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {file.size} • {file.pages} page{file.pages !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveFile(idx, 'up')}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    disabled={idx === files.length - 1}
                    onClick={() => moveFile(idx, 'down')}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1.5 text-red-400 hover:text-red-600 cursor-pointer"
                    title="Remove File"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-6">
            No files added yet. Upload PDFs above to begin merging.
          </p>
        )}

        {files.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={handleMerge}
              disabled={merging}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                mergedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white disabled:opacity-50'
              }`}
            >
              {merging ? (
                <Loader2 size={16} className="animate-spin" />
              ) : mergedSuccess ? (
                <Check size={16} />
              ) : (
                <Download size={16} />
              )}
              <span>
                {merging
                  ? 'Merging PDFs...'
                  : mergedSuccess
                  ? 'Merged PDF Downloaded!'
                  : 'Merge & Download Combined PDF'}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
