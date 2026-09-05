import React, { useState } from 'react';
import { 
  Link, Copy, RefreshCw, Check, Sliders, ArrowRight, ShieldCheck, Sparkles
} from 'lucide-react';

export function URLSlugGenerator() {
  const [inputText, setInputText] = useState('10 Best SEO Tips & Tricks for Ranking #1 on Google in 2026!');
  const [separator, setSeparator] = useState<'-' | '_'>('-');
  const [isLowercase, setIsLowercase] = useState(true);
  const [removeStopWords, setRemoveStopWords] = useState(true);
  const [stripNumbers, setStripNumbers] = useState(false);
  const [maxLength, setMaxLength] = useState<number>(60);
  const [trailingSlash, setTrailingSlash] = useState(false);

  const [copied, setCopied] = useState(false);

  // Stop Words list
  const STOP_WORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'if', 'then', 'else', 'when',
    'at', 'from', 'by', 'for', 'with', 'about', 'against', 'between', 'into',
    'through', 'during', 'before', 'after', 'above', 'below', 'to', 'of', 'in'
  ]);

  const generateSlug = (text: string) => {
    let result = text.trim();

    if (isLowercase) {
      result = result.toLowerCase();
    }

    // Remove accents
    result = result.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Strip special non-alphanumeric chars (keep spaces and hyphens)
    result = result.replace(/[^a-zA-Z0-9\s-_]/g, '');

    if (stripNumbers) {
      result = result.replace(/[0-9]/g, '');
    }

    let words = result.split(/[\s-_]+/);

    if (removeStopWords) {
      words = words.filter(w => !STOP_WORDS.has(w.toLowerCase()) && w.length > 0);
    }

    let slug = words.join(separator);

    if (maxLength > 0 && slug.length > maxLength) {
      slug = slug.substring(0, maxLength).replace(new RegExp(`\\${separator}+$`), '');
    }

    if (trailingSlash && slug.length > 0) {
      slug = slug + '/';
    }

    return slug;
  };

  const currentSlug = generateSlug(inputText);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSlug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
            <Link size={12} className="text-blue-500" />
            SEO Permalinks & Clean URLs
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            SEO URL Slug Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Convert article titles, product names, and headings into search engine optimized, clean permalink URL slugs.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? 'Copied Slug' : 'Copy Clean Slug'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input & Output Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
              Article Title or Heading Input
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
              placeholder="Paste article title or string here..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Generated Slug Result */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <Link size={14} /> Clean Generated URL Slug
              </span>
              <span className="font-mono text-xs text-slate-400">{currentSlug.length} Chars</span>
            </div>

            <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl font-mono text-sm sm:text-base font-bold text-cyan-400 break-all">
              https://example.com/blog/{currentSlug || 'your-slug-here'}
            </div>
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-xs">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Sliders size={14} className="text-blue-500" />
              Slug Customization Rules
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Word Separator</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSeparator('-')}
                    className={`py-2 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                      separator === '-' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Hyphen (-)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSeparator('_')}
                    className={`py-2 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                      separator === '_' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Underscore (_)
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={isLowercase}
                    onChange={(e) => setIsLowercase(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Convert to Lowercase</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={removeStopWords}
                    onChange={(e) => setRemoveStopWords(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Strip Stop Words (a, the, in, for, and)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={stripNumbers}
                    onChange={(e) => setStripNumbers(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Strip Numbers</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={trailingSlash}
                    onChange={(e) => setTrailingSlash(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Append Trailing Slash (/)</span>
                </label>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Max Character Limit</label>
                <input
                  type="number"
                  value={maxLength}
                  onChange={(e) => setMaxLength(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default URLSlugGenerator;
