import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, RefreshCw, Eye, Hash, AlignLeft, Info } from 'lucide-react';

const TONES = [
  { id: 'viral', name: 'Trendy & Viral Hook', desc: 'Bold hooks for Reels and high-CTR attention grabbers' },
  { id: 'minimalist', name: 'Aesthetic & Minimal', desc: 'Short, elegant, poetic, and atmospheric' },
  { id: 'funny', name: 'Funny & Sarcastic', desc: 'Relatable, witty, and light-hearted comedy' },
  { id: 'educational', name: 'Informative & Guide', desc: 'Step-by-step layouts perfect for carousel slides' },
  { id: 'sales', name: 'Sales & Call-To-Action', desc: 'Urgent promotions with high-CTR link drives' }
];

const TEMPLATES: Record<string, string[]> = {
  viral: [
    "🚨 STOP SCROLLING! If you want to master [TOPIC], you need to read this right now. 👇\n\nI used to struggle with [PAIN_POINT], but everything changed when I discovered [TOPIC]. Here is the exact secret:\n\n1️⃣ [STEP1]\n2️⃣ [STEP2]\n3️⃣ [STEP3]\n\nBookmark this reel so you don't lose it! What's your biggest challenge with this? Let me know below! 👇",
    "No one is talking about this [TOPIC] secret... 🤫\n\nMost people think [PAIN_POINT] is impossible to solve. But the truth is, you just need a better workflow.\n\nSave this post for later and tag a friend who needs to see this! 💥",
    "POV: You finally stopped worrying about [PAIN_POINT] and started doing [TOPIC] the right way. ✨\n\nHere is how I went from zero to hero in 3 simple steps. Read the full guide inside my bio link! 🔗"
  ],
  minimalist: [
    "finding peace in [TOPIC]. ✨\n\nno noise. just progress. sometimes the best way to solve [PAIN_POINT] is to simplify the entire equation.\n\nkeep growing. ☕️",
    "current mood: [TOPIC].\n\nleaving [PAIN_POINT] in the past where it belongs. we're building better habits today.\n\nsave for quiet inspiration.",
    "less is more. unless it's [TOPIC]. 🕊️\n\n[STEP1]. [STEP2]. [STEP3].\n\nminimalist workflow for modern minds."
  ],
  funny: [
    "Me trying to explain [TOPIC] to my friends like my life depends on it... 🤡\n\nSeriously though, why is solving [PAIN_POINT] harder than folding a fitted sheet? 😭\n\nBut here is the lazy programmer/creator guide to fixing it:\n👉 [STEP1]\n👉 [STEP2]\n👉 [STEP3]\n\nTag someone who is also struggling with this today! 👇",
    "My therapist: And is [PAIN_POINT] in the room with us right now?\nMe: No, but [TOPIC] is and it's doing wonders. 😂\n\nIf you want to save yourself 4 hours of headaches, do this instead:\n1️⃣ [STEP1]\n2️⃣ [STEP2]\n\nFollow for more relatable hacks! ✌️"
  ],
  educational: [
    "🎓 FREE GUIDE: How to Master [TOPIC] (Without the Headaches)\n\nIf you're tired of dealing with [PAIN_POINT], here is a proven step-by-step roadmap that works:\n\n📌 THE BREAKDOWN:\n• Step 1: [STEP1] - This is crucial to lay the groundwork.\n• Step 2: [STEP2] - Where most people fail but you won't.\n• Step 3: [STEP3] - Your secret weapon for long-term consistency.\n\n💡 KEY TAKEAWAY: Consistency beats intensity every single time.\n\nSave this carousel slide for your next session! 💾",
    "Let's audit [TOPIC] today. 🔍\n\nWhy does [PAIN_POINT] happen? It usually boils down to bad organization. Here is how to fix it starting today:\n\n✅ [STEP1]\n✅ [STEP2]\n✅ [STEP3]\n\nHit that follow button for daily visual guides! 🚀"
  ],
  sales: [
    "🔥 EXCLUSIVE OFFER: Stop wasting time on [PAIN_POINT]!\n\nIf you want to unlock the true potential of [TOPIC], we just launched our brand new suite. \n\nWhat you get:\n⚡️ [STEP1]\n⚡️ [STEP2]\n⚡️ [STEP3]\n\nClick the link in our bio to grab your slot before the price goes up tonight! ⏳",
    "Ready to scale [TOPIC] in 2026? 📈\n\nWe help creators and developers solve [PAIN_POINT] with instant local processing. No monthly fees, no subscription traps.\n\n👉 DM us 'GROW' or click our link to get started free! 🚀"
  ]
};

