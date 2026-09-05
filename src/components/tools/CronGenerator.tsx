import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Clock, Sparkles } from 'lucide-react';

export const CronGenerator: React.FC = () => {
  const [minute, setMinute] = useState<string>('0');
  const [hour, setHour] = useState<string>('12');
  const [dayOfMonth, setDayOfMonth] = useState<string>('*');
  const [month, setMonth] = useState<string>('*');
  const [dayOfWeek, setDayOfWeek] = useState<string>('*');
  const [copied, setCopied] = useState<boolean>(false);

  const cronExpression = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;

  const presets = [
    { label: 'Every Minute', expr: ['*', '*', '*', '*', '*'] },
    { label: 'Every 5 Minutes', expr: ['*/5', '*', '*', '*', '*'] },
    { label: 'Every Hour', expr: ['0', '*', '*', '*', '*'] },
    { label: 'Every Day at Midnight', expr: ['0', '0', '*', '*', '*'] },
    { label: 'Every Day at 12 PM (Noon)', expr: ['0', '12', '*', '*', '*'] },
    { label: 'Every Sunday at Midnight', expr: ['0', '0', '*', '*', '0'] },
    { label: '1st of Every Month at Midnight', expr: ['0', '0', '1', '*', '*'] },
  ];

  const applyPreset = (expr: string[]) => {
    setMinute(expr[0]);
    setHour(expr[1]);
    setDayOfMonth(expr[2]);
    setMonth(expr[3]);
    setDayOfWeek(expr[4]);
  };

  const getHumanExplanation = (): string => {
    if (cronExpression === '* * * * *') return 'Runs every single minute.';
    if (minute === '*/5' && hour === '*') return 'Runs every 5 minutes.';
    if (minute === '0' && hour === '*') return 'Runs at minute 0 of every hour.';
    if (minute === '0' && hour === '0' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') return 'Runs every day at 00:00 (Midnight).';
    if (minute === '0' && hour === '12' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') return 'Runs every day at 12:00 PM (Noon).';
    if (minute === '0' && hour === '0' && dayOfWeek === '0') return 'Runs every Sunday at 00:00 (Midnight).';
    if (minute === '0' && hour === '0' && dayOfMonth === '1') return 'Runs on the 1st of every month at 00:00.';
    
    return `Runs at minute (${minute}), hour (${hour}), day-of-month (${dayOfMonth}), month (${month}), day-of-week (${dayOfWeek}).`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cronExpression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Output */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-400 block mb-1">
              Generated Cron Expression
            </span>
            <div className="text-3xl font-mono font-black tracking-wider text-emerald-400">
              {cronExpression}
            </div>
          </div>

          <button
            onClick={copyToClipboard}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-all self-start sm:self-auto text-xs"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied Expression!' : 'Copy Cron Syntax'}
          </button>
        </div>

        <div className="pt-3 border-t border-slate-800 text-xs font-medium text-slate-300 flex items-center gap-2">
          <Clock size={16} className="text-amber-400 shrink-0" />
          <span>{getHumanExplanation()}</span>
        </div>
      </div>

      {/* Presets */}
      <div className="space-y-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 block">
          Popular Cron Presets
        </span>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p.expr)}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-all cursor-pointer border border-slate-200/60 dark:border-slate-700"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Schedule Builder Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Minute */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-900 dark:text-white block">Minute (0-59)</label>
          <input
            type="text"
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            className="w-full p-2 bg-slate-50 dark:bg-slate-950 font-mono text-sm border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
          />
          <span className="text-[10px] text-slate-400 block">e.g. *, 0, */5, 15,30</span>
        </div>

        {/* Hour */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-900 dark:text-white block">Hour (0-23)</label>
          <input
            type="text"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            className="w-full p-2 bg-slate-50 dark:bg-slate-950 font-mono text-sm border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
          />
          <span className="text-[10px] text-slate-400 block">e.g. *, 12, 0, */2</span>
        </div>

        {/* Day of Month */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-900 dark:text-white block">Day of Month (1-31)</label>
          <input
            type="text"
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(e.target.value)}
            className="w-full p-2 bg-slate-50 dark:bg-slate-950 font-mono text-sm border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
          />
          <span className="text-[10px] text-slate-400 block">e.g. *, 1, 15, L</span>
        </div>

        {/* Month */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-900 dark:text-white block">Month (1-12)</label>
          <input
            type="text"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full p-2 bg-slate-50 dark:bg-slate-950 font-mono text-sm border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
          />
          <span className="text-[10px] text-slate-400 block">e.g. *, 1-6, 12</span>
        </div>

        {/* Day of Week */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-900 dark:text-white block">Day of Week (0-6)</label>
          <input
            type="text"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
            className="w-full p-2 bg-slate-50 dark:bg-slate-950 font-mono text-sm border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
          />
          <span className="text-[10px] text-slate-400 block">0=Sun, 1=Mon, 6=Sat</span>
        </div>
      </div>
    </div>
  );
};
