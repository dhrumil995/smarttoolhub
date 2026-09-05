import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Flame,
  Zap,
  Clock,
  Play,
  TrendingUp,
  Sliders,
  RefreshCw,
  Eye,
  AlertTriangle,
  Lightbulb,
  Share2,
  Tv
} from 'lucide-react';
import { motion } from 'motion/react';

interface HookOption {
  id: string;
  category: 'Curiosity Gap' | 'Contrarian Statement' | 'High-Stakes Story' | 'Visual Proof' | 'The Pain Agitator' | 'Shorts Fast-Pace';
  hookText: string;
  onScreenVisual: string;
  pacingNote: string;
  predictedRetention30s: number; // e.g. 88%
  wordCount: number;
  deliverySeconds: number;
}

export default function YTHookGenerator() {
  const [topic, setTopic] = useState('How to build and launch an AI SaaS as a solo developer');
  const [audience, setAudience] = useState('Beginner to intermediate programmers and indie hackers');
  const [format, setFormat] = useState<'longform' | 'shorts'>('longform');
  const [tone, setTone] = useState<'urgent' | 'shocking' | 'educational' | 'storyteller'>('shocking');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Teleprompter rehearsal state
  const [activeTeleprompter, setActiveTeleprompter] = useState<string | null>(null);
  const [timerCount, setTimerCount] = useState(0);
  const [isTiming, setIsTiming] = useState(false);

  const generatedHooks: HookOption[] = useMemo(() => {
    const cleanTopic = topic.trim() || 'your chosen topic';
    
    if (format === 'shorts') {
      return [
        {
          id: 'h-1',
          category: 'Shorts Fast-Pace',
          hookText: `Stop building full-stack apps the old way in 2026. If you're still writing boilerplate APIs manually, you are wasting 80% of your time. Here is the 10-minute setup top engineers actually use.`,
          onScreenVisual: `Fast zoom on screen showing 500 lines of code getting generated in 3 seconds. Bold yellow subtitle: "STOP DOING THIS"`,
          pacingNote: `0.0s - Cut directly on first word with zero intro music pause.`,
          predictedRetention30s: 94,
          wordCount: 38,
          deliverySeconds: 9,
        },
        {
          id: 'h-2',
          category: 'Contrarian Statement',
          hookText: `Most advice about ${cleanTopic} is completely backwards. 95% of creators fail because they focus on features instead of distribution. Watch this before spending another dollar.`,
          onScreenVisual: `Host looking directly into camera with red alert overlay & sound effect.`,
          pacingNote: `Deliver with high energy and immediate hand gesture emphasis.`,
          predictedRetention30s: 91,
          wordCount: 30,
          deliverySeconds: 8,
        },
        {
          id: 'h-3',
          category: 'Curiosity Gap',
          hookText: `I tried ${cleanTopic} for 30 straight days—and the results completely shocked me. By day 14, something unexpected happened that changed everything.`,
          onScreenVisual: `Rapid B-roll split screen with calendar ticking from Day 1 to Day 30.`,
          pacingNote: `Create suspense in voice tone before the day 14 reveal.`,
          predictedRetention30s: 89,
          wordCount: 26,
          deliverySeconds: 7,
        },
      ];
    }

    return [
      {
        id: 'h-4',
        category: 'Curiosity Gap',
        hookText: `What if I told you that everything you've been taught about ${cleanTopic} is completely outdated? In this video, I'm pulling back the curtain on the exact blueprint that took me from zero to fully launched in under 7 days.`,
        onScreenVisual: `Dramatic B-roll intro showing real dashboard metrics with private numbers blurred, cutting to a high-contrast title card.`,
        pacingNote: `Speak with authoritative, deliberate pacing (140-150 words/min).`,
        predictedRetention30s: 88,
        wordCount: 44,
        deliverySeconds: 14,
      },
      {
        id: 'h-5',
        category: 'The Pain Agitator',
        hookText: `The single biggest mistake people make with ${cleanTopic} isn't lack of time or budget—it's overcomplicating step one. If you've been feeling stuck, this video is designed to fix that in the next 12 minutes.`,
        onScreenVisual: `Quick visual of common failed attempts/frustration on screen, immediately transitioning to a clean solution diagram.`,
        pacingNote: `Hook the exact pain point within the first 6 seconds.`,
        predictedRetention30s: 85,
        wordCount: 40,
        deliverySeconds: 13,
      },
      {
        id: 'h-6',
        category: 'High-Stakes Story',
        hookText: `Two years ago, I had zero experience with ${cleanTopic}. I lost $4,000 trying every generic tutorial online. But then I discovered one unconventional framework that changed my entire trajectory.`,
        onScreenVisual: `Authentic screenshot or archival photo from 2 years ago, moving into dynamic modern workspace.`,
        pacingNote: `Personal vulnerability establishes immediate viewer empathy.`,
        predictedRetention30s: 87,
        wordCount: 35,
        deliverySeconds: 12,
      },
      {
        id: 'h-7',
        category: 'Visual Proof',
        hookText: `Look at this screen right now. This live system was built 100% using ${cleanTopic}. No fluff, no sponsored bias—let's break down step-by-step how you can replicate this exact setup today.`,
        onScreenVisual: `Instant live screen recording with mouse cursor highlighting working output in first 3 seconds.`,
        pacingNote: `Zero monologue: immediate visual proof within 2 seconds.`,
        predictedRetention30s: 92,
        wordCount: 37,
        deliverySeconds: 11,
      },
    ];
  }, [topic, audience, format, tone]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Tool Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-red-500/20">
                YouTube Retention Studio
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[10px] font-bold">
                0-30s Hook Engine
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              YouTube Video Hook & Retention Studio
              <Flame className="text-red-500 fill-red-500" size={20} />
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Prevent viewer drop-off with psychological opening hooks designed for maximum 30-second retention, high audience engagement, and Shorts virality.
            </p>
          </div>
        </div>

        {/* Input Parameters Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="md:col-span-2 space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Your Video Topic / Working Title *
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. How I built a $10k/month micro-SaaS with zero funding"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Target Viewer / Niche Demographic
              </label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Early-stage startup founders, freelance designers, students"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Video Format & Platform
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormat('longform')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    format === 'longform'
                      ? 'bg-red-600 border-red-600 text-white shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Long-Form (16:9)
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('shorts')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    format === 'shorts'
                      ? 'bg-red-600 border-red-600 text-white shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Shorts / Reels (9:16)
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Hook Tone Strategy
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <option value="shocking">Shocking / Contrarian (Highest CTR)</option>
                <option value="urgent">Urgent / Time-Sensitive</option>
                <option value="educational">Authority / Tutorial Proof</option>
                <option value="storyteller">High-Stakes Personal Story</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Hooks Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="text-amber-500" size={18} />
            High-Retention Opening Hooks ({generatedHooks.length})
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Optimized for 0s - 30s Retention Curve
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {generatedHooks.map((h, idx) => (
            <div
              key={h.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-red-500/50 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 font-mono text-[10px] font-bold">
                    {h.category}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    <TrendingUp size={13} />
                    <span>{h.predictedRetention30s}% Est. 30s Retention</span>
                  </div>
                </div>

                {/* Spoken Script */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/70 dark:border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block mb-1 uppercase font-bold">
                    Spoken Script (~{h.deliverySeconds} seconds)
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                    "{h.hookText}"
                  </p>
                </div>

                {/* Visual Cue & Subtitles */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                    <Tv size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">On-Screen Action:</strong> {h.onScreenVisual}
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
                    <Lightbulb size={13} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong>Pacing Tip:</strong> {h.pacingNote}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="text-[11px] font-mono text-slate-400">
                  {h.wordCount} words • ~{h.deliverySeconds}s
                </div>

                <button
                  onClick={() => handleCopy(h.id, h.hookText)}
                  className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  {copiedId === h.id ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedId === h.id ? 'Copied Script' : 'Copy Script'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Educational Retention Curve Guide */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950/20 via-slate-900 to-indigo-950/20 border border-red-900/30 text-xs text-slate-300 space-y-2">
        <h3 className="font-bold text-white flex items-center gap-2">
          <TrendingUp className="text-red-400" size={16} />
          Why the First 30 Seconds Determines 80% of YouTube Impressions
        </h3>
        <p className="leading-relaxed text-slate-400">
          YouTube's recommendation algorithm evaluates early abandonment rate. If more than 35% of viewers leave before 0:30, the video rarely enters Home Browse or Suggested Feeds. Opening with a clear curiosity gap and visual proof keeps retention above the 70% threshold.
        </p>
      </div>
    </div>
  );
}
