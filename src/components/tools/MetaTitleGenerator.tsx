import React, { useState } from 'react';
import { Heading, Search, Copy, Check, Loader2, AlertCircle, Sparkles, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function MetaTitleGenerator() {
  const [keyword, setKeyword] = useState('');
  const [description, setDescription] = useState('');
  const [pageType, setPageType] = useState('Blog/Article');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim() && !description.trim()) return;

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
          toolType: 'meta-title',
          payload: {
            keyword,
            description,
            pageType,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate meta tags');
      }

      setResult(data.result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while connecting to the copywriter engine.');
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
    setKeyword('free client side qr code generator');
    setDescription('Build fully offline, high-contrast QR codes directly in your browser. No databases, 100% data privacy and seamless SVG vector downloads.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <Heading size={12} />
            SEO Tools
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            SEO Meta Title & Description Generator
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Generate high-CTR meta tag configurations bounded by standard Google pixel dimensions for maximum organic indexing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Column */}
        <div className="lg:col-span-6 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                Page Details
              </label>
              <button
                type="button"
                onClick={handleSample}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                Load Sample Details
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Primary Target Keyword</span>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. offline qr generator free"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-3.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Page Content / Core Description</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your page goals, service details, or blog focus..."
                rows={4}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-4 text-sm text-slate-950 dark:text-slate-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Page Structure Type</span>
              <select
                value={pageType}
                onChange={(e) => setPageType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-3 text-sm focus:border-indigo-500 focus:outline-none"
              >
                <option value="Blog/Article">Article / Developer Blog</option>
                <option value="E-Commerce Product">E-Commerce Product Page</option>
                <option value="Service/Landing">Service Landing Page</option>
                <option value="Homepage">Main Homepage / Core Brand</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || (!keyword.trim() && !description.trim())}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-xs hover:bg-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Drafting ranking meta tags...
                </>
              ) : (
                <>
                  <Heading size={16} />
                  Generate Ranking Metas
                </>
              )}
            </button>
          </form>
        </div>

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
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Meta tag Configurations
                </span>
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
                      Copy Tags Report
                    </>
                  )}
                </button>
              </div>
              <div className="p-6 prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-slate-50/30 dark:bg-slate-950/10">
              <Heading size={36} className="text-slate-300 dark:text-slate-700 animate-pulse mb-3" />
              <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                Awaiting Page Specifications
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mt-1">
                We will compose and verify 10 Meta Titles and 5 Meta Descriptions complete with psychological triggers, focus structures, and active character count guides.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
