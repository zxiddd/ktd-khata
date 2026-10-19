import React from 'react';
import { useKhata } from '../../context/KhataContext';
import { Briefcase, Zap, MessageCircle, ShieldCheck, Plus, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import { formatCurrency, formatDate } from '../../db/storage';

export const LoansTab: React.FC = () => {
  const { loans, openModal, recordInstallmentPayment, settleLoanFull, triggerWhatsAppShare, shop } = useKhata();

  const activeLoans = loans.filter((l) => l.status === 'ACTIVE');

  // Compute total due today and late
  const todayStr = new Date().toISOString().split('T')[0];
  let dueTodayAmount = 0;
  let lateAmount = 0;

  activeLoans.forEach((loan) => {
    loan.installments.forEach((inst) => {
      if (inst.status !== 'PAID') {
        const unpaid = inst.amount - (inst.paidAmount || 0);
        if (inst.dueDate === todayStr) {
          dueTodayAmount += unpaid;
        } else if (inst.dueDate < todayStr) {
          lateAmount += unpaid;
        }
      }
    });
  });

  return (
    <div className="pb-24 pt-2">
      {/* Top Dues Card matching screenshot 2 */}
      <div className="mx-4 mb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="grid grid-cols-2 divide-x divide-slate-100 pb-3">
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-1">Due Today</div>
              <div className="text-2xl font-extrabold text-[#0e8354] tracking-tight">
                {formatCurrency(dueTodayAmount)}
              </div>
            </div>
            <div className="pl-4">
              <div className="text-xs font-semibold text-slate-500 mb-1">Late</div>
              <div className="text-2xl font-extrabold text-slate-500 tracking-tight">
                {formatCurrency(lateAmount)}
              </div>
            </div>
          </div>

          <div className="pt-1">
            {dueTodayAmount === 0 && lateAmount === 0 ? (
              <div className="w-full py-2 px-3 bg-slate-50 border border-slate-100 rounded-xl text-center text-xs font-bold text-slate-500 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>No Dues!</span>
              </div>
            ) : (
              <button
                onClick={() => openModal('BULK_REMINDER')}
                className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Send WhatsApp Due Reminders</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hero Illustration & Info matching screenshot 2 */}
      <div className="mx-4 bg-white rounded-3xl p-6 text-center shadow-xs border border-slate-100 space-y-4">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-[#0e8354] shadow-xs">
          <Briefcase className="w-10 h-10 fill-[#0e8354] stroke-white" />
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-[#141b2d] tracking-tight">Loan Management</h2>
          <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2 leading-relaxed">
            Give loans, auto-track installments and collect payments on time — effortlessly.
          </p>
        </div>

        {/* 3 Pills matching screenshot 2 */}
        <div className="flex flex-col items-center space-y-2 pt-2">
          <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-xs font-bold text-slate-700 flex items-center gap-2 shadow-2xs">
            <Zap className="w-4 h-4 text-emerald-600 fill-current" />
            <span>Auto installments</span>
          </div>

          <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-xs font-bold text-slate-700 flex items-center gap-2 shadow-2xs">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp reminders</span>
          </div>

          <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-xs font-bold text-slate-700 flex items-center gap-2 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Late fee engine</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => openModal('CREATE_LOAN')}
            className="w-full py-3.5 px-6 bg-[#0e8354] hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Create New Loan</span>
          </button>
        </div>
      </div>

      {/* Active Loans List */}
      <div className="mx-4 mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Active Loans ({activeLoans.length})
          </h3>
        </div>

        {activeLoans.length === 0 ? (
          <div className="p-6 bg-white rounded-2xl text-center text-slate-400 text-xs border border-slate-200">
            No active customer loans in this book.
          </div>
        ) : (
          activeLoans.map((loan) => {
            const paidCount = loan.installments.filter((i) => i.status === 'PAID').length;
            const nextPending = loan.installments.find((i) => i.status !== 'PAID');

            return (
              <div
                key={loan.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Loan #{loan.id.slice(-4)}
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 mt-1 capitalize">
                      {loan.contactName}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Total Principal</span>
                    <div className="text-lg font-extrabold text-slate-900">
                      {formatCurrency(loan.principal)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">EMI</span>
                    <span className="font-bold text-slate-800">
                      {formatCurrency(loan.emiAmount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Interest</span>
                    <span className="font-bold text-slate-800">
                      {loan.interestRateAnnual}% p.a.
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Progress</span>
                    <span className="font-bold text-emerald-700">
                      {paidCount} / {loan.installments.length} Paid
                    </span>
                  </div>
                </div>

                {nextPending && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-amber-900">
                        Next EMI: {formatCurrency(nextPending.amount)}
                      </div>
                      <div className="text-amber-700 text-[11px]">
                        Due on: {formatDate(nextPending.dueDate)}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        recordInstallmentPayment(loan.id, nextPending.id, nextPending.amount)
                      }
                      className="px-3 py-1.5 bg-[#0e8354] hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs"
                    >
                      Collect EMI
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      const msg = `Dear ${loan.contactName}, installment reminder for Loan #${loan.id.slice(
                        -4
                      )} at ${shop.name}. Amount: ${formatCurrency(loan.emiAmount)}. Thank you!`;
                      triggerWhatsAppShare('9100000000', msg);
                    }}
                    className="text-xs font-semibold text-emerald-700 hover:underline px-2 py-1"
                  >
                    WhatsApp Reminder
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Settle this loan in full?')) {
                        settleLoanFull(loan.id);
                      }
                    }}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 py-1"
                  >
                    Early Settle
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
