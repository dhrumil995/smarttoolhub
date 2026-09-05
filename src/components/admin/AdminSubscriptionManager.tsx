import React, { useState, useEffect } from 'react';
import {
  Crown,
  Search,
  RefreshCw,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserX,
  CreditCard,
  X,
  Download
} from 'lucide-react';
import { toast } from '../../utils/toast';

export interface AdminSubscription {
  userId: string;
  userName?: string;
  userPhone?: string;
  planId: string;
  planName: string;
  startDate: string;
  expiryDate: string;
  status: 'Active' | 'Pending' | 'Cancelled' | 'Expired' | 'Free';
  amountPaid: number;
  autoRenew?: boolean;
  lastOrderId?: string;
  totalPaymentsCount?: number;
  isExpired?: boolean;
}

export const AdminSubscriptionManager: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [planFilter, setPlanFilter] = useState('All');

  // Manual Activate Modal
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [activateEmail, setActivateEmail] = useState('');
  const [activateName, setActivateName] = useState('');
  const [activatePlanId, setActivatePlanId] = useState('pro');
  const [activateDuration, setActivateDuration] = useState(30);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/subscriptions');
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data.subscriptions || []);
      } else {
        toast.error('Failed to load subscriptions');
      }
    } catch (e) {
      toast.error('Error fetching subscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleManualActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activateEmail) {
      toast.error('Please enter user email address');
      return;
    }

    try {
      const planNames: Record<string, string> = {
        starter: 'Starter Plan',
        pro: 'Pro Plan',
        business: 'Business Plan',
        free: 'Free Plan'
      };

      const res = await fetch('/api/subscription/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: activateEmail,
          userName: activateName,
          planId: activatePlanId,
          planName: planNames[activatePlanId] || 'Premium Plan',
          durationDays: activateDuration
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Subscription activated for ${activateEmail}!`);
        setShowActivateModal(false);
        setActivateEmail('');
        setActivateName('');
        fetchSubscriptions();
      } else {
        toast.error(data.error || 'Failed to activate subscription');
      }
    } catch (e) {
      toast.error('Error activating subscription');
    }
  };

  const handleCancelSub = async (email: string) => {
    try {
      const res = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Subscription cancelled for ${email}`);
        fetchSubscriptions();
      } else {
        toast.error(data.error || 'Failed to cancel subscription');
      }
    } catch (e) {
      toast.error('Error cancelling subscription');
    }
  };

  const safeSubs = Array.isArray(subscriptions) ? subscriptions : [];
  const filteredSubs = safeSubs.filter((s) => {
    if (!s) return false;
    const q = searchQuery.toLowerCase().trim();
    const userId = (s.userId || '').toLowerCase();
    const userName = (s.userName || '').toLowerCase();
    const lastOrderId = (s.lastOrderId || '').toLowerCase();

    const matchesQ =
      !q ||
      userId.includes(q) ||
      userName.includes(q) ||
      lastOrderId.includes(q);

    const subStatus = (s.status || 'free').toLowerCase();
    const matchesStatus =
      statusFilter === 'All' || subStatus === statusFilter.toLowerCase();

    const subPlan = (s.planId || 'free').toLowerCase();
    const matchesPlan =
      planFilter === 'All' || subPlan === planFilter.toLowerCase();

    return matchesQ && matchesStatus && matchesPlan;
  });

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

  const getDaysRemaining = (expiryStr: string) => {
    try {
      const exp = new Date(expiryStr).getTime();
      const diff = Math.ceil((exp - Date.now()) / (1000 * 3600 * 24));
      return diff > 0 ? `${diff} days left` : 'Expired';
    } catch {
      return 'N/A';
    }
  };

  const handleExportCSV = () => {
    if (subscriptions.length === 0) {
      toast.error('No subscriptions to export');
      return;
    }
    const headers = ['User Email', 'Name', 'Plan ID', 'Plan Name', 'Status', 'Amount Paid', 'Start Date', 'Expiry Date', 'Auto Renew'];
    const rows = subscriptions.map((s) => [
      s.userId,
      `"${s.userName || ''}"`,
      s.planId,
      `"${s.planName}"`,
      s.status,
      s.amountPaid || 0,
      s.startDate,
      s.expiryDate,
      s.autoRenew ? 'Yes' : 'No'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smarttoolhub_subscriptions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
              <Crown className="text-amber-500" size={22} />
              <span>Subscription & Entitlements Management</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Grant custom plans, extend validity periods, inspect renewal preferences and manage entitlements.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => setShowActivateModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <Plus size={15} />
              <span>Manual Plan Activation</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>

            <button
              onClick={fetchSubscriptions}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl cursor-pointer"
              title="Refresh List"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Email, Order ID, Name..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">Status:</span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl w-full border border-slate-200 dark:border-slate-800">
              {['All', 'Active', 'Expired', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">Plan Tier:</span>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Tiers</option>
              <option value="starter">Starter Tier</option>
              <option value="pro">Pro Tier</option>
              <option value="business">Business Tier</option>
              <option value="free">Free Tier</option>
            </select>
          </div>
        </div>

        {/* Subscriptions Table */}
        {filteredSubs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="py-3 px-3">Subscriber</th>
                  <th className="py-3 px-3">Plan Tier</th>
                  <th className="py-3 px-3">Amount Paid</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Start Date</th>
                  <th className="py-3 px-3">Expiry Date / Validity</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredSubs.map((s) => (
                  <tr key={s.userId} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 px-3">
                      <strong className="block text-slate-900 dark:text-white font-bold">{s.userName || s.userId.split('@')[0]}</strong>
                      <span className="text-slate-500 text-[11px] block">{s.userId}</span>
                      {s.lastOrderId && <span className="text-slate-400 font-mono text-[10px] block">{s.lastOrderId}</span>}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                        {s.planName}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                      ₹{s.amountPaid || 0}
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase ${
                          s.status === 'Active' && !s.isExpired
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : s.status === 'Pending'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {s.status === 'Active' && !s.isExpired ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                        {s.isExpired ? 'Expired' : s.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-slate-500 text-[11px]">
                      {formatDate(s.startDate)}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="block text-slate-900 dark:text-slate-100 text-xs font-medium">
                        {formatDate(s.expiryDate)}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 block">
                        {getDaysRemaining(s.expiryDate)}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      {s.status === 'Active' ? (
                        <button
                          onClick={() => handleCancelSub(s.userId)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg text-[11px] font-mono cursor-pointer transition-colors"
                          title="Cancel Subscription"
                        >
                          <UserX size={12} />
                          <span>Cancel Sub</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">Inactive</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs">
            No subscription records found matching criteria.
          </div>
        )}
      </div>

      {/* Manual Plan Activation Modal */}
      {showActivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2">
                <Crown className="text-amber-500" size={20} />
                <span>Manual Plan Activation</span>
              </h3>
              <button
                onClick={() => setShowActivateModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleManualActivate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">User Email *</label>
                <input
                  type="email"
                  required
                  value={activateEmail}
                  onChange={(e) => setActivateEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">User Full Name (Optional)</label>
                <input
                  type="text"
                  value={activateName}
                  onChange={(e) => setActivateName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Plan Tier</label>
                <select
                  value={activatePlanId}
                  onChange={(e) => setActivatePlanId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="starter">Starter Tier (₹299/mo)</option>
                  <option value="pro">Pro Tier (₹999/mo)</option>
                  <option value="business">Business Tier (₹2,999/mo)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Validity Duration (Days)</label>
                <select
                  value={activateDuration}
                  onChange={(e) => setActivateDuration(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={7}>7 Days</option>
                  <option value={30}>30 Days (1 Month)</option>
                  <option value={90}>90 Days (3 Months)</option>
                  <option value={365}>365 Days (1 Year)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowActivateModal(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md transition-colors"
                >
                  Activate Plan Immediately
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
