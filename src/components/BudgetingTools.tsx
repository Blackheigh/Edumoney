import React, { useState } from 'react';
import { Calculator, PiggyBank, Scale, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { UI_STRINGS } from '../data/translations';

interface BudgetingToolsProps {
  currentLang: SupportedLanguage;
}

export const BudgetingTools: React.FC<BudgetingToolsProps> = ({ currentLang }) => {
  const t = UI_STRINGS[currentLang] || UI_STRINGS.hi;
  const [activeSubTab, setActiveSubTab] = useState<'budget' | 'gullak' | 'loan-trap'>('budget');

  // Tool 1: 50-30-20 Budget State
  const [monthlyIncome, setMonthlyIncome] = useState<number>(30000);
  const [customNeeds, setCustomNeeds] = useState<number>(15000);
  const [customWants, setCustomWants] = useState<number>(9000);
  const [customSavings, setCustomSavings] = useState<number>(6000);

  // Quick Income Presets
  const incomePresets = [18000, 30000, 50000, 80000];

  const handleIncomeChange = (val: number) => {
    setMonthlyIncome(val);
    setCustomNeeds(Math.round(val * 0.5));
    setCustomWants(Math.round(val * 0.3));
    setCustomSavings(Math.round(val * 0.2));
  };

  // Tool 2: Daily Gullak State
  const [dailySaving, setDailySaving] = useState<number>(50); // ₹50/day
  const [years, setYears] = useState<number>(10); // 10 years

  const annualInvestment = dailySaving * 365;
  const totalInvestedPrincipal = annualInvestment * years;

  // Compound future value formulas (Annual compounding)
  const calculateFV = (rate: number) => {
    let fv = 0;
    for (let i = 0; i < years; i++) {
      fv = (fv + annualInvestment) * (1 + rate);
    }
    return Math.round(fv);
  };

  const fvIdle = totalInvestedPrincipal;
  const fvBankSavings = calculateFV(0.068); // 6.8%
  const fvIndexSIP = calculateFV(0.12); // 12%

  // Tool 3: Moneylender vs Bank Loan Trap State
  const [loanPrincipal, setLoanPrincipal] = useState<number>(50000);
  const [moneylenderMonthlyRate, setMoneylenderMonthlyRate] = useState<number>(4); // 4% per month = 48% p.a.
  const [bankAnnualRate] = useState<number>(11); // 11% p.a.
  const [loanTenureMonths, setLoanTenureMonths] = useState<number>(12); // 12 months

  const totalMoneylenderInterest = Math.round(
    loanPrincipal * (moneylenderMonthlyRate / 100) * loanTenureMonths
  );
  const totalMoneylenderPaid = loanPrincipal + totalMoneylenderInterest;

  const monthlyBankRate = bankAnnualRate / 100 / 12;
  const bankEMI = Math.round(
    (loanPrincipal * monthlyBankRate * Math.pow(1 + monthlyBankRate, loanTenureMonths)) /
      (Math.pow(1 + monthlyBankRate, loanTenureMonths) - 1)
  );
  const totalBankPaid = bankEMI * loanTenureMonths;
  const totalBankInterest = totalBankPaid - loanPrincipal;

  const moneySavedWithBank = Math.max(0, totalMoneylenderPaid - totalBankPaid);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              <Calculator className="w-3.5 h-3.5" />
              <span>{t.budgetHeaderTag}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
              {t.budgetMainTitle}
            </h2>
            <p className="mt-1 text-sm text-stone-600 max-w-2xl">
              {t.budgetSubtitle}
            </p>
          </div>

          {/* Sub-tabs Segmented Controller */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg border border-stone-200 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveSubTab('budget')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeSubTab === 'budget'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.tab503020}
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('gullak')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeSubTab === 'gullak'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.tabGullak}
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('loan-trap')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeSubTab === 'loan-trap'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.tabLoanTrap}
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: 50-30-20 DESI HOUSEHOLD BUDGET */}
      {activeSubTab === 'budget' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Deck (Left 7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-6">
            <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <label className="text-sm font-semibold text-stone-900">
                  {t.budgetMonthlyIncome}
                </label>
                <div className="text-xl font-bold font-mono tabular-nums text-emerald-900">
                  ₹{monthlyIncome.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="10000"
                max="150000"
                step="1000"
                value={monthlyIncome}
                onChange={(e) => handleIncomeChange(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
              />

              {/* Quick Presets */}
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="text-stone-400">{t.estimatedIncome}</span>
                {incomePresets.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleIncomeChange(val)}
                    className={`px-2 py-0.5 rounded border text-xs transition-colors ${
                      monthlyIncome === val
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-semibold'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    ₹{(val / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            {/* 3 Categories Breakdown */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              {/* 1. Needs (50%) */}
              <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    <span className="text-sm font-semibold text-stone-900">{t.needsHeader}</span>
                  </div>
                  <span className="text-sm font-bold font-mono tabular-nums text-blue-950">
                    ₹{customNeeds.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-xs text-stone-500">
                  {t.needsDesc}
                </p>
              </div>

              {/* 2. Wants (30%) */}
              <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                    <span className="text-sm font-semibold text-stone-900">{t.wantsHeader}</span>
                  </div>
                  <span className="text-sm font-bold font-mono tabular-nums text-amber-950">
                    ₹{customWants.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-xs text-stone-500">
                  {t.wantsDesc}
                </p>
              </div>

              {/* 3. Savings (20%) */}
              <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    <span className="text-sm font-semibold text-stone-900">{t.savingsHeader}</span>
                  </div>
                  <span className="text-sm font-bold font-mono tabular-nums text-emerald-950">
                    ₹{customSavings.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-xs text-stone-500">
                  {t.savingsDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Visual Health Deck (Right 5 Cols) */}
          <div className="lg:col-span-5 bg-stone-900 text-stone-100 rounded-xl p-6 shadow-sm space-y-6">
            <div>
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
                {t.ratioLabel}
              </div>
              <h3 className="text-xl font-bold font-serif text-white">
                {t.budgetHealthReport}
              </h3>
            </div>

            {/* Visual Bar Breakdown */}
            <div>
              <div className="w-full h-4 bg-stone-800 rounded-full overflow-hidden flex">
                <div style={{ width: '50%' }} className="bg-blue-500 h-full" title="50% Needs" />
                <div style={{ width: '30%' }} className="bg-amber-500 h-full" title="30% Wants" />
                <div style={{ width: '20%' }} className="bg-emerald-500 h-full" title="20% Savings" />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-stone-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                  ₹{(monthlyIncome * 0.5).toLocaleString('en-IN')}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                  ₹{(monthlyIncome * 0.3).toLocaleString('en-IN')}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                  ₹{(monthlyIncome * 0.2).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Key Golden Advice */}
            <div className="bg-stone-800/80 border border-stone-700/80 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{t.goldenRuleTitle}</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                {t.goldenRuleAdvice}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: DAILY GULLAK & COMPOUNDING */}
      {activeSubTab === 'gullak' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Deck (Left 6 Cols) */}
          <div className="lg:col-span-6 bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
                <PiggyBank className="w-4 h-4 text-amber-700" />
                <span>{t.gullakHeaderTag}</span>
              </div>
              <h3 className="text-xl font-bold font-serif text-stone-900">
                {t.gullakTitle}
              </h3>
              <p className="mt-1 text-xs text-stone-600">
                {t.gullakSubtitle}
              </p>
            </div>

            {/* Daily Amount Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-stone-900">
                  {t.dailySavingAmount}
                </label>
                <span className="text-xl font-bold font-mono tabular-nums text-emerald-900">
                  ₹{dailySaving} / {t.daysUnit || 'दिन'}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={dailySaving}
                onChange={(e) => setDailySaving(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
              />

              {/* Fast Buttons */}
              <div className="mt-3 flex items-center gap-2 text-xs">
                {[
                  { amt: 20, label: t.dailyTeaCut },
                  { amt: 50, label: t.dailySnackCut },
                  { amt: 100, label: t.dailySmallCut },
                  { amt: 200, label: t.dailyStrongCut },
                ].map(({ amt, label }) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDailySaving(amt)}
                    className={`px-3 py-1 rounded border text-xs transition-colors ${
                      dailySaving === amt
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-semibold'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    ₹{amt} ({label})
                  </button>
                ))}
              </div>
            </div>

            {/* Years Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-stone-900">
                  {t.savingTenure}
                </label>
                <span className="text-lg font-bold font-mono tabular-nums text-stone-900">
                  {years} {t.yearsUnit}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
              />
              <div className="flex justify-between text-[11px] text-stone-400 mt-1 font-mono">
                <span>1 {t.yearsUnit}</span>
                <span>5 {t.yearsUnit}</span>
                <span>10 {t.yearsUnit}</span>
                <span>15 {t.yearsUnit}</span>
                <span>25 {t.yearsUnit}</span>
              </div>
            </div>

            {/* Investment Summary */}
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg space-y-1 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>{t.annualSaving}</span>
                <span className="font-semibold text-stone-900 font-mono tabular-nums">
                  ₹{annualInvestment.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>
                  {years} {t.totalPocketSavings}
                </span>
                <span className="font-semibold text-stone-900 font-mono tabular-nums">
                  ₹{totalInvestedPrincipal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Results Comparison Deck (Right 6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Box 1: Idle Cash */}
            <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs text-stone-400 font-medium">{t.boxIdleTitle}</div>
                <div className="text-sm font-semibold text-stone-800">{t.boxIdleSub}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold font-mono tabular-nums text-stone-700">
                  ₹{fvIdle.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-rose-600 font-medium">{t.boxIdleLoss}</div>
              </div>
            </div>

            {/* Box 2: Post Office RD / Sukanya (~6.8%) */}
            <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs text-stone-400 font-medium">{t.boxPostOfficeTitle}</div>
                <div className="text-sm font-semibold text-stone-800">{t.boxPostOfficeSub}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold font-mono tabular-nums text-blue-900">
                  ₹{fvBankSavings.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-emerald-600 font-medium">
                  +₹{(fvBankSavings - totalInvestedPrincipal).toLocaleString('en-IN')} {t.boxPostOfficeGain}
                </div>
              </div>
            </div>

            {/* Box 3: Diversified Mutual Fund SIP (~12%) */}
            <div className="bg-emerald-950 text-white rounded-xl p-6 shadow-md border border-emerald-900 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-emerald-400 font-mono uppercase tracking-wider">
                    {t.boxSipTitle}
                  </div>
                  <h4 className="text-lg font-bold font-serif mt-0.5">
                    {t.boxSipSub}
                  </h4>
                </div>
                <div className="p-2 rounded-lg bg-emerald-900/60 text-emerald-300">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-900/80 flex items-baseline justify-between">
                <span className="text-xs text-stone-300">
                  {years} {t.boxSipWealth}
                </span>
                <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-300">
                  ₹{fvIndexSIP.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3 bg-emerald-900/40 rounded-lg text-xs text-emerald-100 flex items-center justify-between">
                <span>{t.boxSipNetGain}</span>
                <span className="font-semibold text-emerald-300 font-mono tabular-nums">
                  +₹{(fvIndexSIP - totalInvestedPrincipal).toLocaleString('en-IN')}
                </span>
              </div>

              <p className="text-[11px] text-stone-300 leading-relaxed">
                {t.boxSipInspire}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: MONEYLENDER VS BANK LOAN TRAP */}
      {activeSubTab === 'loan-trap' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Deck (Left 6 Cols) */}
          <div className="lg:col-span-6 bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 uppercase tracking-wider mb-1">
                <Scale className="w-4 h-4 text-rose-700" />
                <span>{t.loanTrapHeaderTag}</span>
              </div>
              <h3 className="text-xl font-bold font-serif text-stone-900">
                {t.loanTrapTitle}
              </h3>
              <p className="mt-1 text-xs text-stone-600">
                {t.loanTrapSubtitle}
              </p>
            </div>

            {/* Loan Principal */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-stone-900">
                  {t.loanAmount}
                </label>
                <span className="text-xl font-bold font-mono tabular-nums text-stone-900">
                  ₹{loanPrincipal.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="300000"
                step="5000"
                value={loanPrincipal}
                onChange={(e) => setLoanPrincipal(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-700"
              />
              <div className="flex gap-2 mt-2">
                {[25000, 50000, 100000, 200000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setLoanPrincipal(amt)}
                    className="px-2 py-0.5 rounded border border-stone-200 text-xs text-stone-600 hover:bg-stone-50"
                  >
                    ₹{(amt / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            {/* Moneylender Monthly Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-stone-900">
                  {t.moneylenderRateLabel}
                </label>
                <span className="text-lg font-bold font-mono tabular-nums text-rose-700">
                  {moneylenderMonthlyRate}% / {t.monthsUnit || 'माह'} ({moneylenderMonthlyRate * 12}% {t.yearsUnit || 'सालाना'}!)
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="8"
                step="0.5"
                value={moneylenderMonthlyRate}
                onChange={(e) => setMoneylenderMonthlyRate(Number(e.target.value))}
                className="w-full h-2 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-rose-600"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                {t.moneylenderRateNote}
              </p>
            </div>

            {/* Tenure */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-stone-900">
                  {t.loanTenure}
                </label>
                <span className="text-lg font-bold font-mono tabular-nums text-stone-900">
                  {loanTenureMonths} {t.monthsUnit} (
                  {(loanTenureMonths / 12).toFixed(1)} {t.yearsUnit})
                </span>
              </div>
              <input
                type="range"
                min="6"
                max="36"
                step="6"
                value={loanTenureMonths}
                onChange={(e) => setLoanTenureMonths(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-700"
              />
            </div>
          </div>

          {/* Comparison Cards Deck (Right 6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* The Warning: Moneylender Trap */}
            <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-900 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>{t.moneylenderTrapTitle}</span>
                </div>
                <span className="text-xs font-mono font-bold text-rose-700">
                  {moneylenderMonthlyRate * 12}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-rose-200/80">
                <div>
                  <div className="text-xs text-stone-500">{t.moneylenderTotalInterest}</div>
                  <div className="text-xl font-bold font-mono tabular-nums text-rose-800">
                    ₹{totalMoneylenderInterest.toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-stone-500">{t.moneylenderTotalPayable}</div>
                  <div className="text-xl font-bold font-mono tabular-nums text-rose-950">
                    ₹{totalMoneylenderPaid.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            {/* The Solution: Bank MUDRA / Formal Loan */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>{t.bankLoanTitle}</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-800">
                  {bankAnnualRate}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-emerald-200/80">
                <div>
                  <div className="text-xs text-stone-500">{t.bankTotalInterest}</div>
                  <div className="text-xl font-bold font-mono tabular-nums text-emerald-800">
                    ₹{totalBankInterest.toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-stone-500">{t.bankEmiMonthly}</div>
                  <div className="text-xl font-bold font-mono tabular-nums text-emerald-950">
                    ₹{bankEMI.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            {/* The Direct Financial Relief Card */}
            <div className="bg-stone-900 text-white rounded-xl p-6 border border-stone-800 space-y-3">
              <div className="text-xs text-amber-400 font-mono uppercase tracking-wider">
                {t.moneySavedLabel}
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-stone-300">{t.moneySavedLabel}</span>
                <span className="text-3xl font-bold font-mono tabular-nums text-emerald-400">
                  ₹{moneySavedWithBank.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                {t.moneySavedDesc}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
