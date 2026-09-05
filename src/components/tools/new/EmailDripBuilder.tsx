import React, { useState } from 'react';
import { Mail, Clock, Copy, Check, Plus, Trash2 } from 'lucide-react';

export function EmailDripBuilder() {
  const [emails, setEmails] = useState<Array<{ day: string; subject: string; body: string }>>([
    { day: 'Day 0 (Instant)', subject: 'Welcome to SmartToolHub! Here is your quickstart guide', body: 'Hi {{First_Name}},\n\nWelcome aboard! We are thrilled to have you here. Check out our top tools below.' },
    { day: 'Day 3', subject: '3 hidden features you missed in SmartToolHub', body: 'Hi {{First_Name}},\n\nDid you know you can bulk generate UUIDs and export custom charts in seconds?' },
    { day: 'Day 7', subject: 'How Alex saved 10 hours a week using automated utilities', body: 'Hi {{First_Name}},\n\nRead our latest case study on optimizing SaaS marketing pipelines.' },
  ]);

  const [copied, setCopied] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold">
          <Mail size={14} /> Email Automation Sequence Architect
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Email Drip Campaign Sequence Builder
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Design multi-step email onboarding and lead nurturing drip sequences with custom delay triggers, subject lines, and templates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-4">
          {emails.map((em, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <Clock size={12} /> {em.day}
                </span>
              </div>
              <input
                type="text"
                value={em.subject}
                onChange={(e) => {
                  const updated = [...emails];
                  updated[idx].subject = e.target.value;
                  setEmails(updated);
                }}
                className="w-full px-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
              <textarea
                rows={3}
                value={em.body}
                onChange={(e) => {
                  const updated = [...emails];
                  updated[idx].body = e.target.value;
                  setEmails(updated);
                }}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono"
              />
            </div>
          ))}
        </div>

        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b pb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Sequence Output</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(emails, null, 2));
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-xs text-blue-600 font-bold flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy All'}
            </button>
          </div>

          <pre className="text-xs font-mono bg-slate-950 text-blue-300 p-4 rounded-xl overflow-x-auto min-h-[300px]">
            {JSON.stringify(emails, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
