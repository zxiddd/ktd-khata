import React, { useRef } from 'react';
import { useKhata } from '../../context/KhataContext';
import {
  HelpCircle,
  PieChart,
  CreditCard,
  WifiOff,
  RefreshCw,
  Languages,
  Tag,
  Download,
  Upload,
  FileSpreadsheet,
  CheckSquare,
  Lock,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Smartphone,
} from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const {
    shop,
    offlineMode,
    toggleOfflineMode,
    openModal,
    exportDatabaseJson,
    importDatabaseJson,
    exportLedgerCsv,
    language,
    checklistCompletedCount,
    checklistTotalCount,
    appPin,
    user,
    logout,
    clearAllShopData,
  } = useKhata();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ok = await importDatabaseJson(file);
      if (ok) {
        alert('Database restored successfully!');
      } else {
        alert('Failed to restore backup file.');
      }
    }
  };

  return (
    <div className="pb-24 pt-2">
      {/* User Account Card matching screenshot 6 */}
      <div className="mx-4 mb-4">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-14 h-14 rounded-full bg-slate-300 text-slate-700 font-bold text-xl flex items-center justify-center">
              AT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-lg">Atif</h3>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Pro plan
                </span>
              </div>
              <p className="text-xs text-slate-600 font-semibold">{shop.phone}</p>
              <p className="text-xs text-slate-400">{shop.email}</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-2">
            <div
              onClick={() => alert('Storage Usage: 1.2 MB / 100 GB cloud quota used.')}
              className="flex items-center justify-between py-1 text-xs text-slate-700 font-semibold cursor-pointer hover:text-emerald-700"
            >
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-600" />
                <span>Usage</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <div
              onClick={() => alert('Subscription: Pro Annual Plan active with unlimited books and WhatsApp reminders.')}
              className="flex items-center justify-between py-1 text-xs text-slate-700 font-semibold cursor-pointer hover:text-emerald-700"
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Manage subscription</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* PREFERENCES matching screenshot 6 */}
      <div className="mx-4 mb-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">
          Preferences
        </span>
      </div>

      <div className="mx-4 mb-4 bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100 shadow-xs overflow-hidden">
        {/* Install Android App (APK) */}
        <div
          onClick={() => openModal('APK_DOWNLOAD')}
          className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors bg-emerald-50/40"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#0e8354] text-white flex items-center justify-center shadow-xs">
              <Smartphone className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-slate-900 text-sm">Install Android App (APK)</h4>
                <span className="text-[10px] bg-[#0e8354] text-white px-1.5 py-0.2 rounded font-bold">APK</span>
              </div>
              <p className="text-xs text-slate-500">Install native WebAPK on your phone</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>

        {/* Work without internet */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-start space-x-3.5 pr-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <WifiOff className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Work without internet</h4>
              <p className="text-xs text-slate-500 leading-snug mt-0.5">
                Work 10x faster with or without internet. Auto back-up when online again.
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={toggleOfflineMode}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
              offlineMode ? 'bg-[#0e8354]' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                offlineMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Sync status */}
        <div
          onClick={() => openModal('SYNC_STATUS')}
          className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-emerald-600 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Sync status</h4>
              <p className="text-xs text-slate-500">View pending uploads + downloaded data</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>

        {/* Change Language */}
        <div
          onClick={() => openModal('CHANGE_LANGUAGE')}
          className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-emerald-600 flex items-center justify-center">
              <Languages className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Change Language</h4>
              <p className="text-xs text-slate-500 capitalize">Current: {language}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>

        {/* Customize Labels */}
        <div
          onClick={() => openModal('CUSTOMIZE_LABELS')}
          className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-emerald-600 flex items-center justify-center">
              <Tag className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-slate-900 text-sm">Customize Labels</h4>
                <span className="text-amber-500 text-xs">👑</span>
              </div>
              <p className="text-xs text-slate-500">Rename buttons & labels to your own words</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>

        {/* Security & App Lock */}
        <div
          onClick={() => openModal('APP_LOCK_SETTINGS')}
          className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-800 flex items-center justify-center">
              <Lock className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Security & App PIN</h4>
              <p className="text-xs text-slate-500">
                {appPin ? '4-digit PIN Protection Active' : 'No PIN set (unlocked)'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>
      </div>

      {/* BACKUP & EXPORTS */}
      <div className="mx-4 mb-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">
          Data Backup & Audit
        </span>
      </div>

      <div className="mx-4 mb-4 bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100 shadow-xs overflow-hidden">
        {/* Backup Database */}
        <div
          onClick={exportDatabaseJson}
          className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0e8354] flex items-center justify-center">
              <Download className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Download Backup (JSON)</h4>
              <p className="text-xs text-slate-500">Save full shop ledger snapshot to device</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>

        {/* Restore Database */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Upload className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Restore Backup File</h4>
              <p className="text-xs text-slate-500">Upload and restore previously exported data</p>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>

        {/* Export CSV */}
        <div
          onClick={exportLedgerCsv}
          className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Export to Excel / CSV</h4>
              <p className="text-xs text-slate-500">Formatted spreadsheet for accountant review</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>
      </div>

      {/* ACCOUNT & DATA PURGE */}
      <div className="mx-4 mb-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">
          Account & Danger Zone
        </span>
      </div>

      <div className="mx-4 mb-4 bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100 shadow-xs overflow-hidden">
        {/* Clear All Data */}
        <div
          onClick={() => {
            if (window.confirm('Are you sure you want to clear all ledger data? This will remove all contacts, entries, and loans.')) {
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
          <ChevronRight className="w-5 h-5 text-slate-400" />
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
              <Lock className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Log Out</h4>
              <p className="text-xs text-slate-500">Sign out and protect your shop session</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>
      </div>
    </div>
  );
};
