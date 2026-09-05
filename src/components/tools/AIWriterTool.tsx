import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Copy, Check, Sparkles, Wand2, RefreshCw, HelpCircle, AlertCircle, MessageSquare } from 'lucide-react';

const FORMATS = [
  { id: 'improve', label: 'Rewrite Technical Text', desc: 'Polish grammar, adjust readability, and optimize syntax flow.' },
  { id: 'commit', label: 'Conventional Commit', desc: 'Translate raw changes into standard, conventional commit format.' },
  { id: 'readme', label: 'README Enhancer', desc: 'Draft an informative, stylized section with headings and examples.' },
  { id: 'changelog', label: 'Release Logs', desc: 'Format bullet points into a clean, grouped changelog.' },
];

const TONES = [
  { id: 'professional', label: '👔 Professional' },
  { id: 'casual', label: '☕ Friendly Developer' },
  { id: 'concise', label: '⚡ Ultra-Succinct' },
  { id: 'enthusiastic', label: '🚀 Product Launch' },
];

const WRITER_SAMPLES: Record<string, string> = {
  improve: `we builded this client side tool because we dont like servers. it has high speed and it uses localstorage to save you todo items. so you don't lose any data when your tab crashes or battery dies. its completely secure and works offline too.`,
  commit: `added a search filter to the home page that filters by name, tag, and desc. also fixed the responsive overflow gap in the footer and updated help sections to refer to privacy guidelines.`,
  readme: `image client side compressor. works by loading file into canvas element and scaling it down using quality multiplier between 0 and 1. has drag and drop zone. outputs downloadable file size comparison.`,
  changelog: `adds deep dark mode support to all pages. fixed youtube channel avatar downloader crop failure. deprecated legacy base64-convert script. optimized json validator parser efficiency by around 25%.`,
};

export default function AIWriterTool() {
  const [format, setFormat] = useState('improve');
  const [tone, setTone] = useState('professional');
  const [text, setText] = useState(WRITER_SAMPLES.improve);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFormatChange = (newFormat: string) => {
    setFormat(newFormat);
    setResult(null);
    setError(null);
    setText(WRITER_SAMPLES[newFormat] || '');
  };

  const handleAction = async () => {
    if (!text.trim()) {
      setError('Please provide some technical input text or bullet points.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/ai/writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, tone, format }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Server error occurred.');
      }

      setResult(data.result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred while communicating with the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Configuration & Input Column */}
      <div className="lg:col-span-6 space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xs">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-violet-500/10 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400 rounded-xl flex items-center justify-center shrink-0">
              <Wand2 size={20} />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-900 dark:text-white text-base">
                Technical Improver & Writer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Instantly rewrite commits, document chapters, release notes, and blogs with Gemini.
              </p>
            </div>
          </div>

          {/* Formats Grid */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Select Output Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              {FORMATS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => handleFormatChange(f.id)}
                  title={f.desc}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold border text-left transition-all cursor-pointer ${
                    format === f.id
                      ? 'bg-violet-600 border-violet-600 text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-150 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="block truncate">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tone Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Select Writing Tone
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TONES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`px-2.5 py-2.5 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                    tone === t.id
                      ? 'bg-violet-500/5 dark:bg-violet-500/10 border-violet-500/30 text-violet-600 dark:text-violet-400'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-150 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt/Thoughts Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Pasted Input / Bullet Points
              </label>
              <button
                onClick={() => setText(WRITER_SAMPLES[format] || '')}
                className="text-[10px] font-bold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
              >
                Reset to Sample
              </button>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste raw drafts, logs, or quick notes to expand..."
              className="w-full h-44 p-4 text-xs bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-200 border border-slate-200 dark:border-slate-850 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-slate-400 leading-relaxed resize-none shadow-inner"
            />
          </div>

          {/* Action Trigger */}
          <button
            onClick={handleAction}
            disabled={loading}
            className={`w-full py-3.5 rounded-2xl text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
              loading
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800 cursor-not-allowed'
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-95 shadow-violet-600/10 hover:shadow-violet-600/15'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Refining Technical Structure...
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Optimize Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Output Result Column */}
      <div className="lg:col-span-6 space-y-6">
        {error && (
          <div className="bg-red-500/5 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl p-4 flex gap-3 text-xs items-start animate-fade-in">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Generation Failed:</span>
              <p className="font-medium leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-2xs h-[480px] flex flex-col justify-center items-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute h-12 w-12 rounded-full border-4 border-violet-500/10 dark:border-violet-500/20 border-t-violet-600 dark:border-t-violet-400 animate-spin" />
              <Wand2 size={20} className="text-violet-500 animate-pulse" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h4 className="font-display font-extrabold text-slate-900 dark:text-white text-sm">
                Styling documentation...
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Gemini is adjusting style markers, structuring markdown, checking spelling accuracy, and adapting proper conventional logs.
              </p>
            </div>
          </div>
        ) : result ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xs flex flex-col min-h-[480px]">
            {/* Output Header Controls */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-violet-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Polished Technical Draft
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200/60 dark:border-slate-850 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check size={12} className="text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    Copy Draft
                  </>
                )}
              </button>
            </div>

            {/* Markdown Container */}
            <div className="flex-1 overflow-y-auto max-h-[550px] pr-2">
              <div className="markdown-body text-xs text-slate-700 dark:text-slate-300 font-medium">
                <Markdown>{result}</Markdown>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-100/30 dark:bg-slate-900/10 border border-dashed border-slate-200 dark:border-slate-850 rounded-3xl p-12 text-center space-y-4 h-[480px] flex flex-col justify-center items-center">
            <HelpCircle className="h-10 w-10 text-slate-300 dark:text-slate-700" />
            <div className="space-y-1 max-w-sm">
              <h4 className="font-display font-extrabold text-slate-700 dark:text-slate-300 text-sm">
                No polished text draft yet
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                Enter your draft or notes on the left, pick an target output template and tone, and click "Optimize Copy" to generate the final layout.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
