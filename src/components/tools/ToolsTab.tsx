import React from 'react';
import { useKhata } from '../../context/KhataContext';
import {
  FileText,
  Calendar,
  Calculator,
  Lock,
  Percent,
  MessageCircle,
  Clock,
  Trash2,
  Edit2,
  ChevronRight,
  Store,
  Globe,
  Smartphone,
  Sparkles,
  Server,
  Layers,
  ArrowRight,
  Plus,
  Users,
} from 'lucide-react';

export const ToolsTab: React.FC = () => {
  const { shop, activeBook, contacts, openModal, deletedEntries, deletedContacts } = useKhata();

  const totalContacts = contacts.filter((c) => c.status === 'active').length;
  const initial = shop.name ? shop.name.charAt(0).toUpperCase() : 'K';

  return (
    <div className="pb-24 pt-2">
      {/* Shop Profile Card matching screenshot 5 */}
      <div className="mx-4 mb-4">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="w-13 h-13 rounded-full bg-[#0e8354] text-white font-bold text-2xl flex items-center justify-center shadow-xs">
                {initial}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg leading-snug">{shop.name}</h3>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#0e8354] mt-0.5">
                  Owner
                </span>
              </div>
            </div>

            <button
              onClick={() => openModal('SHOP_PROFILE')}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 divide-x divide-slate-100 my-4 text-center">
            <div>
              <div className="text-xl font-extrabold text-slate-900">{totalContacts}</div>
              <div className="text-xs text-slate-500 font-medium">Contacts</div>
            </div>
            <div
              onClick={() => alert('Multi-user staff sync: Team members can view or add ledger entries based on role permissions.')}
              className="cursor-pointer hover:bg-slate-50/50 rounded-lg transition-colors"
            >
              <div className="text-xl font-extrabold text-slate-900">0</div>
              <div className="text-xs text-slate-500 font-medium flex items-center justify-center gap-0.5">
                <span>Team Members</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          <button
            onClick={() => alert('Add Team Member: Invite staff, accountant, or partner with granular permissions.')}
            className="w-full py-2.5 px-4 bg-[#0e8354] hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Team Member</span>
          </button>
        </div>
      </div>

      {/* 4 Grid Quick Action Icons matching screenshot 5 */}
      <div className="mx-4 mb-4 grid grid-cols-4 gap-2.5">
        {/* Report (Orange) */}
        <button
          onClick={() => openModal('REPORT')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-sm mb-1.5">
            <FileText className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-xs font-bold text-slate-800 tracking-tight">Report</span>
        </button>

        {/* Day Book (Blue) */}
        <button
          onClick={() => openModal('DAY_BOOK')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-sky-500 text-white flex items-center justify-center shadow-sm mb-1.5">
            <Calendar className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-xs font-bold text-slate-800 tracking-tight">Day Book</span>
        </button>

        {/* Calculator (Purple) */}
        <button
          onClick={() => openModal('CALCULATOR')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center shadow-sm mb-1.5">
            <Calculator className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-xs font-bold text-slate-800 tracking-tight">Calculator</span>
        </button>

        {/* App Lock (Navy) */}
        <button
          onClick={() => openModal('APP_LOCK_SETTINGS')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-900 text-white flex items-center justify-center shadow-sm mb-1.5">
            <Lock className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-xs font-bold text-slate-800 tracking-tight">App Lock</span>
        </button>
      </div>

      {/* Primary Tools List matching screenshot 5 */}
      <div className="mx-4 mb-4 bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100 shadow-xs overflow-hidden">
        {/* EMI Calculator */}
        <div
          onClick={() => openModal('EMI_CALCULATOR')}
          className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Percent className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">EMI Calculator</h4>
              <p className="text-xs text-slate-500">Plan a loan & see monthly EMI</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>

        {/* Bulk Reminder */}
        <div
          onClick={() => openModal('BULK_REMINDER')}
          className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-[#0e8354] flex items-center justify-center">
              <MessageCircle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Bulk Reminder</h4>
              <p className="text-xs text-slate-500">Send WhatsApp payment reminders</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>

        {/* My Entries */}
        <div
          onClick={() => openModal('DAY_BOOK')}
          className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">My Entries</h4>
              <p className="text-xs text-slate-500">Entries made across your business</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>

        {/* Recycle Bin */}
        <div
          onClick={() => openModal('RECYCLE_BIN')}
          className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-slate-900 text-sm">Recycle Bin</h4>
                <span className="text-amber-500 text-xs">👑</span>
                {(deletedEntries.length > 0 || deletedContacts.length > 0) && (
                  <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded-full font-bold">
                    {deletedEntries.length + deletedContacts.length}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">Restore deleted contacts and entries</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>

        {/* Native Android App & APK */}
        <div
          onClick={() => openModal('APK_DOWNLOAD')}
          className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0e8354] flex items-center justify-center">
              <Smartphone className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-slate-900 text-sm">Native Android App & APK</h4>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
                  Android Native
                </span>
              </div>
              <p className="text-xs text-slate-500">Install APK, WebAPK & view Android project</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>
      </div>
    </div>
  );
};
