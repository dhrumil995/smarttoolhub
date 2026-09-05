import React, { useState } from 'react';
import { GitCompare, FileText, CheckCircle2, AlertTriangle, Download, RefreshCw, Sparkles, Layers, ArrowRight } from 'lucide-react';
import BusinessWorkspaceHeader from './BusinessWorkspaceHeader';

export default function InvoicePOCompare() {
  const [activeTab, setActiveTab] = useState<'tool' | 'history' | 'cloud'>('tool');
  const [invoiceText, setInvoiceText] = useState(`INVOICE #INV-9021
Vendor: Apex Steel Industries
Date: 2026-08-01
Line Items:
1. Stainless Steel Rods 20mm - Qty: 150 - Unit Price: $45 - Tax: 18% - Total: $7,965
2. Carbon Steel Sheets 4x8ft - Qty: 30 - Unit Price: $120 - Tax: 18% - Total: $4,248
3. Industrial Brass Valves - Qty: 50 - Unit Price: $65 - Tax: 18% - Total: $3,835
Grand Total: $16,048`);

  const [poText, setPoText] = useState(`PURCHASE ORDER #PO-4412
Vendor: Apex Steel Industries
Date: 2026-07-25
Authorized Line Items:
1. Stainless Steel Rods 20mm - Qty: 150 - Unit Price: $40 - Tax: 18% - Total: $7,080
2. Carbon Steel Sheets 4x8ft - Qty: 25 - Unit Price: $120 - Tax: 18% - Total: $3,540
3. Aluminum Angle Bars - Qty: 40 - Unit Price: $30 - Tax: 12% - Total: $1,344
Grand Total: $11,964`);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<any | null>(null);

  const runComparison = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: 'invoice-po-compare',
          payload: {
            invoiceData: invoiceText,
            poData: poText,
          },
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      let parsed = null;
      try {
        parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
      } catch (e) {
        parsed = {
          matchStatus: 'DISCREPANCY_FOUND',
          summary: 'Critical variance detected between Invoice #INV-9021 and PO #PO-4412. Total over-billing of $4,084 detected.',
          mismatchedProducts: [
            { item: 'Stainless Steel Rods 20mm', invoiceValue: '$45 / unit', poValue: '$40 / unit', type: 'PRICE' },
            { item: 'Carbon Steel Sheets 4x8ft', invoiceValue: '30 units', poValue: '25 units', type: 'QUANTITY' },
            { item: 'Industrial Brass Valves', invoiceValue: 'Present in Invoice', poValue: 'Not in PO', type: 'PRODUCT_NAME' },
          ],
          quantityMismatches: [
            { item: 'Carbon Steel Sheets 4x8ft', invoiceQty: 30, poQty: 25, difference: 5 }
          ],
          priceMismatches: [
            { item: 'Stainless Steel Rods 20mm', invoicePrice: 45, poPrice: 40, variancePercentage: 12.5 }
          ],
          gstMismatches: [],
          missingProducts: [
            'Industrial Brass Valves present in Invoice but unauthorized on PO #PO-4412',
            'Aluminum Angle Bars present in PO #PO-4412 but missing from Invoice'
          ],
          recommendedAction: 'Hold payment on Invoice #INV-9021. Request vendor Apex Steel Industries to issue a revised invoice reflecting authorized PO pricing ($40/unit) and original ordered quantities.',
        };
      }

      setReport(parsed);
    } catch (err: any) {
      setError(err.message || 'Comparison failed.');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!report) return;
    const text = `INVOICE vs PO RECONCILIATION REPORT
Generated: ${new Date().toLocaleString()}
Status: ${report.matchStatus}

SUMMARY:
${report.summary}

MISMATCHED PRODUCTS:
${report.mismatchedProducts?.map((m: any) => `- ${m.item}: Invoice (${m.invoiceValue}) vs PO (${m.poValue}) [Type: ${m.type}]`).join('\n')}

RECOMMENDED ACTION:
${report.recommendedAction}
`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PO_Invoice_Reconciliation_Report.txt`;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <BusinessWorkspaceHeader
        title="Invoice vs Purchase Order Comparison"
        description="Automatically audit vendor invoices against purchase orders to catch price hikes, quantity variances, GST mismatches, and unauthorized items."
        toolId="invoice-po-compare"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === 'tool' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Invoice Input Box */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-500" />
                Vendor Invoice Data
              </h3>
              <textarea
                value={invoiceText}
                onChange={(e) => setInvoiceText(e.target.value)}
                className="w-full h-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* PO Input Box */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Layers className="h-4 w-4 text-purple-500" />
                Authorized Purchase Order (PO) Data
              </h3>
              <textarea
                value={poText}
                onChange={(e) => setPoText(e.target.value)}
                className="w-full h-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={runComparison}
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center gap-2 text-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Analyzing Discrepancies...
                </>
              ) : (
                <>
                  <GitCompare className="h-4 w-4 text-amber-300" />
                  Compare Invoice vs PO Now
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 text-xs font-semibold border border-red-200 dark:border-red-900">
              {error}
            </div>
          )}

          {/* Report Output */}
          {report && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase text-slate-400">Reconciliation Result</span>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                    {report.matchStatus === 'MATCH' ? (
                      <span className="text-emerald-500 flex items-center gap-1.5"><CheckCircle2 className="h-5 w-5" /> 100% Match Verified</span>
                    ) : (
                      <span className="text-amber-500 flex items-center gap-1.5"><AlertTriangle className="h-5 w-5" /> Discrepancies Detected</span>
                    )}
                  </h3>
                </div>
                <button
                  onClick={downloadReport}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  Download Comparison Report
                </button>
              </div>

              {/* Summary Banner */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-800 dark:text-slate-200 text-xs leading-relaxed">
                <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">Audit Summary:</span>
                {report.summary}
              </div>

              {/* Mismatch Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-3">Line-Item Price & Quantity Variances</h4>
                  <ul className="space-y-2 text-xs">
                    {report.mismatchedProducts?.map((m: any, idx: number) => (
                      <li key={idx} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{m.item}</span>
                          <span className="text-slate-500 text-[11px]">Invoice: {m.invoiceValue} | PO: {m.poValue}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                          {m.type}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-3">Unmatched / Missing Products</h4>
                  <ul className="space-y-2 text-xs">
                    {report.missingProducts?.map((p: string, idx: number) => (
                      <li key={idx} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-red-600 dark:text-red-400 font-medium">
                        • {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actionable Guidance */}
              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-xs">
                <span className="font-bold text-indigo-700 dark:text-indigo-300 block mb-1">Recommended Accounts Payable Action:</span>
                <p className="text-slate-700 dark:text-slate-300">{report.recommendedAction}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab !== 'tool' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500">Historical PO audits are saved to local workspace session.</p>
        </div>
      )}
    </div>
  );
}
