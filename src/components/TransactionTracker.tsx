import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, ArrowUpRight, ArrowDownLeft, ShieldCheck, Download, Wallet } from 'lucide-react';
import { SupportedLanguage, Transaction } from '../types';
import { UI_STRINGS } from '../data/translations';

interface TransactionTrackerProps {
  currentLang: SupportedLanguage;
}

export const TransactionTracker: React.FC<TransactionTrackerProps> = ({ currentLang }) => {
  const t = UI_STRINGS[currentLang] || UI_STRINGS.hi;

  const categoryNames: Record<Transaction['category'], string> = {
    ration: t.catRation,
    rent_utility: t.catRentUtility,
    school_fees: t.catSchoolFees,
    medical: t.catMedical,
    farming_business: t.catFarmingBusiness,
    savings_gullak: t.catSavingsGullak,
    transport: t.catTransport,
    other: t.catOther,
  };

  const getInitialTransactions = (lang: SupportedLanguage): Transaction[] => {
    const isEn = lang === 'en';
    return [
      {
        id: 'tx-1',
        date: '2026-10-01',
        type: 'income',
        category: 'farming_business',
        amount: 28000,
        note: isEn ? 'Shop sales & daily milk produce' : 'दुकान की मासिक बिक्री व दूध का हिसाब',
      },
      {
        id: 'tx-2',
        date: '2026-10-01',
        type: 'expense',
        category: 'ration',
        amount: 6500,
        note: isEn ? 'Monthly groceries, flour & spices' : 'मासिक राशन, तेल व मसाले',
      },
      {
        id: 'tx-3',
        date: '2026-10-02',
        type: 'expense',
        category: 'school_fees',
        amount: 3200,
        note: isEn ? 'School tuition fees & notebook supplies' : 'बच्चों की स्कूल फीस व कॉपियां',
      },
      {
        id: 'tx-4',
        date: '2026-10-02',
        type: 'expense',
        category: 'rent_utility',
        amount: 1800,
        note: isEn ? 'Electricity bill & cooking gas' : 'बिजली का बिल व रसोई गैस सिलेंडर',
      },
      {
        id: 'tx-5',
        date: '2026-10-02',
        type: 'expense',
        category: 'savings_gullak',
        amount: 3000,
        note: isEn ? 'Post Office RD Monthly Deposit' : 'डाकघर RD खाते में जमा (मासिक बचत)',
      },
    ];
  };

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('dhansetu_local_transactions');
      return saved ? JSON.parse(saved) : getInitialTransactions(currentLang);
    } catch {
      return getInitialTransactions(currentLang);
    }
  });

  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [formType, setFormType] = useState<'income' | 'expense'>('expense');
  const [formCategory, setFormCategory] = useState<Transaction['category']>('ration');
  const [formAmount, setFormAmount] = useState('');
  const [formNote, setFormNote] = useState('');
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    try {
      localStorage.setItem('dhansetu_local_transactions', JSON.stringify(transactions));
    } catch (e) {
      console.error(e);
    }
  }, [transactions]);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(formAmount);
    if (!amt || amt <= 0) return;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: formDate,
      type: formType,
      category: formCategory,
      amount: amt,
      note: formNote || (formType === 'income' ? t.income : t.expense),
    };

    setTransactions([newTx, ...transactions]);
    setFormAmount('');
    setFormNote('');
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    setTransactions(transactions.filter((tx) => tx.id !== id));
  };

  const handleExportCSV = () => {
    const headers = 'ID,Date,Type,Category,Amount,Note\n';
    const rows = transactions
      .map((item) => `"${item.id}","${item.date}","${item.type}","${item.category}","${item.amount}","${item.note}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dhansetu-khata-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalIncome = transactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const filteredList = transactions.filter((tx) => {
    if (filterType === 'all') return true;
    return tx.type === filterType;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Wallet className="w-3.5 h-3.5" />
            <span>{t.trackerHeaderTag}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
            {t.trackerTitle}
          </h2>
          <p className="mt-1 text-sm text-stone-600 max-w-2xl">
            {t.trackerSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-md transition-colors"
            title="Download CSV statement"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.downloadLedgerBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-md transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t.addTransaction}</span>
          </button>
        </div>
      </div>

      {/* Overview Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
            <span>{t.totalIncome}</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-700">
            ₹{totalIncome.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
            <span>{t.totalExpense}</span>
            <ArrowUpRight className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-rose-700">
            ₹{totalExpense.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="bg-stone-900 text-white rounded-xl p-5 shadow-xs border border-stone-800">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
            <span>{t.balance}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            ₹{netBalance.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Add Record Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddTransaction}
          className="bg-stone-50 border border-stone-300 rounded-xl p-6 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h4 className="text-sm font-bold font-serif text-stone-900">
              {t.addNewRecordTitle}
            </h4>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-stone-400 hover:text-stone-700"
            >
              {t.cancelBtn}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.recordTypeLabel}
              </label>
              <div className="flex rounded-md border border-stone-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setFormType('expense')}
                  className={`flex-1 py-1.5 text-xs font-medium transition-colors ${
                    formType === 'expense'
                      ? 'bg-rose-700 text-white font-semibold'
                      : 'bg-white text-stone-600'
                  }`}
                >
                  {t.expenseOption}
                </button>
                <button
                  type="button"
                  onClick={() => setFormType('income')}
                  className={`flex-1 py-1.5 text-xs font-medium transition-colors ${
                    formType === 'income'
                      ? 'bg-emerald-700 text-white font-semibold'
                      : 'bg-white text-stone-600'
                  }`}
                >
                  {t.incomeOption}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.amountLabel}
              </label>
              <input
                type="number"
                min="1"
                step="any"
                required
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                placeholder={t.amountPlaceholder}
                className="w-full px-3 py-1.5 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.categoryLabel}
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-md focus:outline-none"
              >
                {Object.entries(categoryNames).map(([key, name]) => (
                  <option key={key} value={key}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.dateLabel}
              </label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-md focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t.descLabel}
            </label>
            <input
              type="text"
              value={formNote}
              onChange={(e) => setFormNote(e.target.value)}
              placeholder={t.descPlaceholder}
              className="w-full px-3 py-1.5 text-sm bg-white border border-stone-300 rounded-md focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-md transition-colors"
            >
              {t.submitRecordBtn}
            </button>
          </div>
        </form>
      )}

      {/* Transaction Records List */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-stone-400 mr-1">{t.viewFilterLabel}</span>
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filterType === 'all'
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {t.filterAll}
            </button>
            <button
              type="button"
              onClick={() => setFilterType('income')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filterType === 'income'
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {t.filterIncome}
            </button>
            <button
              type="button"
              onClick={() => setFilterType('expense')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filterType === 'expense'
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {t.filterExpense}
            </button>
          </div>

          <span className="text-xs text-stone-400 font-mono">
            {filteredList.length} {t.entriesCount}
          </span>
        </div>

        {filteredList.length === 0 ? (
          <div className="text-center py-12 text-sm text-stone-400">
            {t.noRecordsText}
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {filteredList.map((tx) => {
              const isIncome = tx.type === 'income';

              return (
                <div
                  key={tx.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-stone-50/70 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                        isIncome ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-stone-900 leading-snug">
                        {tx.note}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
                        <span>{categoryNames[tx.category]}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-[11px]">{tx.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`font-mono text-base font-bold tabular-nums ${
                        isIncome ? 'text-emerald-700' : 'text-stone-900'
                      }`}
                    >
                      {isIncome ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDelete(tx.id)}
                      className="text-stone-300 hover:text-rose-600 p-1 rounded transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
