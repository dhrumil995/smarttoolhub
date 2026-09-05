import React from 'react';
import { ShieldAlert, Rocket, Heart, Check, HelpCircle, Code } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function About() {
  const values = [
    {
      icon: Rocket,
      title: 'Unrivaled Speed',
      desc: 'No servers, no API delays, no network overhead. Everything compiles directly in browser memory.',
    },
    {
      icon: Heart,
      title: 'Totally Free & Open',
      desc: 'No subscriptions, premium tiers, or hidden features. SmartToolHub is built with open source principles.',
    },
    {
      icon: HelpCircle,
      title: 'Simplistic Focus',
      desc: 'Clutter-free designs, simple interactions, zero intrusive advertisements, and literal labelling.',
    },
  ];

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <SEOHead
        title="About SmartToolHub"
        description="Learn about the philosophy, architecture, and technology stack behind SmartToolHub, the open-source client-side utility portal."
      />

      {/* Header Title */}
      <section className="text-center space-y-4">
        <span className="text-xs font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">
          OUR STORY & PHILOSOPHY
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Empowering workflows <br />
          <span className="bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
            without compromising privacy.
          </span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          SmartToolHub was conceived with a simple goal: build a premium, fast, beautiful collection of developer utilities that respect your data security.
        </p>
      </section>

      {/* Visual Stats Row */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl text-center">
          <span className="block text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">100%</span>
          <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-1 tracking-wider">Client Side</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl text-center">
          <span className="block text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">0ms</span>
          <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-1 tracking-wider">Server Latency</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl text-center">
          <span className="block text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">Zero</span>
          <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-1 tracking-wider">Logs & Tracking</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl text-center">
          <span className="block text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">Free</span>
          <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-1 tracking-wider">Forever License</span>
        </div>
      </section>

      {/* Main Narrative Content */}
      <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 sm:p-10 rounded-3xl space-y-6 text-slate-600 dark:text-slate-300">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          Why we built SmartToolHub
        </h2>
        <p className="text-xs sm:text-sm leading-relaxed">
          Most online developer tools (like JSON formatters or encoder/decoders) are cluttered with intrusive ads, cookies, and slow server-side response times. Worse, pasting sensitive data (such as API keys, payload logs, or configuration profiles) into anonymous websites presents severe security and compliance liabilities.
        </p>
        <p className="text-xs sm:text-sm leading-relaxed">
          SmartToolHub completely changes this paradigm. By hosting standard, performant JavaScript algorithms and leveraging secure built-in browser APIs (like Web Crypto API and local Canvas buffers), everything you input executes completely within your client window. Nothing is uploaded, nothing is stored.
        </p>
        
        <div className="border-t border-slate-150 dark:border-slate-850 pt-6 mt-6">
          <h3 className="font-display font-bold text-slate-900 dark:text-white mb-4">
            Our Core Technologies
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              React v19
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Vite JS
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Tailwind CSS
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              TypeScript
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy grid */}
      <section className="space-y-6">
        <h2 className="font-display text-xl font-bold text-center text-slate-900 dark:text-white">
          Designed with Purpose & Care
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((val, idx) => {
            const IconComponent = val.icon;
            return (
              <div key={idx} className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="h-9 w-9 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                  <IconComponent size={18} />
                </div>
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                  {val.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
