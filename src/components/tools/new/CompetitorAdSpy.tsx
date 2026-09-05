import React, { useState } from 'react';
import { Search, Sparkles, Copy, Check, TrendingUp } from 'lucide-react';

export function CompetitorAdSpy() {
  const [domain, setDomain] = useState('notion.so');
  const [isSpying, setIsSpying] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleSpy = () => {
    setIsSpying(true);
    setTimeout(() => {
      setData({
        adHooks: [
          "One workspace for every team. Document, plan, and execute together.",
          "Tired of switching between 10 apps? Unify your workflow today.",
          "Try the connected workspace trusted by 50M+ creators and teams."
        ],
        targetKeywords: ["project management software", "connected workspace", "team wiki template", "notion alternative"],
        messagingAngle: "Productivity unification & central team wiki source of truth."
      });
      setIsSpying(false);
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-full text-xs font-semibold">
          <Search size={14} /> Competitive Ad Intelligence
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Competitor Ad Copy & Keyword Spy Tool
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Analyze competitor ad messaging angles, high-intent Google search keywords, and value propositions from publicly available ad data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <label className="block text-xs font-bold text-slate-500 uppercase">Competitor Domain</label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
          />
          <button
            onClick={handleSpy}
            disabled={isSpying}
            className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles size={16} /> {isSpying ? 'Spying on Ad Angles...' : 'Analyze Competitor Ads'}
          </button>
        </div>

        <div className="md:col-span-7">
          {data ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 text-xs">
              <span className="font-bold text-slate-400 uppercase">Active Ad Copies</span>
              <div className="space-y-2">
                {data.adHooks.map((h: string, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-medium">
                    "{h}"
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[250px] bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <Search size={36} className="mb-2 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-semibold">Enter a rival domain to discover high-performing ad hooks.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
