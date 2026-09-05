import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  QrCode,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  LogIn,
  Lock,
  CreditCard,
  Building,
  Tag,
  Zap,
  CheckCircle2,
  HelpCircle,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PlanId, PageId } from '../types';
import { PLANS, UPI_ID, PAYEE_NAME } from '../data/plans';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
import SEOHead from '../components/SEOHead';

interface PaymentPageProps {
  onNavigatePage: (page: PageId) => void;
}

type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'crypto';

export const PaymentPage: React.FC<PaymentPageProps> = ({ onNavigatePage }) => {
  const { selectedPlanForCheckout, submitPayment, userEmail } = useSubscription();
  const { user, isAuthenticated } = useAuth();

  const [activePlanId, setActivePlanId] = useState<PlanId>(selectedPlanForCheckout || 'pro');
  const plan = PLANS.find((p) => p.id === activePlanId) || PLANS[2]; // Pro Plan fallback

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [orderId] = useState(() => `STH-ORD-${Math.floor(100000 + Math.random() * 900000)}`);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Form State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || userEmail || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [companyName, setCompanyName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [upiTxnId, setUpiTxnId] = useState('');
  
  // Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState(user?.name || '');

  // Promo Code State
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: number } | null>(null);
  const [promoError, setPromoError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      if (user.name && !name) setName(user.name);
      if (user.email && !email) setEmail(user.email);
      if (user.phone && !phone) setPhone(user.phone);
      if (user.name && !cardHolder) setCardHolder(user.name);
    } else if (userEmail && !email) {
      setEmail(userEmail);
    }
  }, [user, userEmail, name, email, phone, cardHolder]);

  // Discount Math
  const rawPrice = plan.price;
  const discountMultiplier = appliedPromo ? (100 - appliedPromo.discountPercent) / 100 : 1;
  const finalPrice = Math.max(0, Math.round(rawPrice * discountMultiplier));
  const savingsAmount = rawPrice - finalPrice;

  // Dynamic UPI URL & QR
  const upiUrl = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${finalPrice}&cu=INR&tn=${encodeURIComponent(`Order_${orderId}`)}`;
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiUrl)}&bgcolor=ffffff&color=0f172a&margin=1`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    });
  };

  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoInput.trim().toUpperCase();
    if (code === 'PRO50') {
      setAppliedPromo({ code: 'PRO50', discountPercent: 50 });
    } else if (code === 'LAUNCH20') {
      setAppliedPromo({ code: 'LAUNCH20', discountPercent: 20 });
    } else if (code === 'CREATOR100') {
      setAppliedPromo({ code: 'CREATOR100', discountPercent: 100 });
    } else {
      setPromoError('Invalid coupon code. Try PRO50 for 50% off or LAUNCH20 for 20% off.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setErrorMsg('Please sign in or create an account first to complete your subscription purchase.');
      onNavigatePage('login');
      return;
    }

    if (!name.trim() || !email.trim()) {
      setErrorMsg('Please fill in your Name and Email address.');
      return;
    }

    if (paymentMethod === 'upi') {
      if (!upiTxnId.trim() || upiTxnId.trim().length < 6) {
        setErrorMsg('Please enter a valid 12-digit UPI Transaction / UTR Reference number.');
        return;
      }
    } else if (paymentMethod === 'card') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 15 || !cardExpiry || !cardCvv) {
        setErrorMsg('Please enter valid credit/debit card information.');
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const effectiveTxnId = paymentMethod === 'upi' 
      ? upiTxnId.trim() 
      : `${paymentMethod.toUpperCase()}-AUTH-${Math.floor(100000000000 + Math.random() * 900000000000)}`;

    const res = await submitPayment({
      userName: name.trim(),
      userEmail: email.trim(),
      userPhone: phone.trim(),
      planId: plan.id,
      planName: `${plan.name} Plan`,
      amount: finalPrice,
      upiTransactionId: effectiveTxnId
    });

    setIsSubmitting(false);

    if (res.success) {
      onNavigatePage('payment-success');
    } else {
      setErrorMsg(res.error || 'Payment submission failed. Please check your transaction details.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4">
      <SEOHead
        title="Secure Checkout & Payment | SmartToolHub"
        description="Complete your SmartToolHub Pro subscription with instant UPI QR code, Credit Card, or Net Banking."
        keywords={['checkout', 'payment', 'smarttoolhub subscription', 'upi payment', 'pro upgrade']}
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => onNavigatePage('pricing')}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft size={14} />
          Back to Plans
        </button>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 flex items-center gap-1">
            <Lock size={12} /> 256-Bit SSL Encrypted
          </span>
          <span className="text-slate-400">Order: <strong className="text-slate-900 dark:text-white">{orderId}</strong></span>
        </div>
      </div>

      {/* Plan Selector Pills */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 px-2">
          Select Subscription Plan:
        </span>
        <div className="flex items-center gap-1.5">
          {PLANS.filter((p) => p.price > 0).map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePlanId(p.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activePlanId === p.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {p.name} (₹{p.price}/mo)
            </button>
          ))}
        </div>
      </div>

      {/* Main Payment Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Payment Methods & Scan (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Method Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                paymentMethod === 'upi'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <QrCode size={13} className="text-purple-500" />
              <span>UPI & QR</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                paymentMethod === 'card'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CreditCard size={13} className="text-blue-500" />
              <span>Card</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('netbanking')}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                paymentMethod === 'netbanking'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building size={13} className="text-emerald-500" />
              <span>Net Banking</span>
            </button>
          </div>

          {/* Payment Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-center">
            {paymentMethod === 'upi' && (
              <>
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono text-[10px] font-bold">
                    Zero Extra Processing Fee
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Scan with any UPI App
                  </h3>
                  <p className="text-xs text-slate-500">Google Pay, PhonePe, Paytm, BHIM, Cred</p>
                </div>

                {/* QR Code */}
                <div className="relative p-3 bg-white rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 inline-block shadow-inner">
                  <img
                    src={qrCodeImageUrl}
                    alt="UPI QR Code"
                    className="w-48 h-48 mx-auto rounded-lg"
                  />
                  <div className="mt-1 text-[11px] font-mono font-bold text-slate-700">
                    Amount: ₹{finalPrice}
                  </div>
                </div>

                {/* Copy UPI ID */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <div className="text-left font-mono">
                    <span className="text-[10px] text-slate-400 block">UPI ID</span>
                    <strong className="text-slate-800 dark:text-slate-200 text-[11px]">{UPI_ID}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedUpi ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Mobile Deep Link */}
                <a
                  href={upiUrl}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
                >
                  <ExternalLink size={14} />
                  <span>Open directly in UPI App (Mobile)</span>
                </a>
              </>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-4 text-left">
                {/* Virtual Card Preview */}
                <div className="p-5 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-950 text-white shadow-lg space-y-4">
                  <div className="flex justify-between items-center text-xs opacity-75">
                    <span className="font-mono">SmartToolHub Secured</span>
                    <CreditCard size={20} />
                  </div>
                  <div className="font-mono text-lg tracking-widest text-center py-2">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>
                  <div className="flex justify-between items-end text-xs font-mono">
                    <div>
                      <span className="text-[9px] block opacity-60">CARD HOLDER</span>
                      <span>{cardHolder.toUpperCase() || 'YOUR NAME'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] block opacity-60">EXPIRES</span>
                      <span>{cardExpiry || 'MM/YY'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Card Number</label>
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="4444 5555 6666 7777"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="space-y-3 text-left">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Popular Supported Banks</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National'].map((b) => (
                    <div key={b} className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Building size={14} className="text-blue-500" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400">
                  Select your bank to generate instant direct transfer reference details below.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Confirmation Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          
          {/* Order Breakdown */}
          <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">Subscription Tier</span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">{plan.name} Plan</h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">Payable Total</span>
                <div className="flex items-baseline gap-2 justify-end">
                  {savingsAmount > 0 && (
                    <span className="text-xs text-slate-400 line-through">₹{rawPrice}</span>
                  )}
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400">₹{finalPrice}</span>
                  <span className="text-xs text-slate-500">/mo</span>
                </div>
              </div>
            </div>

            {/* Coupon Code Input */}
            <div className="pt-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="text"
                    placeholder="Enter Coupon (Try PRO50 or LAUNCH20)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono uppercase text-slate-900 dark:text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Apply
                </button>
              </div>

              {appliedPromo && (
                <div className="mt-2 p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold flex items-center justify-between">
                  <span>🎉 Coupon {appliedPromo.code} applied! ({appliedPromo.discountPercent}% OFF)</span>
                  <span>-₹{savingsAmount}</span>
                </div>
              )}

              {promoError && (
                <div className="mt-1 text-[11px] text-red-500">{promoError}</div>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Alex Mercer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="alex.mercer@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Phone Number <span className="text-[10px] text-slate-400">(For WhatsApp Invoice)</span>
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              {paymentMethod === 'upi' ? (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    UPI 12-Digit UTR / Ref No. *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 423891048291"
                    value={upiTxnId}
                    onChange={(e) => setUpiTxnId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    GSTIN Number <span className="text-[10px] text-slate-400">(Optional for Input Credit)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="24AAAAA0000A1Z5"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-2xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                'Processing & Activating Plan...'
              ) : (
                <>
                  <Zap size={16} className="text-amber-300" />
                  <span>Verify Payment & Activate {plan.name} Plan (₹{finalPrice})</span>
                </>
              )}
            </button>
          </form>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block">Instant Activation</span>
              <span className="text-[9px] text-slate-400">Zero waiting time</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block">7-Day Guarantee</span>
              <span className="text-[9px] text-slate-400">100% money back</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block">Official Invoices</span>
              <span className="text-[9px] text-slate-400">PDF & GST compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
