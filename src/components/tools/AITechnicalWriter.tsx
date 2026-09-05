import React, { useState } from 'react';
import { Wand2, Type, FileText, Check, Copy, Sparkles, Loader2, RefreshCw, AlertTriangle, HelpCircle, FileSignature } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function AITechnicalWriter() {
  const [text, setText] = useState('');
  const [type, setType] = useState<'readme' | 'commit' | 'changelog' | 'blog'>('readme');
  const [tone, setTone] = useState<'professional' | 'friendly' | 'technical' | 'humorous' | 'persuasive'>('technical');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const documentTypes = [
    { id: 'readme', label: 'README.md Section', icon: FileText },
    { id: 'commit', label: 'Conventional Commit', icon: FileSignature },
    { id: 'changelog', label: 'Changelog / Release Note', icon: RefreshCw },
    { id: 'blog', label: 'Technical Article/Blog', icon: Type },
  ];

  const tones = [
    { id: 'technical', label: 'Deep Technical' },
    { id: 'professional', label: 'Polished Corporate' },
    { id: 'friendly', label: 'Warm & Engaging' },
    { id: 'persuasive', label: 'Impactful & Persuasive' },
    { id: 'humorous', label: 'Lighthearted & Witty' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolType: 'ai-writer',
          payload: {
            text,
            type,
            tone,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to refine copy');
      }

      setResult(data.result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while connecting to the AI writer.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSampleLoad = () => {
    const samples: Record<typeof type, string> = {
      readme: `FocusMode is a chrome extension. It lets you block annoying websites and social media to improve study. It has white noise integration and schedules timers in pomodoro loops. Created with React, Tailwind, and WebExtensions API. No databases, fully client-side storage.`,
      commit: `i fixed the bug where the json parser was throwing an unhandled exception when an empty array is parsed. I also updated the tests in parser.test.ts and cleaned up a typo in the README.`,
      changelog: `For version 1.2.0: We added three new YouTube extract tools (thumbnail downloader, channel id audit, description builder). Also, we fixed the linter bugs on math and base64. Speed is 40% faster because of Vite routing.`,
      blog: `Why client-side processing is the future of utility tools. Server-side logs are insecure. Pasting passwords, customer records, or raw JSON headers can expose API keys. SmartToolHub solves this by executing 100% of tasks in local browser memory.`
    };

    setText(samples[type]);
  };

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <Wand2 size={12} />
            AI Content Creators
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            AI Technical Content Improver
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Polish release notes, structure beautiful readme cards, draft conventional commit lines, or refine articles using Gemini.
          </p>
        </div>

        <button
          onClick={handleSampleLoad}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-150 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 text-xs font-bold rounded-xl transition-all cursor-pointer"
        >
          <RefreshCw size={12} />
          Load Sample Topic
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Template selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Target Content Template
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {documentTypes.map((doc) => {
                  const Icon = doc.icon;
                  return (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => {
                        setType(doc.id as any);
                        setResult(null);
                        setError(null);
                      }}
                      className={`flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-bold border transition-all text-left cursor-pointer ${
                        type === doc.id
                          ? 'bg-purple-600 border-purple-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon size={14} className="shrink-0" />
                      {doc.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tone selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Writing Tone
              </label>
              <div className="flex flex-wrap gap-1.5">
                {tones.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTone(t.id as any)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      tone === t.id
                        ? 'bg-slate-800 dark:bg-slate-200 border-slate-800 dark:border-slate-200 text-white dark:text-slate-950 shadow-2xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Raw Input Text Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Pasted Notes / Draft Details
                </label>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono">
                  {text.length} chars
                </span>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste raw, unformatted notes, raw updates, code list, or messy sentences..."
                rows={9}
                className="w-full p-4 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-2xl border border-slate-200 dark:border-slate-850 focus:outline-none focus:ring-2 focus:ring-purple-500/50 leading-relaxed text-xs font-semibold"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:opacity-50 text-white font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs font-mono uppercase tracking-widest"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Generating Draft...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Refine Technical Copy
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
              Polished Finished Copy
            </span>
            {result && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-emerald-500" />
                    Copied Output
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    Copy Markdown
                  </>
                )}
              </button>
            )}
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900/30 border border-slate-150 dark:border-slate-850 rounded-2xl space-y-3">
              <Loader2 size={32} className="text-purple-500 animate-spin" />
              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Refining technical layout parameters...
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Making sure Markdown structures are fully validated.
                </p>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="p-5 bg-rose-500/10 dark:bg-rose-500/10 border border-rose-500/20 rounded-2xl flex gap-3 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="shrink-0 mt-0.5" size={16} />
              <div className="space-y-1">
                <h4 className="text-xs font-bold">Generation Failed</h4>
                <p className="text-[11px] leading-relaxed opacity-90">{error}</p>
              </div>
            </div>
          )}

          {!loading && !result && !error && (
            <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900/20 border border-dashed border-slate-200 dark:border-slate-850 rounded-3xl text-center p-6 space-y-4">
              <Wand2 className="h-10 w-10 text-slate-300 dark:text-slate-700" />
              <div className="max-w-xs space-y-1">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Awaiting Writing Draft
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Provide messy technical snippets or lists on the left. Gemini will produce beautiful markdown with badges, standards, and polished structures.
                </p>
              </div>
            </div>
          )}

          {!loading && result && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs max-h-[600px] overflow-y-auto">
              <div className="markdown-body prose prose-sm prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed space-y-4">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
