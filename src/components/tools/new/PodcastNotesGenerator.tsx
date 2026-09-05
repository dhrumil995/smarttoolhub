import React, { useState } from 'react';
import { Mic, Sparkles, Copy, Check, FileText } from 'lucide-react';

export function PodcastNotesGenerator() {
  const [transcript, setTranscript] = useState('In this episode, we chat with Sarah Connor about scaling AI engineering teams in 2026, avoiding burnout, and why full-stack developers should learn prompt engineering...');
  const [isGenerating, setIsGenerating] = useState(false);
  const [notes, setNotes] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const generateNotes = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setNotes({
        title: "Ep. 42: How to Scale AI Engineering Teams in 2026 with Sarah Connor",
        summary: "In this episode, Sarah Connor shares key strategies for managing high-velocity AI engineering workflows, integrating automated evaluation pipelines, and staying ahead in modern web development.",
        timestamps: [
          { time: "0:00", topic: "Introduction & Sarah's Background" },
          { time: "4:15", topic: "The Shift to Agentic Workflows in 2026" },
          { time: "12:30", topic: "Building Quality Evaluation Pipelines for AI Models" },
          { time: "22:00", topic: "Rapid Fire Q&A & Key Takeaways" }
        ],
        keyQuotes: [
          `"Developers who leverage autonomous coding agents will build 10x faster than traditional teams."`
        ]
      });
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-xs font-semibold">
          <Mic size={14} /> Podcast Audio & Show Note AI
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Podcast Show Notes & SEO Metadata Generator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Transform raw podcast transcripts into SEO-optimized show notes, timestamped chapter breakdowns, and Spotify/Apple Podcasts descriptions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <label className="block text-xs font-bold text-slate-500 uppercase">Episode Transcript / Summary</label>
          <textarea
            rows={6}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
          />
          <button
            onClick={generateNotes}
            disabled={isGenerating}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles size={16} /> {isGenerating ? 'Drafting Show Notes...' : 'Generate Show Notes'}
          </button>
        </div>

        <div className="lg:col-span-7">
          {notes ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 text-xs">
              <div className="flex justify-between items-center border-b pb-3">
                <span className="font-bold text-slate-400 uppercase">Generated Show Notes</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(notes, null, 2));
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-xs text-purple-600 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy Notes'}
                </button>
              </div>

              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{notes.title}</h3>
              <p className="text-slate-600 dark:text-slate-300">{notes.summary}</p>

              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase">Timestamps</span>
                {notes.timestamps.map((ts: any, i: number) => (
                  <div key={i} className="flex gap-2">
                    <span className="font-mono text-purple-600 font-bold">{ts.time}</span>
                    <span>- {ts.topic}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[280px] bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <Mic size={36} className="mb-2 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-semibold">Paste an episode summary to format show notes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
