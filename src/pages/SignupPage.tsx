import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Code2,
  Video,
  Building2,
  GraduationCap,
  Sparkles,
  Check,
  X,
  Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { PageId } from '../types';
import SEOHead from '../components/SEOHead';

interface SignupPageProps {
  onNavigatePage: (page: PageId) => void;
}

const ROLES = [
  { id: 'developer', label: 'Developer', icon: Code2 },
  { id: 'creator', label: 'Creator / YTR', icon: Video },
  { id: 'business', label: 'Business Owner', icon: Building2 },
  { id: 'student', label: 'Student', icon: GraduationCap },
];

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigatePage }) => {
  const { signup } = useAuth();
  const { selectedPlanForCheckout } = useSubscription();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('developer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password validation checks
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    match: password.length > 0 && password === confirmPassword,
  };

  const handleFillSample = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setName(`Alex Mercer ${randomNum}`);
    setEmail(`alex.mercer${randomNum}@gmail.com`);
    setPhone('+1 (555) 234-5678');
    setPassword('Pass@word1234');
    setConfirmPassword('Pass@word1234');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim() || !email.trim() || !password) {
      setErrorMessage('Please fill in your name, email address, and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your password confirmation.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Please agree to the Terms of Service to create an account.');
      return;
    }

    setLoading(true);
    try {
      const res = await signup(name.trim(), email.trim(), password, phone.trim());
      if (res.success) {
        setSuccessMessage('Account created successfully! Welcome to SmartToolHub.');
        setTimeout(() => {
          if (selectedPlanForCheckout) {
            onNavigatePage('payment');
          } else {
            onNavigatePage('dashboard');
          }
        }, 900);
      } else {
        setErrorMessage(res.error || 'Failed to create account. Email may already be in use.');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred during account creation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="Create Free Account | SmartToolHub"
        description="Sign up for SmartToolHub to access premium developer utilities, saved tool templates, and custom invoice management."
        keywords={['sign up', 'register account', 'smarttoolhub auth', 'free developer account']}
      />

      <div className="max-w-md w-full space-y-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Auth Tab Switcher */}
        <div className="flex items-center justify-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
          <button
            type="button"
            onClick={() => onNavigatePage('login')}
            className="w-1/2 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
          >
            Sign In
          </button>
          <button
            type="button"
            className="w-1/2 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs transition-all cursor-pointer"
          >
            Create Account
          </button>
        </div>

        {/* Selected Plan Banner */}
        {selectedPlanForCheckout && (
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
            <Crown size={15} className="text-amber-500 shrink-0" />
            <span>
              Sign up to complete instant activation for <strong className="capitalize">{selectedPlanForCheckout} Plan</strong>.
            </span>
          </div>
        )}

        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Create Free Account
            </h1>
            <button
              type="button"
              onClick={handleFillSample}
              title="1-Click Auto Fill Test Data"
              className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Sparkles size={11} />
              Auto Fill
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Get instant access to 60+ utilities and daily AI generation credits.
          </p>
        </div>

        {/* Role / Goal Selector */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
            I primarily use tools as a:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {ROLES.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRole(r.id)}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold ring-1 ring-blue-500/30'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <Icon size={14} />
                  <span className="text-[10px] leading-tight truncate">{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Alerts */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs flex items-center gap-2"
            >
              <AlertCircle size={15} className="shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs flex items-center gap-2"
            >
              <CheckCircle2 size={15} className="shrink-0" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                required
                placeholder="Alex Mercer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="email"
                required
                placeholder="alex.mercer@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Phone Number <span className="text-[10px] text-slate-400 font-normal">(Optional for Invoices)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Create Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Interactive Criteria Indicators */}
          {password && (
            <div className="grid grid-cols-2 gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-[10px]">
              <div className={`flex items-center gap-1 font-medium ${checks.length ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                {checks.length ? <Check size={12} /> : <X size={12} />}
                <span>8+ Characters</span>
              </div>
              <div className={`flex items-center gap-1 font-medium ${checks.uppercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                {checks.uppercase ? <Check size={12} /> : <X size={12} />}
                <span>1 Uppercase (A-Z)</span>
              </div>
              <div className={`flex items-center gap-1 font-medium ${checks.number ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                {checks.number ? <Check size={12} /> : <X size={12} />}
                <span>1 Number (0-9)</span>
              </div>
              <div className={`flex items-center gap-1 font-medium ${checks.match ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                {checks.match ? <Check size={12} /> : <X size={12} />}
                <span>Passwords Match</span>
              </div>
            </div>
          )}

          {/* Terms & Privacy */}
          <div className="flex items-center text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 select-none font-medium">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => onNavigatePage('terms')}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Terms & Privacy Policy
                </button>
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              'Creating Account...'
            ) : (
              <>
                <UserPlus size={14} />
                <span>Create Free Account</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-1 text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <button
            onClick={() => onNavigatePage('login')}
            className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Sign In Here
          </button>
        </div>
      </div>
    </div>
  );
};
