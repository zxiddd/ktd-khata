import React, { useState } from 'react';
import { useKhata } from '../../context/KhataContext';
import { Contact } from '../../types';
import { ArrowLeft, Calculator, Calendar, Check, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../db/storage';

interface CreateLoanModalProps {
  contact?: Contact;
  presetPrincipal?: number;
  presetNotes?: string;
}

export const CreateLoanModal: React.FC<CreateLoanModalProps> = ({
  contact: initialContact,
  presetPrincipal,
  presetNotes,
}) => {
  const { contacts, createLoan, closeModal } = useKhata();
  const [selectedContactId, setSelectedContactId] = useState<string>(
    initialContact ? initialContact.id : contacts[0]?.id || ''
  );
  const [principal, setPrincipal] = useState<string>(presetPrincipal ? String(presetPrincipal) : '20000');
  const [interestRate, setInterestRate] = useState<string>('12'); // 12% p.a.
  const [termMonths, setTermMonths] = useState<string>('6');
  const [frequency, setFrequency] = useState<'MONTHLY' | 'WEEKLY' | 'DAILY'>('MONTHLY');
  const [startDate, setStartDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState<string>(presetNotes || 'Business equipment financing');

  const p = parseFloat(principal) || 0;
  const r = (parseFloat(interestRate) || 0) / 100 / 12;
  const n = parseInt(termMonths) || 1;

  // EMI formula
  let emi = 0;
  if (r === 0) {
    emi = Math.round(p / n);
  } else {
    emi = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  }
  const totalPayable = emi * n;
  const totalInterest = Math.max(0, totalPayable - p);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContactId || p <= 0) return;

    createLoan({
      contactId: selectedContactId,
      principal: p,
      interestRateAnnual: parseFloat(interestRate) || 0,
      termMonths: n,
      frequency,
      startDate,
      notes,
    });

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/60 backdrop-blur-xs p-3 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0e8354] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={closeModal}
              className="p-1 rounded-full hover:bg-emerald-800 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold">Create Customer Loan</h2>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* Contact Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Customer
            </label>
            <select
              value={selectedContactId}
              onChange={(e) => setSelectedContactId(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0e8354]"
            >
              {contacts
                .filter((c) => c.status === 'active')
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
            </select>
          </div>

          {/* Principal Amount */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Loan Principal (₹)
            </label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="e.g. 50000"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e8354]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Interest Rate */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Interest (% / Year)
              </label>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="e.g. 12"
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e8354]"
              />
            </div>

            {/* Tenure in months */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tenure (Months)
              </label>
              <input
                type="number"
                value={termMonths}
                onChange={(e) => setTermMonths(e.target.value)}
                placeholder="e.g. 6"
                min="1"
                max="60"
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e8354]"
              />
            </div>
          </div>

          {/* Frequency & Start Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Installment Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0e8354]"
              >
                <option value="MONTHLY">Monthly</option>
                <option value="WEEKLY">Weekly</option>
                <option value="DAILY">Daily</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0e8354]"
              />
            </div>
          </div>

          {/* Calculation Preview Box */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0e8354] uppercase tracking-wider">
              <Calculator className="w-4 h-4" />
              <span>EMI & Repayment Preview</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="bg-white p-2 rounded-xl border border-emerald-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-semibold">Monthly EMI</span>
                <span className="text-base font-extrabold text-[#0e8354]">
                  {formatCurrency(emi)}
                </span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-emerald-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-semibold">Total Interest</span>
                <span className="text-sm font-bold text-slate-800">
                  {formatCurrency(totalInterest)}
                </span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-emerald-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-semibold">Total Payable</span>
                <span className="text-sm font-bold text-slate-800">
                  {formatCurrency(totalPayable)}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-emerald-800 mt-1 leading-snug">
              ✓ Auto-generates {n} scheduled installments with late-fee tracking. Disburses principal as a credit entry in customer ledger.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 bg-[#0e8354] hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md active:scale-[0.99] transition-all cursor-pointer"
          >
            Disburse Loan & Schedule Installments
          </button>
        </form>
      </div>
    </div>
  );
};
