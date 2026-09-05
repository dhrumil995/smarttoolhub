import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  Download,
  CreditCard,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Shield,
  User,
  Zap,
  ArrowRight,
  ShieldCheck,
  Check,
  Loader2,
  Lock
} from 'lucide-react';
import { motion } from 'motion/react';
import { PageId, PaymentRequest } from '../types';
import { useSubscription } from '../context/SubscriptionContext';
import { InvoiceModal } from '../components/InvoiceModal';

interface UserDashboardProps {
  onNavigatePage: (page: PageId) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onNavigatePage }) => {
  const {
    userEmail,
    setUserEmail,
    subscription,
    payments,
    getRemainingDays,
    refreshData,
    toggleAutoRenew,
    loading
  } = useSubscription();

  const [emailInput, setEmailInput] = useState(userEmail || '');
  const [selectedInvoice, setSelectedInvoice] = useState<PaymentRequest | null>(null);
  const [isTogglingAutoRenew, setIsTogglingAutoRenew] = useState(false);
  const [autoRenewMessage, setAutoRenewMessage] = useState<string | null>(null);

  const remainingDays = getRemainingDays();
  const isAutoRenewEnabled = Boolean(subscription.autoRenew);

  const handleToggleAutoRenew = async () => {
    setIsTogglingAutoRenew(true);
    setAutoRenewMessage(null);
    const nextState = !isAutoRenewEnabled;
    const res = await toggleAutoRenew(nextState);
    setIsTogglingAutoRenew(false);
    if (res.success) {
      setAutoRenewMessage(res.message || (nextState ? 'Auto-renew enabled. Payment processor notified.' : 'Auto-renew disabled.'));
    } else {
      setAutoRenewMessage(res.error || 'Failed to update auto-renew setting.');
    }
  };

  // Filter payments for current user
  const userPayments = payments.filter(
    (p) => p.userEmail.toLowerCase() === userEmail.toLowerCase()
  );

  const handleSwitchEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setUserEmail(emailInput.trim());
    }
  };

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return 'N/A';
    try {
      return new Date(isoStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-10 py-4 max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white font-display tracking-tight flex items-center gap-2">
            User Subscription Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage active plan, check remaining days, and download official tax invoices.
          </p>
        </div>

        {/* Email Switcher */}
        <form onSubmit={handleSwitchEmail} className="flex items-center gap-2">
          <div className="relative">
            <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Your email address..."
              className="pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
          >
            Switch
          </button>
        </form>
      </div>

      {/* Subscription Status Card */}
      <div className="relative rounded-3xl p-8 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white shadow-2xl border border-slate-800 overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
                Current Subscription Plan
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border ${
                  subscription.status === 'Active'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : subscription.status === 'Pending'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {subscription.status}
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
                {subscription.planName}
              </h2>
              <p className="text-xs text-slate-300 font-mono">
                Account Email: <strong className="text-amber-400">{userEmail}</strong>
              </p>
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-mono text-[10px] uppercase block">Start Date</span>
                <span className="font-bold text-white font-mono">{formatDate(subscription.startDate)}</span>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-mono text-[10px] uppercase block">Expiry Date</span>
                <span className="font-bold text-white font-mono">{formatDate(subscription.expiryDate)}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Remaining Days Counter & Upgrade CTA */}
          <div className="flex flex-col items-start md:items-end space-y-4 w-full md:w-auto">
            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 text-center w-full md:w-56 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                Remaining Days
              </span>
              <div className="text-4xl font-extrabold text-amber-400 font-mono">
                {remainingDays} <span className="text-xs font-sans text-slate-300">Days</span>
              </div>
              <span className="text-[10px] text-slate-400 block pt-1">
                {remainingDays > 0 ? 'Full Tool Access Granted' : 'Upgrade to Unlock Premium'}
              </span>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigatePage('pricing')}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
            >
              <Zap size={14} className="fill-slate-950" />
              <span>{remainingDays > 0 ? 'Renew / Upgrade Plan' : 'Get Subscription'}</span>
              <ArrowRight size={14} />
            </motion.button>
          </div>

        </div>
      </div>

      {/* Auto-Renew Subscription Settings Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <RefreshCw size={18} className="text-blue-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Auto-Renew Subscription
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                  isAutoRenewEnabled
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                }`}
              >
                {isAutoRenewEnabled ? 'Auto-Renew ON' : 'Auto-Renew OFF'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              When enabled, your payment processor will automatically maintain your continuous tool access before your plan expires ({formatDate(subscription.expiryDate)}). You won't experience service interruption.
            </p>
          </div>

          {/* Toggle Switch Component */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {isAutoRenewEnabled ? 'Enabled' : 'Disabled'}
            </span>

            <button
              type="button"
              onClick={handleToggleAutoRenew}
              disabled={isTogglingAutoRenew}
              className={`relative inline-flex h-8 w-15 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isAutoRenewEnabled
                  ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-300 dark:bg-slate-700'
              } ${isTogglingAutoRenew ? 'opacity-60 cursor-wait' : ''}`}
              role="switch"
              aria-checked={isAutoRenewEnabled}
            >
              <span
                className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out flex items-center justify-center text-slate-800 ${
                  isAutoRenewEnabled ? 'translate-x-7' : 'translate-x-0'
                }`}
              >
                {isTogglingAutoRenew ? (
                  <Loader2 size={12} className="animate-spin text-slate-600" />
                ) : isAutoRenewEnabled ? (
                  <Check size={12} className="text-emerald-600 font-extrabold" />
                ) : (
                  <Lock size={12} className="text-slate-400" />
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Status Toast / Alert Message */}
        {autoRenewMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
              isAutoRenewEnabled
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <ShieldCheck size={16} className={isAutoRenewEnabled ? 'text-emerald-500' : 'text-slate-400'} />
            <span>{autoRenewMessage}</span>
          </motion.div>
        )}
      </div>

      {/* Payment History Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard size={20} className="text-blue-500" />
              Payment History
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              History of all UPI payment requests submitted for <strong className="text-slate-700 dark:text-slate-300">{userEmail}</strong>
            </p>
          </div>

          <button
            onClick={() => refreshData()}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
            title="Refresh Table"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {userPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Plan</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">UPI Txn ID</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {userPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                      {p.id}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {p.planName}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                      ₹{p.amount}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                      {p.upiTransactionId}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">
                      {formatDate(p.createdAt)}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase ${
                          p.status === 'Approved'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : p.status === 'Pending'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                        }`}
                      >
                        {p.status === 'Approved' && <CheckCircle2 size={10} />}
                        {p.status === 'Pending' && <Clock size={10} />}
                        {p.status === 'Rejected' && <XCircle size={10} />}
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {p.status === 'Approved' ? (
                        <button
                          onClick={() => setSelectedInvoice(p)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] rounded-lg cursor-pointer transition-colors"
                        >
                          <Download size={12} />
                          <span>Invoice</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">
                          {p.status === 'Pending' ? 'Pending Approval' : 'N/A'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 space-y-3">
            <FileText size={32} className="mx-auto text-slate-400" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No Payment History Found for {userEmail}
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              If you submitted a payment under a different email address, use the email switcher above to view your records.
            </p>
            <button
              onClick={() => onNavigatePage('pricing')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              <span>Subscribe Now</span>
            </button>
          </div>
        )}
      </div>

      {/* Invoice Modal Overlay */}
      {selectedInvoice && (
        <InvoiceModal
          payment={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};
