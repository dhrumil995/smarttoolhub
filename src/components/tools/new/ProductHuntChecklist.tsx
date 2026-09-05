import React, { useState } from 'react';
import { Rocket, CheckSquare, Copy, Check, Sparkles, Image } from 'lucide-react';

export function ProductHuntChecklist() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Prepare 240x240 GIF Logo / Icon', done: true, phase: 'T-14 Days' },
    { id: 2, title: 'Craft 60-character tagline with value proposition', done: true, phase: 'T-14 Days' },
    { id: 3, title: 'Design 5 gallery screenshots (1270x760 px)', done: false, phase: 'T-7 Days' },
    { id: 4, title: 'Write Maker Comment describing the journey and special promo', done: false, phase: 'T-3 Days' },
    { id: 5, title: 'Launch at 12:01 AM PST (Midnight Pacific Time)', done: false, phase: 'Launch Day' },
    { id: 6, title: 'Post launch announcement to X, LinkedIn, and email list', done: false, phase: 'Launch Day' },
  ]);

  const [copiedPitch, setCopiedPitch] = useState(false);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const completedCount = tasks.filter(t => t.done).length;
  const progressPct = Math.round((completedCount / tasks.length) * 100);

  const hunterPitch = `Hi [Hunter Name],\n\nWe are launching SmartToolHub on Product Hunt next Tuesday at 12:01 AM PST! SmartToolHub provides 100+ free client-side developer and SEO tools with zero paywalls.\n\nWould you be open to hunting our launch? Here is the preview link: https://producthunt.com/upcoming/smarttoolhub\n\nBest,\n[Your Name]`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full text-xs font-semibold">
          <Rocket size={14} /> Product Launch Preparation Kit
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Product Hunt Launch Checklist & Kit
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Master your Product Hunt launch with step-by-step timelines, Hunter outreach pitch templates, and asset dimension guides.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase">Interactive Timeline Checklist</span>
            <span className="text-xs font-extrabold text-orange-600">{progressPct}% Complete</span>
          </div>

          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div style={{ width: `${progressPct}%` }} className="h-full bg-orange-500 transition-all" />
          </div>

          <div className="space-y-2 pt-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  task.done ? 'bg-orange-500/10 border-orange-500/30 text-slate-800 dark:text-slate-200' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                  task.done ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-400'
                }`}>
                  {task.done && <Check size={12} />}
                </div>
                <div className="flex-1 text-xs font-medium">
                  {task.title}
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
                  {task.phase}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hunter Pitch Generator */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Hunter Outreach Pitch</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(hunterPitch);
                setCopiedPitch(true);
                setTimeout(() => setCopiedPitch(false), 2000);
              }}
              className="text-xs text-orange-600 font-bold flex items-center gap-1 cursor-pointer"
            >
              {copiedPitch ? <Check size={12} /> : <Copy size={12} />} {copiedPitch ? 'Copied' : 'Copy Pitch'}
            </button>
          </div>

          <pre className="text-xs font-sans whitespace-pre-wrap bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border text-slate-800 dark:text-slate-300">
            {hunterPitch}
          </pre>
        </div>
      </div>
    </div>
  );
}
