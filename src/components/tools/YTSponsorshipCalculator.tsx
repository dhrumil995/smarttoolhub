import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Briefcase,
  TrendingUp,
  Mail,
  Copy,
  Check,
  Download,
  ShieldCheck,
  FileCheck,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

export default function YTSponsorshipCalculator() {
  const [avgViews, setAvgViews] = useState<number>(35000);
  const [subscribers, setSubscribers] = useState<number>(50000);
  const [niche, setNiche] = useState<'finance' | 'tech' | 'productivity' | 'gaming' | 'lifestyle' | 'education'>('tech');
  const [dealType, setDealType] = useState<'integrated_60' | 'integrated_30' | 'dedicated' | 'shorts' | 'bundle'>('integrated_60');
  const [whitelisting, setWhitelisting] = useState<'none' | '30days' | '90days'>('none');
  const [exclusivity, setExclusivity] = useState<'none' | '30days' | '90days'>('none');
  const [copied, setCopied] = useState(false);

  // Custom Niche CPM multipliers
  const nicheConfig = {
    finance: { label: 'Finance, Crypto & Investing', baseCPM: 42, color: 'text-emerald-500' },
    tech: { label: 'Tech, AI & Software Engineering', baseCPM: 34, color: 'text-blue-500' },
    productivity: { label: 'Productivity & Business SaaS', baseCPM: 28, color: 'text-purple-500' },
    education: { label: 'Education & Science', baseCPM: 22, color: 'text-amber-500' },
    lifestyle: { label: 'Lifestyle, Fitness & Travel', baseCPM: 18, color: 'text-pink-500' },
    gaming: { label: 'Gaming & Entertainment', baseCPM: 14, color: 'text-indigo-500' },
  };

  const dealTypeMultipliers = {
    integrated_60: { label: '60s Integrated Sponsor Read', mult: 1.0, desc: 'Standard 60-90 second mid-roll slot with pinned comment & link.' },
    integrated_30: { label: '30s Integrated Quick Shoutout', mult: 0.65, desc: 'Fast 30s shoutout early in the video.' },
    dedicated: { label: 'Full Dedicated Video (100% Sponsor)', mult: 2.8, desc: 'Entire video topic revolves around the sponsor product.' },
    shorts: { label: 'YouTube Short / TikTok Integration', mult: 0.45, desc: 'Vertical short dedicated integration.' },
    bundle: { label: 'Pro Creator Bundle (1 Long + 2 Shorts)', mult: 1.6, desc: '1 Main video integration + 2 supporting Shorts.' },
  };

  const calculations = useMemo(() => {
    const activeNiche = nicheConfig[niche];
    const deal = dealTypeMultipliers[dealType];

    // Base value from CPM
    const viewThousands = Math.max(1, avgViews) / 1000;
    let baseRate = viewThousands * activeNiche.baseCPM * deal.mult;

    // Add subscriber authority bonus (slight prestige weight)
    if (subscribers > 100000) baseRate *= 1.15;
    else if (subscribers > 50000) baseRate *= 1.08;

    // Whitelisting / Ad-Usage rights surcharge
    let usageFee = 0;
    if (whitelisting === '30days') usageFee = baseRate * 0.35;
    if (whitelisting === '90days') usageFee = baseRate * 0.75;

    // Exclusivity surcharge
    let exclusivityFee = 0;
    if (exclusivity === '30days') exclusivityFee = baseRate * 0.25;
    if (exclusivity === '90days') exclusivityFee = baseRate * 0.50;

    const totalFairRate = Math.round(baseRate + usageFee + exclusivityFee);
    const floorRate = Math.round(totalFairRate * 0.82); // lowest acceptable counter-offer
    const highPitchRate = Math.round(totalFairRate * 1.25); // opening pitch rate

    return {
      baseCPM: activeNiche.baseCPM,
      totalFairRate,
      floorRate,
      highPitchRate,
      usageFee: Math.round(usageFee),
      exclusivityFee: Math.round(exclusivityFee),
    };
  }, [avgViews, subscribers, niche, dealType, whitelisting, exclusivity]);

  const pitchEmailTemplate = useMemo(() => {
    return `Hi [Brand Partner Team],

Thanks for reaching out regarding a partnership with our channel.

Based on our recent performance (averaging ${avgViews.toLocaleString()} views/video with strong audience engagement in the ${nicheConfig[niche].label} niche), here is our standard deliverable package:

📦 PROPOSED DELIVERABLE:
• 1x ${dealTypeMultipliers[dealType].label}
• Pinned Top Comment with dedicated trackable link & promo code
• First 3 lines in Video Description with customized CTA
• 24h Story / Community Post announcement

💰 SPONSORSHIP RATE:
• Standard Investment: $${calculations.highPitchRate.toLocaleString()}
${calculations.usageFee > 0 ? `• Paid Ad Whitelisting (${whitelisting}): Included ($${calculations.usageFee})\n` : ''}${calculations.exclusivityFee > 0 ? `• Category Exclusivity (${exclusivity}): Included ($${calculations.exclusivityFee})\n` : ''}
We typically book 2-3 weeks in advance to ensure thorough script integration and high conversion. Let me know if this aligns with your Q3/Q4 campaign budget, and I can reserve your preferred launch date.

Best regards,
[Your Name / Channel Name]
`;
  }, [avgViews, niche, dealType, whitelisting, exclusivity, calculations]);

  const handleCopy = () => {
    navigator.clipboard.writeText(pitchEmailTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                YouTube Creator Business
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[10px] font-bold">
                Fair Market Value Engine
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              YouTube Sponsorship & Brand Deal Rate Calculator
              <DollarSign className="text-emerald-500" size={22} />
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Calculate accurate market sponsorship rates, whitelisting usage rights surcharges, and generate ready-to-send pitch emails for brand managers.
            </p>
          </div>
        </div>

        {/* Input Parameters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Average Views Per Video (Past 30–60 Days) *
            </label>
            <input
              type="number"
              value={avgViews}
              onChange={(e) => setAvgViews(Math.max(100, Number(e.target.value)))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono font-bold focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Exclude viral outliers; use consistent median.</span>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Total Channel Subscribers
            </label>
            <input
              type="number"
              value={subscribers}
              onChange={(e) => setSubscribers(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono font-bold focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Used for authority weighting tier.</span>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Channel Niche / Category
            </label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              {Object.entries(nicheConfig).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label} (CPM ~${v.baseCPM})
                </option>
              ))}
            </select>
            <span className="text-[10px] text-slate-400 mt-1 block">High CPM niches command 2-3x higher rates.</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Sponsorship Deliverable Type
            </label>
            <select
              value={dealType}
              onChange={(e) => setDealType(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              {Object.entries(dealTypeMultipliers).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Paid Ad Whitelisting Rights
            </label>
            <select
              value={whitelisting}
              onChange={(e) => setWhitelisting(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              <option value="none">Organic Only (No Paid Ads Usage)</option>
              <option value="30days">30-Day Paid Ad Whitelisting (+35%)</option>
              <option value="90days">90-Day Paid Ad Whitelisting (+75%)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Category Exclusivity
            </label>
            <select
              value={exclusivity}
              onChange={(e) => setExclusivity(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              <option value="none">No Exclusivity (Can sponsor competitors)</option>
              <option value="30days">30-Day Direct Competitor Lock (+25%)</option>
              <option value="90days">90-Day Direct Competitor Lock (+50%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pricing Output Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-slate-400">
            <span>Minimum Floor Rate</span>
            <ShieldCheck size={16} className="text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
            ${calculations.floorRate.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400">
            Absolute lowest rate to accept after multi-round negotiation.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-emerald-500/50 shadow-md space-y-2 relative overflow-hidden">
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-500 text-white font-mono text-[9px] font-bold uppercase">
            Recommended
          </div>
          <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
            <span>Fair Market Target</span>
            <DollarSign size={16} className="text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            ${calculations.totalFairRate.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400">
            Industry standard market value based on ${calculations.baseCPM} niche CPM.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-blue-500">
            <span>Opening Pitch Quote</span>
            <TrendingUp size={16} className="text-blue-500" />
          </div>
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">
            ${calculations.highPitchRate.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400">
            Send this in your first email to leave healthy room for negotiation.
          </p>
        </div>
      </div>

      {/* Ready-to-Send Brand Pitch Email */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="text-red-500" size={18} />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Professional Brand Deal Response Template
            </h2>
          </div>

          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Pitch Email'}</span>
          </button>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 whitespace-pre-wrap leading-relaxed">
          {pitchEmailTemplate}
        </div>
      </div>
    </div>
  );
}
