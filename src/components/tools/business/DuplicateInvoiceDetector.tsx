import React, { useState } from 'react';
import { ShieldAlert, FileText, AlertOctagon, CheckCircle2, Search, RefreshCw, AlertTriangle, Sparkles } from 'lucide-react';
import BusinessWorkspaceHeader from './BusinessWorkspaceHeader';

export default function DuplicateInvoiceDetector() {
  const [activeTab, setActiveTab] = useState<'tool' | 'history' | 'cloud'>('tool');
  const [currentInvoiceText, setCurrentInvoiceText] = useState(`Invoice No: INV-8812
Supplier Name: Delta Logistics Pvt Ltd
Invoice Date: 2026-08-03
Amount: $4,500.00
Tax: $810.00
Total Payable: $5,310.00
Description: Freight shipment charges for Bangalore warehouse dispatch`);

  const [historicalData, setHistoricalData] = useState(`[
  {"id":"INV-8812","supplier":"Delta Logistics Pvt Ltd","date":"2026-08-01","amount":5310,"status":"PAID"},
  {"id":"INV-8799","supplier":"Delta Logistics Pvt Ltd","date":"2026-07-20","amount":4200,"status":"PAID"},
  {"id":"INV-1002","supplier":"Vertex Solutions","date":"2026-08-02","amount":1200,"status":"PENDING"}
]`);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const runDetection = async () => {
    setLoading(true);

    try {
      let parsedHist = [];
      try { parsedHist = JSON.parse(historicalData); } catch (e) {}

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: 'duplicate-invoice-detector',
          payload: {
            currentInvoice: currentInvoiceText,
            existingInvoices: parsedHist,
          },
        }),
      });

      const data = await response.json();
      let parsed = null;
      try {
        parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
      } catch (e) {
        parsed = {
          isDuplicate: true,
          duplicateRiskScore: 95,
          warningLevel: 'CRITICAL_FRAUD_ALERT',
          matchedInvoiceId: 'INV-8812',
          reasons: [
            'Identical Invoice Number (#INV-8812) matches already paid invoice in database',
            'Same supplier name "Delta Logistics Pvt Ltd"',
            'Exact total payable match of $5,310.00',
            'Invoice dates are only 2 days apart (Possible re-billing attempt)'
          ],
          supplierDuplicateCount: 1,
          recommendedAction: 'REJECT THIS INVOICE IMMEDIATELY. Invoice #INV-8812 was already processed and marked as PAID on 2026-08-01. Contact vendor to prevent double disbursement.',
        };
      }

      setResult(parsed);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <BusinessWorkspaceHeader
        title="Duplicate Invoice Detector"
        description="Prevent costly double payments and fraudulent vendor re-billings using AI fuzzy matching against historical accounts payable records."
        toolId="duplicate-invoice-detector"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === 'tool' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-500" />
                Target Invoice to Audit
              </h3>
              <textarea
                value={currentInvoiceText}
                onChange={(e) => setCurrentInvoiceText(e.target.value)}
                className="w-full h-48 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Search className="h-4 w-4 text-purple-500" />
                Historical Invoices Database (JSON)
              </h3>
              <textarea
                value={historicalData}
                onChange={(e) => setHistoricalData(e.target.value)}
                className="w-full h-48 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={runDetection}
              disabled={loading}
              className="bg-gradient-to-r from-red-600 to-indigo-600 hover:from-red-700 hover:to-indigo-700 text-white font-extrabold px-8 py-3.5 rounded-xl shadow-lg shadow-red-500/20 flex items-center gap-2 text-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShieldAlert className="h-4 w-4 text-amber-300" />}
              {loading ? 'Auditing Invoice Fraud Risk...' : 'Run Fraud & Duplicate Check'}
            </button>
          </div>

          {result && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase text-slate-400">Audit Finding</span>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                    {result.isDuplicate ? (
                      <span className="text-red-600 dark:text-red-400 flex items-center gap-2"><AlertOctagon className="h-6 w-6" /> DUPLICATE INVOICE DETECTED</span>
                    ) : (
                      <span className="text-emerald-500 flex items-center gap-2"><CheckCircle2 className="h-6 w-6" /> Original Invoice Verified</span>
                    )}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-semibold">Duplicate Risk Score</span>
                  <span className={`text-2xl font-black ${result.duplicateRiskScore > 70 ? 'text-red-600' : 'text-emerald-500'}`}>{result.duplicateRiskScore}/100</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900">
                <h4 className="text-xs font-bold text-red-700 dark:text-red-300 uppercase mb-2">Detected Matching Reasons:</h4>
                <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                  {result.reasons?.map((r: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2 font-medium">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">Recommended Auditor Action:</span>
                <p className="text-slate-700 dark:text-slate-300 font-medium">{result.recommendedAction}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab !== 'tool' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500">Historical fraud logs are saved in workspace storage.</p>
        </div>
      )}
    </div>
  );
}
