import React, { useState } from 'react';
import { Compass, Truck, Printer } from 'lucide-react';
import BusinessWorkspaceHeader from './BusinessWorkspaceHeader';

export default function DeliveryChallanGenerator() {
  const [activeTab, setActiveTab] = useState<'tool' | 'history' | 'cloud'>('tool');
  const [challanNo, setChallanNo] = useState(`DC-2026-${Math.floor(Math.random() * 9000 + 1000)}`);
  const [vehicleNo, setVehicleNo] = useState('MH-04-AB-9821');
  const [driverName, setDriverName] = useState('Ramesh Sharma');
  const [transporter, setTransporter] = useState('VRL Logistics Ltd');

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <BusinessWorkspaceHeader
        title="Delivery Challan Generator"
        description="Generate official delivery challans and dispatch notes complete with vehicle registration, driver details, cargo inventory, and sign-off blocks."
        toolId="delivery-challan-generator"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === 'tool' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-indigo-500" /> Dispatch & Transport Details
            </h3>
            <div>
              <label className="text-slate-500 block mb-0.5">Challan Number</label>
              <input type="text" value={challanNo} onChange={(e) => setChallanNo(e.target.value)} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold" />
            </div>
            <div>
              <label className="text-slate-500 block mb-0.5">Vehicle Number</label>
              <input type="text" value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold" />
            </div>
            <div>
              <label className="text-slate-500 block mb-0.5">Driver Name</label>
              <input type="text" value={driverName} onChange={(e) => setDriverName(e.target.value)} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" />
            </div>
            <div>
              <label className="text-slate-500 block mb-0.5">Transporter Name</label>
              <input type="text" value={transporter} onChange={(e) => setTransporter(e.target.value)} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" />
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white text-slate-900 p-8 rounded-2xl border border-slate-300 shadow-xl space-y-6">
              <div className="flex justify-between items-start border-b-2 border-indigo-600 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-indigo-950">DELIVERY CHALLAN</h2>
                  <p className="text-xs text-slate-500">Goods In Transit Dispatch Document</p>
                </div>
                <div className="text-right text-xs font-bold text-indigo-600">
                  <p>{challanNo}</p>
                  <p className="text-slate-500 font-normal">Date: {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-bold block">Vehicle No:</span>
                  <p className="font-extrabold text-slate-900">{vehicleNo}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Transporter / Driver:</span>
                  <p className="font-extrabold text-slate-900">{transporter} ({driverName})</p>
                </div>
              </div>

              <div className="pt-8 flex justify-between text-xs border-t border-slate-200">
                <div className="text-center border-t border-slate-300 pt-1 w-36">
                  <span className="font-bold">Dispatch Officer</span>
                </div>
                <div className="text-center border-t border-slate-300 pt-1 w-36">
                  <span className="font-bold">Receiver Signature</span>
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={() => window.print()} className="bg-indigo-600 text-white font-bold px-6 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer">
                  <Printer className="h-4 w-4" /> Print Delivery Challan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
