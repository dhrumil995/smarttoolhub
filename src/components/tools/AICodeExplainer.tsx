import React, { useState } from 'react';
import { Cpu, Terminal, Play, Check, Copy, Sparkles, Loader2, RefreshCw, AlertTriangle, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function AICodeExplainer() {
  const [code, setCode] = useState('');
  const [action, setAction] = useState<'explain' | 'optimize' | 'translate' | 'tests'>('explain');
  const [language, setLanguage] = useState('TypeScript');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const languages = ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Java', 'C++', 'HTML/CSS', 'Shell Script'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

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
          toolType: 'ai-code',
          payload: {
            code,
            action,
            language,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setResult(data.result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while connecting to the AI helper.');
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
    const sampleCodes: Record<typeof action, string> = {
      explain: `function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = [];
  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.push(item);
    } else {
      seen.add(item);
    }
  }
  return duplicates;
}`,
      optimize: `function bubbleSort(arr) {
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}`,
      translate: `def greet_user(name: str) -> str:
    if not name:
        return "Hello, Guest!"
    return f"Hello, {name}! Welcome back."`,
      tests: `export function calculateDiscount(price: number, discountRate: number): number {
  if (price < 0 || discountRate < 0 || discountRate > 1) {
    throw new Error("Invalid pricing arguments");
  }
  return price - (price * discountRate);
}`
    };

    setCode(sampleCodes[action]);
    if (action === 'translate') {
      setLanguage('Python');
    } else if (action === 'tests') {
      setLanguage('TypeScript');
    } else {
      setLanguage('JavaScript');
    }
  };

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <Cpu size={12} />
            AI Developer Utilities
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            AI Code Explainer & Optimizer
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Understand complex logic, optimize algorithmic complexity, port syntax, or draft unit test files using server-side Gemini.
          </p>
        </div>

        <button
          onClick={handleSampleLoad}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-150 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 text-xs font-bold rounded-xl transition-all cursor-pointer"
        >
          <RefreshCw size={12} />
          Load Sample Code
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Action Selectors */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Select AI Objective
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'explain', label: 'Explain Logic' },
                  { id: 'optimize', label: 'Optimize / Refactor' },
                  { id: 'translate', label: 'Translate Language' },
                  { id: 'tests', label: 'Generate Tests' },
                ].map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setAction(act.id as any)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      action === act.id
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Source Programming Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Code Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Paste Code Snippet
                </label>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono">
                  {code.length} chars
                </span>
              </div>
              <div className="relative font-mono text-xs">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={`// Paste your source code here...\n\n// Example:\nfunction calculateDiscount(price, rate) {\n  return price - (price * rate);\n}`}
                  rows={14}
                  className="w-full p-4 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 leading-relaxed resize-y"
                  required
                />
                <div className="absolute top-3 right-3 text-slate-600 pointer-events-none">
                  <Terminal size={14} />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:opacity-50 text-white font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs font-mono uppercase tracking-widest"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Generating Analysis...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Analyze Snippet
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
              AI Output Response
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
              <Loader2 size={32} className="text-indigo-500 animate-spin" />
              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Gemini API is processing your request...
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Compiling refactors, explaining logic structures, and formatting output.
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
              <HelpCircle className="h-10 w-10 text-slate-300 dark:text-slate-700" />
              <div className="max-w-xs space-y-1">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Awaiting Input Code
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Paste a logic block on the left and select an objective. Gemini will output formatted reports and optimized listings.
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
