import React, { useState } from 'react';
import { Clock, Send, Mail, Check, AlertTriangle, Sparkles, Copy } from 'lucide-react';
import BusinessWorkspaceHeader from './BusinessWorkspaceHeader';

export default function PaymentReminderSystem() {
  const [activeTab, setActiveTab] = useState<'tool' | 'history' | 'cloud'>('tool');
  const [tone, setTone] = useState<'Polite' | 'Firm' | 'Final Notice'>('Polite');
  const [invoiceNo, setInvoiceNo] = useState('INV-9021');
  const [clientName, setClientName] = useState('Apex Steel Industries');
  const [amount, setAmount] = useState('7,965.00');
  const [dueDate, setDueDate] = useState('2026-07-28');
  const [copied, setCopied] = useState(false);

  const generateTemplate = () => {
    if (tone === 'Polite') {
      return `Dear Accounts Team at ${clientName},\n\nHope you are having a productive week.\n\nThis is a friendly reminder regarding Invoice #${invoiceNo} for $${amount}, which was due on ${dueDate}.\n\nWe kindly request you to confirm the status of payment dispatch. Please find attached a copy of the invoice for your reference.\n\nThank you for your partnership!\n\nBest regards,\nSmartToolHub Accounts Receivable`;
    } else if (tone === 'Firm') {
      return `ATTENTION: Accounts Payable - ${clientName}\n\nSUBJECT: OVERDUE PAYMENT REMINDER - Invoice #${invoiceNo}\n\nWe would like to bring to your immediate attention that Invoice #${invoiceNo} in the amount of $${amount} remains unpaid past its original due date of ${dueDate}.\n\nPlease arrange for the immediate release of funds or share the UTR payment transaction reference at your earliest convenience to maintain an uninterrupted credit cycle.\n\nSincerely,\nFinance & Collections Dept`;
    } else {
      return `URGENT / FINAL NOTICE: OVERDUE ACCOUNT COLLECTION\n\nTO: ${clientName}\nRE: Outstanding Invoice #${invoiceNo} ($${amount})\nORIGINAL DUE DATE: ${dueDate}\n\nDespite multiple prior notices, payment for Invoice #${invoiceNo} has not been received. Please be advised that unless payment is remitted within 48 hours, interest penalties will apply and your credit facility will be temporarily suspended.\n\nPlease remit $${amount} immediately and send transaction confirmation.`;
    }
  };

  const templateText = generateTemplate();

  const handleCopy = () => {
    navigator.clipboard.writeText(templateText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <BusinessWorkspaceHeader
        title="Payment Reminder System"
        description="Automate payment collection workflows with AI-crafted polite, firm, or final-notice email and WhatsApp payment reminder drafts."
        toolId="payment-reminder-system"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === 'tool' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-500" /> Overdue Invoice Details
            </h3>

            <div>
              <label className="text-slate-500 block mb-0.5">Invoice Number</label>
              <input type="text" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold" />
            </div>

            <div>
              <label className="text-slate-500 block mb-0.5">Client Company Name</label>
              <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-500 block mb-0.5">Amount Due ($)</label>
                <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-indigo-600" />
              </div>
              <div>
                <label className="text-slate-500 block mb-0.5">Due Date</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-medium" />
              </div>
            </div>

            <div>
              <label className="text-slate-500 block mb-1 font-semibold">Reminder Tone:</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Polite', 'Firm', 'Final Notice'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      tone === t ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Mail className="h-4 w-4 text-indigo-500" /> AI Generated Payment Notice
                </h3>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy Notice Text'}
                </button>
              </div>

              <textarea
                readOnly
                value={templateText}
                className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-slate-100 leading-relaxed focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
