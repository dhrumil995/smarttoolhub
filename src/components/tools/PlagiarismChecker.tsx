import React, { useState } from 'react';
import { ScanEye, Loader2, AlertCircle, Copy, Check, Eye, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function PlagiarismChecker() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
          toolType: 'plagiarism-checker',
          payload: { text },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to scan for plagiarism');
      }

      setResult(data.result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while connecting to the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSample = () => {
    setText(`React is a free and open-source front-end JavaScript library for building user interfaces based on components. It is maintained by Meta and a community of individual developers and companies. React can be used to develop single-page, mobile, or server-rendered applications.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <ScanEye size={12} />
            SEO Tools
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            SEO Plagiarism Checker & Citator
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Audit content uniqueness with active Google Search grounding to scan blogs, databases, and publications for match citations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                Text to Scan
              </label>
              <button
                type="button"
                onClick={handleSample}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                Load Wikipedia Sample
              </button>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste article, paragraph, or school essay to verify originality..."
              rows={10}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-4 text-sm text-slate-950 dark:text-slate-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              required
            />

            <button
              type="submit"
              disabled={loading || text.trim().length < 10}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Scanning web pages...
                </>
              ) : (
                <>
                  <ScanEye size={16} />
                  Scan Content for Plagiarism
                </>
              )}
            </button>
          </div>
        </form>

        {/* Output Column */}
        <div className="lg:col-span-6 space-y-6">
          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 dark:bg-rose-950/20 p-4 text-sm text-rose-800 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {result ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
              <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye size={16} className="text-indigo-500" />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Plagiarism Scan Audit
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-950 dark:hover:text-slate-50 font-medium"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy Audit Report
                    </>
                  )}
                </button>
              </div>
              <div className="p-6 prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[320px] border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-slate-50/30 dark:bg-slate-950/10">
              <ScanEye size={36} className="text-slate-300 dark:text-slate-700 mb-3 animate-pulse" />
              <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                Awaiting Content Block
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mt-1">
                We'll run similarity checks across public blogs, indexing sources, and Wikipedia, then provide matching links and rewriting tips.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
