import React, { useState } from 'react';
import { Lock, Sparkles, CheckCircle2, ArrowRight, ShieldAlert, Key, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';
import { ToolId, PageId } from '../types';
import { useSubscription } from '../context/SubscriptionContext';
import { TOOLS } from '../data/tools';
import { UpgradePlanModal } from './UpgradePlanModal';

interface PremiumGuardProps {
  toolId: ToolId;
  onNavigatePage: (page: PageId) => void;
  children: React.ReactNode;
}

export const PremiumGuard: React.FC<PremiumGuardProps> = ({
  toolId,
  onNavigatePage,
  children
}) => {
  const { isToolUnlocked, userEmail, setUserEmail, subscription, refreshData } = useSubscription();
  const [emailInput, setEmailInput] = useState(userEmail || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(true);

  const tool = TOOLS.find((t) => t.id === toolId);
  const isUnlocked = isToolUnlocked(toolId);

  if (isUnlocked) {
    return <>{children}</>;
  }

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setIsVerifying(true);
    setVerifyMsg('');
    setUserEmail(emailInput.trim());
    await refreshData();
    setIsVerifying(false);
    setVerifyMsg('Checked subscription status for ' + emailInput.trim());
  };

  return (
    <>
      {/* Upgrade Plan Comparison Modal Triggered */}
      <UpgradePlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        toolId={toolId}
        onNavigatePage={onNavigatePage}
      />

      <div className="relative w-full rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-900/90 via-slate-950 to-indigo-950/80 p-8 sm:p-12 text-white shadow-2xl backdrop-blur-xl overflow-hidden">
        {/* Background Decorative Blur Spheres */}
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
          
          {/* Animated Badge Header */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest"
          >
            <Lock size={14} className="animate-pulse" />
            <span>Premium Tool Access Required</span>
          </motion.div>

          {/* Title */}
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
              Unlock <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">{tool?.name || 'This Tool'}</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              This AI tool is exclusive to <strong className="text-amber-300">Starter, Pro, and Business Subscribers</strong>. Upgrade your account today to unlock full access.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-2xl mx-auto bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-slate-200">Unlock 20+ Enterprise AI Business Tools</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-slate-200">Instant AI OCR & Automatic Reconciliation</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-slate-200">Unlimited Usage without Daily Rate Limits</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-slate-200">Download Official PDF Invoices</span>
            </div>
          </div>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
            >
              <BarChart3 size={16} />
              <span>View Plan Comparison & Upgrade</span>
              <ArrowRight size={16} />
            </motion.button>

            <button
              onClick={() => onNavigatePage('pricing')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-bold text-sm rounded-xl border border-slate-700 cursor-pointer transition-colors"
            >
              <Sparkles size={16} className="text-amber-400" />
              <span>All Pricing Plans</span>
            </button>
          </div>

          {/* Subscription Verification Form */}
          <div className="pt-6 border-t border-slate-800/80 max-w-md mx-auto">
            <p className="text-xs text-slate-400 mb-3">
              Already submitted payment or have an active account? Verify with your email:
            </p>
            <form onSubmit={handleCheckStatus} className="flex gap-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your registered email..."
                className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              />
              <button
                type="submit"
                disabled={isVerifying}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors disabled:opacity-50"
              >
                {isVerifying ? 'Checking...' : 'Check Status'}
              </button>
            </form>
            {verifyMsg && (
              <p className="text-[11px] text-amber-400 mt-2 font-mono">
                {verifyMsg} — Current Status: <strong className="uppercase">{subscription?.status || 'FREE'}</strong>
              </p>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

