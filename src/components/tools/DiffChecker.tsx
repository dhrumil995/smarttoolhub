import React, { useState, useEffect } from 'react';
import { GitCompare, Copy, Check, RefreshCw, X, HelpCircle } from 'lucide-react';
import AdSenseSlot from '../AdSenseSlot';

interface DiffLine {
  text: string;
  type: 'added' | 'removed' | 'unchanged';
  lineNumber?: number;
}

export default function DiffChecker() {
  const [originalText, setOriginalText] = useState('Welcome to SmartToolHub\nThis is the premier developer utility portal.\nOffline ready.\nClient-side processed.');
  const [modifiedText, setModifiedText] = useState('Welcome to SmartToolHub PRO\nThis is the premier developer utility portal.\nExtremely fast.\nClient-side processed.');
  const [diffLines, setDiffLines] = useState<DiffLine[]>([]);
  const [copied, setCopied] = useState(false);

  const performDiff = () => {
    const orig = originalText.split('\n');
    const mod = modifiedText.split('\n');
    const result: DiffLine[] = [];

    let oIdx = 0;
    let mIdx = 0;

    while (oIdx < orig.length || mIdx < mod.length) {
      if (oIdx < orig.length && mIdx < mod.length) {
        if (orig[oIdx] === mod[mIdx]) {
          result.push({ text: orig[oIdx], type: 'unchanged' });
          oIdx++;
          mIdx++;
        } else {
          // Look ahead to see if the modified line matches an upcoming original line
          const upcomingOIdx = orig.indexOf(mod[mIdx], oIdx);
          if (upcomingOIdx !== -1 && upcomingOIdx - oIdx < 5) {
            // Original lines were removed
            while (oIdx < upcomingOIdx) {
              result.push({ text: orig[oIdx], type: 'removed' });
              oIdx++;
            }
          } else {
            // Modified line was added or modified
            result.push({ text: orig[oIdx], type: 'removed' });
            result.push({ text: mod[mIdx], type: 'added' });
            oIdx++;
            mIdx++;
          }
        }
      } else if (oIdx < orig.length) {
        result.push({ text: orig[oIdx], type: 'removed' });
        oIdx++;
      } else if (mIdx < mod.length) {
        result.push({ text: mod[mIdx], type: 'added' });
        mIdx++;
      }
    }

    setDiffLines(result);
  };

  useEffect(() => {
    performDiff();
  }, [originalText, modifiedText]);

  const handleClear = () => {
    setOriginalText('');
    setModifiedText('');
  };

  const handleResetSample = () => {
    setOriginalText('Welcome to SmartToolHub\nThis is the premier developer utility portal.\nOffline ready.\nClient-side processed.');
    setModifiedText('Welcome to SmartToolHub PRO\nThis is the premier developer utility portal.\nExtremely fast.\nClient-side processed.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <GitCompare size={12} />
            Text Utilities
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Text Diff Checker & Comparer
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compare original and modified texts side-by-side to inspect line modifications, additions, or deletions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Original Text Input */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Original Text (Left Side)
            </span>
            <button
              onClick={handleResetSample}
              className="text-[10px] text-indigo-500 hover:underline font-semibold"
            >
              Load Sample Text
            </button>
          </div>
          <textarea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="Enter original text block..."
            rows={8}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-3 text-xs font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-850 dark:text-slate-100"
          />
        </div>

        {/* Right Side: Modified Text Input */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Modified Text (Right Side)
            </span>
            <button
              onClick={handleClear}
              className="text-[10px] text-rose-500 hover:underline font-semibold"
            >
              Clear Inputs
            </button>
          </div>
          <textarea
            value={modifiedText}
            onChange={(e) => setModifiedText(e.target.value)}
            placeholder="Enter modified text block..."
            rows={8}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-3 text-xs font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-850 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Diff Result Analysis Display */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Line Comparison Output
            </span>
          </div>
          {/* Key Legend */}
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500/10 border border-emerald-500/20" /> Added
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-rose-500/10 border border-rose-500/20" /> Removed
            </span>
          </div>
        </div>

        <div className="w-full rounded-xl bg-slate-950 border border-slate-850 p-4 overflow-x-auto font-mono text-xs text-slate-300 space-y-1 select-text max-h-[350px] overflow-y-auto">
          {diffLines.length === 0 ? (
            <span className="text-slate-500 italic">No modifications found. Inputs match perfectly!</span>
          ) : (
            diffLines.map((line, idx) => {
              let bgClass = 'bg-transparent text-slate-400';
              let prefix = ' ';

              if (line.type === 'added') {
                bgClass = 'bg-emerald-950/40 text-emerald-400 border-l-2 border-emerald-500 pl-2 py-0.5';
                prefix = '+';
              } else if (line.type === 'removed') {
                bgClass = 'bg-rose-950/40 text-rose-400 border-l-2 border-rose-500 pl-2 py-0.5';
                prefix = '-';
              } else {
                bgClass = 'pl-2.5 py-0.5 text-slate-400';
              }

              return (
                <div key={idx} className={`${bgClass} rounded transition-colors flex gap-2 whitespace-pre`}>
                  <span className="text-[10px] text-slate-600 select-none w-4 inline-block text-right">{prefix}</span>
                  <span>{line.text}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <AdSenseSlot slot="diff-checker-bottom" />
    </div>
  );
}
