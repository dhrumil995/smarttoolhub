import React, { useState } from 'react';
import { Filter, DollarSign, ArrowDown, Download, Users } from 'lucide-react';

export function FunnelPipelineVisualizer() {
  const [topTraffic, setTopTraffic] = useState(50000);
  const [stage1CR, setStage1CR] = useState(10); // Traffic -> Lead (10%)
  const [stage2CR, setStage2CR] = useState(25); // Lead -> Trial (25%)
  const [stage3CR, setStage3CR] = useState(30); // Trial -> Customer (30%)
  const [arpu, setArpu] = useState(49); // Average Revenue Per User

  const leads = Math.round(topTraffic * (stage1CR / 100));
  const trials = Math.round(leads * (stage2CR / 100));
  const customers = Math.round(trials * (stage3CR / 100));
  const totalRevenue = customers * arpu;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
          <Filter size={14} /> Funnel Economics & Revenue Modeler
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Funnel & Sales Pipeline Visualizer
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Build interactive sales funnels, calculate drop-off ratios between conversion stages, and project monthly recurring revenue.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Stage Ratios</h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Monthly Top Traffic</label>
              <input
                type="number"
                value={topTraffic}
                onChange={(e) => setTopTraffic(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                <span>Visitor → Lead CR</span>
                <span>{stage1CR}%</span>
              </div>
              <input type="range" min="1" max="50" value={stage1CR} onChange={(e) => setStage1CR(Number(e.target.value))} className="w-full accent-emerald-500" />
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                <span>Lead → Free Trial CR</span>
                <span>{stage2CR}%</span>
              </div>
              <input type="range" min="1" max="50" value={stage2CR} onChange={(e) => setStage2CR(Number(e.target.value))} className="w-full accent-emerald-500" />
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                <span>Trial → Paid Customer CR</span>
                <span>{stage3CR}%</span>
              </div>
              <input type="range" min="1" max="50" value={stage3CR} onChange={(e) => setStage3CR(Number(e.target.value))} className="w-full accent-emerald-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Avg Plan Price ($/mo)</label>
              <input
                type="number"
                value={arpu}
                onChange={(e) => setArpu(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Funnel Visualizer Output */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase">PROJECTED MONTHLY REVENUE</span>
              <div className="text-3xl font-black text-emerald-600">${totalRevenue.toLocaleString()}</div>
            </div>
            <div className="text-right text-xs">
              <span className="text-slate-400 font-bold block">NEW CUSTOMERS</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">{customers.toLocaleString()} / mo</span>
            </div>
          </div>

          <div className="space-y-2 py-2">
            {[
              { name: '1. Website Visitors', count: topTraffic, width: '100%', color: 'bg-emerald-600' },
              { name: '2. Email Leads', count: leads, width: '75%', color: 'bg-emerald-500' },
              { name: '3. Active Trials', count: trials, width: '50%', color: 'bg-teal-500' },
              { name: '4. Paid Subscribers', count: customers, width: '30%', color: 'bg-cyan-500' },
            ].map((stg, idx) => (
              <div key={idx} className="mx-auto flex flex-col items-center" style={{ width: stg.width }}>
                <div className={`w-full ${stg.color} text-white p-2.5 rounded-xl text-center text-xs font-bold shadow-sm flex justify-between px-4`}>
                  <span>{stg.name}</span>
                  <span className="font-mono">{stg.count.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
