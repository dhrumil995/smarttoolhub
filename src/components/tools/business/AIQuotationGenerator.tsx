import React, { useState } from 'react';
import { FileCode, Plus, Trash2, Download, Printer, Sparkles, Building, User } from 'lucide-react';
import BusinessWorkspaceHeader from './BusinessWorkspaceHeader';

interface LineItem {
  description: string;
  qty: number;
  rate: number;
  tax: number;
}

export default function AIQuotationGenerator() {
  const [activeTab, setActiveTab] = useState<'tool' | 'history' | 'cloud'>('tool');
  const [quotationNo, setQuotationNo] = useState(`QT-2026-${Math.floor(Math.random() * 9000 + 1000)}`);
  const [quoteDate, setQuoteDate] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);

  const [companyName, setCompanyName] = useState('Apex Industrial Technologies');
  const [companyAddress, setCompanyAddress] = useState('102 Tech Park, Phase 3, Mumbai 400072');
  const [companyGst, setCompanyGst] = useState('27ABCDE1234F1Z5');

  const [clientName, setClientName] = useState('Global Steel & Power Corp');
  const [clientAddress, setClientAddress] = useState('45 Industrial Area, Sector 5, Pune');
  const [clientGst, setClientGst] = useState('27XYZWV9876U1Z9');

  const [items, setItems] = useState<LineItem[]>([
    { description: 'High Precision CNC Milling Machine Tooling Set', qty: 2, rate: 2500, tax: 18 },
    { description: 'Automated Hydraulic Pump Assembly (10HP)', qty: 1, rate: 4800, tax: 18 },
  ]);

  const [discountPercent, setDiscountPercent] = useState(5);
  const [terms, setTerms] = useState('1. 50% advance payment required upon order confirmation.\n2. Delivery within 14 working days.\n3. Quotation valid for 30 days.');

  const addItem = () => {
    setItems([...items, { description: 'New Industrial Item / Service', qty: 1, rate: 1000, tax: 18 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof LineItem, val: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: val };
    setItems(updated);
  };

  const calculateSubtotal = () => items.reduce((acc, item) => acc + item.qty * item.rate, 0);
  const calculateTaxTotal = () => items.reduce((acc, item) => acc + (item.qty * item.rate * item.tax) / 100, 0);
  const calculateDiscount = () => (calculateSubtotal() * discountPercent) / 100;
  const calculateGrandTotal = () => calculateSubtotal() + calculateTaxTotal() - calculateDiscount();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <BusinessWorkspaceHeader
        title="AI Quotation Generator"
        description="Craft sleek, professional, compliance-ready B2B sales quotations with automated line items, GST breakdown, discount rules, and printable vector PDFs."
        toolId="ai-quotation-generator"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === 'tool' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building className="h-4 w-4 text-indigo-500" />
                Company & Quotation Metadata
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-500 block font-semibold mb-1">Quote #</label>
                  <input
                    type="text"
                    value={quotationNo}
                    onChange={(e) => setQuotationNo(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block font-semibold mb-1">Quote Date</label>
                  <input
                    type="date"
                    value={quoteDate}
                    onChange={(e) => setQuoteDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium"
                  />
                </div>
              </div>

              <div className="text-xs space-y-2">
                <label className="text-slate-500 block font-semibold">Your Company Details</label>
                <input
                  type="text"
                  placeholder="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                />
                <input
                  type="text"
                  placeholder="GSTIN Number"
                  value={companyGst}
                  onChange={(e) => setCompanyGst(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono"
                />
              </div>

              <div className="text-xs space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="text-slate-500 block font-semibold flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-purple-500" />
                  Client Details (Billed To)
                </label>
                <input
                  type="text"
                  placeholder="Client Company Name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium"
                />
                <input
                  type="text"
                  placeholder="Client Address"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                />
                <input
                  type="text"
                  placeholder="Client GSTIN"
                  value={clientGst}
                  onChange={(e) => setClientGst(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono"
                />
              </div>

              {/* Items Management */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">Items & Pricing</span>
                  <button
                    onClick={addItem}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Item
                  </button>
                </div>

                {items.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-500">Item #{idx + 1}</span>
                      {items.length > 1 && (
                        <button onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700 cursor-pointer">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(idx, 'description', e.target.value)}
                      className="w-full p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-medium"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400">Qty</label>
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => updateItem(idx, 'qty', Number(e.target.value))}
                          className="w-full p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400">Rate ($)</label>
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateItem(idx, 'rate', Number(e.target.value))}
                          className="w-full p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400">Tax (%)</label>
                        <input
                          type="number"
                          value={item.tax}
                          onChange={(e) => updateItem(idx, 'tax', Number(e.target.value))}
                          className="w-full p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center font-bold"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">Special Discount (%):</span>
                <input
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-20 p-1.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-center"
                />
              </div>
            </div>
          </div>

          {/* Printable Preview Column */}
          <div className="lg:col-span-7">
            <div className="bg-white text-slate-900 rounded-2xl p-8 border border-slate-300 shadow-xl space-y-6 print:p-0 print:border-none print:shadow-none" id="quotation-print-area">
              {/* Document Header */}
              <div className="flex justify-between items-start border-b-2 border-indigo-600 pb-6">
                <div>
                  <h2 className="text-2xl font-black text-indigo-950 uppercase tracking-tight">{companyName}</h2>
                  <p className="text-xs text-slate-600 max-w-xs mt-1">{companyAddress}</p>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">GSTIN: {companyGst}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black uppercase text-indigo-600 tracking-wider">Commercial Quotation</span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{quotationNo}</h3>
                  <p className="text-xs text-slate-500 mt-1">Date: {quoteDate}</p>
                  <p className="text-xs text-slate-500">Valid Until: {validUntil}</p>
                </div>
              </div>

              {/* Billed To Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">Quotation Prepared For:</span>
                <h4 className="text-sm font-extrabold text-slate-900">{clientName}</h4>
                <p className="text-slate-600">{clientAddress}</p>
                {clientGst && <p className="text-slate-500 font-mono mt-0.5">GSTIN: {clientGst}</p>}
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-xs text-slate-800">
                <thead className="bg-indigo-950 text-white font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3 rounded-l-lg">Description</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Rate</th>
                    <th className="p-3 text-right">Tax (%)</th>
                    <th className="p-3 text-right rounded-r-lg">Total ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {items.map((item, idx) => {
                    const lineTotal = item.qty * item.rate * (1 + item.tax / 100);
                    return (
                      <tr key={idx}>
                        <td className="p-3 font-semibold text-slate-900">{item.description}</td>
                        <td className="p-3 text-center font-bold">{item.qty}</td>
                        <td className="p-3 text-right">${item.rate.toLocaleString()}</td>
                        <td className="p-3 text-right">{item.tax}%</td>
                        <td className="p-3 text-right font-extrabold text-indigo-700">${lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Summary Calculations */}
              <div className="flex flex-col items-end text-xs space-y-1.5 pt-3 border-t border-slate-200">
                <div className="flex justify-between w-64 text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-900">${calculateSubtotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between w-64 text-slate-600">
                  <span>GST Tax Total:</span>
                  <span className="font-bold text-slate-900">${calculateTaxTotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between w-64 text-emerald-600 font-semibold">
                    <span>Discount ({discountPercent}%):</span>
                    <span>-${calculateDiscount().toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between w-64 text-base font-black text-indigo-950 pt-2 border-t-2 border-indigo-600">
                  <span>Grand Total:</span>
                  <span className="text-indigo-600">${calculateGrandTotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Terms & Signatures */}
              <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-600 space-y-2">
                <span className="font-bold text-slate-900 block">Terms & Conditions:</span>
                <p className="whitespace-pre-line leading-relaxed text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">{terms}</p>
              </div>

              <div className="pt-8 flex justify-between items-end text-xs">
                <div>
                  <p className="text-slate-400">Thank you for your business!</p>
                </div>
                <div className="text-center border-t border-slate-300 pt-1 w-44">
                  <span className="font-bold text-slate-800">Authorized Signatory</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                Print / Save PDF Quotation
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab !== 'tool' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500">Generated quotations are stored in local workspace history.</p>
        </div>
      )}
    </div>
  );
}
