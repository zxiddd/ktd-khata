import React, { useState } from 'react';
import { useKhata } from '../../context/KhataContext';
import { ArrowLeft, Delete, RotateCcw } from 'lucide-react';
import { NumericKeypad } from '../common/NumericKeypad';

export const StandardCalculatorModal: React.FC = () => {
  const { closeModal } = useKhata();
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [history, setHistory] = useState<string[]>([]);

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/60 backdrop-blur-xs p-3 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0e8354] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={closeModal}
              className="p-1 rounded-full hover:bg-emerald-800 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold">Shop Calculator</h2>
          </div>
          <button
            onClick={() => {
              setDisplayValue('0');
              setHistory([]);
            }}
            className="p-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-emerald-100 text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Display Screen */}
        <div className="p-5 bg-slate-900 text-white text-right space-y-1">
          <div className="text-xs text-slate-400 font-mono h-4">
            {history[history.length - 1] || ' '}
          </div>
          <div className="text-3xl font-extrabold font-mono tracking-tight overflow-x-auto no-scrollbar">
            {displayValue || '0'}
          </div>
        </div>

        {/* Keypad */}
        <div className="flex-1 bg-[#f0f3f6]">
          <NumericKeypad
            value={displayValue === '0' ? '' : displayValue}
            onChange={(val) => setDisplayValue(val || '0')}
          />
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-200 text-center">
          <button
            onClick={closeModal}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
