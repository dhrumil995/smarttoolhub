import React, { useState } from 'react';
import { Target, Sparkles, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';

export function HeadlineSubjectTester() {
  const [headline, setHeadline] = useState("7 Secrets to Double Your SaaS Conversion Rate in 2026");

  const charCount = headline.length;
  const wordCount = headline.trim().split(/\s+/).filter(Boolean).length;

  // Power word check
  const powerWords = ['secret', 'secrets', 'double', 'proven', 'effortless', 'master', 'guaranteed', 'instant', 'free', 'hacks'];
  const foundPowerWords = powerWords.filter(w => headline.toLowerCase().includes(w));

  // Score calculation
  let score = 60;
  if (charCount >= 40 && charCount <= 65) score += 20;
  if (foundPowerWords.length > 0) score += 15;
  if (/\d/.test(headline)) score += 10;
  score = Math.min(score, 99);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-xs font-semibold">
          <Target size={14} /> CTR & Emotional Impact Score
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Headline & Subject Line Tester
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Score your blog headlines and email subject lines for emotional power words, character length, and predicted open/click-through rates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <label className="block text-xs font-bold text-slate-500 uppercase">Input Headline or Subject Line</label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border">
              <span className="block text-[10px] font-bold text-slate-400">CHARACTERS</span>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">{charCount}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border">
              <span className="block text-[10px] font-bold text-slate-400">WORDS</span>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">{wordCount}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border">
              <span className="block text-[10px] font-bold text-slate-400">POWER WORDS</span>
              <span className="text-lg font-extrabold text-amber-600">{foundPowerWords.length}</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Headline Score</span>
            <span className="text-3xl font-extrabold text-amber-600">{score}/100</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-between">
              <span>Optimal Character Count (40-65 chars)</span>
              <span className={charCount >= 40 && charCount <= 65 ? 'text-emerald-600 font-bold' : 'text-amber-500 font-bold'}>
                {charCount >= 40 && charCount <= 65 ? 'Ideal' : 'Adjust Length'}
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-between">
              <span>Includes Numbers / Digits</span>
              <span className={/\d/.test(headline) ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                {/\d/.test(headline) ? 'Yes (+10 pts)' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
