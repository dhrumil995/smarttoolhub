import React, { useState } from 'react';
import { Building2, Users, DollarSign, Clock, CheckCircle2, TrendingUp, Search, Plus } from 'lucide-react';
import BusinessWorkspaceHeader from './BusinessWorkspaceHeader';

export default function SupplierDashboard() {
  const [activeTab, setActiveTab] = useState<'tool' | 'history' | 'cloud'>('tool');
  const [search, setSearch] = useState('');

  const suppliers = [
    { id: 'SUP-101', name: 'Apex Steel Industries', invoicesCount: 14, totalSpent: '$42,800', pendingAmount: '$7,965', rating: '4.9 ★', status: 'ACTIVE' },
    { id: 'SUP-102', name: 'Delta Logistics Pvt Ltd', invoicesCount: 22, totalSpent: '$18,400', pendingAmount: '$0', rating: '4.8 ★', status: 'ACTIVE' },
    { id: 'SUP-103', name: 'Metro Industrial Supplies', invoicesCount: 8, totalSpent: '$12,500', pendingAmount: '$3,200', rating: '4.6 ★', status: 'ACTIVE' },
    { id: 'SUP-104', name: 'Precision Carbide Tools', invoicesCount: 5, totalSpent: '$8,900', pendingAmount: '$1,450', rating: '4.7 ★', status: 'ACTIVE' },
  ];

  const filtered = suppliers.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <BusinessWorkspaceHeader
        title="Supplier Dashboard"
        description="Comprehensive vendor portal to track active suppliers, pending accounts payable, historical procurement spends, and vendor ratings."
        toolId="supplier-dashboard"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === 'tool' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
                <span>Total Active Vendors</span>
                <Users className="h-4 w-4 text-indigo-500" />
              </div>
              <span className="text-2xl font-black text-slate-900 dark:text-white">24 Vendors</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
                <span>Monthly Procurement</span>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <span className="text-2xl font-black text-slate-900 dark:text-white">$82,600</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
                <span>Pending Payables</span>
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400">$12,615</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
                <span>Compliance Rate</span>
                <CheckCircle2 className="h-4 w-4 text-blue-500" />
              </div>
              <span className="text-2xl font-black text-emerald-500">98.4%</span>
            </div>
          </div>

          {/* Supplier Directory */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 max-w-xs">
                <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search suppliers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none"
                />
              </div>

              <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer">
                <Plus className="h-4 w-4" /> Add Vendor
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Vendor Name</th>
                    <th className="p-3">Invoices</th>
                    <th className="p-3">Total Spend</th>
                    <th className="p-3">Pending Payables</th>
                    <th className="p-3">Rating</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-indigo-500" />
                        {s.name}
                      </td>
                      <td className="p-3 text-slate-500">{s.invoicesCount} Invoices</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{s.totalSpent}</td>
                      <td className="p-3 font-bold text-amber-600 dark:text-amber-400">{s.pendingAmount}</td>
                      <td className="p-3 font-semibold text-amber-500">{s.rating}</td>
                      <td className="p-3 text-center">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
