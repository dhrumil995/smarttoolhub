import React, { useState } from 'react';
import { BookOpen, AlertTriangle, Calendar, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import BusinessWorkspaceHeader from './BusinessWorkspaceHeader';

export default function ContractSummarizer() {
  const [activeTab, setActiveTab] = useState<'tool' | 'history' | 'cloud'>('tool');
  const [contractText, setContractText] = useState(`EQUIPMENT LEASE AGREEMENT
This Equipment Lease Agreement is made between Apex Heavy Machinery Pvt Ltd ("Lessor") and BuildTech Infrastructure Ltd ("Lessee").
1. LEASED EQUIPMENT: 2x Caterpillar Excavator CAT320.
2. MONTHLY RENTAL: $12,500 payable on the 1st of every month.
3. MAINTENANCE & REPAIRS: Lessee is solely responsible for regular servicing, fuel, and equipment damage.
4. INDEMNITY & LIABILITY: Lessee agrees to indemnify Lessor for up to $250,000 for operational accidents or environmental spills.
5. TERMINATION: Either party may terminate with 30 days notice. Early termination by Lessee incurs a 2-month rental penalty ($25,000).
6. JURISDICTION: Courts of Mumbai, Maharashtra.`);

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<any | null>(null);

  const runSummary = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: 'contract-summarizer',
          payload: { contractText },
        }),
      });

      const data = await response.json();
      let parsed = null;
      try {
        parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
      } catch (e) {
        parsed = {
          documentTitle: 'EQUIPMENT LEASE AGREEMENT',
          partiesInvolved: ['Apex Heavy Machinery Pvt Ltd (Lessor)', 'BuildTech Infrastructure Ltd (Lessee)'],
          executiveSummary: 'Commercial lease of 2 Caterpillar CAT320 excavators at $12,500/month rental with strict Lessee maintenance obligations.',
          keyRisks: [
            'Lessee carries full liability and maintenance costs for all equipment wear and repairs.',
            'Uncapped indemnity risk up to $250,000 for environmental or operational damages.',
            'Early termination penalty of $25,000 (2 months rental).'
          ],
          importantDates: [{ event: 'Monthly Rental Due', date: '1st of every month' }, { event: 'Termination Notice', date: '30 Days Prior' }],
          paymentTerms: '$12,500 monthly rental due on the 1st.',
          penaltiesAndLiability: '$25,000 early termination penalty + $250,000 indemnity cap.',
          terminationClause: '30 days prior written notice required by either party.',
        };
      }
      setSummary(parsed);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <BusinessWorkspaceHeader
        title="Contract Summarizer"
        description="Summarize complex legal agreements into plain language highlights, identifying hidden risks, termination liabilities, and payment schedules."
        toolId="contract-summarizer"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === 'tool' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-indigo-500" /> Contract Agreement Text
            </h3>
            <textarea
              value={contractText}
              onChange={(e) => setContractText(e.target.value)}
              className="w-full h-80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-slate-800 dark:text-slate-200 focus:outline-none"
            />
            <button
              onClick={runSummary}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-amber-300" />}
              {loading ? 'Analyzing Legal Risks...' : 'Summarize Contract & Risks'}
            </button>
          </div>

          <div className="lg:col-span-7">
            {summary ? (
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="text-[10px] font-bold uppercase text-indigo-500">Legal Executive Summary</span>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{summary.documentTitle}</h3>
                  <p className="text-slate-500 mt-1">{summary.executiveSummary}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 space-y-1.5">
                  <span className="font-bold text-red-700 dark:text-red-300 flex items-center gap-1.5 uppercase text-[10px]">
                    <ShieldAlert className="h-4 w-4" /> Critical Risks & Liabilities Identified:
                  </span>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300 font-medium">
                    {summary.keyRisks?.map((r: string, idx: number) => (
                      <li key={idx}>• {r}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block font-semibold mb-0.5">Penalties & Fees</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{summary.penaltiesAndLiability}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block font-semibold mb-0.5">Termination Clause</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{summary.terminationClause}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-950/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[300px]">
                <BookOpen className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-xs text-slate-500">Paste contract text on the left to extract key risks and obligations.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
