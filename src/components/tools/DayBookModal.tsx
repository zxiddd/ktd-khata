import React, { useState } from 'react';
import { useKhata } from '../../context/KhataContext';
import { ArrowLeft, Calendar, ArrowUpRight, ArrowDownLeft, FileText, Download } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../db/storage';

export const DayBookModal: React.FC = () => {
  const { entries, contacts, closeModal, activeBook, shop } = useKhata();
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().slice(0, 10));

  const bookEntries = entries.filter((e) => e.bookId === activeBook.id && !e.isDeleted);

  // Filter entries for the selected date
  const dayEntries = bookEntries.filter((e) => {
    return e.date.startsWith(selectedDate);
  });

  const moneyIn = dayEntries
    .filter((e) => e.type === 'GOT')
    .reduce((sum, e) => sum + e.amount, 0);

  const moneyOut = dayEntries
    .filter((e) => e.type === 'GAVE')
    .reduce((sum, e) => sum + e.amount, 0);

  const netDay = moneyIn - moneyOut;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/60 backdrop-blur-xs p-3 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0e8354] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={closeModal}
              className="p-1 rounded-full hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold">Day Book (Cash Register)</h2>
          </div>
          <span className="text-xs text-emerald-100 font-semibold">{activeBook.name}</span>
        </div>

        {/* Date Selector */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-700">Select Date:</span>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-xs font-bold bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0e8354]"
          />
        </div>

        {/* Summary Numbers */}
        <div className="p-4 grid grid-cols-3 gap-2 text-center border-b border-slate-100">
          <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
            <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">
              Money In (Got)
            </span>
            <span className="text-base font-extrabold text-[#0e8354]">
              {formatCurrency(moneyIn)}
            </span>
          </div>
          <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-100">
            <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider block">
              Money Out (Gave)
            </span>
            <span className="text-base font-extrabold text-[#d9383a]">
              {formatCurrency(moneyOut)}
            </span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Net Balance
            </span>
            <span
              className={`text-base font-extrabold ${
                netDay >= 0 ? 'text-[#0e8354]' : 'text-[#d9383a]'
              }`}
            >
              {formatCurrency(netDay)}
            </span>
          </div>
        </div>

        {/* Entries list for this day */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1 divide-y divide-slate-100">
          {dayEntries.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No transactions recorded on this date.
            </div>
          ) : (
            dayEntries.map((entry) => {
              const contact = contacts.find((c) => c.id === entry.contactId);
              const isGave = entry.type === 'GAVE';

              return (
                <div key={entry.id} className="pt-2.5 pb-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isGave ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-[#0e8354]'
                      }`}
                    >
                      {isGave ? (
                        <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">
                        {contact ? contact.name : 'Unknown Contact'}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {formatDateTime(entry.date)} {entry.notes ? `• ${entry.notes}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-sm font-bold ${
                        isGave ? 'text-[#d9383a]' : 'text-[#0e8354]'
                      }`}
                    >
                      {isGave ? '-' : '+'}
                      {formatCurrency(entry.amount)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer print / close */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <span className="text-xs text-slate-500 font-semibold">
            {dayEntries.length} entries for this date
          </span>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-[#0e8354] hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Print Day Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
