import React, { useState } from 'react';
import { Flame, Upload, Eye, MousePointer, Download, CheckCircle2, Sparkles } from 'lucide-react';

export function HeatmapSimulator() {
  const [selectedTemplate, setSelectedTemplate] = useState<'hero' | 'checkout' | 'blog'>('hero');
  const [trafficDensity, setTrafficDensity] = useState<number>(75);
  const [scrollDepth, setScrollDepth] = useState<number>(60);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-full text-xs font-semibold">
          <Flame size={14} /> Cognitive UX Heatmap Simulator
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Heatmap & Click Tracking Simulator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Simulate visual attention hotspots, click density, and scroll drop-offs for landing pages and UI wireframes based on cognitive eye-tracking models.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Simulator Controls</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Wireframe Template</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'hero', label: 'SaaS Hero' },
                  { id: 'checkout', label: 'Checkout' },
                  { id: 'blog', label: 'Article' },
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl.id as any)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedTemplate === tpl.id
                        ? 'bg-rose-500 text-white border-rose-500'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                <span>Traffic Density</span>
                <span>{trafficDensity}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={trafficDensity}
                onChange={(e) => setTrafficDensity(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                <span>Scroll Retention</span>
                <span>{scrollDepth}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={scrollDepth}
                onChange={(e) => setScrollDepth(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Canvas Simulated Preview */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-500 uppercase">Attention & Click Map Overlay</span>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-500 rounded-full" /> High</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full" /> Medium</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-blue-500 rounded-full" /> Low</span>
            </div>
          </div>

          <div className="relative min-h-[320px] bg-slate-950 rounded-xl overflow-hidden p-6 text-white flex flex-col justify-between">
            {/* Heatmap Glow Overlays */}
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute top-12 left-1/4 w-32 h-32 bg-rose-500/40 rounded-full blur-2xl"
                style={{ opacity: trafficDensity / 100 }}
              />
              <div
                className="absolute top-24 right-1/3 w-28 h-28 bg-amber-500/40 rounded-full blur-2xl"
                style={{ opacity: trafficDensity / 100 }}
              />
              <div
                className="absolute bottom-12 left-1/3 w-40 h-24 bg-blue-500/30 rounded-full blur-3xl"
                style={{ opacity: scrollDepth / 100 }}
              />
            </div>

            {/* Simulated UI Content */}
            <div className="relative z-10 space-y-4 max-w-md">
              <span className="px-2.5 py-1 bg-rose-500/20 text-rose-400 text-[10px] font-bold rounded-full uppercase">
                {selectedTemplate.toUpperCase()} WIREFRAME
              </span>
              <h2 className="text-2xl font-black leading-tight">
                Supercharge Your SaaS Conversion Rates in 2026
              </h2>
              <p className="text-xs text-slate-400">
                Experience real-time visual hierarchy analysis and eliminate friction before launching your campaign.
              </p>
              <div className="flex gap-3 pt-2">
                <div className="px-4 py-2 bg-rose-600 font-bold rounded-lg text-xs shadow-lg flex items-center gap-1.5 cursor-pointer">
                  <MousePointer size={14} /> Start Free Trial
                </div>
                <div className="px-4 py-2 bg-slate-800 font-bold rounded-lg text-xs cursor-pointer">
                  Watch Demo
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-8 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400 font-mono">
              <span>F-Pattern Attention Score: 88/100</span>
              <span>CTA Visibility: Optimal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
