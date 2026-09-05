import React, { useState, useMemo } from 'react';
import {
  User,
  Sparkles,
  Copy,
  Check,
  Twitter,
  Linkedin,
  Instagram,
  Github,
  RefreshCw,
  Sliders,
  Flame,
  Briefcase,
  Smile,
  Zap,
  AtSign,
  Share2,
  Code2
} from 'lucide-react';
import { toast } from '../../utils/toast';

type PlatformId = 'twitter' | 'linkedin' | 'instagram' | 'github' | 'threads';
type ToneId = 'founder' | 'professional' | 'witty' | 'tech' | 'aesthetic' | 'minimalist' | 'growth';

interface GeneratedBio {
  id: string;
  text: string;
  charCount: number;
  tag: string;
}

export default function AIBioGenerator() {
  const [role, setRole] = useState('Full Stack Engineer & SaaS Founder');
  const [passions, setPassions] = useState('Building AI developer tools, React, open source, mechanical keyboards');
  const [socialProof, setSocialProof] = useState('$500k ARR, 15k+ active users');
  const [cta, setCta] = useState('DMs open for collabs');
  const [platform, setPlatform] = useState<PlatformId>('twitter');
  const [tone, setTone] = useState<ToneId>('founder');
  const [includeEmoji, setIncludeEmoji] = useState(true);
  const [includeCta, setIncludeCta] = useState(true);
  const [includeSocialProof, setIncludeSocialProof] = useState(true);
  const [seed, setSeed] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const e = (emoji: string) => (includeEmoji ? `${emoji} ` : '');

  const generatedBios = useMemo<GeneratedBio[]>(() => {
    const r = role.trim() || 'Software Engineer';
    const p = passions.trim() || 'Coding, web tools, technology';
    const firstPassion = p.split(',')[0].trim() || p;
    const proof = socialProof.trim();
    const callToAction = cta.trim() || 'Link in bio';

    const proofStr = includeSocialProof && proof ? ` • ${proof}` : '';
    const ctaStr = includeCta && callToAction ? callToAction : '';

    const list: { text: string; tag: string }[] = [];

    if (platform === 'twitter') {
      if (tone === 'founder') {
        list.push({
          text: `${e('🚀')} Building the future as ${r}${proofStr}.\n${e('💡')} Obsessed with ${p}.\n${e('👇')} ${ctaStr}`,
          tag: 'High Authority'
        });
        list.push({
          text: `${r}. Sharing the unfiltered journey of building products${proofStr}. Let's chat about ${firstPassion}.\n${e('📩')} ${ctaStr}`,
          tag: 'Build in Public'
        });
        list.push({
          text: `${e('⚡')} ${r} | Creating tools that scale${proofStr} | Talking ${firstPassion} & engineering | ${ctaStr}`,
          tag: 'Punchy One-Liner'
        });
      } else if (tone === 'witty') {
        list.push({
          text: `Professional ${r.toLowerCase()}. Turning coffee into ${firstPassion} and code since 2019. ${e('☕')}\n${proofStr ? `(${proof})` : ''}\n${ctaStr}`,
          tag: 'Relatable Humor'
        });
        list.push({
          text: `I write code so you don't have to. ${e('💻')} ${r} | Enthusiast of ${p}. Say hi: ${ctaStr}`,
          tag: 'Witty Casual'
        });
      } else if (tone === 'minimalist') {
        list.push({
          text: `${r}. ${firstPassion}. ${proofStr ? proof + '.' : ''} ${ctaStr}.`,
          tag: 'Minimal Aesthetic'
        });
        list.push({
          text: `crafting digital systems. ${r} exploring ${firstPassion}. ${ctaStr}.`,
          tag: 'Lowercase Minimal'
        });
      } else if (tone === 'tech') {
        list.push({
          text: `${e('🛠️')} ${r} | Deep in ${p}${proofStr}.\n${e('⚙️')} Shipping clean code & architecture.\n${e('🔗')} ${ctaStr}`,
          tag: 'Dev Focus'
        });
        list.push({
          text: `Code. Ship. Iterate. ${r} building next-gen web tools. Focus: ${p}. ${ctaStr}`,
          tag: 'Engineering First'
        });
      } else {
        list.push({
          text: `${e('✨')} ${r} | Passionate about ${p}${proofStr}.\n${e('🎯')} Helping creators and developers level up.\n${e('📬')} ${ctaStr}`,
          tag: 'Standard Pro'
        });
      }
    } else if (platform === 'linkedin') {
      if (tone === 'founder') {
        list.push({
          text: `Founder & ${r} passionate about scaling high-impact digital experiences. Leading technical innovation with a proven track record${proofStr}. Focused on ${p}.\n\nAlways open to discussing partnerships, venture ideas, and emerging tech. ${ctaStr}.`,
          tag: 'Executive Summary'
        });
        list.push({
          text: `${r} specializing in ${firstPassion}. Driving growth through technical craftsmanship and sustainable product architecture${proofStr}. Let's connect!`,
          tag: 'Direct & Impactful'
        });
      } else if (tone === 'tech') {
        list.push({
          text: `Senior ${r} with deep expertise in ${p}. Proven experience architecting scalable systems and leading high-velocity engineering workflows${proofStr}.\n\nPassionate about clean code, developer productivity, and mentoring.`,
          tag: 'Technical Resume'
        });
      } else {
        list.push({
          text: `Results-driven ${r} dedicated to solving complex problems across ${p}${proofStr}. Committed to continuous learning, collaborative leadership, and building modern software.`,
          tag: 'Corporate Standard'
        });
      }
    } else if (platform === 'github') {
      list.push({
        text: `👋 Hi! I'm a ${r}.\n\n${e('🔭')} Currently working on ${p}\n${e('🌱')} Learning & sharing open source solutions\n${e('💬')} Ask me about ${firstPassion}\n${e('📫')} Reach me: ${ctaStr}`,
        tag: 'README Profile'
      });
      list.push({
        text: `${r} • ${firstPassion} • Open Source Contributor${proofStr} • ${ctaStr}`,
        tag: 'Bio Snippet'
      });
    } else if (platform === 'instagram') {
      list.push({
        text: `${e('✨')} ${r}\n${e('💡')} ${p}\n${e('📍')} ${proofStr ? proof + '\n' : ''}${e('👇')} ${ctaStr}`,
        tag: 'Vertical Spaced'
      });
      list.push({
        text: `${e('🌿')} ${r} | Creating digital solutions\n${e('☕')} Powered by curiosity & ${firstPassion}\n${e('🔗')} ${ctaStr}`,
        tag: 'Aesthetic Lifestyle'
      });
    } else {
      // Threads
      list.push({
        text: `${r} talking about ${p}. ${proofStr} Building in public daily. ${ctaStr}`,
        tag: 'Conversational'
      });
    }

    return list.map((item, idx) => ({
      id: `${platform}-${tone}-${idx}-${seed}`,
      text: item.text.trim(),
      charCount: item.text.length,
      tag: item.tag
    }));
  }, [role, passions, socialProof, cta, platform, tone, includeEmoji, includeCta, includeSocialProof, seed]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Bio copied to clipboard!', 'Copied');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const PLATFORMS: { id: PlatformId; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; limit: number }[] = [
    { id: 'twitter', label: 'Twitter / X', icon: Twitter, limit: 160 },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, limit: 260 },
    { id: 'instagram', label: 'Instagram', icon: Instagram, limit: 150 },
    { id: 'github', label: 'GitHub', icon: Github, limit: 200 },
    { id: 'threads', label: 'Threads', icon: AtSign, limit: 160 },
  ];

  const TONES: { id: ToneId; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
    { id: 'founder', label: 'Founder & Authority', icon: Zap },
    { id: 'tech', label: 'Tech & Developer', icon: Code2 },
    { id: 'witty', label: 'Witty & Relatable', icon: Smile },
    { id: 'minimalist', label: 'Minimalist & Clean', icon: Sparkles },
    { id: 'professional', label: 'Corporate Pro', icon: Briefcase },
    { id: 'aesthetic', label: 'Aesthetic & Visual', icon: Flame },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <User size={13} /> Social Profile Optimizer
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              AI Social Bio & Profile Generator
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Craft high-converting, standout social bios for Twitter/X, LinkedIn, Instagram, and GitHub tailored to your exact tone and credentials.
            </p>
          </div>

          <button
            onClick={() => setSeed((prev) => prev + 1)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Generate Variations</span>
          </button>
        </div>

        {/* Platform Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-4">
          {PLATFORMS.map((p) => {
            const Icon = p.icon;
            const isSelected = platform === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex items-center justify-center gap-2 font-bold text-xs ${
                  isSelected
                    ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-500 text-purple-950 dark:text-purple-200 ring-2 ring-purple-500/20'
                    : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon size={14} />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Configuration */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Sliders size={14} className="text-purple-500" /> Profile Parameters
            </span>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Your Title / Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Founder, Full Stack Dev, UX Designer"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Passions, Skills & Topics
              </label>
              <textarea
                rows={2}
                value={passions}
                onChange={(e) => setPassions(e.target.value)}
                placeholder="e.g. AI tools, TypeScript, mechanical keyboards"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-purple-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Social Proof / Metrics
                </label>
                <input
                  type="text"
                  value={socialProof}
                  onChange={(e) => setSocialProof(e.target.value)}
                  placeholder="e.g. 50k+ users, Ex-Google"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Call to Action (CTA)
                </label>
                <input
                  type="text"
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  placeholder="e.g. DMs open, Link in bio"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>

            {/* Tone Selector */}
            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Persona & Tone
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {TONES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className={`py-2 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer border text-left flex items-center gap-1.5 ${
                      tone === t.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <t.icon size={13} />
                    <span className="truncate">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeEmoji}
                  onChange={(e) => setIncludeEmoji(e.target.checked)}
                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer accent-purple-600"
                />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Include engaging visual emojis
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeSocialProof}
                  onChange={(e) => setIncludeSocialProof(e.target.checked)}
                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer accent-purple-600"
                />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Include social proof metrics
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Generated Results List */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Generated Bio Variations ({generatedBios.length})
            </span>
            <span className="text-[11px] text-slate-400">
              Click copy icon to grab any bio
            </span>
          </div>

          <div className="space-y-3">
            {generatedBios.map((bio) => {
              const currentPlatformInfo = PLATFORMS.find((p) => p.id === platform);
              const limit = currentPlatformInfo?.limit || 160;
              const isOverLimit = bio.charCount > limit;

              return (
                <div
                  key={bio.id}
                  className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs hover:border-purple-300 dark:hover:border-purple-800 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold uppercase tracking-wider">
                      {bio.tag}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-mono ${isOverLimit ? 'text-amber-500 font-bold' : 'text-slate-400'}`}>
                        {bio.charCount} / {limit} chars
                      </span>
                      <button
                        onClick={() => handleCopy(bio.id, bio.text)}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedId === bio.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        <span>{copiedId === bio.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50/80 dark:bg-slate-850/60 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed select-all font-sans">
                    {bio.text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
