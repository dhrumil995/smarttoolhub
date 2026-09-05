import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  IndianRupee,
  Users,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  UserCheck,
  UserX,
  Plus,
  X,
  Filter,
  Sparkles,
  Lock,
  Unlock,
  FileText,
  CreditCard,
  Server,
  Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageId, PaymentRequest, PlanId } from '../types';
import { useSubscription } from '../context/SubscriptionContext';
import { PLANS } from '../data/plans';
import { AdminBlogManager } from '../components/AdminBlogManager';
import { PaymentVerificationUtility } from '../components/PaymentVerificationUtility';
import { AdminUserManagement } from '../components/admin/AdminUserManagement';
import { AdminSubscriptionManager } from '../components/admin/AdminSubscriptionManager';
import { AdminSystemSettings } from '../components/admin/AdminSystemSettings';

interface AdminPanelProps {
  onNavigatePage: (page: PageId) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigatePage }) => {
  const [adminTab, setAdminTab] = useState<'overview' | 'users' | 'subscriptions' | 'payments' | 'blog' | 'system'>('overview');

  const {
    payments,
    stats,
    approvePayment,
    rejectPayment,
    activateUserSubscription,
    cancelUserSubscription,
    refreshData,
    loading,
    isAdmin,
    setIsAdmin
  } = useSubscription();

  // Local Admin Password/Passkey for simple safeguard
  const [passkeyInput, setPasskeyInput] = useState('');
  const [passkeyError, setPasskeyError] = useState('');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Rejection Modal State
  const [rejectingPaymentId, setRejectingPaymentId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Manual Activation Modal State
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [manualEmail, setManualEmail] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualPlan, setManualPlan] = useState<PlanId>('pro');
  const [manualDays, setManualDays] = useState(30);

  const handleLoginAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkeyInput === 'SFH1!)2gAoBPoV8>') {
      setIsAdmin(true);
      setPasskeyError('');
      refreshData();
    } else {
      setPasskeyError('Invalid Admin Passkey.');
    }
  };

  // Automatically refresh payment requests from backend on mount, login & interval
  React.useEffect(() => {
    refreshData();
    const timer = setInterval(() => {
      refreshData();
    }, 10000);
    return () => clearInterval(timer);
  }, [refreshData, isAdmin]);

  // Safe fallbacks for stats
  const safeStats = {
    totalRevenue: stats?.totalRevenue ?? 0,
    monthlyRevenue: stats?.monthlyRevenue ?? 0,
    pendingCount: stats?.pendingCount ?? 0,
    activeSubscribers: stats?.activeSubscribers ?? 0
  };

  // Filtered payments list with defensive checks
  const safePayments = Array.isArray(payments) ? payments : [];
  const filteredPayments = safePayments.filter((p) => {
    if (!p) return false;
    const matchesSearch =
      (p.userName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.userEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.upiTransactionId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.planName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.userPhone && p.userPhone.includes(searchQuery));

    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleApprove = async (id: string) => {
    await approvePayment(id);
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectingPaymentId) {
      await rejectPayment(rejectingPaymentId, rejectReason);
      setRejectingPaymentId(null);
      setRejectReason('');
    }
  };

  const handleManualActivateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (manualEmail.trim()) {
      await activateUserSubscription(manualEmail.trim(), manualName.trim(), manualPlan, manualDays);
      setShowActivateModal(false);
      setManualEmail('');
      setManualName('');
    }
  };

  const handleCancelSub = async (email: string) => {
    if (window.confirm(`Are you sure you want to cancel subscription for ${email}?`)) {
      await cancelUserSubscription(email);
    }
  };

  const handleExportCSV = () => {
    if (payments.length === 0) return;

    const headers = ['Order ID', 'Customer Name', 'Email', 'Phone', 'Plan', 'Amount (INR)', 'UPI Txn ID', 'Status', 'Date'];
    const rows = payments.map((p) => [
      p.id,
      `"${p.userName}"`,
      p.userEmail,
      p.userPhone || '',
      p.planName,
      p.amount,
      p.upiTransactionId,
      p.status,
      new Date(p.createdAt).toLocaleString('en-IN')
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smarttoolhub_payments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return 'N/A';
    try {
      return new Date(isoStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoStr;
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto py-16 px-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/20">
            <Lock size={32} />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-950 dark:text-white">
              Admin Panel Authentication
            </h1>
            <p className="text-xs text-slate-500">
              Enter admin key to manage payments, revenue & subscriptions.
            </p>
          </div>

          {passkeyError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs">
              {passkeyError}
            </div>
          )}

          <form onSubmit={handleLoginAdmin} className="space-y-4">
            <input
              type="password"
              value={passkeyInput}
              onChange={(e) => setPasskeyInput(e.target.value)}
              placeholder="Enter Admin Passkey"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-colors"
            >
              Unlock Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 py-4 max-w-7xl mx-auto">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white font-display tracking-tight">
              SmartToolHub Admin Portal
            </h1>
            <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[10px] font-bold rounded-full border border-blue-500/20">
              ADMIN MODE
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage subscription payments, user accounts, blog articles, and SEO meta tags.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowActivateModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all"
          >
            <Plus size={14} />
            <span>Manual Premium Activation</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold rounded-xl cursor-pointer transition-colors"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAdmin(false)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl cursor-pointer"
            title="Lock Admin"
          >
            <Unlock size={16} />
          </button>
        </div>
      </div>

      {/* ADMIN NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setAdminTab('overview')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            adminTab === 'overview'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <TrendingUp size={15} />
          <span>Overview & Revenue</span>
        </button>

        <button
          onClick={() => setAdminTab('users')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            adminTab === 'users'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users size={15} />
          <span>User Accounts</span>
        </button>

        <button
          onClick={() => setAdminTab('subscriptions')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            adminTab === 'subscriptions'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Crown size={15} />
          <span>Subscriptions</span>
        </button>

        <button
          onClick={() => setAdminTab('payments')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            adminTab === 'payments'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <CreditCard size={15} />
          <span>Payment Audit</span>
        </button>

        <button
          onClick={() => setAdminTab('blog')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            adminTab === 'blog'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText size={15} />
          <span>Blog & SEO CMS</span>
        </button>

        <button
          onClick={() => setAdminTab('system')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            adminTab === 'system'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Server size={15} />
          <span>System Health</span>
        </button>
      </div>

      {adminTab === 'users' && <AdminUserManagement />}

      {adminTab === 'subscriptions' && <AdminSubscriptionManager />}

      {adminTab === 'payments' && (
        <PaymentVerificationUtility
          payments={payments}
          loading={loading}
          onRefresh={refreshData}
          onApprove={handleApprove}
          onReject={rejectPayment}
          onCancelSub={handleCancelSub}
        />
      )}

      {adminTab === 'blog' && <AdminBlogManager />}

      {adminTab === 'system' && <AdminSystemSettings />}

      {adminTab === 'overview' && (
        <div className="space-y-8">
          {/* Analytics Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-mono font-bold uppercase">Total Revenue</span>
                <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                  <IndianRupee size={16} />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-950 dark:text-white font-mono">
                ₹{safeStats.totalRevenue.toLocaleString('en-IN')}
              </div>
              <p className="text-[10px] text-slate-400">Total approved subscription revenue</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-mono font-bold uppercase">Monthly Revenue</span>
                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                  <TrendingUp size={16} />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                ₹{safeStats.monthlyRevenue.toLocaleString('en-IN')}
              </div>
              <p className="text-[10px] text-slate-400">Approved payments this month</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-mono font-bold uppercase">Pending Requests</span>
                <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                  <Clock size={16} />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-amber-500 font-mono">
                {safeStats.pendingCount}
              </div>
              <p className="text-[10px] text-slate-400">Awaiting admin review & approval</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-mono font-bold uppercase">Active Subscribers</span>
                <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
                  <Users size={16} />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-indigo-500 font-mono">
                {safeStats.activeSubscribers}
              </div>
              <p className="text-[10px] text-slate-400">Active Premium user accounts</p>
            </div>
          </div>

          {/* Quick Payment Verification Stream */}
          <PaymentVerificationUtility
            payments={safePayments}
            loading={loading}
            onRefresh={refreshData}
            onApprove={handleApprove}
            onReject={rejectPayment}
            onCancelSub={handleCancelSub}
          />
        </div>
      )}

      {/* Modal 2: Manual Premium Activation */}
      {showActivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck size={18} className="text-emerald-500" />
                Manual Premium Activation
              </h3>
              <button
                onClick={() => setShowActivateModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleManualActivateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  User Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  placeholder="e.g. user@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  User Name
                </label>
                <input
                  type="text"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="Optional name"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Plan
                  </label>
                  <select
                    value={manualPlan}
                    onChange={(e) => setManualPlan(e.target.value as PlanId)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="starter">Starter (₹299)</option>
                    <option value="pro">Pro (₹999)</option>
                    <option value="business">Business (₹2999)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    value={manualDays}
                    onChange={(e) => setManualDays(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowActivateModal(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Activate Premium
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

