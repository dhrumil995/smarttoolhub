import React, { useRef } from 'react';
import { X, Printer, Download, CheckCircle2, Building2 } from 'lucide-react';
import { PaymentRequest } from '../types';
import Logo from './Logo';

interface InvoiceModalProps {
  payment: PaymentRequest;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ payment, onClose }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(payment.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Calculate tax breakdown (inclusive 18% GST or standard)
  const baseAmount = Math.round(payment.amount / 1.18);
  const gstAmount = payment.amount - baseAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Official Tax Invoice & Receipt
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs"
            >
              <Printer size={14} />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div ref={invoiceRef} className="p-8 space-y-8 bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Logo size={40} />
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                  SmartToolHub Technologies
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  SaaS Utilities & AI Automation Platform
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  GSTIN: 24AAAAA0000A1Z5 | Support: support@smarttoolhub.net
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-black uppercase rounded-md border border-emerald-500/20 mb-1">
                PAID & APPROVED
              </span>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Invoice No: <strong className="text-slate-900 dark:text-white">{payment.id.replace('STH-ORD-', 'INV-2026-')}</strong>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Date: {formattedDate}
              </p>
            </div>
          </div>

          {/* Billed To & Billed From */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-950/60 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">
                Billed To (Customer)
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {payment.userName}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Email: {payment.userEmail}
              </p>
              {payment.userPhone && (
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Phone: {payment.userPhone}
                </p>
              )}
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">
                Payment Details
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Method: <strong className="text-slate-900 dark:text-white">UPI Transfer</strong>
              </p>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                UPI ID: <span className="font-mono">{payment.upiIdUsed}</span>
              </p>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                UTR / Txn ID: <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{payment.upiTransactionId}</span>
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="py-3 px-2">Description</th>
                  <th className="py-3 px-2 text-center">Billing Cycle</th>
                  <th className="py-3 px-2 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                <tr>
                  <td className="py-4 px-2">
                    <span className="font-bold text-slate-900 dark:text-white block text-sm">
                      SmartToolHub {payment.planName}
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Full Premium Tool Access + AI Automation Features (30 Days Validity)
                    </span>
                  </td>
                  <td className="py-4 px-2 text-center font-mono text-slate-600 dark:text-slate-300">
                    Monthly
                  </td>
                  <td className="py-4 px-2 text-right font-mono font-bold text-slate-900 dark:text-white text-sm">
                    ₹{baseAmount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total Calculation */}
          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="w-full max-w-xs space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span className="font-mono">₹{baseAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>GST (18% Included):</span>
                <span className="font-mono">₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-sm font-extrabold text-slate-950 dark:text-white">
                <span>Total Amount Paid:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                  ₹{payment.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Terms */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 text-center space-y-1">
            <p>Thank you for subscribing to SmartToolHub! This is a computer-generated invoice and requires no physical signature.</p>
            <p className="font-mono">For billing inquiries or tax invoice adjustments, contact billing@smarttoolhub.net</p>
          </div>

        </div>
      </div>
    </div>
  );
};