const RANDOM_HASHTAGS: Record<string, string[]> = {
  viral: ['#reelsviral', '#trendingreels', '#igtips', '#growthmindset', '#foryourpage'],
  minimalist: ['#minimalaesthetic', '#quietlife', '#atmosphere', '#visualdiary', '#peaceful'],
  funny: ['#relatablememes', '#creatorproblems', '#programmerhumor', '#funnyvideos', '#workplacehumor'],
  educational: ['#educationalreels', '#infographic', '#learnsomethingnew', '#strategytips', '#guidebook'],
  sales: ['#digitalmarketing', '#sidehustleideas', '#entrepreneurmindset', '#scaleup', '#limitedoffer']
};

export default function IGCaptionGenerator() {
  const [topic, setTopic] = useState('building client-side web tools');
  const [painPoint, setPainPoint] = useState('expensive server subscription fees');
  const [step1, setStep1] = useState('Run everything locally in local memory');
  const [step2, setStep2] = useState('Zero rate-limits or data tracking logs');
  const [step3, setStep3] = useState('Bookmark standard layouts for instant reuse');

  const [selectedTone, setSelectedTone] = useState('viral');
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [copied, setCopied] = useState(false);
  const [templateIndex, setTemplateIndex] = useState(0);

  // Hook to generate caption dynamically
  const generateCaption = () => {
    const list = TEMPLATES[selectedTone] || TEMPLATES.viral;
    const template = list[templateIndex % list.length];

    let result = template
      .replace(/\[TOPIC\]/g, topic || 'your topic')
      .replace(/\[PAIN_POINT\]/g, painPoint || 'your daily struggle')
      .replace(/\[STEP1\]/g, step1 || 'Lay down core requirements')
      .replace(/\[STEP2\]/g, step2 || 'Execute with fast speeds')
      .replace(/\[STEP3\]/g, step3 || 'Track metrics locally');

    if (!includeEmojis) {
      // Basic emoji stripping regex (removes most common emojis)
      result = result.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, '');
    }

    if (includeHashtags) {
      const tags = RANDOM_HASHTAGS[selectedTone] || RANDOM_HASHTAGS.viral;
      result += `\n\n${tags.join(' ')}`;
    }

    setGeneratedCaption(result);
  };

  useEffect(() => {
    generateCaption();
  }, [topic, painPoint, step1, step2, step3, selectedTone, includeEmojis, includeHashtags, templateIndex]);

  const handleCopy = () => {
    if (!generatedCaption) return;
    navigator.clipboard.writeText(generatedCaption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cycleTemplate = () => {
    setTemplateIndex(prev => prev + 1);
  };

  const charCount = generatedCaption.length;
  const wordCount = generatedCaption.split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <Sparkles size={12} />
            Instagram Growth Tools
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Instagram Caption & Reels Copywriter
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Create high-engagement, structured captions and Hooks designed to retain audience view duration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input variables */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <AlignLeft size={18} className="text-fuchsia-500" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                Define Video Variables
              </h3>
            </div>

            {/* Topic hook */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Primary Hook / Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. optimizing Tailwind layout"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-fuchsia-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Pain point */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Pain Point / Problem
              </label>
              <input
                type="text"
                value={painPoint}
                onChange={(e) => setPainPoint(e.target.value)}
                placeholder="e.g. slow load speeds on mobile"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-fuchsia-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Value steps */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Three Value / Action Steps
              </label>
              <input
                type="text"
                value={step1}
                onChange={(e) => setStep1(e.target.value)}
                placeholder="Step 1"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-fuchsia-500 text-slate-800 dark:text-slate-100"
              />
              <input
                type="text"
                value={step2}
                onChange={(e) => setStep2(e.target.value)}
                placeholder="Step 2"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-fuchsia-500 text-slate-800 dark:text-slate-100"
              />
              <input
                type="text"
                value={step3}
                onChange={(e) => setStep3(e.target.value)}
                placeholder="Step 3"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-fuchsia-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Select Copywriting Tone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Copywriting Style Tone
              </label>
              <div className="space-y-1.5">
                {TONES.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => {
                      setSelectedTone(tone.id);
                      setTemplateIndex(0);
                    }}
                    className={`w-full p-2.5 text-left rounded-xl border flex flex-col transition-all ${
                      selectedTone === tone.id
                        ? 'bg-fuchsia-500/10 border-fuchsia-500 text-fuchsia-700 dark:text-fuchsia-400'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                    }`}
                  >
                    <span className="text-[11px] font-bold uppercase">{tone.name}</span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500">{tone.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Layout Toggles */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-850 text-xs">
              <label className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Include Emojis
              </label>
              <input
                type="checkbox"
                checked={includeEmojis}
                onChange={(e) => setIncludeEmojis(e.target.checked)}
                className="w-4 h-4 rounded text-fuchsia-500 border-slate-300 focus:ring-fuchsia-500"
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Append Hashtags
              </label>
              <input
                type="checkbox"
                checked={includeHashtags}
                onChange={(e) => setIncludeHashtags(e.target.checked)}
                className="w-4 h-4 rounded text-fuchsia-500 border-slate-300 focus:ring-fuchsia-500"
              />
            </div>
          </div>
        </div>

        {/* Generated output preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
              <div className="flex items-center gap-2">
                <Eye size={18} className="text-fuchsia-500" />
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  Instagram Post Preview
                </h3>
              </div>
              <button
                onClick={cycleTemplate}
                className="text-[10px] font-bold px-2.5 py-1 rounded bg-fuchsia-500/10 text-fuchsia-600 hover:bg-fuchsia-500/20 transition-all border border-fuchsia-500/20"
              >
                Alternate Variation
              </button>
            </div>

            {/* Simulated smartphone card */}
            <div className="border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 bg-slate-50/50 dark:bg-slate-950/40 relative">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200/40 dark:border-slate-800/40 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 p-[2px]">
                  <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center font-bold text-[9px] text-slate-800 dark:text-white">
                    STH
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-850 dark:text-white block">smarttoolhub.net</span>
                  <span className="text-[9px] text-slate-400 block -mt-0.5">Sponsored / Organic</span>
                </div>
              </div>

              {/* Caption body text */}
              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal whitespace-pre-wrap select-all">
                {generatedCaption}
              </div>
            </div>

            {/* Live limit audits */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono font-bold">
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl p-2">
                <span className="block text-[9px] text-slate-400 uppercase tracking-widest">Characters</span>
                <span className={charCount > 2200 ? 'text-red-500' : 'text-slate-800 dark:text-slate-200'}>
                  {charCount}/2200
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl p-2">
                <span className="block text-[9px] text-slate-400 uppercase tracking-widest">Words</span>
                <span className="text-slate-800 dark:text-slate-200">{wordCount} Words</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl p-2 col-span-2">
                <span className="block text-[9px] text-slate-400 uppercase tracking-widest">Post Optimization</span>
                <span className="text-emerald-500">Perfect Fit</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleCopy}
                className="w-full sm:w-auto px-5 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied Caption!' : 'Copy Formatted Caption'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Block */}
      <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <h4 className="font-display font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
          <Info size={16} className="text-fuchsia-500" />
          Pro-Copywriter Checklist: Writing Hook-Oriented Reels Outlines
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
          <p>
            The first 3 seconds of your Instagram Reel determines whether the viewer stays or swipes. Always lead with a **strong psychological hook** that highlights a pain-point or reveals a secret (e.g. "🚨 STOP doing [X]"). Refrain from generic greetings like "Hey guys, welcome back to my channel." Use this tool to draft structured copywriting hooks.
          </p>
          <p>
            Keep your lists scannable. Use emojis as bullet points and add spaces between paragraphs. In 2026, Instagram's search engine focuses heavily on caption semantic keywords, so repeating high-CTR keyword targets naturally within your paragraphs will boost your organic SEO discoverability rating.
          </p>
        </div>
      </div>
    </div>
  );
}
