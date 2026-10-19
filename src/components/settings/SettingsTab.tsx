import React from 'react';
import { useKhata } from '../../context/KhataContext';
import {
  FileSpreadsheet,
  RotateCcw,
  LogOut,
  Edit3,
  Store,
  Phone,
  User as UserIcon,
} from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const {
    shop,
    user,
    openModal,
    exportLedgerCsv,
    logout,
    clearAllShopData,
  } = useKhata();

  // Dynamic owner name and shop details - never hardcoded!
  const ownerDisplayName = user?.name || shop.ownerName || 'Shop Owner';
  const shopDisplayName = user?.shopName || shop.name || 'ktd khata';
  const phoneDisplayName = user?.phone || shop.phone || '';

  // Compute initials dynamically from real owner name
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || 'KH';
  };

  const initials = getInitials(ownerDisplayName);

  return (
    <div className="pb-24 pt-2">
      {/* Dynamic Owner & Shop Profile Card */}
      <div className="mx-4 mb-4">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#0e8354] font-extrabold text-xl flex items-center justify-center border-2 border-emerald-200 shadow-xs">
                {initials}
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
                  {ownerDisplayName}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold mt-0.5">
                  <Store className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>{shopDisplayName}</span>
                </div>
                {phoneDisplayName && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span>{phoneDisplayName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Edit button */}
            <button
              onClick={() => openModal('EDIT_SHOP')}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer border border-slate-100"
              title="Edit Profile & Shop Details"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* DATA EXPORT */}
      <div className="mx-4 mb-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">
          Reports & Export
        </span>
      </div>

      <div className="mx-4 mb-4 bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {/* Export to Excel / CSV */}
        <div
          onClick={exportLedgerCsv}
          className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0e8354] flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Export to Excel / CSV</h4>
              <p className="text-xs text-slate-500">Download formatted ledger report</p>
            </div>
          </div>
        </div>
      </div>

      {/* ACCOUNT & ACTIONS */}
      <div className="mx-4 mb-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">
          Account
        </span>
      </div>

      <div className="mx-4 mb-4 bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100 shadow-xs overflow-hidden">
        {/* Clear All Data */}
        <div
          onClick={() => {
            if (
              window.confirm(
                'Are you sure you want to clear all ledger data? This will remove all contacts, entries, and loans.'
              )
            ) {
              clearAllShopData();
              alert('All ledger data has been cleared. Your book is now fresh and clean.');
            }
          }}
          className="p-4 flex items-center justify-between hover:bg-rose-50/50 cursor-pointer transition-colors"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-bold text-rose-700 text-sm">Clear All Ledger Data</h4>
              <p className="text-xs text-slate-500">Reset contacts, entries, and loans to clean zero</p>
            </div>
          </div>
        </div>

        {/* Log Out */}
        <div
          onClick={() => {
            if (window.confirm('Log out from ktd khata?')) {
              logout();
            }
          }}
          className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <LogOut className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Log Out</h4>
              <p className="text-xs text-slate-500">Sign out of your session</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
