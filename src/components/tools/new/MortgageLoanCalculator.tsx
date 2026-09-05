import React, { useState, useMemo } from 'react';
import {
  Calculator,
  DollarSign,
  Percent,
  Calendar,
  Download,
  Printer,
  PieChart as PieChartIcon,
  TrendingDown,
  Info,
  CheckCircle2,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  Building2,
  Table,
  PlusCircle
} from 'lucide-react';

interface AmortizationRow {
  month: number;
  year: number;
  payment: number;
  principal: number;
  interest: number;
  extraPayment: number;
  totalInterestToDate: number;
  remainingBalance: number;
}

export default function MortgageLoanCalculator() {
  const [homePrice, setHomePrice] = useState<number>(400000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [propertyTaxYearly, setPropertyTaxYearly] = useState<number>(4800);
  const [homeInsuranceYearly, setHomeInsuranceYearly] = useState<number>(1800);
  const [hoaMonthly, setHoaMonthly] = useState<number>(150);
  const [pmiYearly, setPmiYearly] = useState<number>(0);
  const [extraPaymentMonthly, setExtraPaymentMonthly] = useState<number>(200);
  
  const [activeTab, setActiveTab] = useState<'summary' | 'amortization' | 'breakdown'>('summary');

  const downPaymentAmount = useMemo(() => {
    return (homePrice * downPaymentPercent) / 100;
  }, [homePrice, downPaymentPercent]);

  const principalLoanAmount = useMemo(() => {
    return Math.max(0, homePrice - downPaymentAmount);
  }, [homePrice, downPaymentAmount]);

  // Monthly Principal & Interest Calculation
  const calculationResults = useMemo(() => {
    const r = interestRate / 100 / 12;
    const n = loanTermYears * 12;

    let monthlyPI = 0;
    if (r > 0 && n > 0 && principalLoanAmount > 0) {
      monthlyPI = (principalLoanAmount * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
    } else if (n > 0 && principalLoanAmount > 0) {
      monthlyPI = principalLoanAmount / n;
    }

    const monthlyTax = propertyTaxYearly / 12;
    const monthlyInsurance = homeInsuranceYearly / 12;
    const monthlyPMI = downPaymentPercent < 20 ? (pmiYearly > 0 ? pmiYearly / 12 : (principalLoanAmount * 0.008) / 12) : 0;
    const totalMonthlyPayment = monthlyPI + monthlyTax + monthlyInsurance + hoaMonthly + monthlyPMI;

    // Build Amortization Schedule
    const schedule: AmortizationRow[] = [];
    let balance = principalLoanAmount;
    let totalInterest = 0;
    let monthCount = 0;

    while (balance > 0.01 && monthCount < 600) {
      monthCount++;
      const interestForMonth = balance * r;
      let principalForMonth = monthlyPI - interestForMonth;
      
      let actualExtra = extraPaymentMonthly;
      if (balance < principalForMonth + actualExtra) {
        principalForMonth = balance;
        actualExtra = 0;
      }

      const totalPrincipalPaidThisMonth = principalForMonth + actualExtra;
      balance = Math.max(0, balance - totalPrincipalPaidThisMonth);
      totalInterest += interestForMonth;

      schedule.push({
        month: monthCount,
        year: Math.ceil(monthCount / 12),
        payment: monthlyPI + actualExtra,
        principal: principalForMonth,
        interest: interestForMonth,
        extraPayment: actualExtra,
        totalInterestToDate: totalInterest,
        remainingBalance: balance,
      });

      if (balance <= 0) break;
    }

    // Baseline calculation without extra payments for comparison
    let baselineTotalInterest = 0;
    let baselineBalance = principalLoanAmount;
    for (let m = 1; m <= n; m++) {
      const interestForM = baselineBalance * r;
      const principalForM = monthlyPI - interestForM;
      baselineBalance = Math.max(0, baselineBalance - principalForM);
      baselineTotalInterest += interestForM;
    }

    const interestSaved = Math.max(0, baselineTotalInterest - totalInterest);
    const monthsSaved = Math.max(0, n - schedule.length);

    return {
      monthlyPI,
      monthlyTax,
      monthlyInsurance,
      monthlyPMI,
      hoaMonthly,
      totalMonthlyPayment,
      totalInterestPaid: totalInterest,
      baselineTotalInterest,
      totalPaidOverall: principalLoanAmount + totalInterest,
      schedule,
      monthsSaved,
      yearsSaved: (monthsSaved / 12).toFixed(1),
      interestSaved,
      payoffMonths: schedule.length,
      payoffYears: (schedule.length / 12).toFixed(1)
    };
  }, [
    homePrice,
    downPaymentPercent,
    principalLoanAmount,
    interestRate,
    loanTermYears,
    propertyTaxYearly,
    homeInsuranceYearly,
    hoaMonthly,
    pmiYearly,
    extraPaymentMonthly
  ]);

  const handleExportCSV = () => {
    const headers = ['Month', 'Year', 'Payment', 'Principal', 'Interest', 'Extra Payment', 'Total Interest Paid', 'Remaining Balance'];
    const rows = calculationResults.schedule.map(row => [
      row.month,
      row.year,
      row.payment.toFixed(2),
      row.principal.toFixed(2),
      row.interest.toFixed(2),
      row.extraPayment.toFixed(2),
      row.totalInterestToDate.toFixed(2),
      row.remainingBalance.toFixed(2)
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `amortization_schedule_${homePrice}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 sm:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 text-blue-100 px-3 py-1 rounded-full text-xs font-semibold mb-3 backdrop-blur-sm">
              <Calculator className="w-3.5 h-3.5 text-blue-300" />
              Mortgage & Amortization Pro
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Mortgage Loan Calculator</h1>
            <p className="text-blue-100 mt-1 text-sm sm:text-base max-w-2xl">
              Calculate exact monthly payments, tax & insurance breakdowns, extra payment savings, and full printable amortization schedules.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition backdrop-blur-sm"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-white text-blue-900 hover:bg-blue-50 px-4 py-2 rounded-xl text-sm font-semibold transition shadow-sm"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Parameters Panel */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Building2 className="w-5 h-5 text-blue-600" /> Loan & Property Details
          </h2>

          <div className="space-y-4">
            {/* Home Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Home Purchase Price ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  value={homePrice}
                  onChange={(e) => setHomePrice(Number(e.target.value))}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Down Payment */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Down Payment (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Down Payment ($)
                </label>
                <div className="py-2 px-3 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200">
                  ${downPaymentAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>

            {/* Loan Amount Display */}
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-900 dark:text-blue-300">Principal Loan Amount:</span>
              <span className="text-base font-extrabold text-blue-700 dark:text-blue-400">
                ${principalLoanAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>

            {/* Interest Rate & Term */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Loan Term (Years)
                </label>
                <select
                  value={loanTermYears}
                  onChange={(e) => setLoanTermYears(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value={10}>10 Years</option>
                  <option value={15}>15 Years</option>
                  <option value={20}>20 Years</option>
                  <option value={30}>30 Years</option>
                </select>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Taxes, Insurance & Extras</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Property Tax ($/yr)
                  </label>
                  <input
                    type="number"
                    value={propertyTaxYearly}
                    onChange={(e) => setPropertyTaxYearly(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Home Insurance ($/yr)
                  </label>
                  <input
                    type="number"
                    value={homeInsuranceYearly}
                    onChange={(e) => setHomeInsuranceYearly(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    HOA Fees ($/mo)
                  </label>
                  <input
                    type="number"
                    value={hoaMonthly}
                    onChange={(e) => setHoaMonthly(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Extra Principal ($/mo)
                  </label>
                  <input
                    type="number"
                    value={extraPaymentMonthly}
                    onChange={(e) => setExtraPaymentMonthly(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded-lg text-xs font-semibold text-emerald-800 dark:text-emerald-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results & Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Payment Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div>
                <span className="text-xs uppercase tracking-widest text-indigo-300 font-semibold">Total Estimated Monthly Payment</span>
                <div className="text-4xl sm:text-5xl font-black text-white mt-1">
                  ${Math.round(calculationResults.totalMonthlyPayment).toLocaleString()}
                  <span className="text-sm font-normal text-indigo-200">/mo</span>
                </div>
              </div>

              {extraPaymentMonthly > 0 && calculationResults.monthsSaved > 0 && (
                <div className="bg-emerald-500/20 border border-emerald-400/40 rounded-xl p-3 text-emerald-300 backdrop-blur-sm text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-200">
                    <TrendingDown className="w-4 h-4" /> Extra Payment Impact:
                  </div>
                  <div>Pay off <span className="font-extrabold text-white">{calculationResults.yearsSaved} years earlier</span></div>
                  <div>Save <span className="font-extrabold text-white">${Math.round(calculationResults.interestSaved).toLocaleString()}</span> in interest!</div>
                </div>
              )}
            </div>

            {/* Visual Breakdown Bar */}
            <div className="mt-6 space-y-2">
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${(calculationResults.monthlyPI / calculationResults.totalMonthlyPayment) * 100}%` }}
                  className="bg-blue-500 h-full"
                  title="Principal & Interest"
                />
                <div
                  style={{ width: `${(calculationResults.monthlyTax / calculationResults.totalMonthlyPayment) * 100}%` }}
                  className="bg-indigo-400 h-full"
                  title="Property Tax"
                />
                <div
                  style={{ width: `${(calculationResults.monthlyInsurance / calculationResults.totalMonthlyPayment) * 100}%` }}
                  className="bg-amber-400 h-full"
                  title="Home Insurance"
                />
                {calculationResults.hoaMonthly > 0 && (
                  <div
                    style={{ width: `${(calculationResults.hoaMonthly / calculationResults.totalMonthlyPayment) * 100}%` }}
                    className="bg-emerald-400 h-full"
                    title="HOA"
                  />
                )}
                {calculationResults.monthlyPMI > 0 && (
                  <div
                    style={{ width: `${(calculationResults.monthlyPMI / calculationResults.totalMonthlyPayment) * 100}%` }}
                    className="bg-rose-400 h-full"
                    title="PMI"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                  <span>P&I: <strong className="text-white">${Math.round(calculationResults.monthlyPI)}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block" />
                  <span>Taxes: <strong className="text-white">${Math.round(calculationResults.monthlyTax)}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                  <span>Insurance: <strong className="text-white">${Math.round(calculationResults.monthlyInsurance)}</strong></span>
                </div>
                {calculationResults.hoaMonthly > 0 && (
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                    <span>HOA: <strong className="text-white">${Math.round(calculationResults.hoaMonthly)}</strong></span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === 'summary'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Loan Overview
            </button>
            <button
              onClick={() => setActiveTab('amortization')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === 'amortization'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Amortization Table
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'summary' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Loan Summary Breakdown</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-xs text-slate-500">Total Interest Paid</span>
                  <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                    ${Math.round(calculationResults.totalInterestPaid).toLocaleString()}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-xs text-slate-500">Total Loan Amount Paid</span>
                  <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                    ${Math.round(calculationResults.totalPaidOverall).toLocaleString()}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-xs text-slate-500">Payoff Term</span>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {calculationResults.payoffYears} Years
                  </div>
                </div>
              </div>

              {downPaymentPercent < 20 && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>PMI Note:</strong> Because your down payment is under 20% (${downPaymentAmount.toLocaleString()}), Private Mortgage Insurance (PMI) is added until reaching 20% equity.
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'amortization' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Full Schedule ({calculationResults.schedule.length} Months)</h3>
                <button
                  onClick={handleExportCSV}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" /> Download CSV
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 sticky top-0">
                    <tr>
                      <th className="p-2.5">Mo</th>
                      <th className="p-2.5">Payment</th>
                      <th className="p-2.5">Principal</th>
                      <th className="p-2.5">Interest</th>
                      <th className="p-2.5">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                    {calculationResults.schedule.map((row) => (
                      <tr key={row.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-2.5 font-sans font-medium text-slate-500">{row.month}</td>
                        <td className="p-2.5 font-medium text-slate-900 dark:text-slate-100">${row.payment.toFixed(0)}</td>
                        <td className="p-2.5 text-blue-600 dark:text-blue-400">${row.principal.toFixed(0)}</td>
                        <td className="p-2.5 text-slate-500">${row.interest.toFixed(0)}</td>
                        <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">${row.remainingBalance.toFixed(0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
