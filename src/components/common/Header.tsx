import React from 'react';
import { useKhata } from '../../context/KhataContext';
import { ChevronDown, Smartphone, LogOut, User } from 'lucide-react';

export const Header: React.FC<{ isMobileFrame: boolean; setIsMobileFrame: (val: boolean) => void }> = ({
  isMobileFrame,
  setIsMobileFrame,
}) => {
  const { activeBook, openModal, user, logout } = useKhata();

  return (
    <header className="bg-[#0e8354] text-white px-4 py-3 flex items-center justify-between shadow-md select-none sticky top-0 z-30">
      <div className="flex items-center space-x-2">
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5">
            <span className="font-extrabold text-lg tracking-tight leading-tight">ktd khata</span>
            <span className="text-[10px] text-emerald-200 font-mono bg-emerald-800/80 px-1.5 py-0.5 rounded">
              v4.8
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Install APK Button */}
        <button
          onClick={() => openModal('APK_DOWNLOAD')}
          className="flex items-center gap-1.5 bg-emerald-800/90 hover:bg-emerald-900 px-2.5 py-1.5 rounded-xl border border-emerald-600/40 text-xs font-bold text-emerald-100 transition-all active:scale-95 cursor-pointer shadow-xs"
          title="Install Android APK"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-300" />
          <span>APK</span>
        </button>

        {/* Book Selector trigger */}
        <button
          onClick={() => openModal('SELECT_BOOK')}
          className="flex items-center space-x-1.5 bg-emerald-800/90 hover:bg-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-600/40 text-sm font-semibold tracking-wide transition-all active:scale-95 cursor-pointer shadow-xs"
        >
          <span className="truncate max-w-[130px] sm:max-w-[170px]">{activeBook.name}</span>
          <ChevronDown className="w-4 h-4 text-emerald-200 flex-shrink-0" />
        </button>

        {/* Desktop Viewport Switcher */}
        <button
          onClick={() => setIsMobileFrame(!isMobileFrame)}
          className="hidden md:flex items-center justify-center p-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-600/40 text-xs transition-colors cursor-pointer"
          title={isMobileFrame ? 'Expand to Full Width' : 'Switch to Mobile Frame'}
        >
          <Smartphone className="w-4 h-4" />
        </button>

        {/* Logout Quick Trigger if logged in */}
        {user && (
          <button
            onClick={() => {
              if (window.confirm('Log out from this session?')) {
                logout();
              }
            }}
            className="p-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-600/40 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
