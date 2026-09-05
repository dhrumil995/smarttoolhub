import React, { useState, useEffect } from 'react';
import { UserCheck, Copy, Check, Sparkles, AlertCircle, Info, RefreshCw } from 'lucide-react';

const BIO_PRESETS = [
  {
    id: 'developer',
    name: 'Tech / Developer',
    inputs: {
      name: 'John Doe | Full Stack Dev',
      tagline: 'Building elegant client-side solutions',
      achievement: 'Creator of open-source utilities',
      cta: 'Get free templates below 👇',
    }
  },
  {
    id: 'creator',
    name: 'Influencer / Creator',
    inputs: {
      name: 'Jane Smith | Digital Artist',
      tagline: 'Expressing ideas through vector & 3D art',
      achievement: 'Weekly tutorials & creative tips',
      cta: 'Check my latest design reel 🎨👇',
    }
  },
  {
    id: 'fitness',
    name: 'Fitness & Coach',
    inputs: {
      name: 'Alex | Fit Coach',
      tagline: 'Transforming mind & body from home',
      achievement: '10,000+ lives changed offline',
      cta: 'Join my free 7-day challenge 👇',
    }
  },
  {
    id: 'minimalist',
    name: 'Aesthetic / Minimalist',
    inputs: {
      name: 'hannah.style',
      tagline: 'quiet moments • soft tones • conscious living',
      achievement: 'curating cozy corners daily',
      cta: 'my favorites link below',
    }
  },
  {
    id: 'entrepreneur',
    name: 'Founder / Entrepreneur',
    inputs: {
      name: 'Robert | CEO at Startup',
      tagline: 'Helping early startups scale organically',
      achievement: 'Inc. 500 founder & speaker',
      cta: 'Claim your free audit report 👇',
    }
  }
];

// Character mapping for fancy fonts
const FANCY_FONTS: Record<string, (text: string) => string> = {
  normal: (t) => t,
  serifBold: (text) => {
    const normal = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fancy = "𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙";
    return text.split('').map(c => {
      const idx = normal.indexOf(c);
      return idx > -1 ? fancy.substring(idx * 2, idx * 2 + 2) : c;
    }).join('');
  },
  cursive: (text) => {
    const normal = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fancy = "𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩";
    return text.split('').map(c => {
      const idx = normal.indexOf(c);
      return idx > -1 ? fancy.substring(idx * 2, idx * 2 + 2) : c;
    }).join('');
  },
  monospace: (text) => {
    const normal = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const fancy = "𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿";
    return text.split('').map(c => {
      const idx = normal.indexOf(c);
      return idx > -1 ? fancy.substring(idx * 2, idx * 2 + 2) : c;
    }).join('');
  },
  gothic: (text) => {
    const normal = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fancy = "𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷𝔄𝔅𝔄𝔇𝔈𝔉𝔊𝔏𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔𝔖𝔗𝔘𝔙𝔚𝔛𝔜frame";
    // basic gothic font replacement, fallback index
    return text.split('').map(c => {
      const idx = normal.indexOf(c);
      return idx > -1 ? fancy.substring(idx * 2, idx * 2 + 2) : c;
    }).join('');
  }
};

