import React, { useState } from 'react';
import { Activity, Printer, FileText } from 'lucide-react';
import BusinessWorkspaceHeader from './BusinessWorkspaceHeader';

export default function ManufacturingReportGenerator() {
  const [activeTab, setActiveTab] = useState<'tool' | 'history' | 'cloud'>('tool');
  const [reportType, setReportType] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const [shiftCount, setShiftCount] = useState('3 Shifts');
  const [totalOutput, setTotalOutput] = useState('1,250 Units');
  const [efficiency, setEfficiency] = useState('94.2%');
  const [scrapRate, setScrapRate] = useState('1.8%');

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <BusinessWorkspaceHeader
        title="Manufacturing Report Generator"
        description="Generate production shift reports with output counts, scrap rates, overall equipment effectiveness (OEE), and printable PDF documents."
        toolId="manufacturing-report-generator"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === 'tool' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4 text-indigo-500" /> Shift Production Parameters
            </h3>

            <div>
              <label className="text-slate-500 block mb-1">Report Cadence:</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Daily', 'Weekly', 'Monthly'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setReportType(type)}
                    className={`p-2 rounded-xl text-xs font-bold cursor-pointer ${
                      reportType === type ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-slate-500 block mb-0.5">Shifts Operating</label>
              <input type="text" value={shiftCount} onChange={(e) => setShiftCount(e.target.value)} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold" />
            </div>

            <div>
              <label className="text-slate-500 block mb-0.5">Total Finished Output</label>
              <input type="text" value={totalOutput} onChange={(e) => setTotalOutput(e.target.value)} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-500 block mb-0.5">Line OEE (%)</label>
                <input type="text" value={efficiency} onChange={(e) => setEfficiency(e.target.value)} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-emerald-600" />
              </div>
              <div>
                <label className="text-slate-500 block mb-0.5">Scrap Rate (%)</label>
                <input type="text" value={scrapRate} onChange={(e) => setScrapRate(e.target.value)} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-red-500" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white text-slate-900 p-8 rounded-2xl border border-slate-300 shadow-xl space-y-6">
              <div className="flex justify-between items-start border-b-2 border-indigo-600 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-indigo-950">{reportType.toUpperCase()} PRODUCTION REPORT</h2>
                  <p className="text-xs text-slate-500">Plant Operations & Shift Performance</p>
                </div>
                <div className="text-right text-xs">
                  <p className="font-bold text-slate-900">Date: {new Date().toLocaleDateString()}</p>
                  <p className="text-slate-500">{shiftCount}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 text-center font-bold">
                <div><span className="text-slate-400 block font-normal">Total Output</span>{totalOutput}</div>
                <div><span className="text-slate-400 block font-normal">Line Efficiency</span>{efficiency}</div>
                <div><span className="text-slate-400 block font-normal">Scrap Rate</span>{scrapRate}</div>
              </div>

              <div className="flex justify-end">
                <button onClick={() => window.print()} className="bg-indigo-600 text-white font-bold px-6 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer">
                  <Printer className="h-4 w-4" /> Print Production Report PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
