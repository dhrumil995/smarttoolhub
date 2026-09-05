import React, { useState } from 'react';
import { Check, Zap, Sparkles, ShieldCheck, ArrowRight, HelpCircle, Star, Building2, ChevronDown, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PlanId, PageId } from '../types';
import { PLANS } from '../data/plans';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';

interface PricingProps {
  onNavigatePage: (page: PageId) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onNavigatePage }) => {
  const { subscription, setSelectedPlanForCheckout } = useSubscription();
  const { isAuthenticated } = useAuth();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSelectPlan = (planId: PlanId) => {
    if (planId === 'free') {
      onNavigatePage('dashboard');
      return;
    }
    
    setSelectedPlanForCheckout(planId);

    if (!isAuthenticated) {
      onNavigatePage('login');
      return;
    }

    onNavigatePage('payment');
  };

  const faqs = [
    {
      q: 'How does UPI Payment verification work?',
      a: 'When you select a plan, you can pay using any UPI App (GPay, PhonePe, Paytm, BHIM, CRED) by scanning the dynamic QR code or opening your UPI app. After completing the payment, paste your 12-digit UPI Transaction ID / UTR into the form. Our admin panel verifies the transaction and unlocks your subscription automatically.'
    },
    {
      q: 'When will my Premium tools be activated?',
      a: 'Payment verification usually takes 5 to 15 minutes. Once approved by our team, all 20+ Premium AI Business Tools and unlimited daily features unlock instantly.'
    },
    {
      q: 'Can I request a GST tax invoice?',
      a: 'Yes! All approved payments generate an official tax invoice with GST breakdown, downloadable in PDF format directly from your User Dashboard.'
    },
    {
      q: 'What happens when my 30-day plan expires?',
      a: 'You can easily renew your plan anytime from your User Dashboard or upgrade to a higher tier plan with no loss of data.'
    }
  ];

  return (
    <div className="space-y-16 py-4">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold uppercase tracking-wider">
          <Zap size={14} className="fill-blue-500" />
          Flexible & Transparent Pricing
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white font-display">
          Unlock Premium AI Tools & <br className="hidden sm:inline" /> Supercharge Your Business
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Choose the ideal plan to automate invoices, procurement, OCR extraction, and technical workflows with enterprise-grade AI speed.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {PLANS.map((plan) => {
          const isCurrent = subscription?.planId === plan.id && subscription?.status === 'Active';

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 transition-all duration-200 hover:-translate-y-1.5 ${
                plan.isPopular
                  ? 'bg-gradient-to-b from-blue-900/40 via-slate-900 to-slate-950 border-2 border-blue-500 shadow-2xl shadow-blue-500/20 text-white'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl'
              }`}
            >
              {/* Top Badge */}
              {plan.badge && (
                <div
                  className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[11px] font-black font-mono uppercase tracking-widest shadow-md ${
                    plan.isPopular
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {plan.badge}
                </div>
              )}

              <div>
                {/* Plan Header */}
                <div className="space-y-2 mb-6">
                  <h3 className={`text-xl font-bold tracking-tight ${plan.isPopular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs ${plan.isPopular ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'} min-h-[36px]`}>
                    {plan.description}
                  </p>
                </div>

                {/* Price Display */}
                <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${plan.isPopular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                      {plan.price === 0 ? '₹0' : `₹${plan.price}`}
                    </span>
                    <span className={`text-xs font-medium ${plan.isPopular ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
                      /{plan.billingPeriod}
                    </span>
                  </div>
                  <div className={`mt-2 text-xs font-semibold ${plan.isPopular ? 'text-amber-400' : 'text-blue-600 dark:text-blue-400'}`}>
                    {plan.aiLimit}
                  </div>
                </div>

                {/* Feature List */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className={`p-0.5 rounded-full mt-0.5 ${plan.isPopular ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
                        <Check size={14} className="stroke-[3]" />
                      </div>
                      <span className={`text-xs ${plan.isPopular ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div>
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-3 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-bold text-xs cursor-default flex items-center justify-center gap-2"
                  >
                    <Check size={16} />
                    <span>Current Active Plan</span>
                  </button>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-3.5 px-4 rounded-xl font-black text-xs cursor-pointer transition-all flex items-center justify-center gap-2 shadow-md ${
                      plan.isPopular
                        ? 'bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-blue-500/30'
                        : 'bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white'
                    }`}
                  >
                    <span>{plan.price === 0 ? 'Use Free Tools' : `Get ${plan.name} Plan`}</span>
                    <ArrowRight size={14} />
                  </motion.button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & UPI Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center lg:text-left">
            <span className="inline-block px-3 py-1 bg-amber-400/10 text-amber-400 border border-amber-400/20 text-xs font-mono font-bold uppercase rounded-md">
              Fast & Secure Payment
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Instant UPI Payment via Any Preferred App
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Scan dynamic QR codes or pay directly using Google Pay, PhonePe, Paytm, CRED, or BHIM UPI. Safe, zero extra gateway fees!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
            <div className="px-3 py-1.5 bg-slate-800 rounded-lg text-xs font-mono font-bold text-slate-200">Google Pay</div>
            <div className="px-3 py-1.5 bg-slate-800 rounded-lg text-xs font-mono font-bold text-slate-200">PhonePe</div>
            <div className="px-3 py-1.5 bg-slate-800 rounded-lg text-xs font-mono font-bold text-slate-200">Paytm</div>
            <div className="px-3 py-1.5 bg-slate-800 rounded-lg text-xs font-mono font-bold text-slate-200">BHIM UPI</div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="max-w-3xl mx-auto space-y-6 pt-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Everything you need to know about payments, activations, and invoices.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
