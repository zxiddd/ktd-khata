import React, { useState } from 'react';
import { useKhata } from '../../context/KhataContext';
import { ArrowLeft, Download, FileSpreadsheet, Printer, Calendar } from 'lucide-react';
import { formatCurrency, calculateContactBalance } from '../../db/storage';

export const ReportsModal: React.FC = () => {
  const { entries, contacts, activeBook, shop, closeModal, exportLedgerCsv } = useKhata();
  const [filterPeriod, setFilterPeriod] = useState<'ALL' | 'MONTH' | 'WEEK' | 'TODAY'>('ALL');

  const now = new Date();
  const activeContacts = contacts.filter((c) => c.status === 'active' && c.bookId === activeBook.id);

  // Filter entries
  const filteredEntries = entries.filter((e) => {
    if (e.bookId !== activeBook.id || e.isDeleted) return false;
    const entryDate = new Date(e.date);
    if (filterPeriod === 'TODAY') {
      return entryDate.toDateString() === now.toDateString();
    }
    if (filterPeriod === 'WEEK') {
      const diffTime = Math.abs(now.getTime() - entryDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }
    if (filterPeriod === 'MONTH') {
      return (
        entryDate.getMonth() === now.getMonth() &&
        entryDate.getFullYear() === now.getFullYear()
      );
    }
    return true;
  });

  const totalGave = filteredEntries
    .filter((e) => e.type === 'GAVE')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalGot = filteredEntries
    .filter((e) => e.type === 'GOT')
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/60 backdrop-blur-xs p-3 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0e8354] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={closeModal}
              className="p-1 rounded-full hover:bg-emerald-800 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold">Business Report & Statement</h2>
          </div>
          <button
            onClick={() => window.print()}
            className="p-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-emerald-100 transition-colors"
            title="Print Report"
          >
            <Printer className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {(['ALL', 'MONTH', 'WEEK', 'TODAY'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setFilterPeriod(p)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  filterPeriod === p
                    ? 'bg-[#0e8354] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {p === 'ALL'
                  ? 'All Time'
                  : p === 'MONTH'
                  ? 'This Month'
                  : p === 'WEEK'
                  ? 'This Week'
                  : 'Today'}
              </button>
            ))}
          </div>

          <button
            onClick={exportLedgerCsv}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>CSV Export</span>
          </button>
        </div>

        {/* Report Overview Box */}
        <div className="p-4 grid grid-cols-2 gap-3 border-b border-slate-100">
          <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-100">
            <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
              Total Credit Given
            </span>
            <span className="text-xl font-black text-[#d9383a] mt-0.5 block">
              {formatCurrency(totalGave)}
            </span>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100">
            <span className="text-[10px] font-bold text-[#0e8354] uppercase tracking-wider block">
              Total Payments Received
            </span>
            <span className="text-xl font-black text-[#0e8354] mt-0.5 block">
              {formatCurrency(totalGot)}
            </span>
          </div>
        </div>

        {/* Breakdown by Contact */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Contact-wise Balances ({activeContacts.length})
          </div>

          <div className="divide-y divide-slate-100">
            {activeContacts.map((contact) => {
              const balance = calculateContactBalance(contact.id, entries);
              return (
                <div key={contact.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{contact.name}</h4>
                    <p className="text-[11px] text-slate-400">{contact.phone}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-sm font-extrabold ${
                        balance > 0
                          ? 'text-[#d9383a]'
                          : balance < 0
                          ? 'text-[#0e8354]'
                          : 'text-slate-500'
                      }`}
                    >
                      {formatCurrency(balance)}
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      {balance > 0
                        ? 'Customer owes you'
                        : balance < 0
                        ? 'You owe customer'
                        : 'Settled'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-500">
            Shop: <strong className="text-slate-800">{shop.name}</strong> • {activeBook.name}
          </span>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-[#0e8354] hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs"
          >
            Print Statement
          </button>
        </div>
      </div>
    </div>
  );
};
