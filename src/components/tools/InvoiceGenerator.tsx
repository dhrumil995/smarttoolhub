import React, { useState } from 'react';
import { 
  FileText, Plus, Trash2, Printer, Download, Copy, RefreshCw, 
  Check, DollarSign, Calendar, Building, User, CreditCard, Image, Save, Share2, Info
} from 'lucide-react';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'INR', symbol: '₹' },
  { code: 'CAD', symbol: '$' },
  { code: 'AUD', symbol: '$' },
];

export function InvoiceGenerator() {
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);

  // Company Details
  const [companyName, setCompanyName] = useState('Acme Global Solutions Inc.');
  const [companyEmail, setCompanyEmail] = useState('billing@acmeglobal.com');
  const [companyAddress, setCompanyAddress] = useState('100 Innovation Way, Suite 400\nSan Francisco, CA 94105');
  const [companyTaxId, setCompanyTaxId] = useState('GSTIN: 27AAAAA0000A1Z5');

  // Client Details
  const [clientName, setClientName] = useState('Apex Digital Corp');
  const [clientEmail, setClientEmail] = useState('accounts@apexdigital.com');
  const [clientAddress, setClientAddress] = useState('450 Market Street\nNew York, NY 10001');

  // Items
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Web Application Design & UI/UX Development', quantity: 1, rate: 2400 },
    { id: '2', description: 'API Integration & Server Setup', quantity: 12, rate: 85 },
    { id: '3', description: 'Monthly Maintenance & Performance Audits', quantity: 1, rate: 350 },
  ]);

  // Calculations
  const [taxRate, setTaxRate] = useState<number>(18); // e.g. 18% GST/VAT
  const [discountRate, setDiscountRate] = useState<number>(5); // e.g. 5% discount
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [notes, setNotes] = useState('Thank you for your business! Payment is due within 14 days via Direct Bank Transfer.');

  const [copied, setCopied] = useState(false);

  // Math totals
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const discountAmount = (subtotal * discountRate) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * taxRate) / 100;
  const totalAmount = taxableAmount + taxAmount + shippingFee;

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), description: 'New Service / Product Item', quantity: 1, rate: 100 }
    ]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `INVOICE ${invoiceNumber}\nFrom: ${companyName}\nTo: ${clientName}\nDate: ${invoiceDate}\nDue Date: ${dueDate}\nTotal Amount Due: ${currency.symbol}${totalAmount.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setInvoiceNumber(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
    setItems([
      { id: '1', description: 'Consulting Services', quantity: 1, rate: 500 }
    ]);
    setTaxRate(18);
    setDiscountRate(0);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto print:max-w-none print:p-0">
      {/* Header Banner (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6 print:hidden">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
            <FileText size={12} className="text-emerald-500" />
            GST & Tax Ready Billing Studio
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Professional Invoice & GST Generator
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Create, calculate, print, and export itemized invoices with GST/VAT taxes and custom terms instantly.
          </p>
        </div>

        {/* Top Control Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Reset</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer size={14} />
            <span>Print / PDF Invoice</span>
          </button>
        </div>
      </div>

      {/* Main Printable Invoice Card Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-lg print:border-none print:shadow-none print:p-0 print:bg-white print:text-black space-y-8">
        
        {/* Invoice Top Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6 print:border-slate-300">
          <div className="space-y-2">
            <div className="inline-block px-3 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs uppercase tracking-widest rounded-md print:bg-black print:text-white">
              INVOICE
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">#</span>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="font-mono text-xl font-extrabold text-slate-900 dark:text-white print:text-black bg-transparent border-b border-dashed border-slate-300 dark:border-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-400 dark:text-slate-500 block uppercase text-[10px]">Invoice Date</label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 print:bg-transparent border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 print:text-black"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-400 dark:text-slate-500 block uppercase text-[10px]">Payment Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 print:bg-transparent border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 print:text-black"
              />
            </div>
          </div>
        </div>

        {/* Company Biller & Client Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
          {/* Company / From */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 print:text-black flex items-center gap-1.5">
              <Building size={14} />
              Billed From (Your Business)
            </h4>
            <div className="space-y-1.5">
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company Name"
                className="w-full bg-slate-50 dark:bg-slate-950 print:bg-transparent border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white print:text-black focus:outline-none focus:border-emerald-500"
              />
              <input
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                placeholder="Company Email"
                className="w-full bg-slate-50 dark:bg-slate-950 print:bg-transparent border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 print:text-black focus:outline-none"
              />
              <textarea
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                placeholder="Company Address"
                rows={2}
                className="w-full bg-slate-50 dark:bg-slate-950 print:bg-transparent border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 print:text-black focus:outline-none resize-none"
              />
              <input
                type="text"
                value={companyTaxId}
                onChange={(e) => setCompanyTaxId(e.target.value)}
                placeholder="GSTIN / Tax ID"
                className="w-full bg-slate-50 dark:bg-slate-950 print:bg-transparent border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-600 dark:text-slate-400 print:text-black focus:outline-none"
              />
            </div>
          </div>

          {/* Client / Bill To */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 print:text-black flex items-center gap-1.5">
              <User size={14} />
              Billed To (Client Details)
            </h4>
            <div className="space-y-1.5">
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Client Name / Business"
                className="w-full bg-slate-50 dark:bg-slate-950 print:bg-transparent border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white print:text-black focus:outline-none focus:border-blue-500"
              />
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="Client Email"
                className="w-full bg-slate-50 dark:bg-slate-950 print:bg-transparent border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 print:text-black focus:outline-none"
              />
              <textarea
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                placeholder="Client Billing Address"
                rows={2}
                className="w-full bg-slate-50 dark:bg-slate-950 print:bg-transparent border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 print:text-black focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Currency Selector Bar (Hidden on Print) */}
        <div className="flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 print:hidden">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Billing Currency
          </span>
          <div className="flex gap-1.5">
            {CURRENCIES.map(curr => (
              <button
                key={curr.code}
                onClick={() => setCurrency(curr)}
                className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border transition-all ${
                  currency.code === curr.code
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                }`}
              >
                {curr.code} ({curr.symbol})
              </button>
            ))}
          </div>
        </div>

        {/* Line Items Table */}
        <div className="space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 print:border-slate-300 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-2 px-2 w-1/2">Item Description</th>
                  <th className="py-2 px-2 text-center w-16">Qty</th>
                  <th className="py-2 px-2 text-right w-28">Rate ({currency.symbol})</th>
                  <th className="py-2 px-2 text-right w-28">Amount ({currency.symbol})</th>
                  <th className="py-2 px-2 text-center w-10 print:hidden"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 print:divide-slate-200">
                {items.map((item) => (
                  <tr key={item.id} className="text-xs">
                    <td className="py-2.5 px-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 print:bg-transparent border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-xs text-slate-800 dark:text-slate-200 print:text-black focus:outline-none"
                      />
                    </td>
                    <td className="py-2.5 px-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-950 print:bg-transparent border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-xs text-center font-mono font-bold text-slate-800 dark:text-slate-200 print:text-black focus:outline-none"
                      />
                    </td>
                    <td className="py-2.5 px-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-950 print:bg-transparent border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-xs text-right font-mono text-slate-800 dark:text-slate-200 print:text-black focus:outline-none"
                      />
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono font-bold text-slate-900 dark:text-white print:text-black">
                      {currency.symbol}{(item.quantity * item.rate).toFixed(2)}
                    </td>
                    <td className="py-2.5 px-2 text-center print:hidden">
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={items.length <= 1}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-30 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={addItem}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer print:hidden"
          >
            <Plus size={14} />
            <span>Add Item</span>
          </button>
        </div>

        {/* Invoice Summary & Tax Totals */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
          {/* Notes & Terms */}
          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Payment Terms & Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-slate-50 dark:bg-slate-950 print:bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-700 dark:text-slate-300 print:text-black resize-none focus:outline-none"
            />
          </div>

          {/* Total Breakdown */}
          <div className="w-full sm:w-72 space-y-2 bg-slate-50 dark:bg-slate-950 print:bg-slate-100 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
              <span>Subtotal:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white print:text-black">
                {currency.symbol}{subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                Discount ({discountRate}%):
              </span>
              <span className="font-mono text-emerald-600 font-bold">
                -{currency.symbol}{discountAmount.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                GST / Tax ({taxRate}%):
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white print:text-black">
                +{currency.symbol}{taxAmount.toFixed(2)}
              </span>
            </div>

            {/* Configurable Tax Rate Inputs (Hidden on Print) */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 print:hidden">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase">Tax %</label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase">Discount %</label>
                <input
                  type="number"
                  value={discountRate}
                  onChange={(e) => setDiscountRate(Number(e.target.value))}
                  className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white print:text-black pt-3 border-t-2 border-slate-900 dark:border-white print:border-black">
              <span>Total Due:</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 print:text-black">
                {currency.symbol}{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceGenerator;
