import React, { useState } from 'react';
import { Sliders, Package, Printer } from 'lucide-react';
import BusinessWorkspaceHeader from './BusinessWorkspaceHeader';

export default function PackingListGenerator() {
  const [activeTab, setActiveTab] = useState<'tool' | 'history' | 'cloud'>('tool');
  const [packingListNo, setPackingListNo] = useState(`PL-2026-${Math.floor(Math.random() * 9000 + 1000)}`);
  const [totalCartons, setTotalCartons] = useState(12);
  const [grossWeight, setGrossWeight] = useState('340 KG');
  const [netWeight, setNetWeight] = useState('310 KG');

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <BusinessWorkspaceHeader
        title="Packing List Generator"
        description="Build itemized export/shipment packing lists with box breakdown, carton dimensions, net/gross weights, and printable PDF documents."
        toolId="packing-list-generator"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === 'tool' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-purple-500" /> Shipment Specs
            </h3>
            <div>
              <label className="text-slate-500 block mb-0.5">Packing List No</label>
              <input type="text" value={packingListNo} onChange={(e) => setPackingListNo(e.target.value)} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold" />
            </div>
            <div>
              <label className="text-slate-500 block mb-0.5">Total Cartons / Boxes</label>
              <input type="number" value={totalCartons} onChange={(e) => setTotalCartons(Number(e.target.value))} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-500 block mb-0.5">Gross Weight</label>
                <input type="text" value={grossWeight} onChange={(e) => setGrossWeight(e.target.value)} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold" />
              </div>
              <div>
                <label className="text-slate-500 block mb-0.5">Net Weight</label>
                <input type="text" value={netWeight} onChange={(e) => setNetWeight(e.target.value)} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white text-slate-900 p-8 rounded-2xl border border-slate-300 shadow-xl space-y-6">
              <div className="flex justify-between items-start border-b-2 border-purple-600 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-purple-950">EXPORT PACKING LIST</h2>
                  <p className="text-xs text-slate-500">Commercial Cargo Breakdown</p>
                </div>
                <div className="text-right text-xs font-bold text-purple-600">
                  <p>{packingListNo}</p>
                  <p className="text-slate-500 font-normal">Date: {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 text-center font-bold">
                <div><span className="text-slate-400 block font-normal">Total Cartons</span>{totalCartons} Boxes</div>
                <div><span className="text-slate-400 block font-normal">Gross Weight</span>{grossWeight}</div>
                <div><span className="text-slate-400 block font-normal">Net Weight</span>{netWeight}</div>
              </div>

              <div className="flex justify-end">
                <button onClick={() => window.print()} className="bg-purple-600 text-white font-bold px-6 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer">
                  <Printer className="h-4 w-4" /> Print Packing List PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
