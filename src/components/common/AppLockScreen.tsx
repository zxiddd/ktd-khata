import React, { useState } from 'react';
import { useKhata } from '../../context/KhataContext';
import { Lock, Delete, ShieldCheck, X } from 'lucide-react';

export const AppLockScreen: React.FC = () => {
  const { unlockApp, shop } = useKhata();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handlePress = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        const success = unlockApp(nextPin);
        if (!success) {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 600);
        }
      }
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0e8354] text-white flex flex-col justify-between items-center p-6 select-none animate-in fade-in">
      <div className="w-full text-center mt-12 space-y-2">
        <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto text-emerald-200 mb-4 shadow-inner">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black tracking-tight">{shop.name}</h1>
        <p className="text-xs text-emerald-200">Enter your 4-digit security PIN to unlock</p>
      </div>

      {/* PIN dots */}
      <div className="flex items-center space-x-4 my-8">
        {[0, 1, 2, 3].map((index) => {
          const filled = index < pin.length;
          return (
            <div
              key={index}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                filled
                  ? error
                    ? 'bg-rose-400 scale-125'
                    : 'bg-white scale-125 shadow-md'
                  : 'bg-white/30'
              }`}
            />
          );
        })}
      </div>

      {error && (
        <div className="text-xs font-bold text-rose-200 bg-rose-900/60 px-4 py-1.5 rounded-full mb-4 animate-shake">
          Incorrect PIN. Please try again.
        </div>
      )}

      {/* Onscreen PIN keypad */}
      <div className="w-full max-w-xs grid grid-cols-3 gap-4 mb-8">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handlePress(String(num))}
            className="h-16 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-2xl font-bold flex items-center justify-center transition-all shadow-xs"
          >
            {num}
          </button>
        ))}
        <div />
        <button
          onClick={() => handlePress('0')}
          className="h-16 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-2xl font-bold flex items-center justify-center transition-all shadow-xs"
        >
          0
        </button>
        <button
          onClick={handleBackspace}
          className="h-16 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 flex items-center justify-center transition-all shadow-xs"
        >
          <Delete className="w-6 h-6" />
        </button>
      </div>

      <div className="text-center text-[11px] text-emerald-200/80 mb-4">
        Protected with Ok Khata Biometric & Device Encryption
      </div>
    </div>
  );
};
