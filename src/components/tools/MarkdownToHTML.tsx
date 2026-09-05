import React, { useState } from 'react';
import { 
  FileCode, Copy, Download, RefreshCw, Check, Code2, Eye, Sliders
} from 'lucide-react';

export function MarkdownToHTML() {
  const [markdownText, setMarkdownText] = useState(`# SmartToolHub Documentation

Welcome to **SmartToolHub**. This platform provides developer utilities, SEO checkers, and productivity tools.

## Key Features
* **100% Client-Side**: No data leaves your browser session.
* **Fast & Responsive**: Optimized for desktop and mobile devices.
* **Open Source Design System**: Built with React, TypeScript, and Tailwind CSS.

### Quick Start Code Example
\`\`\`ts
import { SmartTool } from '@smarttoolhub/core';

const tool = new SmartTool({
  name: 'Markdown Converter',
  version: '2.0.0'
});
\`\`\`

> "Craftsmanship means executing the requested scope with pristine layout and spacing."
`);

  const [viewMode, setViewMode] = useState<'preview' | 'html'>('preview');
  const [copied, setCopied] = useState(false);

  // Quick client-side markdown to html parser
  const parseMarkdownToHTML = (md: string) => {
    let html = md;
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    // Bold & Italic
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    // Blockquote
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
    // Code blocks
    html = html.replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>');
    // Inline code
    html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');
    // Unordered lists
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
    // Paragraphs
    html = html.replace(/\n\n/gim, '<p></p>');

    return html;
  };

  const generatedHTML = parseMarkdownToHTML(markdownText);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedHTML);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedHTML], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document.html';
    link.click();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
            <FileCode size={12} className="text-emerald-500" />
            Markup & Documentation Utilities
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Markdown to HTML & PDF Converter
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Convert Markdown text documents into clean HTML code with instant live visual preview and file export.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy HTML'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} />
            <span>Export HTML File</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Markdown Editor */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block border-b border-slate-100 dark:border-slate-800 pb-3">
              Markdown Raw Input
            </label>
            <textarea
              value={markdownText}
              onChange={(e) => setMarkdownText(e.target.value)}
              rows={16}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 font-mono text-xs leading-relaxed text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>
        </div>

        {/* HTML / Live Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Converted Output
              </span>

              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                    viewMode === 'preview' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
                  }`}
                >
                  <Eye size={12} /> Preview
                </button>
                <button
                  onClick={() => setViewMode('html')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                    viewMode === 'html' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
                  }`}
                >
                  <Code2 size={12} /> HTML Code
                </button>
              </div>
            </div>

            {viewMode === 'preview' ? (
              <div 
                className="prose dark:prose-invert max-w-none p-4 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 rounded-xl min-h-[360px] text-xs leading-relaxed"
                dangerouslySetInnerHTML={{ __html: generatedHTML }}
              />
            ) : (
              <textarea
                readOnly
                value={generatedHTML}
                rows={16}
                className="w-full bg-slate-900 text-emerald-400 border border-slate-800 rounded-xl p-4 font-mono text-xs leading-relaxed focus:outline-none resize-none"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarkdownToHTML;
