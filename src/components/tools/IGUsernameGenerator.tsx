import React, { useState } from 'react';
import { UserSearch, Copy, Check, Sparkles, Filter, Info, RefreshCw } from 'lucide-react';

const MOODS = [
  { id: 'professional', name: 'Professional & Authority', prefixes: ['the', 'official', 'real', 'iam'], suffixes: ['hq', 'pro', 'agency', 'consulting'] },
  { id: 'creative', name: 'Creative & Artistic', prefixes: ['create', 'make', 'artby', 'hello'], suffixes: ['studio', 'designs', 'creative', 'lab'] },
  { id: 'aesthetic', name: 'Aesthetic & Cozy', prefixes: ['soft', 'cozy', 'sweet', 'daily'], suffixes: ['vibes', 'style', 'mood', 'journals'] },
  { id: 'tech', name: 'Tech & Modern Code', prefixes: ['tech', 'dev', 'code', 'build'], suffixes: ['dev', 'codes', 'hub', 'stack'] }
];

export default function IGUsernameGenerator() {
  const [keyword, setKeyword] = useState('tech');
  const [brandName, setBrandName] = useState('dhrumil');
  const [selectedMood, setSelectedMood] = useState('tech');
  const [useUnderscore, setUseUnderscore] = useState(true);
  const [useDot, setUseDot] = useState(false);

  const [generatedList, setGeneratedList] = useState<string[]>([]);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleGenerate = () => {
    const moodObj = MOODS.find(m => m.id === selectedMood) || MOODS[0];
    const results: string[] = [];
    const key = keyword.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    const brand = brandName.toLowerCase().trim().replace(/[^a-z0-9]/g, '');

    const separator = useUnderscore ? '_' : useDot ? '.' : '';

    if (!key && !brand) {
      // Fallback filler
      results.push('creativestudio', 'daily_vibes_co', 'minimal_journals');
    } else {
      // 1. Prefix mixes
      moodObj.prefixes.forEach(p => {
        if (brand) results.push(`${p}${separator}${brand}`);
        if (key) results.push(`${p}${separator}${key}`);
      });

      // 2. Suffix mixes
      moodObj.suffixes.forEach(s => {
        if (brand) results.push(`${brand}${separator}${s}`);
        if (key) results.push(`${key}${separator}${s}`);
      });

      // 3. Combined mixes
      if (brand && key) {
        results.push(`${brand}${separator}${key}`);
        results.push(`${key}${separator}${brand}`);
        results.push(`the${separator}${brand}${separator}${key}`);
        results.push(`${brand}${separator}${key}${separator}pro`);
      }

      // 4. Fun variants
      if (brand) {
        results.push(`its${separator}${brand}`);
        results.push(`${brand}${separator}daily`);
        results.push(`${brand}${separator}life`);
      }
    }

    // Filter unique items under 30 characters limit
    const uniqueList = Array.from(new Set(results))
      .filter(u => u.length <= 30)
      .slice(0, 24);

    setGeneratedList(uniqueList);
  };

  const copyToClipboard = (username: string) => {
    navigator.clipboard.writeText(username);
    setCopiedItem(username);
    setTimeout(() => setCopiedItem(null), 1500);
  };

  // Run on mount
  React.useEffect(() => {
    handleGenerate();
  }, [keyword, brandName, selectedMood, useUnderscore, useDot]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <UserSearch size={12} />
            Instagram Growth Tools
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Instagram Username & Handle Generator
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Generate available-feeling, catchy, and highly professional brand handles under Instagram\'s 30-character limit.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Block */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <Filter size={18} className="text-fuchsia-500" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                Name Inputs
              </h3>
            </div>

            {/* Keyword / Niche */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Niche / Topic Keyword
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. fitness, code, style"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-fuchsia-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Brand / Personal Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Brand / Personal Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. dhrumil, smarttool"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-fuchsia-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Mood selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Niche Tone Mood
              </label>
              <div className="space-y-1.5">
                {MOODS.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`w-full p-2.5 text-left rounded-xl border flex flex-col transition-all ${
                      selectedMood === mood.id
                        ? 'bg-fuchsia-500/10 border-fuchsia-500 text-fuchsia-700 dark:text-fuchsia-400'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                    }`}
                  >
                    <span className="text-[11px] font-bold uppercase">{mood.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Character styling checkboxes */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-850 pt-3 text-xs">
              <label className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Use Underscores (_)
              </label>
              <input
                type="checkbox"
                checked={useUnderscore}
                onChange={(e) => {
                  setUseUnderscore(e.target.checked);
                  if (e.target.checked) setUseDot(false);
                }}
                className="w-4 h-4 rounded text-fuchsia-500 border-slate-300 focus:ring-fuchsia-500"
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Use Dots (.)
              </label>
              <input
                type="checkbox"
                checked={useDot}
                onChange={(e) => {
                  setUseDot(e.target.checked);
                  if (e.target.checked) setUseUnderscore(false);
                }}
                className="w-4 h-4 rounded text-fuchsia-500 border-slate-300 focus:ring-fuchsia-500"
              />
            </div>

            <button
              onClick={handleGenerate}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-xs transition-all text-xs"
            >
              <RefreshCw size={14} className="animate-spin-slow" />
              Regenerate Username Ideas
            </button>
          </div>
        </div>

        {/* Right Side: Results Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <Sparkles size={18} className="text-amber-500" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                Generated Catchy Handles
              </h3>
            </div>

            {/* Results Grid layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {generatedList.map((handle) => {
                const isCopied = copiedItem === handle;
                return (
                  <div
                    key={handle}
                    onClick={() => copyToClipboard(handle)}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-250/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-fuchsia-500/50 hover:bg-fuchsia-500/5 transition-all cursor-pointer group"
                  >
                    <div className="space-y-0.5">
                      <span className="font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400">
                        @{handle}
                      </span>
                      <span className="text-[8px] text-slate-400 block font-mono">
                        {handle.length} / 30 chars
                      </span>
                    </div>
                    <button className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                      {isCopied ? (
                        <span className="text-[10px] text-emerald-600 font-bold uppercase">Copied</span>
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Educational Block */}
      <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <h4 className="font-display font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
          <Info size={16} className="text-fuchsia-500" />
          Pro-Branding Secret: Designing Available & Searchable Handles
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
          <p>
            When registering a brand username, **simplicity and pronunciation** are crucial. A handle that is easy to spell allows word-of-mouth growth to flourish. Instagram usernames must be **30 characters or less** and can only contain letters, numbers, periods, and underscores. Try to keep periods or underscores to a minimum, as they can sometimes lower search crawling rates.
          </p>
          <p>
            If your target business name is already taken, adding premium suffixes like **.hq, .co, .studio, or .dev** is an exceptional alternative. They maintain brand authority without sounding cluttered with numbers (e.g. @brand12345 looks highly untrustworthy and should be strictly avoided).
          </p>
        </div>
      </div>
    </div>
  );
}
