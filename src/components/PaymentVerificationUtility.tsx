import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  Eye,
  AlertCircle,
  Database,
  Filter,
  User,
  Calendar,
  CreditCard,
  Hash,
  Sparkles,
  UserX,
  FileCheck,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PaymentRequest } from '../types';

interface PaymentVerificationUtilityProps {
  payments: PaymentRequest[];
  loading: boolean;
  onRefresh: () => Promise<any>;
  onApprove: (id: string) => Promise<any>;
  onReject: (id: string, reason?: string) => Promise<any>;
  onCancelSub: (email: string) => Promise<any>;
}

export const PaymentVerificationUtility: React.FC<PaymentVerificationUtilityProps> = ({
  payments,
  loading,
  onRefresh,
  onApprove,
  onReject,
  onCancelSub
}) => {
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');

  // Single Lookup Search input (by Order ID or UTR)
  const [lookupTerm, setLookupTerm] = useState('');
  const [lookupResult, setLookupResult] = useState<PaymentRequest | null | 'not_found'>(null);

  // Inspector Modal State
  const [selectedTxn, setSelectedTxn] = useState<PaymentRequest | null>(null);

  // Reject Modal State
  const [rejectingTxnId, setRejectingTxnId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Copy Feedback state
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Last queried timestamp
  const [lastQueriedTime, setLastQueriedTime] = useState<string>(() => new Date().toLocaleTimeString('en-IN'));

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleManualRefresh = async () => {
    await onRefresh();
    setLastQueriedTime(new Date().toLocaleTimeString('en-IN'));
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupTerm.trim()) {
      setLookupResult(null);
      return;
    }

    const cleanTerm = lookupTerm.trim().toLowerCase();
    const safePayments = Array.isArray(payments) ? payments : [];
    const match = safePayments.find(
      (p) =>
        (p?.id || '').toLowerCase() === cleanTerm ||
        (p?.upiTransactionId || '').toLowerCase() === cleanTerm ||
        (p?.userEmail || '').toLowerCase() === cleanTerm
    );

    if (match) {
      setLookupResult(match);
    } else {
      setLookupResult('not_found');
    }
  };

  // Date filtering logic
  const now = new Date().getTime();
  const safeList = Array.isArray(payments) ? payments : [];
  const filteredPayments = safeList.filter((p) => {
    if (!p) return false;
    // 1. Status Filter
    if (statusFilter !== 'All' && p.status !== statusFilter) {
      return false;
    }

    // 2. Date Filter
    if (dateFilter !== 'all') {
      const pTime = new Date(p.createdAt || Date.now()).getTime();
      const diffHours = (now - pTime) / (1000 * 3600);
      if (dateFilter === 'today' && diffHours > 24) return false;
      if (dateFilter === '7days' && diffHours > 24 * 7) return false;
      if (dateFilter === '30days' && diffHours > 24 * 30) return false;
    }

    // 3. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matches =
        (p.id || '').toLowerCase().includes(q) ||
        (p.userName || '').toLowerCase().includes(q) ||
        (p.userEmail || '').toLowerCase().includes(q) ||
        (p.upiTransactionId || '').toLowerCase().includes(q) ||
        (p.planName || '').toLowerCase().includes(q) ||
        (p.userPhone && p.userPhone.includes(q));
      if (!matches) return false;
    }

    return true;
  });

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectingTxnId) {
      await onReject(rejectingTxnId, rejectReason);
      setRejectingTxnId(null);
      setRejectReason('');
      if (selectedTxn?.id === rejectingTxnId) {
        setSelectedTxn(null);
      }
    }
  };

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return 'N/A';
    try {
      return new Date(isoStr).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return isoStr;
    }
  };

  // Stats calculation
  const totalCount = payments.length;
  const approvedCount = payments.filter((p) => p.status === 'Approved').length;
  const pendingCount = payments.filter((p) => p.status === 'Pending').length;
  const rejectedCount = payments.filter((p) => p.status === 'Rejected').length;
  const totalVerifiedVolume = payments
    .filter((p) => p.status === 'Approved')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-8">
      {/* 1. Header Banner & Database Sync Status */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Database size={200} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              DATABASE CONNECTED & SYNCHRONIZED
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              Payment Verification & Audit Center
            </h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Real-time transaction log querying and automated entitlement verification.
              Query incoming UPI payments, inspect user details, and verify plan status instantly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-2 bg-slate-800/80 border border-slate-700/80 rounded-2xl text-xs font-mono text-slate-300 flex items-center gap-2">
              <Clock size={14} className="text-blue-400" />
              <span>Last Synced: {lastQueriedTime}</span>
            </div>

            <button
              onClick={handleManualRefresh}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Query Database Now</span>
            </button>
          </div>
        </div>

        {/* Quick Audit Metrics Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/50">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Total Queried</span>
            <span className="text-lg font-mono font-black text-white">{totalCount} Transactions</span>
          </div>

          <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/50">
            <span className="text-[10px] uppercase font-mono font-bold text-amber-400 block">Pending Verification</span>
            <span className="text-lg font-mono font-black text-amber-400">{pendingCount} Requests</span>
          </div>

          <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/50">
            <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 block">Verified & Approved</span>
            <span className="text-lg font-mono font-black text-emerald-400">{approvedCount} Verified</span>
          </div>

          <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/50">
            <span className="text-[10px] uppercase font-mono font-bold text-blue-400 block">Verified Volume</span>
            <span className="text-lg font-mono font-black text-blue-300">₹{totalVerifiedVolume.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* 2. Instant UTR / Order ID Lookup Tool */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
            <FileCheck size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Instant Transaction Verification Lookup
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Query database directly by Order ID (e.g. STH-ORD-123456) or UPI Ref Number (UTR)
            </p>
          </div>
        </div>

        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={lookupTerm}
              onChange={(e) => setLookupTerm(e.target.value)}
              placeholder="Enter Order ID or UPI Transaction Ref (e.g. 423190876541)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck size={16} />
            <span>Verify UTR</span>
          </button>
        </form>

        {/* Lookup Result Box */}
        <AnimatePresence>
          {lookupResult && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="pt-2"
            >
              {lookupResult === 'not_found' ? (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl text-xs flex items-center gap-3">
                  <AlertCircle size={20} className="flex-shrink-0" />
                  <div>
                    <strong className="block font-bold">Transaction Not Found in Database</strong>
                    <span className="text-[11px] opacity-90">
                      No payment record matches "{lookupTerm}". Please re-check the Order ID or UPI UTR number submitted by the user.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                      <CheckCircle2 size={18} />
                      <span>MATCH FOUND IN DATABASE &mdash; {lookupResult.id}</span>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full font-mono text-[10px] font-bold uppercase ${
                        lookupResult.status === 'Approved'
                          ? 'bg-emerald-600 text-white'
                          : lookupResult.status === 'Pending'
                          ? 'bg-amber-500 text-white'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      Status: {lookupResult.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white/80 dark:bg-slate-900/80 p-3.5 rounded-xl border border-emerald-500/20">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">Customer</span>
                      <strong className="text-slate-900 dark:text-white">{lookupResult.userName}</strong>
                      <span className="text-[10px] text-slate-500 block truncate">{lookupResult.userEmail}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">Plan & Amount</span>
                      <strong className="text-blue-600 dark:text-blue-400 font-mono">{lookupResult.planName} &bull; ₹{lookupResult.amount}</strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">UPI Ref (UTR)</span>
                      <strong className="font-mono text-slate-900 dark:text-white">{lookupResult.upiTransactionId}</strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">Submission Date</span>
                      <span className="text-slate-600 dark:text-slate-300 text-[11px]">{formatDate(lookupResult.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedTxn(lookupResult)}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Eye size={14} />
                      <span>Inspect Full Verification Details</span>
                    </button>

                    {lookupResult.status === 'Pending' && (
                      <button
                        type="button"
                        onClick={() => onApprove(lookupResult.id)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 size={14} />
                        <span>Approve Payment Now</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Main Query Table Controls & Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          {/* Main Search Input */}
          <div className="relative flex-1 max-w-lg">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, Customer Name, Email, Phone, or UTR..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option value="all">All Dates</option>
              <option value="today">Last 24 Hours</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* 4. Transactions Table */}
        {filteredPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Customer Details</th>
                  <th className="py-3 px-3">Plan</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">UPI Txn Ref (UTR)</th>
                  <th className="py-3 px-3">Database Timestamp</th>
                  <th className="py-3 px-3">Verification Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors">
                    {/* Order ID */}
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-1.5">
                        <span>{p.id}</span>
                        <button
                          onClick={() => handleCopy(p.id)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                          title="Copy Order ID"
                        >
                          {copiedText === p.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </td>

                    {/* Customer Details */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs flex-shrink-0">
                          {p.userName ? p.userName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <strong className="block text-slate-900 dark:text-white text-xs">{p.userName}</strong>
                          <span className="text-slate-500 text-[11px] block">{p.userEmail}</span>
                          {p.userPhone && <span className="text-slate-400 text-[10px] block">{p.userPhone}</span>}
                        </div>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="py-3.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold">
                        {p.planName}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-3 font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                      ₹{p.amount}
                    </td>

                    {/* UTR */}
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700/80 w-fit">
                        <span>{p.upiTransactionId}</span>
                        <button
                          onClick={() => handleCopy(p.upiTransactionId)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                          title="Copy UTR"
                        >
                          {copiedText === p.upiTransactionId ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-3 text-slate-500 text-[11px]">
                      {formatDate(p.createdAt)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase ${
                          p.status === 'Approved'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : p.status === 'Pending'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                        }`}
                      >
                        {p.status === 'Approved' && <CheckCircle2 size={12} />}
                        {p.status === 'Pending' && <Clock size={12} className="animate-pulse" />}
                        {p.status === 'Rejected' && <XCircle size={12} />}
                        {p.status === 'Approved' ? 'VERIFIED' : p.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-right space-x-1.5">
                      <button
                        onClick={() => setSelectedTxn(p)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 text-[11px] font-semibold"
                        title="Inspect Verification Details"
                      >
                        <Eye size={14} />
                        <span className="hidden sm:inline">Inspect</span>
                      </button>

                      {p.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => onApprove(p.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg cursor-pointer transition-colors shadow-xs"
                          >
                            <CheckCircle2 size={12} />
                            <span>Approve</span>
                          </button>

                          <button
                            onClick={() => setRejectingTxnId(p.id)}
                            className="inline-flex items-center gap-1 px-2 py-1.5 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white border border-red-500/20 font-bold text-[11px] rounded-lg cursor-pointer transition-colors"
                          >
                            <XCircle size={12} />
                            <span>Reject</span>
                          </button>
                        </>
                      ) : p.status === 'Approved' ? (
                        <button
                          onClick={() => onCancelSub(p.userEmail)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-slate-400 hover:text-red-500 text-[11px] font-mono cursor-pointer transition-colors"
                          title="Revoke / Cancel Subscription"
                        >
                          <UserX size={12} />
                          <span>Cancel Sub</span>
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs">
            No payment transaction records found matching your active filters.
          </div>
        )}
      </div>

      {/* 5. Detailed Transaction Inspection Modal Drawer */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Payment Verification Audit
                  </h3>
                  <p className="text-xs font-mono text-slate-400">{selectedTxn.id}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedTxn(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Main Inspection Grid */}
            <div className="space-y-4 text-xs">
              {/* Status Header */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Verification Status</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase mt-1 ${
                      selectedTxn.status === 'Approved'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : selectedTxn.status === 'Pending'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                    }`}
                  >
                    {selectedTxn.status === 'Approved' ? 'Verified & Active' : selectedTxn.status}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Paid Amount</span>
                  <span className="text-lg font-mono font-black text-blue-600 dark:text-blue-400">₹{selectedTxn.amount}</span>
                </div>
              </div>

              {/* Customer Details */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                  <User size={14} className="text-blue-500" />
                  <span>Customer Account Profile</span>
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Full Name</span>
                    <strong className="text-slate-900 dark:text-white">{selectedTxn.userName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Email Address</span>
                    <span className="text-slate-800 dark:text-slate-200 font-mono text-[11px]">{selectedTxn.userEmail}</span>
                  </div>
                  {selectedTxn.userPhone && (
                    <div>
                      <span className="text-[10px] text-slate-400 block">Phone Number</span>
                      <span className="text-slate-800 dark:text-slate-200">{selectedTxn.userPhone}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] text-slate-400 block">Plan ID</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedTxn.planName}</span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                  <CreditCard size={14} className="text-emerald-500" />
                  <span>UPI Payment Reference</span>
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block">UPI Ref / UTR</span>
                    <strong className="font-mono text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {selectedTxn.upiTransactionId}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">UPI ID Used</span>
                    <span className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">{selectedTxn.upiIdUsed}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Created Timestamp</span>
                    <span className="text-slate-600 dark:text-slate-300">{formatDate(selectedTxn.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Last Updated</span>
                    <span className="text-slate-600 dark:text-slate-300">{formatDate(selectedTxn.updatedAt)}</span>
                  </div>
                </div>
              </div>

              {selectedTxn.rejectionReason && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl text-xs space-y-1">
                  <strong className="block font-bold">Rejection Note:</strong>
                  <span>{selectedTxn.rejectionReason}</span>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Printer size={14} />
                <span>Print Audit Log</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTxn(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Close
                </button>

                {selectedTxn.status === 'Pending' && (
                  <button
                    type="button"
                    onClick={async () => {
                      await onApprove(selectedTxn.id);
                      setSelectedTxn(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={14} />
                    <span>Approve & Activate Plan</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Note Dialog */}
      {rejectingTxnId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Reject Payment Request
            </h3>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Reason for Rejection
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. UTR number not found in bank statement, amount mismatch..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectingTxnId(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Confirm Reject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
