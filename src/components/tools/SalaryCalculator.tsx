import React, { useState } from 'react';
import { 
  Calculator, DollarSign, TrendingUp, ShieldAlert, FileText, 
  Download, RefreshCw, Check, Percent, ArrowRight, PieChart, Users
} from 'lucide-react';

export function SalaryCalculator() {
  // Input parameters
  const [payPeriod, setPayPeriod] = useState<'annual' | 'monthly'>('monthly');
  const [basePay, setBasePay] = useState<number>(6500); // Base Monthly Salary
  const [hra, setHra] = useState<number>(2000); // House Rent Allowance / Housing Allowance
  const [specialAllowance, setSpecialAllowance] = useState<number>(1200); // Other Allowances
  const [monthlyBonus, setMonthlyBonus] = useState<number>(500); // Monthly Incentive/Bonus
  
  // Overtime
  const [overtimeHours, setOvertimeHours] = useState<number>(10);
  const [overtimeRate, setOvertimeRate] = useState<number>(45); // $45/hr

  // Deductions
  const [pfRate, setPfRate] = useState<number>(12); // PF / Social Security / 401k %
  const [taxRate, setTaxRate] = useState<number>(15); // Income Tax %
  const [healthInsurance, setHealthInsurance] = useState<number>(150); // Monthly Health Insurance
  const [professionalTax, setProfessionalTax] = useState<number>(50); // Flat PT / Local Tax

  // Calculations
  const monthlyGrossBeforeOT = basePay + hra + specialAllowance + monthlyBonus;
  const overtimeEarnings = overtimeHours * overtimeRate;
  const totalMonthlyGross = monthlyGrossBeforeOT + overtimeEarnings;

  // Deductions
  const pfDeduction = (basePay * pfRate) / 100;
  const taxDeduction = (totalMonthlyGross * taxRate) / 100;
  const totalDeductions = pfDeduction + taxDeduction + healthInsurance + professionalTax;

  // Take Home
  const monthlyNetSalary = Math.max(0, totalMonthlyGross - totalDeductions);
  const annualGross = totalMonthlyGross * 12;
  const annualNet = monthlyNetSalary * 12;
  const annualTax = taxDeduction * 12;

  const handleReset = () => {
    setBasePay(5000);
    setHra(1500);
    setSpecialAllowance(1000);
    setMonthlyBonus(0);
    setOvertimeHours(0);
    setPfRate(12);
    setTaxRate(15);
    setHealthInsurance(100);
    setProfessionalTax(0);
  };

  const exportJSON = () => {
    const data = {
      calculator: "Salary & Net Take-Home Calculator",
      date: new Date().toISOString(),
      earnings: {
        basicSalary: basePay,
        hra,
        specialAllowance,
        monthlyBonus,
        overtimeHours,
        overtimeRate,
        overtimeEarnings,
        totalMonthlyGross
      },
      deductions: {
        pfRatePercentage: pfRate,
        pfDeduction,
        taxRatePercentage: taxRate,
        taxDeduction,
        healthInsurance,
        professionalTax,
        totalDeductions
      },
      summary: {
        monthlyNetSalary,
        annualGross,
        annualNet,
        annualTax
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `salary_breakdown_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const rows = [
      ['Category', 'Item', 'Amount ($)'],
      ['Earnings', 'Basic Salary', basePay.toFixed(2)],
      ['Earnings', 'HRA / Housing Allowance', hra.toFixed(2)],
      ['Earnings', 'Special Allowance', specialAllowance.toFixed(2)],
      ['Earnings', 'Monthly Bonus', monthlyBonus.toFixed(2)],
      ['Earnings', `Overtime Pay (${overtimeHours} hrs)`, overtimeEarnings.toFixed(2)],
      ['Summary', 'Total Monthly Gross', totalMonthlyGross.toFixed(2)],
      ['Deductions', `PF / 401k (${pfRate}%)`, pfDeduction.toFixed(2)],
      ['Deductions', `Income Tax (${taxRate}%)`, taxDeduction.toFixed(2)],
      ['Deductions', 'Health Insurance', healthInsurance.toFixed(2)],
      ['Deductions', 'Professional Tax', professionalTax.toFixed(2)],
      ['Summary', 'Total Monthly Deductions', totalDeductions.toFixed(2)],
      ['Summary', 'Net Monthly Take-Home Pay', monthlyNetSalary.toFixed(2)],
      ['Summary', 'Annual Gross Salary', annualGross.toFixed(2)],
      ['Summary', 'Annual Net Salary', annualNet.toFixed(2)]
    ];
    const csvContent = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `salary_breakdown_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-cyan-500/20">
            <Calculator size={12} className="text-cyan-500" />
            Payroll & Take-Home Salary Calculator
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Employee Salary & Net Take-Home Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Calculate gross salary, tax deductions, PF/401k contributions, overtime earnings, and net take-home salary.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Reset</span>
          </button>

          <button
            onClick={exportJSON}
            className="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Download size={14} />
            <span>Save as JSON</span>
          </button>

          <button
            onClick={exportCSV}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Download size={14} />
            <span>Save as CSV</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xs">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Users size={16} className="text-cyan-500" />
              Monthly Earnings Structure ($)
            </h3>

            {/* Base Pay & Allowances */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Basic Salary</label>
                <input
                  type="number"
                  value={basePay}
                  onChange={(e) => setBasePay(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 block">HRA / Housing Allowance</label>
                <input
                  type="number"
                  value={hra}
                  onChange={(e) => setHra(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Special / Other Allowances</label>
                <input
                  type="number"
                  value={specialAllowance}
                  onChange={(e) => setSpecialAllowance(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Monthly Performance Bonus</label>
                <input
                  type="number"
                  value={monthlyBonus}
                  onChange={(e) => setMonthlyBonus(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Overtime Controls */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Overtime Earnings
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400">OT Hours Worked</label>
                  <input
                    type="number"
                    value={overtimeHours}
                    onChange={(e) => setOvertimeHours(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400">OT Hourly Rate ($/hr)</label>
                  <input
                    type="number"
                    value={overtimeRate}
                    onChange={(e) => setOvertimeRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Deductions Controls */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Tax & Statutory Deductions
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400">PF / 401k Rate (%)</label>
                  <input
                    type="number"
                    value={pfRate}
                    onChange={(e) => setPfRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400">Income Tax Rate (%)</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400">Health Insurance ($)</label>
                  <input
                    type="number"
                    value={healthInsurance}
                    onChange={(e) => setHealthInsurance(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400">Professional Tax ($)</label>
                  <input
                    type="number"
                    value={professionalTax}
                    onChange={(e) => setProfessionalTax(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Breakdown Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Net Take-Home Result Card */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-white space-y-6 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-400">
                Net Take-Home Pay
              </span>
              <span className="text-xs font-mono text-slate-400">
                Monthly Estimate
              </span>
            </div>

            <div className="space-y-1">
              <div className="font-mono text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight">
                ${monthlyNetSalary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-slate-400">
                Annual Take-Home: <span className="font-mono text-white font-bold">${annualNet.toLocaleString()}</span>
              </p>
            </div>

            {/* Visual Ratio Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-mono text-slate-300">
                <span>Take-Home ({totalMonthlyGross > 0 ? ((monthlyNetSalary / totalMonthlyGross) * 100).toFixed(0) : 0}%)</span>
                <span>Deductions ({totalMonthlyGross > 0 ? ((totalDeductions / totalMonthlyGross) * 100).toFixed(0) : 0}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                <div 
                  className="bg-emerald-500 h-full" 
                  style={{ width: `${totalMonthlyGross > 0 ? (monthlyNetSalary / totalMonthlyGross) * 100 : 0}%` }} 
                />
                <div 
                  className="bg-rose-500 h-full" 
                  style={{ width: `${totalMonthlyGross > 0 ? (totalDeductions / totalMonthlyGross) * 100 : 0}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Itemized Calculation Summary Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-3">
              Itemized Monthly Summary
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between font-medium">
                <span className="text-slate-600 dark:text-slate-400">Basic Salary:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">${basePay.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-600 dark:text-slate-400">Housing Allowance (HRA):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">${hra.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-600 dark:text-slate-400">Special & Other Allowances:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">${specialAllowance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-600 dark:text-slate-400">Overtime Pay ({overtimeHours} hrs @ ${overtimeRate}/hr):</span>
                <span className="font-mono font-bold text-emerald-600">+${overtimeEarnings.toFixed(2)}</span>
              </div>

              <div className="flex justify-between font-bold pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white">
                <span>Total Monthly Gross:</span>
                <span className="font-mono">${totalMonthlyGross.toFixed(2)}</span>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-slate-500">
                <div className="flex justify-between">
                  <span>PF / 401k ({pfRate}% of Base):</span>
                  <span className="font-mono text-rose-500">-${pfDeduction.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Income Tax Estimate ({taxRate}%):</span>
                  <span className="font-mono text-rose-500">-${taxDeduction.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Health Insurance & PT:</span>
                  <span className="font-mono text-rose-500">-${(healthInsurance + professionalTax).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between font-extrabold text-sm pt-3 border-t-2 border-slate-900 dark:border-white text-slate-900 dark:text-white">
                <span>Net Monthly Take-Home:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">${monthlyNetSalary.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalaryCalculator;
