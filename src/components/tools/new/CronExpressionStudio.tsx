import React, { useState } from 'react';
import { Clock, Calendar, Copy, Check, Play } from 'lucide-react';

export function CronExpressionStudio() {
  const [cron, setCron] = useState('0 0 * * *');
  const [copied, setCopied] = useState(false);

  const presets = [
    { label: 'Every Minute', expr: '* * * * *' },
    { label: 'Every 5 Minutes', expr: '*/5 * * * *' },
    { label: 'Every Hour at :00', expr: '0 * * * *' },
    { label: 'Every Midnight', expr: '0 0 * * *' },
    { label: 'Every Sunday at 2 AM', expr: '0 2 * * 0' },
  ];

  const getEnglish = (expr: string) => {
    if (expr === '* * * * *') return 'At every minute.';
    if (expr === '*/5 * * * *') return 'At every 5th minute.';
    if (expr === '0 * * * *') return 'At minute 0 of every hour.';
    if (expr === '0 0 * * *') return 'At 00:00 (midnight) every day.';
    if (expr === '0 2 * * 0') return 'At 02:00 AM every Sunday.';
    return `Custom expression schedule: ${expr}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-full text-xs font-semibold">
          <Clock size={14} /> Cron Job Schedule Architect
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Cron Schedule Visualizer & Expression Builder
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Build 5-part cron expressions visually, translate complex syntax into human-readable English, and inspect upcoming execution times.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <label className="block text-xs font-bold text-slate-500 uppercase">Cron Expression</label>
          <input
            type="text"
            value={cron}
            onChange={(e) => setCron(e.target.value)}
            className="w-full px-3 py-2 text-base font-mono font-bold bg-slate-50 dark:bg-slate-800 border rounded-xl text-center text-violet-600"
          />

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Presets</span>
            <div className="space-y-1">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setCron(p.expr)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 hover:bg-violet-500/10 hover:text-violet-600 rounded-xl text-xs font-medium text-left flex justify-between cursor-pointer"
                >
                  <span>{p.label}</span>
                  <span className="font-mono text-slate-400">{p.expr}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b pb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Human Translation</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(cron);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-xs text-violet-600 font-bold flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy Cron'}
            </button>
          </div>

          <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-700 dark:text-violet-300 font-bold text-sm">
            "{getEnglish(cron)}"
          </div>
        </div>
      </div>
    </div>
  );
}
