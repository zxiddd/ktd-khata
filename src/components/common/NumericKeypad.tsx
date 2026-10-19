import React, { useState } from 'react';
import { Delete, ChevronDown } from 'lucide-react';

interface NumericKeypadProps {
  value: string;
  onChange: (val: string) => void;
  onClose?: () => void;
}

export const NumericKeypad: React.FC<NumericKeypadProps> = ({ value, onChange, onClose }) => {
  const [memory, setMemory] = useState<number>(0);
  const [expression, setExpression] = useState<string>('');

  const handleKeyPress = (key: string) => {
    // If AC (All Clear)
    if (key === 'AC') {
      onChange('');
      setExpression('');
      return;
    }

    // Backspace
    if (key === 'BACKSPACE') {
      if (value.length > 0) {
        onChange(value.slice(0, -1));
      }
      return;
    }

    // Equal sign (Calculate expression if any)
    if (key === '=') {
      if (!expression && !value) return;
      try {
        const fullExpr = (expression + value).replace(/×/g, '*').replace(/÷/g, '/');
        // Simple safe evaluator for math strings
        // eslint-disable-next-line no-eval
        const result = Function(`'use strict'; return (${fullExpr})`)();
        if (!isNaN(result) && isFinite(result)) {
          onChange(String(Math.round(result * 100) / 100));
          setExpression('');
        }
      } catch {
        // syntax error, keep current value
      }
      return;
    }

    // Arithmetic operators: +, -, ×, ÷, %
    if (['+', '-', '×', '÷'].includes(key)) {
      if (value) {
        setExpression(value + ' ' + key + ' ');
        onChange('');
      } else if (expression) {
        // swap operator
        setExpression(expression.slice(0, -2) + key + ' ');
      }
      return;
    }

    if (key === '%') {
      if (value) {
        const num = parseFloat(value);
        if (!isNaN(num)) {
          onChange(String(num / 100));
        }
      }
      return;
    }

    // Memory functions
    if (key === 'M+') {
      const num = parseFloat(value || '0');
      if (!isNaN(num)) setMemory((prev) => prev + num);
      return;
    }

    if (key === 'M-') {
      const num = parseFloat(value || '0');
      if (!isNaN(num)) setMemory((prev) => prev - num);
      return;
    }

    // Decimal point
    if (key === '.') {
      if (!value.includes('.')) {
        onChange(value ? value + '.' : '0.');
      }
      return;
    }

    // Digits
    if (/^[0-9]$/.test(key)) {
      // Prevent multiple leading zeroes
      if (value === '0') {
        onChange(key);
      } else {
        onChange(value + key);
      }
    }
  };

  return (
    <div className="bg-[#f0f3f6] border-t border-slate-300 p-2 select-none">
      {/* Expression line if calculating */}
      {expression && (
        <div className="text-right text-xs text-slate-500 font-mono pr-2 mb-1">
          {expression} {value}
        </div>
      )}

      {/* Row 1: AC | M+ | M- | % | ÷ */}
      <div className="grid grid-cols-5 gap-1.5 mb-1.5">
        <button
          type="button"
          onClick={() => handleKeyPress('AC')}
          className="h-11 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 font-bold text-slate-700 rounded-lg text-sm transition-colors shadow-xs"
        >
          AC
        </button>
        <button
          type="button"
          onClick={() => handleKeyPress('M+')}
          className="h-11 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 font-semibold text-slate-700 rounded-lg text-xs transition-colors shadow-xs"
        >
          M+
        </button>
        <button
          type="button"
          onClick={() => handleKeyPress('M-')}
          className="h-11 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 font-semibold text-slate-700 rounded-lg text-xs transition-colors shadow-xs"
        >
          M-
        </button>
        <button
          type="button"
          onClick={() => handleKeyPress('%')}
          className="h-11 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 font-bold text-slate-700 rounded-lg text-sm transition-colors shadow-xs"
        >
          %
        </button>
        <button
          type="button"
          onClick={() => handleKeyPress('÷')}
          className="h-11 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 font-bold text-slate-800 rounded-lg text-base transition-colors shadow-xs"
        >
          ÷
        </button>
      </div>

      {/* Main Grid: 4 columns for Numbers and Operators */}
      <div className="grid grid-cols-4 gap-1.5">
        {/* Row 2: 1, 2, 3, × */}
        <button
          type="button"
          onClick={() => handleKeyPress('1')}
          className="h-12 bg-white hover:bg-slate-50 active:bg-slate-200 font-bold text-slate-800 rounded-lg text-xl transition-colors shadow-xs border border-slate-100"
        >
          1
        </button>
        <button
          type="button"
          onClick={() => handleKeyPress('2')}
          className="h-12 bg-white hover:bg-slate-50 active:bg-slate-200 font-bold text-slate-800 rounded-lg text-xl transition-colors shadow-xs border border-slate-100"
        >
          2
        </button>
        <button
          type="button"
          onClick={() => handleKeyPress('3')}
          className="h-12 bg-white hover:bg-slate-50 active:bg-slate-200 font-bold text-slate-800 rounded-lg text-xl transition-colors shadow-xs border border-slate-100"
        >
          3
        </button>
        <button
          type="button"
          onClick={() => handleKeyPress('×')}
          className="h-12 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 font-bold text-slate-800 rounded-lg text-xl transition-colors shadow-xs"
        >
          ×
        </button>

        {/* Row 3: 4, 5, 6, - */}
        <button
          type="button"
          onClick={() => handleKeyPress('4')}
          className="h-12 bg-white hover:bg-slate-50 active:bg-slate-200 font-bold text-slate-800 rounded-lg text-xl transition-colors shadow-xs border border-slate-100"
        >
          4
        </button>
        <button
          type="button"
          onClick={() => handleKeyPress('5')}
          className="h-12 bg-white hover:bg-slate-50 active:bg-slate-200 font-bold text-slate-800 rounded-lg text-xl transition-colors shadow-xs border border-slate-100"
        >
          5
        </button>
        <button
          type="button"
          onClick={() => handleKeyPress('6')}
          className="h-12 bg-white hover:bg-slate-50 active:bg-slate-200 font-bold text-slate-800 rounded-lg text-xl transition-colors shadow-xs border border-slate-100"
        >
          6
        </button>
        <button
          type="button"
          onClick={() => handleKeyPress('-')}
          className="h-12 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 font-bold text-slate-800 rounded-lg text-xl transition-colors shadow-xs"
        >
          -
        </button>

        {/* Row 4: 7, 8, 9, + */}
        <button
          type="button"
          onClick={() => handleKeyPress('7')}
          className="h-12 bg-white hover:bg-slate-50 active:bg-slate-200 font-bold text-slate-800 rounded-lg text-xl transition-colors shadow-xs border border-slate-100"
        >
          7
        </button>
        <button
          type="button"
          onClick={() => handleKeyPress('8')}
          className="h-12 bg-white hover:bg-slate-50 active:bg-slate-200 font-bold text-slate-800 rounded-lg text-xl transition-colors shadow-xs border border-slate-100"
        >
          8
        </button>
        <button
          type="button"
          onClick={() => handleKeyPress('9')}
          className="h-12 bg-white hover:bg-slate-50 active:bg-slate-200 font-bold text-slate-800 rounded-lg text-xl transition-colors shadow-xs border border-slate-100"
        >
          9
        </button>
        <button
          type="button"
          onClick={() => handleKeyPress('+')}
          className="h-12 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 font-bold text-slate-800 rounded-lg text-xl transition-colors shadow-xs"
        >
          +
        </button>

        {/* Row 5: ., 0, ⌫, = */}
        <button
          type="button"
          onClick={() => handleKeyPress('.')}
          className="h-12 bg-white hover:bg-slate-50 active:bg-slate-200 font-bold text-slate-800 rounded-lg text-2xl transition-colors shadow-xs border border-slate-100 flex items-center justify-center pb-2"
        >
          .
        </button>
        <button
          type="button"
          onClick={() => handleKeyPress('0')}
          className="h-12 bg-white hover:bg-slate-50 active:bg-slate-200 font-bold text-slate-800 rounded-lg text-xl transition-colors shadow-xs border border-slate-100"
        >
          0
        </button>
        <button
          type="button"
          onClick={() => handleKeyPress('BACKSPACE')}
          className="h-12 bg-white hover:bg-slate-50 active:bg-slate-200 text-slate-700 rounded-lg transition-colors shadow-xs border border-slate-100 flex items-center justify-center"
        >
          <Delete className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => handleKeyPress('=')}
          className="h-12 bg-[#0e8354] hover:bg-emerald-700 active:bg-emerald-800 font-bold text-white rounded-lg text-2xl transition-colors shadow-xs"
        >
          =
        </button>
      </div>

      {/* Collapse keypad handle */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="w-full mt-2 py-1 flex items-center justify-center text-slate-400 hover:text-slate-600"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
