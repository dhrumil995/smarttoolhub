import React, { useState } from 'react';
import { Code, Check, Copy, Sparkles, HelpCircle } from 'lucide-react';

export function RegexTesterGenerator() {
  const [pattern, setPattern] = useState('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState('Contact us at support@smarttoolhub.net or sales@example.com for help.');
  const [explanation, setExplanation] = useState('Matches valid email address formats.');

  const [matches, setMatches] = useState<string[]>([]);

  React.useEffect(() => {
    try {
      const regex = new RegExp(pattern, flags);
      const m = testText.match(regex);
      setMatches(m || []);
    } catch (e) {
      setMatches([]);
    }
  }, [pattern, flags, testText]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full text-xs font-semibold">
          <Code size={14} /> Regular Expression Debugger
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Regex Pattern Tester & Explainer
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Test regular expressions in real-time with instant syntax highlighting, group capturing, and plain-English pattern explanations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Regex Pattern</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="flex-1 px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-cyan-600"
              />
              <input
                type="text"
                value={flags}
                placeholder="flags"
                onChange={(e) => setFlags(e.target.value)}
                className="w-16 px-2 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border rounded-xl text-center"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Test String</label>
            <textarea
              rows={5}
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>
        </div>

        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Matches Found ({matches.length})</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border text-xs font-mono space-y-2">
            {matches.length > 0 ? (
              matches.map((m, idx) => (
                <div key={idx} className="px-2 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded font-bold">
                  Match #{idx + 1}: {m}
                </div>
              ))
            ) : (
              <span className="text-slate-400">No matches found for current pattern.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
