import React, { useState } from 'react';
import { Receipt, Plus, Trash2, Printer, Building, User } from 'lucide-react';
import BusinessWorkspaceHeader from './BusinessWorkspaceHeader';

export default function POGenerator() {
  const [activeTab, setActiveTab] = useState<'tool' | 'history' | 'cloud'>('tool');
  const [poNo, setPoNo] = useState(`PO-2026-${Math.floor(Math.random() * 9000 + 1000)}`);
  const [poDate, setPoDate] = useState(new Date().toISOString().split('T')[0]);
  const [deliveryDate, setDeliveryDate] = useState(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);

  const [vendorName, setVendorName] = useState('Metro Industrial Supplies Pvt Ltd');
  const [vendorAddress, setVendorAddress] = useState('Plot 88, GIDC Estate, Ahmedabad 380015');

  const [items, setItems] = useState([
    { description: '304 Stainless Steel Flanges 4 Inch', qty: 50, unit: 'Pcs', rate: 45, tax: 18 },
    { description: 'High Pressure Rubber Hose 20m', qty: 10, unit: 'Rolls', rate: 120, tax: 18 },
  ]);

  const calculateSubtotal = () => items.reduce((a, b) => a + b.qty * b.rate, 0);
  const calculateTax = () => items.reduce((a, b) => a + (b.qty * b.rate * b.tax) / 100, 0);
  const calculateTotal = () => calculateSubtotal() + calculateTax();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <BusinessWorkspaceHeader
        title="Purchase Order Generator"
        description="Issue compliant B2B Purchase Orders with vendor specs, delivery commitments, tax breakdown, and printable PDF exports."
        toolId="po-generator"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === 'tool' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Receipt className="h-4 w-4 text-indigo-500" />
              PO Meta & Vendor Details
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-500 block mb-0.5">PO Number</label>
                <input type="text" value={poNo} onChange={(e) => setPoNo(e.target.value)} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold" />
              </div>
              <div>
                <label className="text-slate-500 block mb-0.5">PO Date</label>
                <input type="date" value={poDate} onChange={(e) => setPoDate(e.target.value)} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" />
              </div>
            </div>

            <div>
              <label className="text-slate-500 block mb-0.5">Vendor Name</label>
              <input type="text" value={vendorName} onChange={(e) => setVendorName(e.target.value)} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold" />
            </div>

            <div>
              <label className="text-slate-500 block mb-0.5">Vendor Address</label>
              <textarea value={vendorAddress} onChange={(e) => setVendorAddress(e.target.value)} className="w-full h-16 p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" />
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white text-slate-900 p-8 rounded-2xl border border-slate-300 shadow-xl space-y-6">
              <div className="flex justify-between items-start border-b-2 border-indigo-600 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-indigo-950">PURCHASE ORDER</h2>
                  <p className="text-xs text-slate-500 mt-1">Authorized Official Procurement</p>
                </div>
                <div className="text-right text-xs">
                  <p className="font-bold text-slate-900">{poNo}</p>
                  <p className="text-slate-500">Date: {poDate}</p>
                  <p className="text-slate-500">Delivery: {deliveryDate}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                <span className="font-bold text-indigo-600 block mb-1">To Vendor:</span>
                <p className="font-extrabold text-slate-900">{vendorName}</p>
                <p className="text-slate-600">{vendorAddress}</p>
              </div>

              <table className="w-full text-xs text-left">
                <thead className="bg-indigo-950 text-white font-bold text-[10px]">
                  <tr>
                    <th className="p-2">Item Description</th>
                    <th className="p-2 text-center">Qty</th>
                    <th className="p-2 text-right">Rate</th>
                    <th className="p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map((item, i) => (
                    <tr key={i}>
                      <td className="p-2 font-semibold">{item.description}</td>
                      <td className="p-2 text-center">{item.qty} {item.unit}</td>
                      <td className="p-2 text-right">${item.rate}</td>
                      <td className="p-2 text-right font-bold">${item.qty * item.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex flex-col items-end text-xs space-y-1 pt-3 border-t border-slate-200">
                <div className="flex justify-between w-48"><span>Subtotal:</span><span>${calculateSubtotal()}</span></div>
                <div className="flex justify-between w-48"><span>GST Tax:</span><span>${calculateTax()}</span></div>
                <div className="flex justify-between w-48 font-black text-indigo-900 text-sm border-t border-slate-300 pt-1">
                  <span>Grand Total:</span><span>${calculateTotal()}</span>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button onClick={() => window.print()} className="bg-indigo-600 text-white font-bold px-6 py-2 rounded-xl text-xs flex items-center gap-2 shadow cursor-pointer">
                  <Printer className="h-4 w-4" /> Print Purchase Order PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
