import React, { useState, useEffect } from 'react';
import { 
  Receipt, Plus, Trash2, Download, Search, Filter, PieChart, 
  ArrowUpRight, DollarSign, Calendar, Tag, CreditCard, RefreshCw, FileSpreadsheet
} from 'lucide-react';

interface ExpenseItem {
  id: string;
  date: string;
  title: string;
  category: string;
  amount: number;
  paymentMethod: string;
  notes?: string;
}

const CATEGORIES = [
  'Software & SaaS',
  'Marketing & Ads',
  'Office & Supplies',
  'Travel & Lodging',
  'Payroll & Contracting',
  'Utilities & Rent',
  'Legal & Accounting',
  'Miscellaneous'
];

const PAYMENT_METHODS = ['Credit Card', 'Bank Transfer', 'Corporate Debit', 'Cash', 'PayPal'];

const INITIAL_EXPENSES: ExpenseItem[] = [
  { id: '1', date: '2026-07-25', title: 'Google Cloud Platform Hosting', category: 'Software & SaaS', amount: 342.50, paymentMethod: 'Credit Card', notes: 'Monthly server infrastructure' },
  { id: '2', date: '2026-07-22', title: 'Google Ads Search Campaign', category: 'Marketing & Ads', amount: 850.00, paymentMethod: 'Credit Card', notes: 'Q3 acquisition campaign' },
  { id: '3', date: '2026-07-18', title: 'Ergonomic Office Chairs x3', category: 'Office & Supplies', amount: 620.00, paymentMethod: 'Corporate Debit', notes: 'New hire onboarding supplies' },
  { id: '4', date: '2026-07-15', title: 'Design Subcontractor Milestone 1', category: 'Payroll & Contracting', amount: 1500.00, paymentMethod: 'Bank Transfer', notes: 'UI overhaul contract' },
  { id: '5', date: '2026-07-10', title: 'Delta Airlines Flight to TechConf', category: 'Travel & Lodging', amount: 480.20, paymentMethod: 'Credit Card', notes: 'Keynote conference travel' },
];

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('smarttoolhub_expenses');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return INITIAL_EXPENSES;
  });

  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [notes, setNotes] = useState('');

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('smarttoolhub_expenses', JSON.stringify(expenses));
    }
  }, [expenses]);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || Number(amount) <= 0) return;

    const newExpense: ExpenseItem = {
      id: Date.now().toString(),
      date,
      title: title.trim(),
      category,
      amount: parseFloat(amount),
      paymentMethod,
      notes: notes.trim()
    };

    setExpenses([newExpense, ...expenses]);
    setTitle('');
    setAmount('');
    setNotes('');
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(item => item.id !== id));
  };

  const handleReset = () => {
    setExpenses(INITIAL_EXPENSES);
  };

  // Filtered Expenses
  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (exp.notes && exp.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategoryFilter === 'All' || exp.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Metric Calculations
  const totalSpend = expenses.reduce((sum, item) => sum + item.amount, 0);
  const avgExpense = expenses.length > 0 ? totalSpend / expenses.length : 0;

  // Category Breakdown
  const categoryTotals = expenses.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0] || ['None', 0];

  const exportJSON = () => {
    if (expenses.length === 0) return;
    const jsonContent = JSON.stringify(expenses, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `business_expenses_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    if (expenses.length === 0) return;
    const headers = ['ID', 'Date', 'Title', 'Category', 'Amount', 'Payment Method', 'Notes'];
    const rows = expenses.map(e => [
      e.id,
      e.date,
      `"${e.title.replace(/"/g, '""')}"`,
      `"${e.category}"`,
      e.amount.toFixed(2),
      `"${e.paymentMethod}"`,
      `"${(e.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `business_expenses_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20">
            <Receipt size={12} className="text-indigo-500" />
            Financial Management & Budget Analytics
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Business Expense Tracker & Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Log operational spending, analyze category breakdowns, track corporate payment methods, and export JSON / CSV reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={exportJSON}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} />
            <span>Save as JSON</span>
          </button>

          <button
            onClick={exportCSV}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet size={14} />
            <span>Save as CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Business Expense</span>
          <div className="font-mono text-2xl font-extrabold text-slate-900 dark:text-white">
            ${totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
            <ArrowUpRight size={12} /> {expenses.length} Total Recorded Entries
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Top Spending Category</span>
          <div className="font-display text-lg font-bold text-slate-900 dark:text-white truncate">
            {topCategory[0]}
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-500">
            ${(topCategory[1] as number).toFixed(2)} ({totalSpend > 0 ? (((topCategory[1] as number) / totalSpend) * 100).toFixed(0) : 0}%)
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Average Expense Value</span>
          <div className="font-mono text-2xl font-extrabold text-slate-900 dark:text-white">
            ${avgExpense.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Per Transaction Average</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Categories</span>
          <div className="font-mono text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {Object.keys(categoryTotals).length}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Out of 8 Pre-set Categories</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Add New Expense Form */}
        <div className="lg:col-span-4 space-y-6">
          <form onSubmit={handleAddExpense} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Plus size={16} className="text-indigo-500" />
              Add Expense Entry
            </h3>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Expense Title / Vendor</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AWS Cloud Hosting, Office Supplies"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {PAYMENT_METHODS.map(pm => <option key={pm} value={pm}>{pm}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Notes / Reference</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional description or invoice ref"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus size={14} />
              <span>Record Expense</span>
            </button>
          </form>

          {/* Category Visual Progress Bars */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider flex items-center gap-2">
              <PieChart size={14} className="text-indigo-500" />
              Category Budget Breakdown
            </h3>

            <div className="space-y-3">
              {Object.entries(categoryTotals).map(([cat, amountVal]) => {
                const percentage = totalSpend > 0 ? (amountVal / totalSpend) * 100 : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{cat}</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">${amountVal.toFixed(2)} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Expenses List & Filter Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vendor or description..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            </div>

            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Vendor / Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                        No expense records found matching filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredExpenses.map((exp) => (
                      <tr key={exp.id} className="text-xs hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors">
                        <td className="py-3 px-4 font-mono text-slate-500">{exp.date}</td>
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                          {exp.title}
                          {exp.notes && <span className="block font-normal text-[10px] text-slate-400">{exp.notes}</span>}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium text-[11px]">
                            {exp.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-[11px]">{exp.paymentMethod}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                          ${exp.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleDeleteExpense(exp.id)}
                            className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpenseTracker;
