import React from 'react';
import { CheckCircle2, Clock, ArrowRight, ShieldCheck, Sparkles, LayoutDashboard } from 'lucide-react';
import { motion } from 'motion/react';
import { PageId } from '../types';
import { useSubscription } from '../context/SubscriptionContext';

interface PaymentSuccessProps {
  onNavigatePage: (page: PageId) => void;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ onNavigatePage }) => {
  const { payments, userEmail } = useSubscription();

  const latestPayment = payments.length > 0 ? payments[0] : null;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-8">
      {/* Animated Success Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-xl"
      >
        <CheckCircle2 size={48} />
      </motion.div>

      {/* Title */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white font-display tracking-tight">
          Payment Request Submitted!
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Thank you! We have received your payment submission. Your transaction is currently being verified by our team.
        </p>
      </div>

      {/* Payment Summary Box */}
      {latestPayment && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl text-left space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 uppercase font-mono">Status</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-xs font-extrabold uppercase rounded-full border border-amber-500/20">
              <Clock size={12} className="animate-spin" />
              Pending Approval
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-mono uppercase text-[10px]">Order Reference</span>
              <strong className="text-slate-900 dark:text-white font-mono">{latestPayment.id}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-mono uppercase text-[10px]">Plan & Amount</span>
              <strong className="text-blue-600 dark:text-blue-400 font-bold">{latestPayment.planName} (₹{latestPayment.amount})</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-mono uppercase text-[10px]">UPI Ref / UTR</span>
              <strong className="text-slate-900 dark:text-white font-mono">{latestPayment.upiTransactionId}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-mono uppercase text-[10px]">Submitted For</span>
              <strong className="text-slate-900 dark:text-white">{latestPayment.userEmail}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Notification Banner */}
      <div className="p-4 bg-slate-900 text-slate-200 rounded-2xl border border-slate-800 text-xs text-left space-y-1.5">
        <div className="flex items-center gap-2 text-amber-400 font-bold">
          <Sparkles size={14} />
          <span>Next Steps:</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          Admin verification usually completes within <strong>5 to 15 minutes</strong>. You can check your activation status anytime from your <strong>User Dashboard</strong>.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigatePage('dashboard')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 cursor-pointer transition-colors"
        >
          <LayoutDashboard size={16} />
          <span>Open User Dashboard</span>
        </motion.button>

        <button
          onClick={() => onNavigatePage('home')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold text-xs rounded-xl cursor-pointer transition-colors"
        >
          <span>Return to Tools</span>
        </button>
      </div>
    </div>
  );
};
