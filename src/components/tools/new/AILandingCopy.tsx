import React, { useState } from 'react';
import { Zap, Sparkles, Copy, Check, Layout, CheckCircle2 } from 'lucide-react';

export function AILandingCopy() {
  const [productName, setProductName] = useState('FlowSync');
  const [targetAudience, setTargetAudience] = useState('SaaS Founders & Marketing Teams');
  const [keyBenefit, setKeyBenefit] = useState('Automates cross-platform social scheduling in 5 minutes per week');
  const [tone, setTone] = useState('Persuasive & Professional');

  const [isGenerating, setIsGenerating] = useState(false);
  const [copyOutput, setCopyOutput] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const generateCopy = async () => {
    setIsGenerating(true);

    try {
      const cleanProd = productName.trim() || 'Product';
      const cleanAud = targetAudience.trim() || 'Modern Teams';
      const cleanBen = keyBenefit.trim() || 'Accelerates daily productivity';

      // Tailored copy generation
      const headline = `The Modern Way for ${cleanAud} to ${cleanBen.replace(/^(Automates|Provides|Enables|Helps|Delivers)\s*/i, '').slice(0, 60)}.`;
      const subhead = `${cleanProd} empowers ${cleanAud} with intelligent automation. Experience ${cleanBen.toLowerCase()} without complex setup or manual overhead.`;
      
      const features = [
        {
          title: `Smart ${cleanProd} Automation`,
          desc: `Eliminate repetitive workflows with intuitive automated pipelines designed for ${cleanAud}.`
        },
        {
          title: 'High-Impact Performance',
          desc: `Deliver measurable growth and efficiency with zero latency and real-time synchronizations.`
        },
        {
          title: 'Enterprise-Grade Reliability',
          desc: `Built with modern encryption, high uptime SLA, and seamless team workspace switching.`
        }
      ];

      const socialProof = `"${cleanProd} completely transformed how our team operates. It delivers on its promise to ${cleanBen.toLowerCase()} from day one!" — Jordan P., Head of Operations`;

      const faq = [
        {
          q: `How quickly can ${cleanAud} get started with ${cleanProd}?`,
          a: `Setup takes less than 2 minutes with no credit card required.`
        },
        {
          q: `Does ${cleanProd} integrate with my existing workflow?`,
          a: `Yes, ${cleanProd} supports standard webhook, API, and cloud exports out of the box.`
        }
      ];

      setCopyOutput({
        heroH1: headline,
        heroSub: subhead,
        ctaPrimary: `Start Free with ${cleanProd} →`,
        features,
        socialProof,
        faq
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-xs font-semibold">
          <Zap size={14} /> AI Sales Copywriting Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          AI Landing Page Copy Generator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Generate complete high-converting landing page headlines, subheads, feature highlights, social proof blocks, and CTAs tailored for your audience.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Product / Service Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Audience</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Main Value Proposition / Benefit</label>
            <textarea
              rows={3}
              value={keyBenefit}
              onChange={(e) => setKeyBenefit(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>
          <button
            onClick={generateCopy}
            disabled={isGenerating}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles size={16} /> {isGenerating ? 'Writing Sales Copy...' : 'Generate Landing Page Copy'}
          </button>
        </div>

        <div className="lg:col-span-7">
          {copyOutput ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase">Generated Copy Structure</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(copyOutput, null, 2));
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-xs text-amber-600 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied Copy!' : 'Copy All Copy'}
                </button>
              </div>

              {/* Hero Section Copy */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <span className="text-[10px] font-bold text-amber-600 uppercase">HERO SECTION</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{copyOutput.heroH1}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">{copyOutput.heroSub}</p>
                <div className="pt-2">
                  <span className="px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-lg inline-block">
                    {copyOutput.ctaPrimary}
                  </span>
                </div>
              </div>

              {/* Feature Grid Copy */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-amber-600 uppercase">FEATURE BLOCKS</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {copyOutput.features.map((feat: any, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{feat.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-tight">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <Layout size={36} className="mb-2 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-semibold">Enter your product details to draft full landing page copy.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
