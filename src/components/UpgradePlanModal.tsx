import React from 'react';
import {
  X,
  Lock,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ToolId, PageId, PlanId } from '../types';
import { PLANS } from '../data/plans';
import { TOOLS } from '../data/tools';
import { useSubscription } from '../context/SubscriptionContext';

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolId: ToolId;
  onNavigatePage: (page: PageId) => void;
}

export const UpgradePlanModal: React.FC<UpgradePlanModalProps> = ({
  isOpen,
  onClose,
  toolId,
  onNavigatePage
}) => {
  const { subscription, setSelectedPlanForCheckout } = useSubscription();

  if (!isOpen) return null;

  const tool = TOOLS.find((t) => t.id === toolId);

  // Determine current user plan
  const currentPlanId: PlanId = (subscription && subscription.status === 'Active')
    ? subscription.planId
    : 'free';

  const currentPlan = PLANS.find((p) => p.id === currentPlanId) || PLANS[0];

  // Required plan is Pro by default for full premium tools, or Starter if current is Free
  const requiredPlanId: PlanId = currentPlanId === 'starter' ? 'pro' : 'pro';
  const requiredPlan = PLANS.find((p) => p.id === requiredPlanId) || PLANS[2];

  const handleUpgradeClick = (planId: PlanId) => {
    setSelectedPlanForCheckout(planId);
    onClose();
    onNavigatePage('payment');
  };

  const handleViewAllPlans = () => {
    onClose();
    onNavigatePage('pricing');
  };

  // Comparison metrics rows
  const comparisonRows = [
    {
      feature: `${tool?.name || 'This Tool'} Access`,
      current: false,
      required: true,
      currentText: 'Locked',
      requiredText: 'Full Access Unlocked'
    },
    {
      feature: '20+ AI Business & Finance Tools',
      current: currentPlanId !== 'free',
      required: true,
      currentText: currentPlanId === 'free' ? 'Locked' : 'Partial Access',
      requiredText: 'Unlocked'
    },
    {
      feature: 'AI Operations & Limit',
      current: false,
      required: true,
      currentText: currentPlan.aiLimit,
      requiredText: requiredPlan.aiLimit
    },
    {
      feature: 'AI OCR & Document Scanning',
      current: currentPlanId === 'pro' || currentPlanId === 'business',
      required: true,
      currentText: currentPlanId === 'free' ? 'Disabled' : 'Basic',
      requiredText: 'Advanced Auto-Reconciliation'
    },
    {
      feature: 'Download Official GST Invoices',
      current: currentPlanId === 'pro' || currentPlanId === 'business',
      required: true,
      currentText: currentPlanId === 'free' ? 'No' : 'Yes',
      requiredText: 'Yes (PDF Download)'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
        {/* Backdrop click to close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden my-8 z-10"
        >
          {/* Decorative Background Blur Elements */}
          <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

          {/* Close Button Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 bg-slate-900/50">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Lock size={16} />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Premium Feature Guard
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Content Body */}
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Header Title */}
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
                Upgrade Required to Access{' '}
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                  {tool?.name || 'This Premium Tool'}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                You are currently on the <strong className="text-slate-100">{currentPlan.name} Plan</strong>. Upgrade to the <strong className="text-amber-400">{requiredPlan.name} Plan</strong> to unlock full access to this tool and all enterprise features.
              </p>
            </div>

            {/* Side-By-Side Plan Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Current Plan */}
              <div className="rounded-2xl p-6 bg-slate-900/80 border border-slate-800 space-y-4 relative flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Your Current Plan
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono font-bold">
                      ACTIVE
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white">{currentPlan.name} Plan</h3>
                    <div className="text-2xl font-extrabold text-slate-300 font-mono mt-1">
                      {currentPlan.price === 0 ? '₹0' : `₹${currentPlan.price}`}
                      <span className="text-xs text-slate-400 font-sans font-normal"> / {currentPlan.billingPeriod}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed min-h-[32px]">
                    {currentPlan.description}
                  </p>

                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <XCircle size={14} className="text-red-400 flex-shrink-0" />
                      <span className="text-slate-400">{tool?.name || 'Premium Tool'} Access: <strong className="text-red-400">Locked</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                      <span>{currentPlan.aiLimit}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    disabled
                    className="w-full py-2.5 px-4 bg-slate-800/80 text-slate-400 text-xs font-bold rounded-xl border border-slate-700/60 cursor-not-allowed text-center"
                  >
                    Current Plan ({currentPlan.name})
                  </button>
                </div>
              </div>

              {/* Card 2: Required / Recommended Upgrade Plan */}
              <div className="rounded-2xl p-6 bg-gradient-to-b from-blue-950/60 via-slate-900 to-slate-950 border-2 border-amber-400/80 space-y-4 relative flex flex-col justify-between shadow-xl shadow-amber-500/10">
                {/* Badge */}
                <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-mono font-black uppercase tracking-wider shadow-md">
                  RECOMMENDED UNLOCK
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                      <Sparkles size={12} />
                      Required Plan
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white">{requiredPlan.name} Plan</h3>
                    <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">
                      ₹{requiredPlan.price}
                      <span className="text-xs text-slate-300 font-sans font-normal"> / {requiredPlan.billingPeriod}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed min-h-[32px]">
                    {requiredPlan.description}
                  </p>

                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-white">
                      <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                      <span className="font-bold text-amber-300">Unlocks {tool?.name || 'This Tool'} Instantly</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                      <span>{requiredPlan.aiLimit}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleUpgradeClick(requiredPlan.id)}
                    className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    <Zap size={14} className="fill-slate-950" />
                    <span>Upgrade to {requiredPlan.name} Plan (₹{requiredPlan.price})</span>
                    <ArrowRight size={14} />
                  </motion.button>
                </div>
              </div>

            </div>

            {/* Feature Comparison Table */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <ShieldCheck size={14} className="text-blue-400" />
                Plan Feature Comparison
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                      <th className="pb-2">Feature</th>
                      <th className="pb-2 text-center">{currentPlan.name} (Current)</th>
                      <th className="pb-2 text-center text-amber-400">{requiredPlan.name} (Required)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {comparisonRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-850/50">
                        <td className="py-2.5 font-medium text-slate-200">{row.feature}</td>
                        
                        <td className="py-2.5 text-center font-mono text-slate-400">
                          {row.current ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                              <Check size={12} /> {row.currentText}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-400">
                              <XCircle size={12} /> {row.currentText}
                            </span>
                          )}
                        </td>

                        <td className="py-2.5 text-center font-mono">
                          <span className="inline-flex items-center gap-1 text-amber-300 font-bold">
                            <CheckCircle2 size={12} className="text-amber-400" /> {row.requiredText}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Footer Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <button
                onClick={handleViewAllPlans}
                className="text-xs text-blue-400 hover:text-blue-300 underline font-bold cursor-pointer"
              >
                Compare All Available Plans (Starter, Pro, Business) →
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Close & Return
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
