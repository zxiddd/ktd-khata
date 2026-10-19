import React, { useState } from 'react';
import { useKhata } from '../../context/KhataContext';
import { ArrowLeft, Calculator, PieChart, Check } from 'lucide-react';
import { formatCurrency } from '../../db/storage';

export const EmiCalculatorModal: React.FC = () => {
  const { closeModal } = useKhata();
  const [amount, setAmount] = useState<number>(50000);
  const [interestRate, setInterestRate] = useState<number>(12); // % p.a.
  const [tenureMonths, setTenureMonths] = useState<number>(12);

  const r = interestRate / 12 / 100;
  const n = tenureMonths;

  let emi = 0;
  if (r === 0) {
    emi = Math.round(amount / n);
  } else {
    emi = Math.round((amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  }

  const totalPayment = emi * n;
  const totalInterest = Math.max(0, totalPayment - amount);

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
            <h2 className="text-xl font-bold">Loan EMI Calculator</h2>
          </div>
        </div>

        {/* Inputs */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Loan Amount */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Loan Amount (₹)</label>
              <span className="text-sm font-extrabold text-[#0e8354]">
                {formatCurrency(amount)}
              </span>
            </div>
            <input
              type="range"
              min="5000"
              max="1000000"
              step="5000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-[#0e8354]"
            />
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase">
                Annual Interest Rate (%)
              </label>
              <span className="text-sm font-extrabold text-slate-900">{interestRate}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="36"
              step="0.5"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-[#0e8354]"
            />
          </div>

          {/* Tenure */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Tenure (Months)</label>
              <span className="text-sm font-extrabold text-slate-900">{tenureMonths} Months</span>
            </div>
            <input
              type="range"
              min="1"
              max="60"
              step="1"
              value={tenureMonths}
              onChange={(e) => setTenureMonths(Number(e.target.value))}
              className="w-full accent-[#0e8354]"
            />
          </div>

          {/* Results Summary Box */}
          <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 space-y-3">
            <div className="text-center">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Monthly EMI
              </span>
              <div className="text-3xl font-black text-[#0e8354] mt-1">
                {formatCurrency(emi)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-emerald-200/60 text-center text-xs">
              <div>
                <span className="text-slate-500 font-semibold block">Principal Amount</span>
                <span className="font-bold text-slate-900 text-sm">{formatCurrency(amount)}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Total Interest</span>
                <span className="font-bold text-slate-900 text-sm">
                  {formatCurrency(totalInterest)}
                </span>
              </div>
            </div>

            <div className="pt-2 text-center text-xs text-slate-600">
              Total Amount Payable: <strong className="text-slate-900">{formatCurrency(totalPayment)}</strong>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={closeModal}
            className="w-full py-2.5 bg-[#0e8354] hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
          >
            Close Calculator
          </button>
        </div>
      </div>
    </div>
  );
};