export default function IGBioGenerator() {
  const [name, setName] = useState('Dhrumil | Social Growth');
  const [tagline, setTagline] = useState('Curating clean design systems & client-side tools');
  const [achievement, setAchievement] = useState('Scaling websites organically to 100k views');
  const [cta, setCta] = useState('Explore free utilities below 👇');
  const [fontStyle, setFontStyle] = useState('normal');

  const [generatedBio, setGeneratedBio] = useState('');
  const [copied, setCopied] = useState(false);

  const applyPreset = (presetId: string) => {
    const preset = BIO_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setName(preset.inputs.name);
      setTagline(preset.inputs.tagline);
      setAchievement(preset.inputs.achievement);
      setCta(preset.inputs.cta);
    }
  };

  const handleReset = () => {
    setName('');
    setTagline('');
    setAchievement('');
    setCta('');
    setFontStyle('normal');
  };

  // Compile the final bio representation
  useEffect(() => {
    const formatter = FANCY_FONTS[fontStyle] || FANCY_FONTS.normal;
    
    const formattedName = formatter(name.trim());
    const formattedTagline = tagline.trim() ? `✨ ${tagline.trim()}` : '';
    const formattedAchievement = achievement.trim() ? `🏆 ${achievement.trim()}` : '';
    const formattedCta = cta.trim() ? `${cta.trim()}` : '';

    const lines = [
      formattedName,
      formattedTagline,
      formattedAchievement,
      formattedCta
    ].filter(Boolean);

    setGeneratedBio(lines.join('\n'));
  }, [name, tagline, achievement, cta, fontStyle]);

  const handleCopy = () => {
    if (!generatedBio) return;
    navigator.clipboard.writeText(generatedBio);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bioLength = generatedBio.length;
  const isOverLimit = bioLength > 150;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <UserCheck size={12} />
            Instagram Growth Tools
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Instagram Bio Generator Pro
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Structure high-converting profile bios with styling hooks, professional layout presets, and character validation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls block */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xs">
            {/* Presets */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Load Quick Template Preset
              </label>
              <div className="flex flex-wrap gap-1.5">
                {BIO_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset.id)}
                    className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 transition-all"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-850 pt-3">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Profile Parameters
              </h4>
              <button
                onClick={handleReset}
                className="text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear Fields
              </button>
            </div>

            {/* Inputs list */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Profile Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe | Web Developer"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-fuchsia-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mission / Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Helping you code without limits"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-fuchsia-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Achievement / Authority</label>
                <input
                  type="text"
                  value={achievement}
                  onChange={(e) => setAchievement(e.target.value)}
                  placeholder="e.g. 50k+ active developers monthly"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-fuchsia-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Call To Action (CTA)</label>
                <input
                  type="text"
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  placeholder="e.g. Download 100% free presets 👇"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-fuchsia-500 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Fancy Font Selector */}
            <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-850 pt-3">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Fancy Name Font Style
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'normal', name: 'Normal Standard' },
                  { id: 'serifBold', name: 'Serif Bold 𝐚𝐛𝐜' },
                  { id: 'cursive', name: 'Cursive Style 𝓪𝓫𝓬' },
                  { id: 'monospace', name: 'Monospace 𝚊𝚋𝚌' },
                ].map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setFontStyle(style.id)}
                    className={`px-3 py-2 text-left rounded-xl border text-[10px] font-medium transition-all ${
                      fontStyle === style.id
                        ? 'bg-fuchsia-500 border-fuchsia-500 text-white shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                    }`}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Output section */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <Sparkles size={18} className="text-fuchsia-500" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                Instagram Bio Profile Simulator
              </h3>
            </div>

            {/* Profile simulator layout */}
            <div className="border border-slate-150 dark:border-slate-800/80 rounded-2xl p-5 bg-slate-50/50 dark:bg-slate-950/40 space-y-4">
              {/* Profile Top bar */}
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center border border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500 font-mono text-[10px] font-bold">
                  NO PHOTO
                </div>
                <div className="flex gap-6 text-center text-xs">
                  <div>
                    <span className="block font-bold text-slate-800 dark:text-white">128</span>
                    <span className="text-[10px] text-slate-400">posts</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-800 dark:text-white">4,812</span>
                    <span className="text-[10px] text-slate-400">followers</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-800 dark:text-white">356</span>
                    <span className="text-[10px] text-slate-400">following</span>
                  </div>
                </div>
              </div>

              {/* Bio block */}
              <div className="space-y-1">
                <div className="text-xs text-slate-850 dark:text-white font-bold leading-normal whitespace-pre-wrap">
                  {generatedBio || 'Empty profile bio. Enter details on the left.'}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:underline">
                  https://smarttoolhub.net/link
                </div>
              </div>

              {/* Action tabs */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold pt-2 border-t border-slate-200/40 dark:border-slate-800/40">
                <div className="py-2 rounded-lg bg-slate-200/50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Follow
                </div>
                <div className="py-2 rounded-lg bg-slate-200/50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Message
                </div>
              </div>
            </div>

            {/* Character length validation panel */}
            <div className={`p-4 rounded-xl border flex items-start gap-2.5 text-xs ${
              isOverLimit 
                ? 'bg-red-500/10 border-red-500 text-red-600' 
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
            }`}>
              {isOverLimit ? <AlertCircle size={16} className="shrink-0 mt-0.5" /> : <UserCheck size={16} className="shrink-0 mt-0.5" />}
              <div>
                <span className="font-bold block">
                  {isOverLimit ? 'Instagram Character Limit Exceeded!' : 'Profile Bio Is Ready!'}
                </span>
                <span className="block mt-0.5 font-mono text-[11px]">
                  Current Length: {bioLength} / 150 characters. {isOverLimit ? `Please shorten by ${bioLength - 150} chars.` : ''}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleCopy}
                disabled={isOverLimit || bioLength === 0}
                className="w-full sm:w-auto px-5 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied Bio!' : 'Copy Simulator Bio'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Block */}
      <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <h4 className="font-display font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
          <Info size={16} className="text-fuchsia-500" />
          Pro Profile Design: Structuring Your Bio for High-Conversion & SEO
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
          <p>
            An Instagram bio is not a resume — it is a sales landing page with a **150-character limit**. It should answer exactly three questions immediately: **Who you are**, **What authority/credentials you possess**, and **What the visitor should do next (CTA)**. Adding custom emojis helps categorize your lines vertically, which increases readability.
          </p>
          <p>
            Using clean, standard fonts for your tagline is highly recommended for search discoverability. While cursive or serif bold characters look stylish, they are technically custom Unicode characters that Instagram\'s internal search engine cannot crawl or index! For maximum organic reach, keep keywords in standard font formatting.
          </p>
        </div>
      </div>
    </div>
  );
}
