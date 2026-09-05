import React, { useState } from 'react';
import { Video, Sparkles, Copy, Check, RefreshCw, Flame, Lightbulb, PlayCircle, Hash } from 'lucide-react';
import AdSenseSlot from '../AdSenseSlot';

export default function TikTokHookGenerator() {
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('Tech & AI');
  const [tone, setTone] = useState('Controversial / Curiosity');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const niches = ['Tech & AI', 'Fitness & Health', 'Personal Finance & Crypto', 'E-commerce & Business', 'Beauty & Fashion', 'Educational & Productivity'];
  const tones = ['Controversial / Curiosity', 'Storytelling / Emotional', 'Listicle / Quick Value', 'Bold Statement / Hot Take', 'Problem-Solving'];

  const hookTemplates: Record<string, (t: string) => string[]> = {
    'Controversial / Curiosity': (t) => [
      `Stop doing ${t || 'this'} if you want actual results in 2026. Here is why...`,
      `Nobody is talking about this ${t || 'secret'} and it's secretly ruining your progress.`,
      `I tested ${t || 'this method'} for 30 days so you don't have to. Here is what happened...`,
      `99% of people fail at ${t || 'this'} because they make this one massive mistake.`,
      `Why top 1% creators never reveal how they handle ${t || 'this'}...`,
      `Are you still doing ${t || 'this'} in 2026? You are burning time and energy.`,
      `What happens when you combine ${t || 'this workflow'} with 10 minutes of focus?`,
      `This ${t || 'hack'} feels illegal to know, but here is how it actually works...`,
      `I was today years old when I learned this about ${t || 'this topic'}...`,
      `Wait until the end to see how ${t || 'this one trick'} doubles your output...`
    ],
    'Storytelling / Emotional': (t) => [
      `How I completely mastered ${t || 'this skill'} starting from absolute zero...`,
      `This one shift in ${t || 'my daily routine'} changed everything for me.`,
      `I almost gave up on ${t || 'this project'} until I discovered this hidden shortcut...`,
      `The painful truth about ${t || 'this industry'} that nobody warns you about.`,
      `If I had to start ${t || 'this journey'} all over again today, I would only do these 3 steps.`,
      `3 months ago I couldn't understand ${t || 'this'}, now I do it effortlessly. Here is how...`,
      `My honest reflection on trying ${t || 'this trend'} for a full week...`,
      `The exact moment everything clicked for me with ${t || 'this strategy'}...`
    ],
    'Listicle / Quick Value': (t) => [
      `3 free tools for ${t || 'creators'} that feel illegal to know in 2026.`,
      `5 instant hacks to improve your ${t || 'results'} in less than 60 seconds.`,
      `The exact 3-step checklist to master ${t || 'this'} without spending a dime.`,
      `Do these 4 simple things every morning to double your ${t || 'productivity'}.`,
      `Top 3 resources for ${t || 'beginners'} you need to bookmark immediately.`,
      `4 hidden features in ${t || 'this tool'} that 90% of people miss completely.`,
      `The 5-minute audit every creator needs for ${t || 'their workflow'}...`,
      `3 non-negotiable rules if you want to dominate ${t || 'this space'}...`
    ],
    'Bold Statement / Hot Take': (t) => [
      `${t || 'Traditional advice'} is dead. Here is what actually works now.`,
      `Unpopular opinion: You don't need expensive tools for ${t || 'success'}, you just need this.`,
      `If you are still struggling with ${t || 'this'}, you are working 10x harder than you need to.`,
      `Why 2026 is the easiest year to dominate ${t || 'this space'}, if you do this one thing.`,
      `Forget everything you were taught about ${t || 'this'}. Here is the modern playbook.`,
      `Stop buying courses for ${t || 'this'}. Everything you need is right here.`,
      `The biggest lie in ${t || 'this niche'} exposed in under 30 seconds...`
    ],
    'Problem-Solving': (t) => [
      `Struggling with ${t || 'low engagement'}? Here is the exact fix in 30 seconds.`,
      `How to fix ${t || 'this common error'} without losing your mind or wasting hours.`,
      `The fastest way to solve ${t || 'this problem'} even if you have zero experience.`,
      `If you hate ${t || 'complicated workflows'}, try this 1-click solution instead.`,
      `Save this video if you ever need to optimize your ${t || 'content'} on the fly.`,
      `Here is the 10-second routine that eliminates ${t || 'this issue'} forever...`,
      `If you want to master ${t || 'this'}, screenshot this workflow right now...`
    ]
  };

  const getTikTokHashtags = (t: string, n: string) => {
    const cleanT = t.toLowerCase().replace(/[^a-z0-9]/g, '') || 'viral';
    return [
      `#fyp`, `#foryou`, `#viral`, `#trending`, `#tiktok`, `#${cleanT}`,
      `#${cleanT}tok`, `#${cleanT}tips`, `#${cleanT}hacks`, `#${cleanT}life`,
      `#creator`, `#2026`, `#learnontiktok`, `#edutok`, `#lifehack`,
      `#growth`, `#mindset`, `#fypシ`, `#foryoupage`, `#viralvideo`,
      `#trendingnow`, `#explore`, `#shorts`, `#reels`, `#content`
    ];
  };

  const activeHooks = hookTemplates[tone] ? hookTemplates[tone](topic.trim()) : hookTemplates['Controversial / Curiosity'](topic.trim());

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/10 text-pink-500 rounded-full text-xs font-extrabold uppercase tracking-widest border border-pink-500/20">
          <Flame size={14} /> Viral Content Generator
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          TikTok & Short Video Hook Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Generate scroll-stopping opening hooks, video scripts, and visual cues tailored for TikTok, YouTube Shorts, and Instagram Reels to skyrocket your watch time and virality.
        </p>
      </div>

      <AdSenseSlot slot="tiktok-hook-top" />

      {/* Main Generator Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Input Controls */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-4 shadow-xs">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Video Topic or Keyword
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. AI tools, Crypto investing, Losing weight, Coding"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Niche / Industry
            </label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
            >
              {niches.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Hook Angle / Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
            >
              {tones.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-pink-500/5 dark:bg-pink-500/10 rounded-xl border border-pink-500/10 text-[11px] text-pink-600 dark:text-pink-400 space-y-1">
            <span className="font-bold block flex items-center gap-1">
              <Lightbulb size={12} /> Pro Creator Tip
            </span>
            <p className="leading-normal">
              The first 3 seconds determine 80% of video retention. Pair a strong verbal hook with a visual pattern disruptor like text on screen!
            </p>
          </div>
        </div>

        {/* Generated Hooks Output */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} className="text-pink-500" /> Scroll-Stopping Hooks ({activeHooks.length})
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Niche: {niche}
            </span>
          </div>

          <div className="space-y-3">
            {activeHooks.map((hookText, index) => (
              <div
                key={index}
                className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl hover:border-pink-500/50 transition-all flex items-start justify-between gap-3 group shadow-xs"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[9px] font-mono font-bold text-slate-600 dark:text-slate-400 rounded-md">
                    <PlayCircle size={10} className="text-pink-500" /> Hook #{index + 1}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                    "{hookText}"
                  </p>
                </div>

                <button
                  onClick={() => handleCopy(hookText, index)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                    copiedIndex === index
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-pink-500 hover:text-white hover:border-pink-500'
                  }`}
                  title="Copy Hook"
                >
                  {copiedIndex === index ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
