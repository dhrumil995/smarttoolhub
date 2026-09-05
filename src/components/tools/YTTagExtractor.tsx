import React, { useState } from 'react';
import { Tag, Search, Copy, Check, Loader2, AlertCircle, Sparkles, Plus, ListChecks } from 'lucide-react';

export default function YTTagExtractor() {
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setTags([]);

    try {
      const response = await fetch('/api/yt-extract-tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract tags from video');
      }

      setTags(data.tags || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while connecting to the tag extractor.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAll = () => {
    if (tags.length === 0) return;
    navigator.clipboard.writeText(tags.join(', '));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopySingle = (tag: string, idx: number) => {
    navigator.clipboard.writeText(tag);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const handleSample = () => {
    setUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <Tag size={12} />
            YouTube Optimizers
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            YouTube Video Tag Extractor
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Query any public YouTube URL to securely extract its actual indexing keywords and organic metadata tags.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Column */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                YouTube Video URL
              </label>
              <button
                type="button"
                onClick={handleSample}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                Load Sample Video
              </button>
            </div>

            <div className="space-y-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-3.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-xs hover:bg-red-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Extracting meta tags...
                </>
              ) : (
                <>
                  <Search size={16} />
                  Extract Competitor Tags
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

          {tags.length > 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
              <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <ListChecks size={18} />
                  <span className="text-sm font-semibold">
                    Extracted Tags ({tags.length})
                  </span>
                </div>
                <button
                  onClick={handleCopyAll}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500"
                >
                  {copiedAll ? (
                    <>
                      <Check size={14} />
                      Copied All!
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy All Comma List
                    </>
                  )}
                </button>
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-2.5">
                  {tags.map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleCopySingle(tag, idx)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-indigo-500 transition-all text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      <span>{tag}</span>
                      {copiedIdx === idx ? (
                        <Check size={12} className="text-emerald-500" />
                      ) : (
                        <Copy size={12} className="text-slate-400 hover:text-slate-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-slate-50/30 dark:bg-slate-950/10">
              <Tag size={36} className="text-slate-300 dark:text-slate-700 animate-pulse mb-3" />
              <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                Awaiting YouTube URL
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mt-1">
                Once queried, we will safely crawl the video metadata server-side to isolate hidden SEO tags and indexable labels.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
