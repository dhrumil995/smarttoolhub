import React, { useState } from 'react';
import { Globe, Search, Copy, Check, Loader2, AlertCircle, Sparkles, Eye, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const COUNTRIES = [
  { id: 'US', label: 'United States' },
  { id: 'UK', label: 'United Kingdom' },
  { id: 'CA', label: 'Canada' },
  { id: 'AU', label: 'Australia' },
  { id: 'IN', label: 'India' },
];

export default function KeywordResearch() {
  const [keyword, setKeyword] = useState('');
  const [country, setCountry] = useState('US');
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

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
          toolType: 'keyword-research',
          payload: {
            keyword,
            country,
            language,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze keyword');
      }

      setResult(data.result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while connecting to the keyword research engine.');
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

  const handleSaveJSON = () => {
    if (!result) return;
    const data = {
      keyword,
      country,
      language,
      analyzedAt: new Date().toISOString(),
      report: result
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `keyword_research_${keyword.replace(/\s+/g, '_') || 'report'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSaveCSV = () => {
    if (!result) return;
    const rows = [
      ['Focus Keyword', 'Country', 'Language', 'Analysis Result'],
      [keyword, country, language, result]
    ];
    const csvContent = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `keyword_research_${keyword.replace(/\s+/g, '_') || 'report'}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSample = () => {
    setKeyword('best client side image compressor react');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <Globe size={12} />
            SEO Tools
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            SEO Keyword Research Tool
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Generate LSI keyword clusters, calculate difficulty scores, and map user intent with real-time search engine data.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Column */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                Focus Search Term
              </label>
              <button
                type="button"
                onClick={handleSample}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                Load Sample Term
              </button>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. image compressor online free"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-3.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Country</span>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-3 text-xs focus:border-indigo-500 focus:outline-none"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Language</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-3 text-xs focus:border-indigo-500 focus:outline-none"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !keyword.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-xs hover:bg-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating keyword reports...
                </>
              ) : (
                <>
                  <Search size={16} />
                  Analyze Search Intent
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 dark:bg-rose-950/20 p-4 text-sm text-rose-800 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {result ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
              <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 px-6 py-4 flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  SEO Keyword Dashboard
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveJSON}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    title="Download report as JSON"
                  >
                    <Download size={12} />
                    <span>Save JSON</span>
                  </button>
                  <button
                    onClick={handleSaveCSV}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    title="Download report as CSV"
                  >
                    <Download size={12} />
                    <span>Save CSV</span>
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-950 dark:hover:text-slate-50 font-medium px-2 py-1"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-emerald-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copy Report
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="p-6 prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-slate-50/30 dark:bg-slate-950/10">
              <Globe size={36} className="text-slate-300 dark:text-slate-700 animate-pulse mb-3" />
              <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                Awaiting Search Phrase
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mt-1">
                We will pull real search engine result page (SERP) details to compile CPC indexes, LSI semantic queries, search difficulties, and content outlines.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
